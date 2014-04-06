package com.agilecrm.subscription.restrictions;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Id;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.account.AccountEmailStats;
import com.agilecrm.account.util.AccountEmailStatsUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.subscription.limits.PlanLimitsEnum;
import com.agilecrm.subscription.limits.contacts.cron.deferred.OurDomainSyncDeferredTask;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.subscription.restrictions.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.util.BillingRestrictionUtil.ErrorMessages;
import com.agilecrm.webrules.WebRule;
import com.agilecrm.workflows.Workflow;
import com.analytics.util.AnalyticsSQLUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.annotation.NotSaved;

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
public class BillingRestriction
{
    @Id
    public Long id;

    public Integer contacts;
    public Integer webrules;
    public Integer campaigns;
    public Integer pageviews;
    public Integer emails;
    public Integer one_time_emails;

    @NotSaved
    @JsonIgnore
    public Set<String> tagsToAddInOurDomain = new HashSet<String>();

    @NotSaved
    @JsonIgnore
    public boolean sendRemainder = false;

    @NotSaved
    @JsonIgnore
    public boolean getTags = false;

    @NotSaved
    @JsonIgnore
    public PlanLimitsEnum planLimitsEnum;

    private static ObjectifyGenericDao<BillingRestriction> dao = new ObjectifyGenericDao<BillingRestriction>(BillingRestriction.class);

    BillingRestriction()
    {

    }

    private BillingRestriction(PlanLimitsEnum limits)
    {
	planLimitsEnum = limits;
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
	return new BillingRestriction(BillingRestrictionUtil.getPlan(planName, users).getPlanLimits());
    }

    /**
     * Compares number of entities in particular entity based on dao and
     * compared with allowed limits.
     * 
     * @param dao
     * @throws PlanRestrictedException
     */
    public void check(ObjectifyGenericDao dao) throws PlanRestrictedException
    {
	// Gets underlying class of dao
	String className = dao.getClazz().getSimpleName();
	int count = 0;

	// If type is contacts then count is not fetched again but read from
	// billing restrictions class instead, to avoid fetching time.
	if (className.equals("Contact"))
	    count = contacts;
	else
	    count = dao.count();

	check(count, className);
    }

    /**
     * It is similar to check method which takes doa, but it is more simplified
     * to do comparision based on count and class.
     * 
     * @param count
     * @param clazz
     * @throws PlanRestrictedException
     */
    public void check(int count, Class clazz) throws PlanRestrictedException
    {
	String className = clazz.getSimpleName();
	check(count, className);
    }

    /**
     * Compares entities count with plan limits. Also sends remainders/adds tags
     * in our domain accordingly
     * 
     * @param count
     * @param className
     * @throws PlanRestrictedException
     */
    public void check(int count, String className) throws PlanRestrictedException
    {
	// Gets allowed entities in current plan
	int allowedEntities = planLimitsEnum.getLimit(className);

	String tag = null;

	// If send remainder or get tags is set true, calculates percentage
	// completed and gets tag to be added in our domain
	if (getTags || sendRemainder)
	    tag = getTag(count, allowedEntities, className);

	if (!StringUtils.isEmpty(tag))
	    tagsToAddInOurDomain.add(tag);

	// If send remainder is set true then new task is initialized to add
	// tags in our domain
	if (sendRemainder)
	{
	    sendRemainder();
	}

	// If count reaches allowed entities then exception to client side
	if (count >= allowedEntities)
	{
	    throw new PlanRestrictedException(ErrorMessages.valueOf(className).getMessage());
	}

    }

    /**
     * Checks webstats
     * 
     * @throws PlanRestrictedException
     */
    public void checkWebstats() throws PlanRestrictedException
    {
	if (pageviews == null && !StringUtils.isEmpty(NamespaceManager.get()))
	    pageviews = AnalyticsSQLUtil.getPageViewsCountForGivenDomain(NamespaceManager.get());

	if (pageviews >= planLimitsEnum.getLimit("webRule"))
	    throw new PlanRestrictedException("pageviews limit exceeded");
    }

    public boolean isWhiteLabelEnabled()
    {
	return planLimitsEnum.isWhiteLabelEnabled();
    }

    public void checkAPILimits() throws PlanRestrictedException
    {
	check(Contact.dao);
    }

    /**
     * Gets current limits to send it to client few limitations can be checked
     * at client side
     * 
     * @return
     */
    public PlanLimitsEnum getCurrentLimits()
    {
	return planLimitsEnum;
    }

    /**
     * Checks if account can be downgraded
     * 
     * @throws PlanRestrictedException
     */
    public void isDowngradable() throws PlanRestrictedException
    {
	refresh(true);
	try
	{
	    check(contacts, Contact.class);
	    AccountEmailStatsUtil.checkLimits();
	    check(webrules, WebRule.class);
	    check(campaigns, Workflow.class);
	}
	catch (PlanRestrictedException e)
	{
	    throw new PlanRestrictedException("Plan cannot be downgradded");
	}
    }

    /**
     * Refreshes all entities count. Takes boolean as argument whether to
     * refresh contacts count
     * 
     * @param refreshContacts
     */
    public void refresh(boolean refreshContacts)
    {

	webrules = WebRule.dao.count();
	campaigns = Workflow.dao.count();
	AccountEmailStats stats = AccountEmailStatsUtil.getAccountEmailStats(NamespaceManager.get());
	if (stats != null)
	    emails = stats.count;

	if (refreshContacts)
	{
	    refreshContacts();
	    return;
	}

	save();

	// pageviews =
	// AnalyticsSQLUtil.getPageViewsCountForGivenDomain(NamespaceManager.get());
    }

    public void refreshContacts()
    {
	contacts = Contact.dao.count();
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
    public void sendRemainder()
    {
	System.out.println("tags to add" + tagsToAddInOurDomain);
	if (tagsToAddInOurDomain.isEmpty())
	    return;

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
    @JsonIgnore
    private String getTag(int count, int allowedCount, String className)
    {

	Integer percentage = BillingRestrictionUtil.calculatePercentage(allowedCount, count);
	if (percentage >= 75 && percentage < 85)
	    return className + "-75";
	if (percentage >= 85 && percentage < 90)
	    return className + "-85";
	if (percentage >= 90 && percentage < 100)
	    return className + "-90";
	if (percentage >= 100)
	    return className + "-100";

	return null;

    }

    @Override
    public boolean equals(Object object)
    {
	BillingRestriction restriction = (BillingRestriction) object;

	if (restriction.contacts == contacts && restriction.one_time_emails == one_time_emails && restriction.webrules == webrules
		&& restriction.campaigns == campaigns && restriction.pageviews == pageviews)
	    return true;

	return false;
    }
}
