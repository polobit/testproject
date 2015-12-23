/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.net.SocketTimeoutException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.sync.ImportStatus;
import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.IContactWrapper;
import com.agilecrm.contact.sync.wrapper.impl.SalesForceContactWrapperImpl;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.JSONUtil;
import com.agilecrm.util.email.SendMail;
import com.thirdparty.salesforce.SalesforceUtil;

/**
 * @author jitendra
 * 
 */
public class SalesforceSync extends OneWaySyncService
{

	Map<String, String> contactIdsMap = new HashMap<String, String>();
	boolean contactsfetched = false;
	
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
        	importSalesforceContacts();
        }
        
        if(importOptions.contains("tasks")){
        	System.out.println("Importing tasks");
        	importSalesforceTasks();
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
			
			storeContactIdAndEmailsInList(jsonArray);
			
			saveContactsInAgile(jsonArray);
			
		}
		catch (SocketTimeoutException e)
		{
			System.out.println("In exception ");
			importSalesforceContacts();
		}

	}
    
    private void storeContactIdAndEmailsInList(JSONArray entries){
    	
    	if(entries == null || entries.length() == 0)
    		  return;
    	
		 for (int i = 0; i < entries.length(); i++) {
    			 try {
	    			 JSONObject entryJSON = entries.getJSONObject(i);
	    			 contactIdsMap.put(entryJSON.getString("Id"), entryJSON.getString("Email"));
    			 } catch (Exception e) {
    			 		e.printStackTrace();
    			 }
			}
       	
    }
    
    private String getContactsFromSalesForce() throws Exception
	{
		String query = "SELECT  Id, FirstName, LastName, Email, Title, Department,  Phone, Fax, MobilePhone, MailingCity, MailingState, MailingCountry, MailingPostalCode, MailingStreet FROM Contact";
		System.out.println("In contacts------------------------------------");
		
		this.contactsfetched = true;
		return SalesforceUtil.getEntities(prefs, query);
	}
    
    /**
     * Save contacts in agile crm.
     * 
     * @param entries
     *            the entries
     */
    private void saveContactsInAgile(JSONArray entries)
    {
    	
		for (int i = 0; i < entries.length(); i++)
		{
			try {
				
				JSONObject entry =  entries.getJSONObject(i);
				
			    List<String> emails = getEmailsList(entry);
	
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
    }
	
    
    private List<String> getEmailsList(JSONObject entry) {
    	
    	List<String> emailList = new ArrayList<String>();
    	
    	String email = "";
    	if(entry.has("Email")){
    		email = JSONUtil.getJSONValue(entry, "Email");
    	}
    	
    	if(email == null)
    		 return emailList;
    	
    	StringTokenizer tokens = new StringTokenizer(email, ",");
    	while (tokens.hasMoreElements()) {
			String object = (String) tokens.nextElement();
			emailList.add(object);
		}
    	
    	return emailList;
    	
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
	return SalesForceContactWrapperImpl.class;
    }
    
    
    
    private void finalizeSync()
    {
	sendNotification(prefs.type.getNotificationEmailSubject());
    }

	@Override
	protected void updateLastSyncedInPrefs() {
	}
	
	
	protected void importSalesforceTasks(){
		
		try
		{
			if(!this.contactsfetched)
			{
				storeContactIdAndEmailsInList(new JSONArray(getContactsFromSalesForce()));
			}
			
			System.out.println("contactIdsMap = " + contactIdsMap);
			
			JSONArray json = getTasksFromSalesForce();
			System.out.println(json);
			saveSalesforceTasksInAgile(json);
		}
		catch (SocketTimeoutException e)
		{
			System.out.println("In exception ");
			importSalesforceTasks();
		}catch (Exception e) {
			e.printStackTrace();
		}
		
	}
    
	protected JSONArray getTasksFromSalesForce() throws Exception{
		String query = "select Id, OwnerId, whoId, whatId, Subject, Description, ActivityDate, Priority, Status, Who.Type, Who.Name, Who.Id From Task";
		System.out.println("In tasks------------------------------------");
		return new JSONArray(SalesforceUtil.getEntities(prefs, query));
	}
	
	protected void saveSalesforceTasksInAgile(JSONArray entries){
    	
		syncStatus.put(ImportStatus.TOTAL_TASKS, entries.length());
		
		for (int i = 0; i < entries.length(); i++)
		{
			try {
			   wrapTaskToAgileSchemaAndSave(entries.getJSONObject(i));
			} catch (Exception e) {
			}
			
		}
	}
	
	protected void wrapTaskToAgileSchemaAndSave(JSONObject entry){

		try {
			
				System.out.println("In task contact of agile");
				Task agileTask = new Task();
				
				if(entry.has("Subject"))
				agileTask.subject = entry.getString("Subject");
				
				if(entry.has("Status")){
	
					String status = entry.getString("Status");
					agileTask.status = Task.Status.YET_TO_START;
					if(StringUtils.isNotBlank(status)){
						switch (status) {
						case "Completed":
							agileTask.status = Task.Status.COMPLETED;
							break;
						case "In Progress":
							agileTask.status = Task.Status.IN_PROGRESS;
							break;
						}
					}
				
				}
				
				if(entry.has("Priority")){
					String type = entry.getString("Priority");
					agileTask.priority_type = Task.PriorityType.NORMAL;
					if(StringUtils.isNotBlank(type)){
						switch (type) {
						case "High":
							agileTask.priority_type = Task.PriorityType.HIGH;
							break;
						case "Normal":
							agileTask.priority_type = Task.PriorityType.NORMAL;
							break;
						case "Low":
							agileTask.priority_type = Task.PriorityType.LOW;
							break;
						}
					}
				}
				
				if(entry.has("Description")){
					String desc = entry.getString("Description");
					agileTask.note_description = desc;
				}
				
				if(entry.has("ActivityDate")){
					String date = entry.getString("ActivityDate");
					try {
						DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
						agileTask.due = formatter.parse(date).getTime() / 1000;
					} catch (Exception e) {
					}
				} else {
					agileTask.due = System.currentTimeMillis() / 1000;
				}
				
				if(entry.has("WhoId")){
					String contactId = entry.getString("WhoId");
					if(contactIdsMap.containsKey(contactId)){
						
						List<String> contactList = new ArrayList<String>();
						// Get agile contact with associated email
						String emailid = contactIdsMap.get(contactId);
						if(StringUtils.isNotBlank(emailid))
						{
							Contact agileContact =  ContactUtil.searchContactByEmailAndType(emailid, Type.PERSON);
							contactList.add(agileContact.id + "");
						}
						
						agileTask.contacts = contactList;
						
					}
				}
	
				agileTask.save();
				syncStatus.put(ImportStatus.SAVED_TASKS, (syncStatus.get(ImportStatus.SAVED_TASKS) + 1));
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	
	}
	
	
	/**
     * send Email Notification status to domain user after import completed.this
     * method needs to be called from third party client
     * 
     * @param Map
     *            Map<ImportStatus,Integer> map
     * @param notificationSubject
     *            String value of subject
     * 
     * 
     */

    public void sendNotification(String notificationSubject)
    {
	DomainUser user = DomainUserUtil.getCurrentDomainUser();

	// Saves limits
	restriction.save();

	buildNotificationStatus();

	System.out.println("----Synced contacts------" + syncStatus.get(ImportStatus.TOTAL));
	
	if (user != null)
	{

	    int emailRequired = syncStatus.get(ImportStatus.EMAIL_REQUIRED);
	    if (emailRequired == 0)
		syncStatus.remove(ImportStatus.EMAIL_REQUIRED);

	    SendMail.sendMail(user.email, notificationSubject, NOTIFICATION_TEMPLATE, new Object[] { user, syncStatus });

	    SendMail.sendMail("govind@agilecrm.com", notificationSubject + " - " + user.domain,
		    NOTIFICATION_TEMPLATE, new Object[] { user, syncStatus });
	}
    }

    /**
     * Builds the notification status creates Map of Total New Contact,Merge
     * Contact and Failed Contact save in Agile for Email Notification .
     * 
     * @return the map
     */
    private Map<ImportStatus, Integer> buildNotificationStatus()
    {
	Integer fail = syncStatus.get(ImportStatus.TOTAL_FAILED);
	Integer total = syncStatus.get(ImportStatus.TOTAL);
	Integer totalSaved = syncStatus.get(ImportStatus.SAVED_CONTACTS);
	for (Map.Entry<ImportStatus, Integer> entry : syncStatus.entrySet())
	{
	    if (entry.getKey() == ImportStatus.NEW_CONTACTS)
	    {
		total += entry.getValue();
		totalSaved += entry.getValue();
	    }
	    else if (entry.getKey() == ImportStatus.MERGED_CONTACTS)
	    {
		total += entry.getValue();
		totalSaved += entry.getValue();
	    }
	    else if (entry.getKey() == ImportStatus.LIMIT_REACHED)
	    {
		total += entry.getValue();
		fail += entry.getValue();
	    }

	}

	syncStatus.put(ImportStatus.TOTAL_FAILED, fail);
	syncStatus.put(ImportStatus.TOTAL, total);
	syncStatus.put(ImportStatus.SAVED_CONTACTS, totalSaved);
	
	// Tasks
	if(syncStatus.get(ImportStatus.TOTAL_TASKS) > 0){
		syncStatus.put(ImportStatus.TOTAL_TASKS, syncStatus.get(ImportStatus.TOTAL_TASKS));
		syncStatus.put(ImportStatus.SAVED_TASKS, syncStatus.get(ImportStatus.SAVED_TASKS));
	}

	return syncStatus;
    }
	
}

