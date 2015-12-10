package com.agilecrm.subscription.restrictions.entity;

import java.util.ArrayList;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.impl.ContactBillingRestriction;
import com.agilecrm.subscription.restrictions.entity.impl.DomainUserBillingRestriction;
import com.agilecrm.subscription.restrictions.entity.impl.EmailBillingRestriction;
import com.agilecrm.subscription.restrictions.entity.impl.ReportBillingRestriction;
import com.agilecrm.subscription.restrictions.entity.impl.ReportGraphBillingRestriction;
import com.agilecrm.subscription.restrictions.entity.impl.TriggerBillingRestriction;
import com.agilecrm.subscription.restrictions.entity.impl.WebRuleBillingRestriction;
import com.agilecrm.subscription.restrictions.entity.impl.WildCardBillingRestriction;
import com.agilecrm.subscription.restrictions.entity.impl.WorkflowBillingRestriction;
import com.agilecrm.subscription.restrictions.util.BillingRestrictionReminderUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>DoaBillingRestriction</code> class is abstract class based on
 * {@link BillingRestrictionManager} implementation. It has methods to create
 * respective entity restriction class object.
 * 
 * @author Yaswanth
 * 
 */
public abstract class DaoBillingRestriction implements
	com.agilecrm.subscription.restrictions.entity.EntityDaoRestrictionInterface
{
    /**
     * Class information used to create instance according to name of the class
     * 
     */
    public static enum ClassEntities
    {
	Contact(ContactBillingRestriction.class, "Contact"),

	WebRule(WebRuleBillingRestriction.class, "WebRule"),

	Workflow(WorkflowBillingRestriction.class, "Workflow"),

	Report(ReportGraphBillingRestriction.class, ""),

	DomainUser(DomainUserBillingRestriction.class, ""),

	Email(EmailBillingRestriction.class, "Email"),

	Reports(ReportBillingRestriction.class, ""),

	Trigger(TriggerBillingRestriction.class, "Trigger"),

	WildCard(WildCardBillingRestriction.class, "");

	Class<? extends DaoBillingRestriction> clazz;

	String tagPrefix;

	private ClassEntities(Class<? extends DaoBillingRestriction> clazz, String tagPrefix)
	{
	    this.clazz = clazz;
	    this.tagPrefix = tagPrefix;
	}

	public Class<? extends DaoBillingRestriction> getClazz()
	{
	    return clazz;
	}

	public String getTagPrefix()
	{
	    return tagPrefix;
	}
    }

    private ClassEntities entityClass = null;

    public boolean daemonCheck = false;

    public static final WildCardBillingRestriction wildCardRestriction = new WildCardBillingRestriction();

    public static final ArrayList<String> restrictedDomains;
    static
    {
	restrictedDomains = new ArrayList<String>();
	restrictedDomains.add("our");
    }

    public static DaoBillingRestriction getInstace(String className, Object entity)
    {

	DaoBillingRestriction dao = getInstace(className);

	if (dao == null)
	    return dao;

	if (dao.isMasterDomain())
	    return wildCardRestriction;

	dao.entity = entity;
	return dao;
    }

    private boolean isMasterDomain()
    {
	String namespace = NamespaceManager.get();
	if (StringUtils.isEmpty(namespace))
	{
	    return false;
	}

	return restrictedDomains.contains(namespace);
    }

    // Max allowed entities, it is set after initialization. Taken primitive
    // type instead of wrapper, to avoid null pointer exception if limit is not
    // set
    protected int max_allowed = 0;

    public boolean hardUpdateTags = false;

    // Restriction object used to get current limits
    protected BillingRestriction restriction;

    protected boolean sendReminder = true;

    protected Object entity = null;

    public int getPendingCount()
    {
	return 0;
    }

    /**
     * Initializes respective child class instance based on class name. After
     * getting instance max limit is set, which is set from BillingRestriction
     * class
     * 
     * @param className
     * @return
     */
    public static DaoBillingRestriction getInstace(String className)
    {
	try
	{
	    DaoBillingRestriction dao = getPlanInstance(className);

	    // Sets max limits
	    dao.setMax();
	    return dao;

	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    return null;
	}
    }

    private static DaoBillingRestriction getPlanInstance(String className)
    {
	ClassEntities entity = ClassEntities.valueOf(className);

	if (entity == null)
	    return null;

	Class<? extends DaoBillingRestriction> clazz = entity.getClazz();
	DaoBillingRestriction dao = null;
	try
	{
	    dao = clazz.newInstance();
	}
	catch (InstantiationException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	catch (IllegalAccessException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	if (dao != null)
	    dao.entityClass = entity;

	return dao;
    }

    /**
     * This method is used to use same restriction object of different entity
     * checks. It is called from cron where all the tags can be created and then
     * be added in single request.
     * 
     * @param className
     * @param restriction
     * @return
     */
    public static DaoBillingRestriction getInstace(String className, BillingRestriction restriction)
    {
	DaoBillingRestriction dao = getPlanInstance(className);
	if (dao == null)
	    return dao;

	dao.restriction = restriction;
	dao.setMax();
	dao.sendReminder = dao.restriction.sendReminder;
	return dao;
    }

    /**
     * Callend from backend deamon thread
     * 
     * @param className
     * @param restriction
     * @return
     */
    public static DaoBillingRestriction getInstaceDeamon(String className, BillingRestriction restriction)
    {
	DaoBillingRestriction dao = getInstace(className, restriction);
	if (dao == null)
	    return dao;

	dao.daemonCheck = true;

	return dao;
    }

    public abstract boolean check();

    /**
     * Gets tags and set in {@link BillingRestriction} tags set and reminder is
     * sent
     */
    @Override
    public void send_warning_message()
    {
	try
	{
	    getTag();

	}
	catch (Exception e)
	{
	    System.err.print(e.getMessage());
	    e.printStackTrace();
	    return;
	}
	if (restriction.tagsToAddInOurDomain.isEmpty())
	    return;

	restriction.sendReminder();
    }

    // Sets max value based on plan
    public abstract void setMax();

    /**
     * Returns tags based on percentage usage. It can be overridden if required,
     * so all tags can be read and added at once in cron
     * 
     * @return
     */
    public String getTag()
    {
	return null;
    }

    protected String setTagsToUpdate(int max_allowed, int currentCount)
    {

	String tag = BillingRestrictionReminderUtil.getTag(currentCount, max_allowed, entityClass.getTagPrefix(), true);

	if (tag != null)
	{
	    int percentage = BillingRestrictionReminderUtil.calculatePercentage(max_allowed, currentCount);

	    if (restriction == null || restriction.id == null)
	    {
		restriction = BillingRestrictionUtil.getBillingRestrictionAndSubscriptionFromDB();
	    }

	    if (percentage < 75 && !restriction.tags_in_our_domain.isEmpty())
	    {
		boolean isTagRemoved = false;
		// Removes previous tags
		for (String percentageString : BillingRestrictionUtil.percentages)
		{
		    boolean removed = restriction.tags_in_our_domain.remove(entityClass.getTagPrefix() + "_"
			    + percentageString);

		    isTagRemoved = isTagRemoved ? isTagRemoved : removed;
		}

		if (isTagRemoved)
		{
		    restriction.save();
		    hardUpdateTags = true;
		}
	    }

	    // If tags are not there then new tag is saved in tags in our domain
	    // class
	    if ((restriction.tags_in_our_domain.isEmpty() || !restriction.tags_in_our_domain.contains(tag))
		    && percentage >= 75)
	    {

		// Removes previous tags
		for (String percentageString : BillingRestrictionUtil.percentages)
		{
		    restriction.tags_in_our_domain.remove(entityClass.getTagPrefix() + "_" + percentageString);
		}

		restriction.tags_in_our_domain.add(tag);

		restriction.save();
		restriction.tagsToAddInOurDomain.add(tag);

		return tag;
	    }

	    // Updates tag even if percentage is less than 75%
	    if (hardUpdateTags && percentage < 75)
		restriction.tagsToAddInOurDomain.add(tag);
	}
	return tag;
    }

    public void setBillingRestriction(BillingRestriction restriction)
    {
	this.restriction = restriction;
    }

    public boolean canAddTag(Integer percentage, String tag)
    {
	if (percentage < 75)
	    return false;

	if (!restriction.tags_in_our_domain.isEmpty() && restriction.tags_in_our_domain.contains(tag))
	    return false;

	return true;
    }
}
