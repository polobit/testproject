package com.thirdparty.shopify;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

public class ShopifyService {
	private ShopifyAgileMapper mapper = new ShopifyAgileMapper();
	
	public void save(org.json.JSONObject jsonObject,Key<DomainUser> key){
		try{
		JSONArray customerList = new JSONArray(jsonObject.get("customers").toString());
		for(int i=0;i<customerList.length();i++){
			JSONObject customer = new JSONObject(customerList.get(i).toString());
			mapper.saveCustomer(customer, key);
		}
		
		}catch(Exception e){
			e.printStackTrace();
		}
	}

}
