package com.agilecrm.billing;

import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.customer.CreditCard;
import com.agilecrm.customer.Plan;

public interface AgileBilling
{
    public JSONObject createCustomer(CreditCard cardDetails, Plan plan)
	    throws Exception;

    public JSONObject updatePlan(JSONObject billingData, Plan plan)
	    throws Exception;

    public JSONObject updateCreditCard(JSONObject billingData,
	    CreditCard cardDetails) throws Exception;

    public JSONObject getInvoices(JSONObject billingData) throws Exception;

    public void deleteCustomer(JSONObject billingData) throws Exception;
}
