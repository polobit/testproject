package com.agilecrm.contact.deferred;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.cases.Case;
import com.agilecrm.cases.util.CaseUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.email.ContactEmail;
import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.contact.filter.ContactFilterResultFetcher;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.document.Document;
import com.agilecrm.document.util.DocumentUtil;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.status.CampaignStatus;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;

/**
 * <code>MassMergeDuplicates</code> merge all the duplicate contacts in the
 * namespace.
 * 
 * Task is initialized from {@link ContactMassDuplicateMergeServlet}, which is called by cron
 * with domain
 * 
 * @author nidhi
 * 
 */
@SuppressWarnings("serial")
public class ContactMassDuplicateMerge implements DeferredTask
{

    private String domain;

    public ContactMassDuplicateMerge(String domain)
    {
	this.domain = domain;
    }

    @Override
    public void run()
    {
	String oldNamespace = NamespaceManager.get();
	
	try
	{
		if (StringUtils.isNotEmpty(domain) && !domain.equals("all"))
		{
			mergeDuplicates(domain);
		}

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	    System.out.println("finally block");
	}

    }
    
    public static void mergeDuplicates(String namespace)
    {
    	 NamespaceManager.set(namespace);
    	 Map<String, Object> searchMap = new HashMap<String, Object>();
    	 	searchMap.put("type",Contact.Type.PERSON);	
		ContactFilterResultFetcher fetcher= new ContactFilterResultFetcher(searchMap,null,200,Integer.MAX_VALUE);
		do
		{
				List<Contact> contacts = fetcher.nextSet();
				System.out.println("Fetcher"+ fetcher.getTotalFetchedCount());
				for(Contact contact :contacts){
					Contact oldContact=null;
					
					if(isExists(contact))
					{
						List<ContactField> emails = contact.getContactPropertiesList(Contact.EMAIL);
						for (ContactField field : emails)
						{
						    oldContact = ContactUtil.searchMultipleContactByEmail(field.value,contact);
						    if (oldContact != null)
							break;
						}
						//Contact oldContact = ContactUtil.getDuplicateContact(contact);
						
						if(contact.updated_time!=0 || oldContact.updated_time!=0){
							if(contact.updated_time>=oldContact.updated_time)
							{
								ContactUtil.getContact(Long.valueOf(oldContact.id)).delete();
							}
							else
								ContactUtil.getContact(Long.valueOf(contact.id)).delete();
						}
						else{
							
		

						try
					    {
						List<Note> notes = NoteUtil.getNotes(Long.valueOf(contact.id));

						for (Note note : notes)
						{
						    note.addContactIds(oldContact.id.toString());
						    note.owner_id = String.valueOf(note.getDomainOwner().id);
						    note.save();
						}

						// update events

						List<Event> events = EventUtil.getContactEvents(Long.valueOf(contact.id));

						for (Event event : events)
						{
						    event.addContacts(oldContact.id.toString());
						    event.save();
						}

						// update task
						List<Task> tasks = TaskUtil.getContactTasks(Long.valueOf(contact.id));
						for (Task task : tasks)
						{
						    task.addContacts(oldContact.id.toString());
						    task.save();
						}

						// update deals
						List<Opportunity> opportunities = OpportunityUtil.getAllOpportunity(Long.valueOf(contact.id));
						for (Opportunity opportunity : opportunities)
						{
						    opportunity.addContactIds(oldContact.id.toString());
						    opportunity.save();
						}

						// merge document

						List<Document> documents = DocumentUtil.getContactDocuments(Long.valueOf(contact.id));
						for (Document document : documents)
						{
						    document.getContact_ids().add(oldContact.id.toString());
						    document.save();
						}

						// merge Case
						List<Case> cases = CaseUtil.getCases(Long.valueOf(contact.id));
						for (Case cas : cases)
						{
						    cas.addContactToCase(oldContact.id.toString());
						    cas.save();
						}
						
						/*// merge Campaigns
						List<CampaignStatus> campaigns=contact.campaignStatus;
						for (CampaignStatus campaign : campaigns)
						{
						    oldContact.campaignStatus.add(campaign);
						}
						
						try
						{
							Map<String, Object> map = new HashMap<String, Object>();
							map.put("contact_key", new Key<Contact>(Contact.class, contact.id));
							
							List<Tickets> tickets= Tickets.ticketsDao.listByProperty(map);
							for (Tickets ticket : tickets)
							{
								ticket.contact_ids.add(oldContact.id);
								//ticket.contactID
								ticket.save();
							}
						}
						catch (Exception e)
						{
							System.out.println(ExceptionUtils.getFullStackTrace(e));
							throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
									.build());
						}*/
						
						//emails
						List<ContactEmail> contactEmails = ContactEmailUtil.getContactEmails(contact.id);
						for (ContactEmail contactEmail : contactEmails)
						{
							contactEmail.contact_id=oldContact.id;
							contactEmail.save();
						}
						
						// delete duplicated record
						ContactUtil.getContact(Long.valueOf(contact.id)).delete();
						// save master reccord
						oldContact.save();

					    }
					    catch (Exception e)
					    {
						e.printStackTrace();
					    }
						}
					}
				}
			}while (fetcher.hasNextSet());
    }
    public static boolean isExists(Contact contact){
    	boolean isDuplicate=false;
    	List<ContactField> emails = contact.getContactPropertiesList(Contact.EMAIL);
    	for (ContactField email : emails)
		{
		if (StringUtils.isBlank(email.value.toLowerCase()))
		    continue;

		isDuplicate = ContactUtil.searchContactCountByEmail(email.value.toLowerCase()) > 1 ? true : false;
		if(isDuplicate)
			return isDuplicate;
		}
    	 return isDuplicate;
    }
    
}

