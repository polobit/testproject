package com.agilecrm.subscription.restrictions;

import com.agilecrm.subscription.restrictions.db.BillingRestriction;

/**
 * <code>DoaBillingRestriction</code> class is abstract class based on
 * {@link BillingRestrictionManager} implementation. It has methods to create
 * respective entity restriction class object.
 * 
 * @author Yaswanth
 * 
 */
public abstract class DaoBillingRestriction implements com.agilecrm.subscription.restrictions.BillingRestriction
{
    /**
     * Class information used to create instance according to name of the class
     * 
     */
    public static enum ClassEntities
    {
	Contact(ContactBillingRestriction.class),

	WebRule(WebRuleBillingRestriction.class),

	Workflow(WorkflowBillingRestriction.class),

	Report(ReportBillingRestriction.class);

	Class<? extends DaoBillingRestriction> clazz;

	private ClassEntities(Class<? extends DaoBillingRestriction> clazz)
	{
	    this.clazz = clazz;
	}

	public Class<? extends DaoBillingRestriction> getClazz()
	{
	    return clazz;
	}
    }

    // Max allowed entities, it is set after initialization. Taken primitive
    // type instead of wrapper, to avoid null pointer exception if limit is not
    // set
    protected int MAX = 0;

    // Restriction object used to get current limits
    protected BillingRestriction restriction;

    protected boolean sendReminder = true;

    protected Object entity = null;

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
	    ClassEntities entity = ClassEntities.valueOf(className);
	    if (entity == null)
		return null;
	    return getInstace(entity);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    return null;
	}
    }

    public static DaoBillingRestriction getInstace(ClassEntities entity)
    {

	Class<? extends DaoBillingRestriction> clazz = entity.getClazz();
	DaoBillingRestriction dao;
	try
	{
	    dao = clazz.newInstance();
	}
	catch (InstantiationException e)
	{
	    // TODO Auto-generated catch block

	    e.printStackTrace();
	    return null;
	}
	catch (IllegalAccessException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return null;
	}

	// Sets max limits
	dao.setMax();
	return dao;
    }

    public static DaoBillingRestriction getInstace(String className, Object entity)
    {

	DaoBillingRestriction dao = getInstace(className);
	if (dao == null)
	    return dao;
	dao.entity = entity;
	return dao;
    }

    public static DaoBillingRestriction getInstace(ClassEntities classEntity, Object entity)
    {

	DaoBillingRestriction dao = getInstace(classEntity);
	if (dao == null)
	    return dao;
	dao.entity = entity;
	return dao;
    }

    /**
     * Along with instance, this method takes reminder flag to choose whether to
     * send reminder or not to.
     * 
     * @param className
     * @param sendReminder
     * @return
     */
    public static DaoBillingRestriction getInstace(String className, boolean sendReminder)
    {
	DaoBillingRestriction dao = getInstace(className);
	if (dao == null)
	    return dao;

	dao.sendReminder = sendReminder;
	return dao;
    }

    public abstract boolean check();

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
	DaoBillingRestriction dao = getInstace(className);
	if (dao == null)
	    return dao;

	dao.restriction = restriction;
	dao.sendReminder = dao.restriction.sendReminder;
	return dao;
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

}
