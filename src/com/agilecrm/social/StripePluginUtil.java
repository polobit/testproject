package com.agilecrm.social;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.subscription.stripe.StripeUtil;
import com.agilecrm.widgets.Widget;
import com.google.gson.Gson;
import com.stripe.model.Customer;
import com.stripe.model.Invoice;

public class StripePluginUtil
{

    public static JSONObject getCustomerDetails(Widget widget, String customerId)
	    throws Exception
    {

	JSONObject customer_info = new JSONObject();

	String apiKey = widget.getProperty("access_token");
	Customer customer = Customer.retrieve(customerId, apiKey);

	Map<String, Object> invoiceParams = new HashMap<String, Object>();
	invoiceParams.put("customer", customerId);
	List<Invoice> invoiceList = Invoice.all(invoiceParams, apiKey)
		.getData();
	// System.out.println(Invoice.all(invoiceParams, apiKey));
	// System.out.println(invoiceList);
	JSONArray list = new JSONArray(new Gson().toJson(invoiceList));
	// System.out.println(list);
	customer_info.put("customer", StripeUtil.getJSONFromCustomer(customer));
	customer_info.put("invoice", list);
	// System.out.println(customer_info);
	return customer_info;

    }

    public static void main(String[] args)
    {
	try
	{
	    // "sk_test_R4iHedrh8cDnCsNthKyXSKTj";
	    System.out.println(getCustomerDetails(null, "cus_1HB4FFdQLR4g7X"));
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

}
