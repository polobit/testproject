package com.agilecrm.billing;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Plan
{
    public String plan_id = "";
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
