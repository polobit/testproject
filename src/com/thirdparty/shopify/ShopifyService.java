package com.thirdparty.shopify;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;

public class ShopifyService {
	private ShopifyAgileMapper mapper = new ShopifyAgileMapper();

	public void save(ContactPrefs prefs,JSONArray customers, Key<DomainUser> key) {

		try {
			for (int i = 0; i < customers.length(); i++) {
				JSONObject 	customer = new JSONObject(customers.get(i).toString());
				System.out.println(customer.get("email"));
				mapper.saveCustomer(prefs,customer, key);

			}
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

}
