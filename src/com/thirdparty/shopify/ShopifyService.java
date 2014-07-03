package com.thirdparty.shopify;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;

/**
 * This Service provide save customer details into agile contact
 * @author jitendra
 * 
 */
public class ShopifyService
{
    private ShopifyAgileMapper mapper = new ShopifyAgileMapper();

    /**
     * Saving customer details into agile contact
     * @param prefs
     * @param customers
     * @param key
     */
    public void save(ContactPrefs prefs, JSONArray customers, Key<DomainUser> key)
    {

	try
	{
	    for (int i = 0; i < customers.length(); i++)
	    {
		JSONObject customer = new JSONObject(customers.get(i).toString());
		mapper.map(prefs, customer, key);

	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();

	}
    }

}
