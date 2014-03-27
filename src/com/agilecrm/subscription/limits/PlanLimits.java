package com.agilecrm.subscription.limits;

public enum PlanLimits
{
    FREE(null, 0f, 1000, 500, 1, 0, 1, 1000, "Email Reports", false), STARTER(null, 0f, 10000, 1500, 0, 0, 3, 5000, "ALL", false), REGULAR(null, 0f, 50000,
	    2500, 0, 0, 5, 10000, "ALL", false), PRO(null, 0f, Integer.MAX_VALUE, 5000, 0, 0, 10, 20000, "ALL", true),

    BASIC(null, 0f, 0, 0, 0, 0, 0, 1000, "ALL", false), PROFESSIONAL(null, 0f, 0, 0, 0, 0, 0, 5000, "ALL", false), ENTERPRISE(null, 0f, 0, 0, 0, 0, 0, 10000,
	    "ALL", true), LITE(null, 0f, 0, 0, 0, 0, 0, 1000, "ALL", false);

    private final String planId;
    private final Float price;
    private final Integer contactsLimit;
    private final Integer emailsLimit;
    private final Integer campaignsLimit;
    private final Integer googleContactsLimit;
    private final Integer webRulesLimit;
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
    private PlanLimits(String planId, Float price, Integer contactsLimit, Integer emailsLimit, Integer campaignsLimit, Integer googleContactsLimit,
	    Integer webRulesLimit, Integer pageViewsLimit, String reporting, boolean whiteLabelEnabled)
    {
	this.planId = planId;
	this.price = price;
	this.contactsLimit = contactsLimit;
	this.emailsLimit = emailsLimit;
	this.campaignsLimit = campaignsLimit;
	this.googleContactsLimit = googleContactsLimit;
	this.webRulesLimit = webRulesLimit;
	this.pageViewsLimit = pageViewsLimit;
	this.reporting = reporting;
	this.whiteLabelEnabled = whiteLabelEnabled;
    }

    public String getPlan()
    {
	return this.toString();
    }

    public String getPlanId()
    {
	return this.planId;
    }

    public Float getPrice()
    {
	return price;
    }

    public Integer getContactsLimit()
    {
	return contactsLimit;
    }

    public Integer getGoogleContactsLimit()
    {
	return googleContactsLimit;
    }

    public Integer getEmailsLimit()
    {
	return emailsLimit;
    }

    public Integer getCampaignsLimit()
    {
	return campaignsLimit;
    }

    public Integer getwebRulesLimit()
    {
	return webRulesLimit;
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
}