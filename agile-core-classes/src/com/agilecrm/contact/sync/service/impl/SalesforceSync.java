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
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.deferred.SalesforceImportNoteDeferredTask;
import com.agilecrm.contact.sync.ImportStatus;
import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.IContactWrapper;
import com.agilecrm.contact.sync.wrapper.impl.SalesForceContactWrapperImpl;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.JSONUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.thirdparty.salesforce.SalesforceUtil;

/**
 * @author jitendra
 * 
 */
public class SalesforceSync extends OneWaySyncService
{
	
	final String NOTIFICATION_TEMPLATE = "salesforce_import_notification_template";

	public static final String CONTACTS_NOTES_KEY = "contact_notes";
	
	Map<String, String> contactIdsMap = new HashMap<String, String>();
	Map<String, String> contactAccountIdssMap = new HashMap<String, String>();
	Map<String, JSONArray> contactNotesMap = new HashMap<String, JSONArray>();
	
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
    	
    	 if(importOptions.contains("accounts")){
         	System.out.println("Importing accounts");
         	importSalesforceAccounts();
         }
    	 
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
    
    private String getAccountsFromSalesForce() throws Exception{

		// String query = "SELECT Id, ParentId, Name, Website, Phone, Industry, Description, Type, NumberOfEmployees, BillingStreet, BillingCity, BillingState, BillingCountry, BillingPostalCode FROM Account";
		String query = "SELECT Id, ParentId, Name, Website, Phone, Type, BillingStreet, BillingCity, BillingState, BillingCountry, BillingPostalCode FROM Account";
		System.out.println("In accounts------------------------------------");
		return SalesforceUtil.getEntities(prefs, query);
	
    }
    private void importSalesforceAccounts() throws JSONException, Exception{
    	try
		{
			JSONArray jsonArray = new JSONArray(getAccountsFromSalesForce());
			System.out.println(jsonArray);
			
			// Get notes from salesforce
			getNotesFromSalesForceAndCategorizeOnParentId();
						
			saveSalesforceAccountsInAgile(jsonArray);
			
			if(syncStatus.get(ImportStatus.SAVED_ACCOUNTS) > 0)
				BulkActionNotifications.publishconfirmation(BulkAction.COMPANIES_CSV_IMPORT, String.valueOf(syncStatus.get(ImportStatus.SAVED_ACCOUNTS)));
			
		}
		catch (SocketTimeoutException e)
		{
			System.out.println("In exception ");
			importSalesforceAccounts();
		}
    }
    
