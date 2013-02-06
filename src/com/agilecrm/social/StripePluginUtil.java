package com.agilecrm.social;

import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.subscription.stripe.StripeUtil;
import com.agilecrm.widgets.Widget;
import com.stripe.model.Customer;

public class StripePluginUtil
{

    public static JSONObject getCustomerDetails(Widget widget, String customerId)
	    throws Exception
    {
	String apiKey = widget.getProperty("access_token");
	Customer customer = Customer.retrieve(customerId, apiKey);
	return StripeUtil.getJSONFromCustomer(customer);

    }

}
