package com.agilecrm.subscription.restrictions.db;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.xml.bind.annotation.XmlElement;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.map.JsonMappingException;

import com.agilecrm.account.AccountEmailStats;
import com.agilecrm.account.util.AccountEmailStatsUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.subscription.limits.PlanLimits;
import com.agilecrm.subscription.limits.cron.deferred.OurDomainSyncDeferredTask;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.webrules.WebRule;
import com.agilecrm.webrules.util.WebRuleUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.analytics.util.AnalyticsSQLUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>BillingRestriction</code> class represents number of entities in
 * domain.
 * <p>
 * This class holds number of contacts, webrules, campaigns, page views etc..
 * which gets updated by a cron run every day.
 * 
 * Methods can be used to check if any of the entities have crossed limits, on
 * which it throws {@link PlanRestrictedException}
 * </p>
 * 
 * @author yaswanth
 * 
 */
@Cached
public class BillingRestriction
{
    @Id
    public Long id;

    public Integer contacts_count;
    public Integer webrules_count;
    public Integer campaigns_count;
    public Integer pageviews_count;
    public Integer emails_count;
    public Integer users_count;

    public Integer companies_count;

    public Long created_time = null;

    /**
     * New limits
     */
    @NotSaved(IfDefault.class)
    public Integer reports_count = 0;

    @NotSaved(IfDefault.class)
    public Integer triggers_count = 0;

    @NotSaved(IfDefault.class)
    public Integer widgets_count = 0;

    public Integer one_time_emails_count = 0;

    public Integer max_emails_count;

    public Long email_pack_start_time = 0L;

    @NotSaved(IfDefault.class)
    public Plan plan;

    @NotSaved
    @JsonIgnore
    public boolean sendReminder = false;

    @NotSaved
    @JsonIgnore
    public Set<String> tagsToAddInOurDomain = new HashSet<String>();

    @NotSaved(IfDefault.class)
    @JsonIgnore
    public Set<String> tags_in_our_domain = new HashSet<String>();

    @NotSaved
    @Embedded
    @JsonIgnore
    public PlanLimits planDetails = PlanLimits.getPlanDetails(new Plan("FREE", 2));

    public static ObjectifyGenericDao<BillingRestriction> dao = new ObjectifyGenericDao<BillingRestriction>(
	    BillingRestriction.class);

    BillingRestriction()
    {

    }

    private BillingRestriction(PlanLimits limits)
    {
	planDetails = limits;

	planDetails.setEmailWhiteLabelEnabled(max_emails_count != null && max_emails_count > 0);
    }

    /**
     * Creates new Instance of BillingRestriction object based on plan and
     * number of users
     * 
     * @param planName
     * @param users
     * @return
     */
    public static BillingRestriction getInstance(String planName, Integer users)
    {
	BillingRestriction res = new BillingRestriction(BillingRestrictionUtil.getPlan(planName, users)
		.getPlanDetails());

	res.setCreatedTime();

	return res;
    }

    /**
     * Initializes {@link DaoBillingRestriction} class based on entity class
     * name. If limits check returns
     * 
     * @param className
     * @throws PlanRestrictedException
     */
    public void check(String className) throws PlanRestrictedException
    {
	DaoBillingRestriction daoRestriction = DaoBillingRestriction.getInstace(className, this);
	if (daoRestriction != null && !daoRestriction.can_create())
	    BillingRestrictionUtil.throwLimitExceededException(className);
    }

    /**
     * Checks webstats
     * 
     * @throws PlanRestrictedException
     */
    public void checkWebstats() throws PlanRestrictedException
    {
	if (pageviews_count == null && !StringUtils.isEmpty(NamespaceManager.get()))
	    pageviews_count = AnalyticsSQLUtil.getPageViewsCountForGivenDomain(NamespaceManager.get());

	if (pageviews_count >= planDetails.getWebRuleLimit())
	    throw new PlanRestrictedException("pageviews limit exceeded");
    }

    /**
     * Returns true if white label is enabled
     * 
     * @return
     */
    public boolean isWhiteLabelEnabled()
    {
	return planDetails.isWhiteLabelEnabled();
    }

