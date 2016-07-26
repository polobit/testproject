package com.agilecrm.contact.deferred;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.ContactSchemaUpdateStats;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.document.ContactDocument;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.CountryUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.search.Document.Builder;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * @author kakarlal
 *
 */
@SuppressWarnings("serial")
public class UpdateContactsOfDomainDeferredTask implements DeferredTask
{
	/**
	 * Domain of the account
	 */
	private String domain;

	private String cursor;

	private int count;

	public UpdateContactsOfDomainDeferredTask(String domain, String cursor, int count)
	{
		this.domain = domain;
		this.cursor = cursor;
		this.count = count;
	}

	@Override
	public void run()
	{
		
		System.out.println("Task started for domain: "+ domain);
		String oldNamespace = NamespaceManager.get();
		int currentCount = 0;
		String failedIds = "";

		NamespaceManager.set(domain);
		List<Contact> contacts_list = null;
		List<Builder> builderObjects = new ArrayList<Builder>();
		String currentCursor = null;
		String previousCursor = null;
		try
		{
			ContactSchemaUpdateStats contactSchemaUpdateStats = getStats();
			if(contactSchemaUpdateStats != null) {
				count = contactSchemaUpdateStats.count;
				previousCursor = contactSchemaUpdateStats.cursor;
				failedIds = contactSchemaUpdateStats.failedIds;
				updateStats(previousCursor,failedIds, "RUNNING");
			}
			ContactDocument contactDocuments = new ContactDocument();
			contacts_list = Contact.dao.fetchAll(200, cursor, null);
			try {
				if(StringUtils.isEmpty(cursor) && count == 0 && currentCount == 0 && contactSchemaUpdateStats == null) {
					int total = (contacts_list != null && contacts_list.size() > 0)?contacts_list.get(0).count : 0;
					createStats(total);
				}
			} catch(Exception e) {
				System.err.println("Exception while creating stats for domain: "+ domain);
				e.printStackTrace();
			}
			if(contacts_list == null || contacts_list.isEmpty()) {
				updateStats(null, failedIds, "COMPLETED");
				return;
			}
			AppengineSearch<Contact> search = new AppengineSearch<Contact>(Contact.class);
			do
			{
				currentCount += contacts_list.size();

				previousCursor = contacts_list.get(contacts_list.size() - 1).cursor;
				
				for (Contact contact : contacts_list)
				{
					//Updates old contact countries with country code
					updateCountry(contact);
					
					contact.updated_time = System.currentTimeMillis() / 1000;
					//builderObjects.add(contactDocuments.buildDocument(contact));
					try {
						search.index.putAsync(contactDocuments.buildDocument(contact));
					} catch(Exception e) {
						System.out.println("Exception while adding contact to text search: "+contact.id + e);
						failedIds = failedIds + ", " + contact.id;
					}
					/*if(builderObjects.size() >= 50) {
						search.index.putAsync(builderObjects.toArray(new Builder[builderObjects.size() - 1]));
						builderObjects.clear();
					}*/
				}
				Contact.dao.putAll(contacts_list);

				if(builderObjects.size() > 0) {
					search.index.putAsync(builderObjects.toArray(new Builder[builderObjects.size() - 1]));
					builderObjects.clear();
				}
				
				System.out.println("Contacts completed so far: "+ currentCount);

				
				//already saved 10000 so create new task.
				if(currentCount >= 10000) {
					count+=currentCount;
					if(previousCursor != null) {
						System.out.println("New ask started for domain: "+ domain+" after completing "+count);
						//update stats with new count and cursor.
						updateStats(previousCursor,failedIds, "ANOTHER_TASK_CRAETED");
						UpdateContactsOfDomainDeferredTask updateContactDeferredTask = new UpdateContactsOfDomainDeferredTask(
								domain, previousCursor, count);
						// Create Task and push it into Task Queue
					    TaskOptions taskOptions = TaskOptions.Builder.withPayload(updateContactDeferredTask);
						
						
						// Add to queue
						Queue queue = QueueFactory.getQueue(AgileQueues.CONTACTS_SCHEMA_CHANGE_QUEUE);
						queue.addAsync(taskOptions);
					} else {
						//update stats to completion.
						
						updateStats(previousCursor,failedIds, "COMPLETED");
					}
					break;
				}

				if (!StringUtils.isEmpty(previousCursor))
				{
					contacts_list = Contact.dao.fetchAll(200, previousCursor, null);
					
					currentCursor = contacts_list.size() > 0 ? contacts_list.get(contacts_list.size() - 1).cursor
							: null;
					continue;
				}
				
				//update stats to completion.
				count+=currentCount;
				
				updateStats(previousCursor,failedIds, "COMPLETED");
				break;
			} while (contacts_list.size() > 0 && !StringUtils.equals(previousCursor, currentCursor));
			

		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}
	
	private void createStats(int total)
	{
		NamespaceManager.set("");
		try {
		 new ContactSchemaUpdateStats(domain, "STARTED", null, 0, total).save();
		} finally {
			NamespaceManager.set(domain);
		}
		
	}

	private ContactSchemaUpdateStats getStats()
	{
		NamespaceManager.set("");
		try {
			return ContactSchemaUpdateStats.getByDomain(domain);
		} finally {
			NamespaceManager.set(domain);
		}
	}

	private void updateStats(String previousCursor,String failedIds, String status) {
		NamespaceManager.set("");
			
		
		
		try {
			System.out.println(" cur Domain "+ domain);
			ContactSchemaUpdateStats contactSchemaUpdateStats = ContactSchemaUpdateStats.get(domain);
			String domainUserMail =contactSchemaUpdateStats.domainusermail;
			System.out.println("Domain user email "+ domainUserMail);
			
			
			
			contactSchemaUpdateStats.count = count;
			contactSchemaUpdateStats.cursor = previousCursor;
			contactSchemaUpdateStats.status = status;
			contactSchemaUpdateStats.failedIds = failedIds;
			
			contactSchemaUpdateStats.save();
			
			if(status.equalsIgnoreCase("COMPLETED"))
			{		
				SendMail.sendMail(domainUserMail, "Process update Status", SendMail.Process_update_status,
						new Object[] { domain, status });

				
				//System.out.println("Namespace"+NamespaceManager.get());
				//System.out.println("Session ="+ SessionManager.get());
				
			//DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();
			
			//System.out.println("Domain user "+domainUser);
			//System.out.println(" cur Domain "+ domain);
			
			}
			
		} catch(Exception e) {
			System.err.println("Exception while updating stats for domain: "+ domain);
			e.printStackTrace();
		} finally {
			NamespaceManager.set(domain);
		}
	}
	
	
	private void updateCountry(Contact contact)
	{
		List<ContactField> contactFieldsList = contact.properties;
		if(contactFieldsList != null)
		{
			for(ContactField conField : contactFieldsList)
			{
				if (Contact.ADDRESS.equals(conField.name))
				{
				    ContactField addressField = contact.getContactField(contact.ADDRESS);
				    try
				    {
						if (addressField != null && addressField.value != null)
						{
							JSONObject  addressJSON = new JSONObject(addressField.value);
							if(addressJSON != null && addressJSON.has("country"))
							{
								String contactCountry = addressJSON.getString("country");
								CountryUtil.setCountryCode(addressJSON, null, contactCountry);
							}
						    addressField.value = addressJSON.toString();
						}
				    }
				    catch (JSONException e)
				    {
				    	e.printStackTrace();
				    }
				    catch (Exception e)
				    {
				    	e.printStackTrace();
				    }
				    break;
				}
			}
		}
	}
}