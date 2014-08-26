package com.thirdparty.xero;

import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;
import com.agilecrm.scribe.util.SignpostUtil;

public class XeroSyncImpl extends OneWaySyncService
{
    private int currentPage = 1;
    private static String BASE_URL = "https://api.xero.com/api.xro/2.0/%s";

    @Override
    public Class<? extends WrapperService> getWrapperService()
    {
	return XeroContactWrapperImpl.class;
    }

    @Override
    public void initSync()
    {

	while (true)
	{

	    try
	    {
		String contactURl = String.format(BASE_URL+"?page="+currentPage+"", "Contacts");
		String result = SignpostUtil.accessURLWithOauth(Globals.XERO_API_KEY, Globals.XERO_CLIENT_ID,
			prefs.token, prefs.secret, contactURl, "GET", "", "xero");
		JSONObject response = new JSONObject(result);
		if(response.has("Contacts")){
		    JSONArray contacts = (JSONArray) response.get("Contacts");
		  
		    for(int i=0;i<contacts.length();i++){
			
			    Contact agileContact = wrapContactToAgileSchemaAndSave(contacts.get(i));
			    System.out.println(agileContact.id);
			}
		   
		    
		}else{
		    break;
		}
		
		System.out.println(response);

	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
		break;
	    }
	    
	    currentPage += 1;
	}

    }

    @Override
    protected void updateLastSyncedInPrefs()
    {

    }

}
