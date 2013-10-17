package com.agilecrm.core.api.bulkactions.backends;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.util.CSVUtil;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.workflows.status.CampaignStatus;
import com.agilecrm.workflows.status.CampaignStatus.Status;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.agilecrm.workflows.status.util.CampaignSubscribersUtil;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.campaignio.cron.util.CronUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreInputStream;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;

import edu.emory.mathcs.backport.java.util.Arrays;

@Path("/api/bulk-actions")
public class BulkOperationsAPI
{
    /**
     * Deletes selected contacts based on ids
     * 
     * @param model_ids
     *            array of contact ids as String
     * @throws JSONException
     */

    @Path("delete/contacts/{current_user}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteContacts(@FormParam("ids") String model_ids, @FormParam("filter") String filter,
	    @PathParam("current_user") Long current_user_id) throws JSONException
    {

	Integer count = 0;
	List<Contact> contacts_list = new ArrayList<Contact>();
	if (!StringUtils.isEmpty(filter))
	{
	    contacts_list = BulkActionUtil.getFilterContacts(filter, null, current_user_id);

	    String currentCursor = null;
	    String previousCursor = null;
	    do
	    {
		count += contacts_list.size();
		previousCursor = contacts_list.get(contacts_list.size() - 1).cursor;

		ContactUtil.deleteContactsbyListSupressNotification(contacts_list);

		if (!StringUtils.isEmpty(previousCursor))
		{
		    contacts_list = BulkActionUtil.getFilterContacts(filter, previousCursor, current_user_id);
		    currentCursor = contacts_list.size() > 0 ? contacts_list.get(contacts_list.size() - 1).cursor
			    : null;
		    continue;
		}

		break;
	    } while (contacts_list.size() > 0 && !StringUtils.equals(previousCursor, currentCursor));

	}
	else if (!StringUtils.isEmpty(model_ids))
	{
	    contacts_list = ContactUtil.getContactsBulk(new JSONArray(model_ids));

	    ContactUtil.deleteContactsbyListSupressNotification(contacts_list);
	    count += contacts_list.size();
	}

	BulkActionNotifications.publishconfirmation(BulkAction.BULK_ACTIONS.DELETE, String.valueOf(count), "companies");
    }

    /**
     * Change the owner of selected contacts
     * 
     * @param contact_ids
     *            array of contact ids as String
     * @param new_owner
     *            id of new owner (DomainUser id)
     * 
     * @throws JSONException
     */
    @Path("/change-owner/{new_owner}/{current_user}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void changeOwnerToContacts(@FormParam("contact_ids") String contact_ids,
	    @PathParam("new_owner") String new_owner, @FormParam("filter") String filter,
	    @PathParam("current_user") Long current_user) throws JSONException
    {

	Integer count = 0;
	List<Contact> contacts_list = new ArrayList<Contact>();
	if (!StringUtils.isEmpty(filter))
	{
	    contacts_list = BulkActionUtil.getFilterContacts(filter, null, current_user);

	    String currentCursor = null;
	    String previousCursor = null;
	    do
	    {
		count += contacts_list.size();
		previousCursor = contacts_list.get(contacts_list.size() - 1).cursor;

		ContactUtil.changeOwnerToContactsBulk(contacts_list, new_owner);

		if (!StringUtils.isEmpty(previousCursor))
		{
		    contacts_list = BulkActionUtil.getFilterContacts(filter, previousCursor, current_user);

		    currentCursor = contacts_list.size() > 0 ? contacts_list.get(contacts_list.size() - 1).cursor
			    : null;
		    continue;
		}

		break;
	    } while (contacts_list.size() > 0 && !StringUtils.equals(previousCursor, currentCursor));

	}
	else if (!StringUtils.isEmpty(contact_ids))
	{
	    contacts_list = ContactUtil.getContactsBulk(new JSONArray(contact_ids));

	    ContactUtil.changeOwnerToContactsBulk(contacts_list, new_owner);
	    count += contacts_list.size();
	}

	BulkActionNotifications.publishconfirmation(BulkAction.BULK_ACTIONS.OWNER_CHANGE, String.valueOf(count));
    }

