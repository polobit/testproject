package com.agilecrm.subscription.limits;

import java.lang.reflect.InvocationTargetException;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonProperty;

@XmlRootElement
public enum PlanLimitsEnum
{

    FREE(null, 0f, 1000, 500, 1, 1, 1, 1000, "Email Reports", false),

    STARTER(null, 0f, 10000, 1500, 3, 0, 3, 5000, "ALL", false),

    REGULAR(null, 0f, 50000, 2500, 10, 0, 5, 10000, "ALL", false),

    PRO(null, 0f, Integer.MAX_VALUE, 5000, Integer.MAX_VALUE, 0, 10, 20000, "ALL", true),

    /**
     * Old plans for backward compatibility
     */
    BASIC(null, 0f, 50000, 2500, 10, 0, 5, 10000, "ALL", false),

    PROFESSIONAL(null, 0f, 50000, 2500, 10, 0, 5, 10000, "ALL", false),

    ENTERPRISE(null, 0f, Integer.MAX_VALUE, 5000, Integer.MAX_VALUE, 0, 10, 20000, "ALL", true),

    LITE(null, 0f, 0, 0, 0, 0, 0, 1000, "ALL", false);

    private final String planId;
    private final Float price;
    private final Integer contactLimit;
    private final Integer emailsLimit;
    private final Integer workflowLimit;
    private final Integer googleContactsLimit;
    private final Integer webRuleLimit;
    private final Integer pageViewsLimit;
    private final String reporting;
    private final boolean whiteLabelEnabled;

    /**
     * 
     * @param planId
     * @param price
     * @param contactsLimit
     * @param emailsLimit
     * @param campaignsLimit
     * @param googleContactsLimit
     * @param googleCalendarLimit
     */
    private PlanLimitsEnum(String planId, Float price, Integer contactsLimit, Integer emailsLimit, Integer campaignsLimit, Integer googleContactsLimit,
	    Integer webRulesLimit, Integer pageViewsLimit, String reporting, boolean whiteLabelEnabled)
    {
	this.planId = planId;
	this.price = price;
	this.contactLimit = contactsLimit;
	this.emailsLimit = emailsLimit;
	this.workflowLimit = campaignsLimit;
	this.googleContactsLimit = googleContactsLimit;
	this.webRuleLimit = webRulesLimit;
	this.pageViewsLimit = pageViewsLimit;
	this.reporting = reporting;
	this.whiteLabelEnabled = whiteLabelEnabled;
    }

    public String getPlanId()
    {
	return planId;
    }

    public Float getPrice()
    {
	return price;
    }

    public Integer getContactLimit()
    {
	return contactLimit;
    }

    public Integer getEmailsLimit()
    {
	return emailsLimit;
    }

    public Integer getWorkflowLimit()
    {
	return workflowLimit;
    }

    public Integer getGoogleContactsLimit()
    {
	return googleContactsLimit;
    }

    public Integer getWebRuleLimit()
    {
	return webRuleLimit;
    }

    public Integer getPageViewsLimit()
    {
	return pageViewsLimit;
    }

    public String getReporting()
    {
	return reporting;
    }

    public boolean isWhiteLabelEnabled()
    {
	return whiteLabelEnabled;
    }

    public Integer getLimit(String fieldName)
    {
	Integer count = 0;
	try
	{
	    try
	    {
		Object object = this.getClass().getMethod("get" + fieldName + "Limit").invoke(this);

		if (object instanceof Integer)
		    count = (Integer) object;
	    }
	    catch (IllegalAccessException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	    catch (IllegalArgumentException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	    catch (InvocationTargetException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }

	}
	catch (NoSuchMethodException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	catch (SecurityException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return count;
    }
}