    /**
     * Gets current limits to send it to client few limitations can be checked
     * at client side
     * 
     * @return
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonGenerationException
     */
    public PlanLimits getCurrentLimits()
    {
	if (one_time_emails_count != null && one_time_emails_count > 0)
	    planDetails.setEmailWhiteLabelEnabled(true);

	return planDetails;
    }

    /**
     * Checks if account can be downgraded
     * 
     * @throws PlanRestrictedException
     */
    @JsonIgnore
    public boolean isDowngradable()
    {
	refreshContacts();

	if (contacts_count > planDetails.getContactLimit())
	    return false;
	if (WorkflowUtil.getCount() > planDetails.getWorkflowLimit())
	    return false;
	if (WebRuleUtil.getCount() > planDetails.getWebRuleLimit())
	    return false;
	if (DomainUserUtil.count() > planDetails.getAllowedUsers())
	    return false;
	
	if (TriggerUtil.getCount() > planDetails.getTriggersLimit())
	    return false;

	return true;
    }

    /**
     * Refreshes all entities count. Takes boolean as argument whether to
     * refresh contacts count
     * 
     * @param refreshContacts
     */
    /**
     * Refreshes all entities count. Takes boolean as argument whether to
     * refresh contacts count
     * 
     * @param refreshContacts
     */
    public void refresh(boolean refreshContacts)
    {

	webrules_count = WebRule.dao.count();
	campaigns_count = Workflow.dao.count();
	AccountEmailStats stats = AccountEmailStatsUtil.getAccountEmailStats(NamespaceManager.get());
	if (stats != null)
	    emails_count = stats.count;

	if (refreshContacts)
	{
	    refreshContacts();
	    return;
	}

	if (id != null)
	{
	    setCreatedTime();
	    save();
	}

	// pageviews =
	// AnalyticsSQLUtil.getPageViewsCountForGivenDomain(NamespaceManager.get());
    }

    private void setCreatedTime()
    {
	if (created_time != null && created_time > 0)
	    return;

	DomainUser user = DomainUserUtil.getCurrentDomainUser();

	if (user == null)
	{
	    created_time = System.currentTimeMillis();

	    return;
	}

	created_time = user.getCreatedTime();
    }

    @XmlElement
    public Long getCreatedtime()
    {
	if (created_time != null && created_time > 0)
	{
	    return created_time;
	}

	DomainUser user = DomainUserUtil.getDomainOwner(NamespaceManager.get());
	if (user != null)
	    return created_time = user.getCreatedTime();

	return created_time = System.currentTimeMillis();
    }

    /**
     * Refreshes contacts count
     */
    public void refreshContacts()
    {
	contacts_count = Contact.dao.count();

	if (id != null)
	    save();
    }

    public void save()
    {
	dao.put(this);
    }

    /**
     * Gets tags to be added and task is initialized to add in our domain.
     * Deferred task is used to avoid tag adding time while checking
     */
    public void sendReminder()
    {
	OurDomainSyncDeferredTask task = new OurDomainSyncDeferredTask(tagsToAddInOurDomain);
	Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(task));
    }

    /**
     * Returns tags to be added
     * 
     * @param count
     * @param allowedCount
     * @param className
     * @return
     */

    @Override
    public boolean equals(Object object)
    {
	BillingRestriction restriction = (BillingRestriction) object;

	if (restriction.contacts_count == contacts_count && restriction.one_time_emails_count == one_time_emails_count
		&& restriction.webrules_count == webrules_count && restriction.campaigns_count == campaigns_count
		&& restriction.pageviews_count == pageviews_count)
	    return true;

	return false;
    }

    @PostLoad
    private void postLoad()
    {
	if (one_time_emails_count == null)
	    one_time_emails_count = 0;

	if (max_emails_count == null)
	    max_emails_count = 0;

	if (one_time_emails_count > 0 && (max_emails_count == null || max_emails_count == 0))
	{
	    max_emails_count = one_time_emails_count;
	    this.save();
	}
    }
}