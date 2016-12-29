package com.agilecrm.subscription.restrictions.db;

import java.io.IOException;
import java.io.Serializable;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.map.JsonMappingException;

import com.agilecrm.account.AccountEmailStats;
import com.agilecrm.account.util.AccountEmailStatsUtil;
import com.agilecrm.account.util.SMSGatewayUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.contact.sync.Type;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.util.MilestoneUtil;
import com.agilecrm.reports.ReportsUtil;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.subscription.Subscription.BillingStatus;
import com.agilecrm.subscription.deferred.RenewalCreditsDeferredTask;
import com.agilecrm.subscription.limits.PlanLimits;
import com.agilecrm.subscription.limits.cron.deferred.OurDomainSyncDeferredTask;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.DateUtil;
import com.agilecrm.webrules.WebRule;
import com.agilecrm.webrules.util.WebRuleUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.analytics.util.AnalyticsSQLUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;
import com.thirdparty.google.utl.ContactPrefsUtil;

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
public class BillingRestriction implements Serializable
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
     * Last renewal time of emails for free users.
     */
    @NotSaved(IfDefault.class)
    public Long last_renewal_time = null;

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
    
    // Life time emails
    public Integer email_credits_count = 0;

    /**
     * This field is not saved in database, it is used to have a backup emails
     * count we have got from DB. This field is used to compare before saving
     * emails count
     */
    @NotSaved
    private Integer one_time_emails_backup = 0;
    
    /**
     * This field is not saved in database, it is used to have a backup email credits
     * count we have got from DB. This field is used to compare before saving
     * emails count
     */
    @NotSaved
    private Integer email_credits_backup = 0;

    @NotSaved
    public boolean isNewEmailPlanUpgrade = false;

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
    
  	//Auto recharge related fields
  	@NotSaved(IfDefault.class)
  	public Integer nextRechargeCount = null;
  	
  	@NotSaved(IfDefault.class)
  	public Integer autoRenewalPoint = null;
  	
  	@NotSaved(IfDefault.class)
  	public Boolean isAutoRenewalEnabled = false;

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
	planDetails.setEmailWhiteLabelEnabled(true);

	return planDetails;
    }

    public boolean isEmailWhiteLabelEnabled()
    {
	if ((one_time_emails_count != null && one_time_emails_count > 0) || (email_credits_count != null && email_credits_count > 0))
	    return true;

	return false;
    }

    public boolean isEmailPlanPaid()
    {
	return (one_time_emails_count != null && one_time_emails_count > 0);
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

    @JsonIgnore
    public Map<String, Map<String, Object>> getRestrictions()
    {
	Map<String, Map<String, Object>> resrtictions = new HashMap<String, Map<String, Object>>();

	refreshContacts();
	List<AgileUser> agileUsers = AgileUser.getUsers();
	Map<String, Object> limits;
	int contactsLimit = planDetails.getContactLimit();
	if(contactsLimit < contacts_count){
		limits = new HashMap<String, Object>();
		limits.put("limit", contactsLimit);
		limits.put("count", contacts_count);
		resrtictions.put("contacts", limits);
	}
	int webRuleLimit = planDetails.getWebRuleLimit();
	int webRuleCount = WebRuleUtil.getCount();
	if(webRuleLimit < webRuleCount){
		limits = new HashMap<String, Object>();
		limits.put("limit", webRuleLimit);
		limits.put("count", webRuleCount);
		resrtictions.put("webrules", limits);
	}
	int workFlowsLimit = planDetails.getWorkflowLimit();
	int workFlowsCount = WorkflowUtil.get_enable_campaign_count();
	if(workFlowsLimit < workFlowsCount){
		limits = new HashMap<String, Object>();
		limits.put("limit", workFlowsLimit);
		limits.put("count", workFlowsCount);
		resrtictions.put("workflows", limits);
	}
	int triggersLimit = planDetails.getTriggersLimit();
	int triggersCount = TriggerUtil.getCount();
	if(triggersLimit < triggersCount){
		limits = new HashMap<String, Object>();
		limits.put("limit", triggersLimit);
		limits.put("count", triggersCount);
		resrtictions.put("triggers", limits);
	}
	int usersLimit = planDetails.getAllowedUsers();
	int usersCount = DomainUserUtil.count();
	if(usersLimit < usersCount){
		limits = new HashMap<String, Object>();
		limits.put("limit", usersLimit);
		limits.put("count", usersCount);
		resrtictions.put("users", limits);
	}
	int widgetsLimit = planDetails.getWidgetsLimit();
	int widgetsCount = WidgetUtil.checkForDowngrade(widgetsLimit, agileUsers);
	if(widgetsLimit < widgetsCount){
		limits = new HashMap<String, Object>();
		limits.put("limit", widgetsLimit);
		limits.put("count", widgetsCount);
		resrtictions.put("widgets", limits);
	}
	int nodesLimit = planDetails.getCampaignNodesLimit();
	int maxNodesCount = WorkflowUtil.getMaxWorkflowNodes();
	if(nodesLimit < --maxNodesCount){
		limits = new HashMap<String, Object>();
		limits.put("limit", nodesLimit);
		limits.put("count", maxNodesCount);
		resrtictions.put("nodes", limits);
	}
	int emailAccountsLimit = planDetails.getEmailAccountLimit();
	int emailAccountsCount = ContactEmailUtil.checkForDowngrade(planDetails.getEmailAccountLimit(), agileUsers);
	if(emailAccountsLimit < emailAccountsCount){
		limits = new HashMap<String, Object>();
		limits.put("limit", emailAccountsLimit);
		limits.put("count", emailAccountsCount);
		resrtictions.put("emailAccounts", limits);
	}
	int reportsLimit = planDetails.getReportsLimit();
	int reportsCount = ReportsUtil.count();
	if(reportsLimit < reportsCount){
		limits = new HashMap<String, Object>();
		limits.put("limit", reportsLimit);
		limits.put("count", reportsCount);
		resrtictions.put("reports", limits);
	}
	Widget widget = SMSGatewayUtil.getSMSGatewayWidget();
	if(!planDetails.getSMSGateway() && widget != null){
		limits = new HashMap<String, Object>();
		limits.put("isAllowed", planDetails.getSMSGateway());
		resrtictions.put("smsGateway", limits);
	}
	boolean ecommerceSyncEnabled = ContactPrefsUtil.checkWidgetExists(Type.SHOPIFY, agileUsers);
	if(!planDetails.getEcommerceSync() && ecommerceSyncEnabled){
		limits = new HashMap<String, Object>();
		limits.put("isAllowed", planDetails.getEcommerceSync());
		resrtictions.put("ecommerceSync", limits);
	}
	boolean accountingSyncEnabled = ContactPrefsUtil.checkWidgetExists(Type.FRESHBOOKS, agileUsers) || ContactPrefsUtil.checkWidgetExists(Type.QUICKBOOK, agileUsers);
	if(!planDetails.getAccountingSync() && accountingSyncEnabled){
		limits = new HashMap<String, Object>();
		limits.put("isAllowed", planDetails.getAccountingSync());
		resrtictions.put("accountingSync", limits);
	}
	int tracksCount = MilestoneUtil.getCount();
	if(!planDetails.getAddTracks() && tracksCount > 1){
		limits = new HashMap<String, Object>();
		limits.put("limit", 1);
		limits.put("count", tracksCount);
		resrtictions.put("tracks", limits);
	}
	
	
	return resrtictions;
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

	System.out.println(this.tags_in_our_domain);
	System.out.println(this);
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
    
    //sets emails to 5000(for free customers)
  	public void refreshEmails()
  	{
  		this.one_time_emails_count = 0;
  		this.max_emails_count = 0;
  		this.last_renewal_time = System.currentTimeMillis()/1000;
  		this.save();
  		BillingRestrictionUtil.sendFreeEmailsUpdatedMail();
  	}

    private void setCreatedTime()
    {
	if (created_time != null && created_time > 0)
	    return;

	DomainUser user = DomainUserUtil.getDomainOwner(NamespaceManager.get());

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

    @PrePersist
    private void prePersist()
    {
    	
	if (this.id == null)
	    return;

	if (isNewEmailPlanUpgrade)
	{
	    this.one_time_emails_backup = one_time_emails_count;
	    return;
	}

	BillingRestriction restriction = BillingRestriction.dao.ofy().query(BillingRestriction.class).get();

	// Just to avoid null pointer exception
	if (this.one_time_emails_backup == null)
	    this.one_time_emails_backup = this.one_time_emails_count;
	if (this.email_credits_backup == null)
	    this.email_credits_backup = this.email_credits_count;

	// Substracting from existing db count
	restriction.one_time_emails_count -= (this.one_time_emails_backup - this.one_time_emails_count);
	restriction.email_credits_count -= (this.email_credits_backup - this.email_credits_count);

	// Updating one time count from that of DB entity
	this.one_time_emails_count = restriction.one_time_emails_count;
	this.email_credits_count = restriction.email_credits_count;

	// Updating backup count from that of DB entity
	this.one_time_emails_backup = one_time_emails_count;
	this.email_credits_backup = email_credits_count;

    }

    public void save()
    {
    setCreatedTime();
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
	
	if (email_credits_count == null || email_credits_count < 0)
		email_credits_count = 0;

	if (one_time_emails_count > 0 && (max_emails_count == null || max_emails_count == 0))
	{
	    max_emails_count = one_time_emails_count;
	}

	one_time_emails_backup = one_time_emails_count;
	email_credits_backup = email_credits_count;

	System.out.println("one time emails in domain : " + NamespaceManager.get() + " : " + one_time_emails_backup +" and email credits count : "+email_credits_backup);
    }
    
    public boolean checkToUpdateFreeEmails(){
    	Subscription subscription = SubscriptionUtil.getSubscription();
    	if(subscription.status != null && subscription.status.equals(BillingStatus.SUBSCRIPTION_DELETED))
    		return false;
    	System.out.println("max emails count::"+this.max_emails_count);
    	if(this.max_emails_count == null || this.max_emails_count == 0 || (this.one_time_emails_count != null && this.one_time_emails_count <= 0 && subscription != null && subscription.emailPlan == null)){
			System.out.println("last renewal time::"+this.last_renewal_time);
			if(this.last_renewal_time == null){
				DomainUser owner = DomainUserUtil.getDomainOwner(NamespaceManager.get());
				if (owner != null)
					this.last_renewal_time = owner.getCreatedTime();
				else
					this.last_renewal_time = new DateUtil().getTime().getTime()/1000;
			}
			Long currentDate = new DateUtil().getTime().getTime()/1000;
			if(currentDate - this.last_renewal_time >= 2592000){
				System.out.println("Updating free 5000 emails");
				return true;
			}
		}
		System.out.println("restriction obj:: "+this);
		return false;
    }
    
    public boolean checkForEmailCredits(){
    	if(this.one_time_emails_count != null && this.one_time_emails_count <= 0 && this.email_credits_count != null && this.email_credits_count > 0)
    		return true;
    	else
    		return false;
    }
    
    public void decrementEmailCreditsCount(){
    	--this.email_credits_count;
    }
    
    public void decrementEmailCreditsCount(int count){
    	this.email_credits_count -= count;
    	if(isAutoRenewalEnabled && email_credits_count <= autoRenewalPoint){
    		Subscription subscription = SubscriptionUtil.getSubscription();
    		if(Subscription.EmailPurchaseStatus.BLOCKED.equals(subscription.getEmailpurchaseStatus()))
    			return;
    		String namespace = NamespaceManager.get();
    		String syncKey = namespace + "_auto_renewal_lock";
    		boolean lockAcquired = false;
    		try
    		{
    			lockAcquired = acquireLock(syncKey);
    			renewalCredits(nextRechargeCount, count);
    		}catch (Exception e){
    			System.out.println(ExceptionUtils.getFullStackTrace(e));
    			e.printStackTrace();
    		}finally{
    			if (lockAcquired)
    				decrement(syncKey);
    		}
    	}
    }
    
    public void incrementEmailCreditsCount(int count){
    	this.email_credits_count += count;
    }
    
    /**
	 * Enabling lock on memcache key
	 * 
	 * Source:
	 * http://stackoverflow.com/questions/14907908/google-app-engine-how-
	 * to-make-synchronized-actions-using-memcache-or-datastore
	 * 
	 * @param syncKey
	 * @return
	 */
	public boolean acquireLock(String syncKey)
	{
		MemcacheService memcacheService = MemcacheServiceFactory.getMemcacheService();

		while (true)
		{
			if (memcacheService.increment(syncKey, 1L, 0L) == 1L)
				return true;

			try
			{
				System.out.println("Waiting for acquiring lock.");
				Thread.sleep(2000L);
			}
			catch (InterruptedException e)
			{
				e.printStackTrace();
				System.out.println(ExceptionUtils.getFullStackTrace(e));
			}
		}
	}
	
	public static void decrement(String syncKey)
	{
		MemcacheServiceFactory.getMemcacheService().put(syncKey, 0l);
	}
    
    //
    public void renewalCredits(int quantity, int decrementCount){
    	BillingRestriction restriction = BillingRestrictionUtil.getBillingRestrictionFromDB();
    	restriction.email_credits_count -= decrementCount;
    	if(restriction.email_credits_count <= restriction.autoRenewalPoint){	
			RenewalCreditsDeferredTask task = new RenewalCreditsDeferredTask(NamespaceManager.get(), quantity, 0);			
			task.run();
    	}
	}
}
