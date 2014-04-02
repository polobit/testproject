package com.agilecrm.subscription.restrictions;

/**
 * <code>DoaBillingRestriction</code> class is
 * 
 * @author yaswanth
 * 
 */
public abstract class DaoBillingRestriction implements BillingRestriction
{
    private static final String subclassPackage = "com.agilecrm.subscription.restrictions.";
    protected Integer MAX = 0;
    protected BillingRestriction1 restriction;

    public static DaoBillingRestriction getInstace(String clazz)
    {
	try
	{
	    Class<DaoBillingRestriction> DaoBillingRestriction = (Class<com.agilecrm.subscription.restrictions.DaoBillingRestriction>) Class
		    .forName(subclassPackage + clazz + "BillingRestriction");

	    DaoBillingRestriction dao = DaoBillingRestriction.newInstance();
	    dao.setMax();
	    return dao;
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return null;

	}
    }

    public abstract void setMax();

}
