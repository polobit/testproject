/**
 * 
 */
package com.thirdparty.quickbook;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;
import com.agilecrm.scribe.util.SignpostUtil;

/**
 * @author jitendra
 *
 */
public class QuickBookSyncImpl extends OneWaySyncService
{

    @Override
    public Class<? extends WrapperService> getWrapperService()
    {
	return QuickBookContactWrapperImpl.class;
    }

    @Override
    public void initSync()
    {
	JSONArray customers = getCustomers();

	try{
	if (customers != null)
	{
	   for(int i=0 ; i<customers.length();i++){
	       Contact contact = wrapContactToAgileSchemaAndSave(customers.get(i));
	   }
	}
	}catch(Exception e){
	    e.printStackTrace();
	}

    }

    @Override
    protected void updateLastSyncedInPrefs()
    {

    }

    public JSONArray getCustomers()
    {
	JSONArray customers = new  JSONArray();
	
	 String APIURL = "https://quickbooks.api.intuit.com/v3/company/"+prefs.othersParams+"/query?query=SELECT%20%2AFROM%20Customer";
	
	 try{
	 String response = SignpostUtil.accessURLWithOauth(Globals.QUICKBOOKS_CONSUMER_KEY, Globals.QUICKBOOKS_CONSUMER_SECRET, prefs.token,
			prefs.secret, APIURL, "GET", "", "quickbooks");
	 JSONObject object = new JSONObject(response);
	 
	 JSONObject queryResponse = object.getJSONObject("QueryResponse");
	 if(queryResponse != null){
	      customers = queryResponse.getJSONArray("Customer");
	 }
	 
	 }catch(Exception e){
	     e.printStackTrace();
	 }
	return customers;
    }
    
    public static void main(String[] args)
    {
	
		
    }

}