    /**
     * Enrolls selected contacts to a campaign.
     * 
     * @param contact_ids
     *            array of contact ids as String.
     * @param workflowId
     *            campaign id that the contacts to be enrolled.
     * @throws JSONException
     */
    @Path("enroll-campaign/{workflow-id}/{current_user_id}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void subscribeContactsBulk(@FormParam("contact_ids") String contact_ids,
	    @PathParam("workflow-id") Long workflowId, @FormParam("filter") String filter,
	    @PathParam("current_user_id") Long current_user_id) throws JSONException
    {
	List<Contact> contact_list = null;
	int count = 0;
	if (!StringUtils.isEmpty(filter))
	{
	    contact_list = BulkActionUtil.getFilterContacts(filter, null, current_user_id);

	    String currentCursor = null;
	    String previousCursor = null;
	    do
	    {
		count += contact_list.size();
		previousCursor = contact_list.size() > 0 ? contact_list.get(contact_list.size() - 1).cursor : null;

		WorkflowSubscribeUtil.subscribeDeferred(contact_list, workflowId);

		if (!StringUtils.isEmpty(previousCursor))
		{
		    contact_list = BulkActionUtil.getFilterContacts(filter, previousCursor, current_user_id);
		    currentCursor = contact_list.size() > 0 ? contact_list.get(contact_list.size() - 1).cursor : null;
		    continue;
		}
		break;
	    } while (contact_list.size() > 0 && !StringUtils.equals(previousCursor, currentCursor));

	}

	else if (!StringUtils.isEmpty(contact_ids))
	{
	    contact_list = ContactUtil.getContactsBulk(new JSONArray(contact_ids));

	    WorkflowSubscribeUtil.subscribeDeferred(contact_list, workflowId);
	    count += contact_list.size();
	}
	BulkActionNotifications.publishconfirmation(BulkAction.BULK_ACTIONS.ENROLL_CAMPAIGN, String.valueOf(count));
    }

