package com.agilecrm.subscription.restrictions.db;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonProperty;

import com.agilecrm.subscription.limits.PlanLimitsEnum;

@XmlRootElement
public class PlanLimitsEmunWrapper
{
    PlanLimitsEnum limits;

    private PlanLimitsEmunWrapper()
    {

    }

    public PlanLimitsEmunWrapper(PlanLimitsEnum limits)
    {
	this.limits = limits;
    }

    public Integer getContactLimit()
    {
	return limits.getContactLimit();
    }

    public Integer getWebRuleLimit()
    {
	return limits.getWebRuleLimit();
    }

    @JsonProperty("isWhiteLabelEnabled")
    public boolean isWhiteLabelEnabled()
    {
	return limits.isWhiteLabelEnabled();
    }

    public String getReporting()
    {
	return limits.getReporting();
    }
}
