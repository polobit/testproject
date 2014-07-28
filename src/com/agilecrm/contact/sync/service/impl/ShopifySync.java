/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;
import org.json.JSONObject;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Verb;

import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;
import com.agilecrm.contact.sync.wrapper.impl.ShopifyContactWrapperImpl;

// TODO: Auto-generated Javadoc
/**
 * The Class ShopifySync.
 * 
 * @author jitendra
 */
public class ShopifySync extends OneWaySyncService
{
    private String shop;
    private static final int MAX_FETCH_RESULT = 250;
    private int currentPage = 1;
    private String lastSyncPoint;
    
    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
    String date = df.format(new Date());

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.service.OneWaySyncService#initSync()
     */
    @Override
    public void initSync()
    {
	  shop = prefs.othersParams;
	  lastSyncPoint = prefs.lastSyncCheckPoint;
	if (shop != null && !shop.isEmpty())
	{
	    int total_records = getTotalCustomers(shop);
		int pages = (int) Math.ceil(total_records / MAX_FETCH_RESULT);

		if (total_records < MAX_FETCH_RESULT)
		    pages = 1;

		try
		{

		    while (currentPage <= pages)
		    {
		    ArrayList<LinkedHashMap<String, Object>> customers = new ArrayList<LinkedHashMap<String, Object>>();
			String newCustomerURl = materializeURL(shop, "customers", currentPage,"new");
			String updateCustomerURl = materializeURL(shop, "customers", currentPage,"edited");
			
			customers.addAll(getCustomers(newCustomerURl));
			customers.addAll(getCustomers(updateCustomerURl));
			if(!isLimitExceeded()){
			for(int i =0;i<customers.size();i++){
			
				wrapContactToAgileSchemaAndSave(customers.get(i));
				
			}
		    }
			currentPage += 1;
		    }
		    sendNotification(prefs.client.getNotificationEmailSubject());
		    updateLastSyncedInPrefs();
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		}

	}
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.service.SyncService#getWrapperService()
     */
    @Override
    public Class<? extends WrapperService> getWrapperService()
    {
	return ShopifyContactWrapperImpl.class;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.agilecrm.contact.sync.service.ContactSyncService#updateLastSyncedInPrefs
     * ()
     */
    @Override
    protected void updateLastSyncedInPrefs()
    {
	  prefs.lastSyncCheckPoint = date;
	  prefs.save();

    }

    private String materializeURL(String shop, String entityName, int page,String update)
    {

	StringBuilder uri = new StringBuilder();

	uri.append("https://").append(shop).append("/admin/").append(entityName + ".json?");
	if (page != 0){
	    uri.append("limit=" + MAX_FETCH_RESULT).append("&page=" + currentPage);
	    if(update.equalsIgnoreCase("new")){
	      uri.append("&created_at_min="+lastSyncPoint);
	    }else if(update.equalsIgnoreCase("update")){
	    	uri.append("&updated_at_max="+lastSyncPoint);
	    }
	}
	System.out.println(uri.toString());

	return uri.toString();

    }

    private int getTotalCustomers(String shopName)
    {
	Integer count = 0;
	String uri = materializeURL(shopName, "count", 0,"new");
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, uri);
	oAuthRequest.addHeader("X-Shopify-Access-Token", prefs.token);
	Response response = oAuthRequest.send();
	try
	{
	    HashMap<String, String> properties = new ObjectMapper().readValue(response.getBody(),
		    new TypeReference<HashMap<String, String>>()
		    {

		    });
	    if (properties.containsKey("count"))
		count = Integer.parseInt(properties.get("count"));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return count.intValue();
    }
    
    public 	ArrayList<LinkedHashMap<String, Object>> getCustomers(String accessURl){
    	
    	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, accessURl);
    	oAuthRequest.addHeader("X-Shopify-Access-Token", prefs.token);
    	ArrayList<LinkedHashMap<String, Object>> customers = new ArrayList<LinkedHashMap<String, Object>>();
    	Response response = oAuthRequest.send();
    	try
    	{
    		Map<String, ArrayList<LinkedHashMap<String, Object>>> results = new ObjectMapper().readValue(response.getStream(),Map.class);
    		 customers = results.get("customers");

    }catch(Exception e){
    	e.printStackTrace();
    }
    return customers;
    }
    
    public ArrayList<LinkedHashMap<String, Object>> getOrder(String customerId){
    	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, getOrderUrl(customerId));
    	oAuthRequest.addHeader("X-Shopify-Access-Token", prefs.token);
    	ArrayList<LinkedHashMap<String, Object>> orders = new ArrayList<LinkedHashMap<String, Object>>();
    	Response response = oAuthRequest.send();
    	try
    	{
    		Map<String, ArrayList<LinkedHashMap<String, Object>>> results = new ObjectMapper().readValue(response.getStream(),Map.class);
    		 orders = results.get("orders");

    }catch(Exception e){
    	e.printStackTrace();
    }
    return orders;
    }
    

public String getOrderUrl(String custId){
	StringBuilder sb = new  StringBuilder("http://"+shop+"/admin/orders.json?customer_id="+custId);
	return sb.toString();
}
}