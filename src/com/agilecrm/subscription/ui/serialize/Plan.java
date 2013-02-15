package com.agilecrm.subscription.ui.serialize;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Plan
{
	public static enum PlanType
	{
		LITE_MONTHLY, PRO_MONTHLY, ENTERPIRSE_MONTHLY, 
		LITE_YEARLY, PRO_YEARLY, ENTERPRISE_YEARLY
	}
	
	public PlanType plan_type = null;
    public String plan_id = null;
    public Integer quantity = null;

    public Plan()
    {

    }

    @Override
    public String toString()
    {
    	return "Plan: {plan_id: " + plan_id + ", quantity: " + quantity + "}";
    }

}