    private void importSalesforceContacts() throws Exception
	{
		try
		{
			JSONArray jsonArray = new JSONArray(getContactsFromSalesForce());
			System.out.println(jsonArray);
			
			storeContactIdAndEmailsInList(jsonArray);
			
			// Get accounts list
			getAccountssFromSalesForceAndCategorizeOnAccountIdAndName();
			
			// Get notes from salesforce
			getNotesFromSalesForceAndCategorizeOnParentId();
			
			saveContactsInAgile(jsonArray);
			
			if(syncStatus.get(ImportStatus.SAVED_CONTACTS) > 0)
				BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_CSV_IMPORT, String.valueOf(syncStatus.get(ImportStatus.SAVED_CONTACTS)));
			
		}
		catch (SocketTimeoutException e)
		{
			System.out.println("In exception ");
			importSalesforceContacts();
		}

	}
    
    private void getNotesFromSalesForceAndCategorizeOnParentId(){
    	
    	try {
    		
    		JSONArray notesArray = new JSONArray(getNotesFromSalesForce());
        	if(notesArray == null || notesArray.length() == 0)
        		  return;
        	
        	for (int i = 0; i < notesArray.length(); i++) {
        		try {
        			JSONObject noteJSON = notesArray.getJSONObject(i);
        			JSONArray contactNotesArray = new JSONArray();
        			
        			String parentId = JSONUtil.getJSONValue(noteJSON, "ParentId");
        			if(contactNotesMap.containsKey(parentId))
        				contactNotesArray = contactNotesMap.get(parentId);
        			
        			contactNotesArray = contactNotesArray.put(noteJSON);
        			
        			// Reset
        			contactNotesMap.put(parentId, contactNotesArray);
        			
    			} catch (Exception e) {
    				e.printStackTrace();
    			}
        	}	
		} catch (Exception e) {
			e.printStackTrace();
		}
    	
    }
    
    
    private void getAccountssFromSalesForceAndCategorizeOnAccountIdAndName(){
    	
    	try {
    		
    		JSONArray accountsArray = new JSONArray(getAccountsFromSalesForce());
        	if(accountsArray == null || accountsArray.length() == 0)
        		  return;
        	
        	for (int i = 0; i < accountsArray.length(); i++) {
        		try {
        			JSONObject accountJSON = accountsArray.getJSONObject(i);
        			
        			String parentId = JSONUtil.getJSONValue(accountJSON, "Id");
        			contactAccountIdssMap.put(parentId, JSONUtil.getJSONValue(accountJSON, "Name"));
        			
    			} catch (Exception e) {
    				e.printStackTrace();
    			}
        	}	
		} catch (Exception e) {
			e.printStackTrace();
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
    			 }
			}
       	
    }
    
    private String getContactsFromSalesForce() throws Exception
	{
		String query = "SELECT  Id, AccountId, FirstName, LastName, Email, Title, Department,  Phone, Fax, MobilePhone, MailingCity, MailingState, MailingCountry, MailingPostalCode, MailingStreet FROM Contact";
		System.out.println("In contacts------------------------------------");
		
		this.contactsfetched = true;
		return SalesforceUtil.getEntities(prefs, query);
	}
    
    private String getNotesFromSalesForce() throws Exception
	{
		String query = "SELECT Title, Body, ParentId FROM Note";
		System.out.println("In notes------------------------------------");
		
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
    	
    	System.out.println("contactNotesMap = " + contactNotesMap);
		for (int i = 0; i < entries.length(); i++)
		{
			try {
				
				JSONObject entry =  entries.getJSONObject(i);
				
			    List<String> emails = getEmailsList(entry);
	
			    // Added condition to mandate emails. It is added here as other sync
			    // allows contacts without email
			    if (emails == null || emails.size() == 0)
			    {
				// syncStatus.put(ImportStatus.EMAIL_REQUIRED, syncStatus.get(ImportStatus.EMAIL_REQUIRED) + 1);
				// syncStatus.put(ImportStatus.TOTAL_FAILED, syncStatus.get(ImportStatus.TOTAL_FAILED) + 1);
				// continue;
			    }
	
			    // Set notes to contacts if any 
			    String SFcontactId = JSONUtil.getJSONValue(entry, "Id"); 
			    if(contactNotesMap.containsKey(SFcontactId))
			    	entry = entry.put(CONTACTS_NOTES_KEY, contactNotesMap.get(SFcontactId).toString());
			    
			    // Set company name
			    String accountId = JSONUtil.getJSONValue(entry, "AccountId");
			    if(contactAccountIdssMap.containsKey(accountId))
			    	entry = entry.put("CompanyName", contactAccountIdssMap.get(accountId).toString());
			    
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
			
			JSONArray tasksArrayJSON = getTasksFromSalesForce();
			System.out.println(tasksArrayJSON);
			
			saveSalesforceTasksInAgile(tasksArrayJSON);
			
			if(syncStatus.get(ImportStatus.SAVED_TASKS) > 0)
				BulkActionNotifications.publishconfirmation(BulkAction.TASKS_CSV_IMPORT, String.valueOf(syncStatus.get(ImportStatus.SAVED_TASKS)));
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
							agileTask.is_complete = true;
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
							agileTask.is_complete = true;
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
					// agileTask.due = System.currentTimeMillis() / 1000;
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
							if(agileContact != null)
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
	
	protected void saveSalesforceAccountsInAgile(JSONArray entries){
    	
		syncStatus.put(ImportStatus.TOTAL_ACCOUNTS, entries.length());
		
		for (int i = 0; i < entries.length(); i++)
		{
			try {
				
				JSONObject entry = entries.getJSONObject(i);
				
				// Set notes to contacts if any 
			    String SFcontactId = JSONUtil.getJSONValue(entry, "Id"); 
			    if(contactNotesMap.containsKey(SFcontactId))
			    	entry = entry.put(CONTACTS_NOTES_KEY, contactNotesMap.get(SFcontactId).toString());
			    
				wrapAccountToAgileSchemaAndSave(entry);
			} catch (Exception e) {
			}
			
		}
	}
	
	protected void wrapAccountToAgileSchemaAndSave(JSONObject entry){

		try {
			
				System.out.println("In account of salesforce");
				Contact agileCompany = new Contact();
				
				// Set type as company
				agileCompany.type = Type.COMPANY;
				
				String companyName = JSONUtil.getJSONValue(entry, "Name"); 
				agileCompany.properties.add(new ContactField(Contact.NAME, companyName, null));
				
				if(entry.has("Website"))
					agileCompany.properties.add(new ContactField(Contact.WEBSITE, JSONUtil.getJSONValue(entry, "Website"), null));
				
				if(entry.has("Phone"))
					agileCompany.properties.add(new ContactField(Contact.PHONE, JSONUtil.getJSONValue(entry, "Phone"), "main"));
				
				if (entry.has("Fax"))
					agileCompany.properties.add(new ContactField(Contact.PHONE, JSONUtil.getJSONValue(entry, "Fax"), "home fax"));
				
				if (entry.has("Industry"))
					agileCompany.properties.add(new ContactField(Contact.TITLE, JSONUtil.getJSONValue(entry, "Industry"), null));
				
					
	    		JSONObject json = new JSONObject();
	    		if (entry.has("BillingStreet"))
	    			json.put("address", entry.getString("BillingStreet"));
	    		if (entry.has("BillingCity"))
	    			json.put("city", entry.getString("BillingCity"));
	    		if (entry.has("BillingState"))
	    			json.put("state", entry.getString("BillingState"));
	    		if (entry.has("BillingCountry"))
	    			json.put("country", entry.getString("BillingCountry"));
	    		if (entry.has("BillingPostalCode"))
	    			json.put("zip", entry.getString("BillingPostalCode"));
	    		
	    		// default subtype is postal
	    		agileCompany.properties.add(new ContactField(Contact.ADDRESS, json.toString(), "postal"));
	
	    		// Check the existance
				if(ContactUtil.isCompanyExist(companyName)){
					agileCompany = ContactUtil.mergeCompanyFields(agileCompany);
					syncStatus.put(ImportStatus.MERGED_ACCOUNTS, (syncStatus.get(ImportStatus.MERGED_ACCOUNTS) + 1));
				} else {
					syncStatus.put(ImportStatus.SAVED_ACCOUNTS, (syncStatus.get(ImportStatus.SAVED_ACCOUNTS) + 1));
				}
				
	    		agileCompany.save();
	    		
	    		// Get notes from Salesforce
	    		SalesforceImportNoteDeferredTask task =  new SalesforceImportNoteDeferredTask(NamespaceManager.get(), entry.toString(), SalesforceImportNoteDeferredTask.ACTION_TYPE.ADD_NOTES, agileCompany.id);
	    		
	    		Queue defaultQueue = QueueFactory.getDefaultQueue();
	    		defaultQueue.addAsync(TaskOptions.Builder.withPayload(task));
			
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

	/*if(syncStatus.get(ImportStatus.TOTAL_ACCOUNTS) == 0 && syncStatus.get(ImportStatus.SAVED_CONTACTS) == 0 && syncStatus.get(ImportStatus.TOTAL_TASKS) == 0)
		  return;*/
	
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
    	System.out.println("buildNotificationStatus in sync class");
    	
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

	// Accounts
	if(syncStatus.get(ImportStatus.TOTAL_ACCOUNTS) > 0){
		syncStatus.put(ImportStatus.TOTAL_ACCOUNTS, syncStatus.get(ImportStatus.TOTAL_ACCOUNTS));
		syncStatus.put(ImportStatus.SAVED_ACCOUNTS, syncStatus.get(ImportStatus.SAVED_ACCOUNTS));
		syncStatus.put(ImportStatus.MERGED_ACCOUNTS, syncStatus.get(ImportStatus.MERGED_ACCOUNTS));
	}
	
	System.out.println("syncStatus = " + syncStatus.toString());
	
	return syncStatus;
    }
	
}