    /**
     * Add tags to selected contacts
     * 
     * @param contact_ids
     *            array of contact ids as String
     * @param tagsString
     *            array of tags as string
     * @throws JSONException
     */
    @SuppressWarnings("unchecked")
    @Path("contact/tags/{current_user}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void addTagsToContacts(@FormParam("contact_ids") String contact_ids, @FormParam("data") String tagsString,
	    @FormParam("filter") String filter, @PathParam("current_user") Long current_user) throws JSONException
    {
	System.out.println(filter);
	System.out.println("current user : " + current_user);
	System.out.println("domain : " + NamespaceManager.get());
	System.out.println(contact_ids);
	System.out.println(tagsString);

	if (StringUtils.isEmpty(tagsString))
	    return;

	JSONArray tagsJSONArray = new JSONArray(tagsString);

	String[] tagsArray = null;
	try
	{
	    tagsArray = new ObjectMapper().readValue(tagsJSONArray.toString(), String[].class);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	if (tagsArray == null)
	    return;

	List<Contact> contacts = null;
	int count = 0;

	if (!StringUtils.isEmpty(filter))
	{
	    contacts = BulkActionUtil.getFilterContacts(filter, null, current_user);

	    String currentCursor = null;
	    String previousCursor = null;
	    do
	    {
		count += contacts.size();
		previousCursor = contacts.get(contacts.size() - 1).cursor;

		ContactUtil.addTagsToContactsBulk(contacts, tagsArray);

		if (!StringUtils.isEmpty(previousCursor))
		{
		    contacts = BulkActionUtil.getFilterContacts(filter, previousCursor, current_user);
		    currentCursor = contacts.size() > 0 ? contacts.get(contacts.size() - 1).cursor : null;
		    continue;
		}
		break;
	    } while (contacts.size() > 0 && !StringUtils.equals(previousCursor, currentCursor));

	}

	else if (!StringUtils.isEmpty(contact_ids))
	{
	    contacts = ContactUtil.getContactsBulk(new JSONArray(contact_ids));

	    ContactUtil.addTagsToContactsBulk(contacts, tagsArray);
	    count += contacts.size();
	}

	BulkActionNotifications.publishconfirmation(BulkAction.BULK_ACTIONS.ADD_TAGS, Arrays.asList(tagsArray)
		.toString(), String.valueOf(count));
    }

    /**
     * It runs in backends. Fetches blob data based on the blob key sent and
     * call CSV utility function is called to create contacts, based on the
     * contact prototype sent.
     * 
     * @param contact
     * @param ownerId
     * @param key
     */
    @Path("/upload/{owner_id}/{key}")
    @POST
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void contactsBulkSave(Contact contact, @PathParam("owner_id") String ownerId, @PathParam("key") String key)
    {
	System.out.println("backend running");

	System.out.println(key);

	// Creates a blobkey object from blobkey string
	BlobKey blobKey = new BlobKey(key);

	// Reads the stream from blobstore
	InputStream blobStream;
	try
	{
	    blobStream = new BlobstoreInputStream(blobKey);
	    // Converts stream data into valid string data

	    // Calls utility method to save contacts in csv with owner id,
	    // according to contact prototype sent
	    CSVUtil.createContactsFromCSV(blobStream, contact, ownerId);
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	finally
	{
	    CacheUtil.deleteCache(key);

	    // Delete blob data after contacts are created
	    BlobstoreServiceFactory.getBlobstoreService().delete(blobKey);
	}
    }

    /**
     * Removes all or selected active subscribers of campaign from Cron if
     * exists and updates the campaign-status of each active subscriber.
     * 
     * @param contactIds
     *            - List of selected contact ids
     * @param campaign_id
     *            - Campaign-id
     * @param allActiveSubscribers
     *            - shows all active subscribers are selected.
     * @throws JSONException
     */
    @Path("/remove-active-subscribers/{campaign_id}/{current_user_id}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void removeActiveSubscribersOfCampaign(@FormParam("ids") String contactIds,
	    @PathParam("campaign_id") String campaign_id, @FormParam("filter") String allActiveSubscribers)
	    throws JSONException
    {

	// to show in notification
	int contactSize = 0;

	// if all active subscribers are selected
	if (!StringUtils.isEmpty(allActiveSubscribers) && allActiveSubscribers.equals("all-active-subscribers"))
	{
	    List<Contact> activeContacts = CampaignSubscribersUtil.getAllCampaignSubscribers(campaign_id + "-"
		    + CampaignStatus.Status.ACTIVE);

	    contactSize = activeContacts.size();

	    for (Contact contact : activeContacts)
	    {
		// Remove from Cron.
		CronUtil.removeTask(campaign_id, contact.id.toString());

		// Updates CampaignStatus to REMOVE
		CampaignStatusUtil.setStatusOfCampaign(contact.id.toString(), campaign_id, Status.REMOVED);
	    }

	    BulkActionNotifications.publishconfirmation(BulkAction.REMOVE_ACTIVE_SUBSCRIBERS,
		    String.valueOf(contactSize));
	    return;
	}

	// Removes and updates for selected active subscribers
	JSONArray activeContactsJSONArray = new JSONArray(contactIds);
	contactSize = activeContactsJSONArray.length();

	for (int i = 0; i < contactSize; i++)
	{
	    // Remove from Cron
	    CronUtil.removeTask(campaign_id, activeContactsJSONArray.getString(i));

	    // Set REMOVED campaignStatus
	    CampaignStatusUtil.setStatusOfCampaign(activeContactsJSONArray.getString(i), campaign_id, Status.REMOVED);
	}

	BulkActionNotifications.publishconfirmation(BulkAction.REMOVE_ACTIVE_SUBSCRIBERS, String.valueOf(contactSize));
    }
}
