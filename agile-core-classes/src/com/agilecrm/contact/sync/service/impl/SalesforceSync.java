/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.sync.ImportStatus;
import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.IContactWrapper;
import com.agilecrm.contact.sync.wrapper.impl.GoogleContactWrapperImpl;
import com.google.appengine.api.NamespaceManager;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.extensions.Email;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.utl.ContactPrefsUtil;
import com.thirdparty.salesforce.SalesforceContactToAgileContact;
import com.thirdparty.salesforce.SalesforceImportUtil;
import com.thirdparty.salesforce.SalesforceUtil;

/**
 * @author jitendra
 * 
 */
public class SalesforceSync extends OneWaySyncService
{

    @Override
    public void initSync()
    {
    	
	// TODO Auto-generated method stub
    System.out.println("SalesforceSync started" + prefs);
    
    if(prefs == null)
    	 return;
    
    // Get Contacts and Tasks
    List<String> importOptions = prefs.importOptions;
    if(importOptions == null)
    	  return;
    
    try {
    	if(importOptions.contains("contacts")){
        	System.out.println("Importing contacts");
        	importSalesforceContacts(prefs);
        	
        	// SalesforceImportUtil.importSalesforceContacts(prefs);
        }
        
        if(importOptions.contains("tasks")){
        	System.out.println("Importing tasks");
        	SalesforceImportUtil.importSalesforceTasks(prefs);
        }
	} catch (Exception e) {
		e.printStackTrace();
	} finally{
		finalizeSync();	
	}
    
    }
    
    private void importSalesforceContacts() throws Exception
	{
		try
		{
			JSONArray jsonArray = new JSONArray(getContactsFromSalesForce());
			System.out.println(jsonArray);
			
			saveContactsInAgile(jsonArray);
			// SalesforceContactToAgileContact.saveSalesforceContactsInAgile(contactPrefs, json);
		}
		catch (SocketTimeoutException e)
		{
			System.out.println("In exception ");
			importSalesforceContacts();
		}

	}
    
    private String getContactsFromSalesForce() throws Exception
	{
		String query = "SELECT  Id, FirstName, LastName, Email, Title, Department,  Phone, Fax, MobilePhone, MailingCity, MailingState, MailingCountry, MailingPostalCode, MailingStreet FROM Contact";
		System.out.println("In contacts------------------------------------");
		return SalesforceUtil.getEntities(prefs, query);
	}
    
    /**
     * Save contacts in agile crm.
     * 
     * @param entries
     *            the entries
     */
    private int index =0;
    private void saveContactsInAgile(JSONArray entries)
    {
	Long created_at = 0l;

	for (int i = 0; i < entries.length(); i++)
	{
		
		try {
			
			JSONObject entry =  entries.getJSONObject(i);
			index++;
			
		    List<String> emails = getEmailAddresses(entry);

		    // Added condition to mandate emails. It is added here as other sync
		    // allows contacts without email
		    if (emails == null || emails.size() == 0)
		    {
			syncStatus.put(ImportStatus.EMAIL_REQUIRED, syncStatus.get(ImportStatus.EMAIL_REQUIRED) + 1);
			syncStatus.put(ImportStatus.TOTAL_FAILED, syncStatus.get(ImportStatus.TOTAL_FAILED) + 1);
			continue;
		    }

		   wrapContactToAgileSchemaAndSave(entry);
		   
		} catch (Exception e) {
		}
		
	}

	System.out.println(NamespaceManager.get() + " , " + index);

    }
    
    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.service.SyncService#getWrapperService()
     */
    @Override
    public Class<? extends IContactWrapper> getWrapperService()
    {
	// TODO Auto-generated method stub
	return GoogleContactWrapperImpl.class;
    }
    
    private List<String> getEmailAddresses(JSONObject entry){
    	List<String> emailList = new ArrayList<String>();
    	
    	String email = "";
    	
    	if(entry.has("Email")){
    		email = entry.getString("Email");
    	}
    	
    	if(StringUtils.isBlank(email))
    		  return emailList;
    	
    	StringTokenizer tokens = new StringTokenizer(email, ",");
    	while (tokens.hasMoreElements()) {
			String object = (String) tokens.nextElement();
			emailList.add(object);
		}
    	
    	return emailList;
    }
    
    private void finalizeSync()
    {
	sendNotification(prefs.type.getNotificationEmailSubject());
    }
    

}

