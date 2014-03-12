package com.agilecrm.subscription.ui.serialize;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * <code>Plan</code> is used for serializing subscription form data. It include
 * plan information according to which request is sent to Stripe/Paypal
 * 
 * @author Yaswanth
 * 
 */
@XmlRootElement
public class Plan
{
    public static enum PlanType
    {
	BASIC_MONTHLY, PROFESSIONAL_MONTHLY, ENTERPRISE_MONTHLY, ENTERPRISE_YEARLY, BASIC_YEARLY, PROFESSIONAL_YEARLY, LITE_MONTHLY, LITE_YEARLY, PRO_MONTHLY, PRO_YEARLY, PRO_BIENNIAL, STARTER_MONTHLY, STARTER_YEARLY, STARTER_BIENNIAL, REGULAR_MONTHLY, REGULAR_YEARLY, REGULAR_BIENNIAL;
    }

    public PlanType plan_type = null;
    public String plan_id = null;
    public Integer quantity = null;
    public String coupon = null;

    public Plan()
    {

    }

    @Override
    public String toString()
    {
	return "Plan: {plan_id: " + plan_id + ", quantity: " + quantity + "}";
    }

}
