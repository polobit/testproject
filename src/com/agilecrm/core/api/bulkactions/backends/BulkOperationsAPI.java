package com.agilecrm.core.api.bulkactions.backends;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
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
import org.json.JSONObject;

import com.agilecrm.account.util.AccountEmailStatsUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.util.ContactBulkEmailUtil;
import com.agilecrm.contact.export.util.ContactExportBlobUtil;
import com.agilecrm.contact.export.util.ContactExportEmailUtil;
import com.agilecrm.contact.sync.SyncFrequency;
import com.agilecrm.contact.filter.ContactFilterResultFetcher;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.util.CSVUtil;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.workflows.status.CampaignStatus;
import com.agilecrm.workflows.status.CampaignStatus.Status;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.agilecrm.workflows.status.util.CampaignSubscribersUtil;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.util.LogUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreInputStream;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.thirdparty.Mailgun;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactPrefs.SYNC_TYPE;
import com.thirdparty.google.contacts.ContactSyncUtil;
import com.thirdparty.google.utl.ContactPrefsUtil;

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
	ContactFilterResultFetcher fetcher = new ContactFilterResultFetcher(filter, 200, model_ids, current_user_id);

	while (fetcher.hasNextSet())
	{
	    ContactUtil.deleteContacts(fetcher.nextSet());
	}

	System.out.println("contacts : " + fetcher.getAvailableContacts());
	System.out.println("companies : " + fetcher.getAvailableCompanies());

	String message = "";
	if (fetcher.getAvailableContacts() > 0)
	    message = fetcher.getAvailableContacts() + " Contacts deleted";
	else if (fetcher.getAvailableCompanies() > 0)
	    message = fetcher.getAvailableCompanies() + " Companies deleted";

	BulkActionNotifications.publishNotification(message);
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

	ContactFilterResultFetcher fetcher = new ContactFilterResultFetcher(filter, 200, contact_ids, current_user);

	while (fetcher.hasNextSet())
	{
	    ContactUtil.changeOwnerToContactsBulk(fetcher.nextSet(), new_owner);
	}

	String message = "Owner changed for ";
	if (fetcher.getAvailableContacts() > 0)
	    message = message + fetcher.getAvailableContacts() + " Contacts";
	else if (fetcher.getAvailableCompanies() > 0)
	    message = message + fetcher.getAvailableCompanies() + " Companies";

	BulkActionNotifications.publishNotification(message);

	// BulkActionNotifications.publishconfirmation(BulkAction.BULK_ACTIONS.OWNER_CHANGE,
	// String.valueOf(0));
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
	ContactFilterResultFetcher fetcher = new ContactFilterResultFetcher(filter, 200, contact_ids, current_user_id);

	while (fetcher.hasNextSet())
	{
	    // ContactUtil.deleteContactsbyListSupressNotification(fetcher.nextSet());
	    WorkflowSubscribeUtil.subscribeDeferred(fetcher.nextSet(), workflowId);
	}

	System.out.println("contacts : " + fetcher.getAvailableContacts());
	System.out.println("companies : " + fetcher.getAvailableCompanies());

	System.out.println("Total contacts subscribed to campaign " + workflowId + " is "
	        + String.valueOf(fetcher.getAvailableContacts()));

	BulkActionNotifications.publishconfirmation(BulkAction.BULK_ACTIONS.ENROLL_CAMPAIGN,
	        String.valueOf(fetcher.getAvailableContacts()));

	try
	{
	    Mailgun.sendMail("campaigns@agile.com", "Campaign Observer", "naresh@agilecrm.com", null, null,
		    "Campaign Initiated in " + NamespaceManager.get(), null,
		    "Hi Naresh,<br><br> Campaign Initiated:<br><br> User id: " + current_user_id
		            + "<br><br>Campaign-id: " + workflowId + "<br><br>Filter-id: " + filter + "<br><br>Count: "
		            + fetcher.getAvailableContacts(), null);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while sending campaign initiated mail " + e.getMessage());
	}
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

	ContactFilterResultFetcher fetcher = new ContactFilterResultFetcher(filter, 200, contact_ids, current_user);

	while (fetcher.hasNextSet())
	{
	    // ContactUtil.deleteContactsbyListSupressNotification(fetcher.nextSet());
	    ContactUtil.addTagsToContactsBulk(fetcher.nextSet(), tagsArray);
	}

	BulkActionNotifications.publishconfirmation(BulkAction.BULK_ACTIONS.ADD_TAGS, Arrays.asList(tagsArray)
	        .toString(), String.valueOf(fetcher.getAvailableContacts()));
    }

    @SuppressWarnings("unchecked")
    @Path("contact/remove-tags/{current_user}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void removeTagsFromContacts(@FormParam("contact_ids") String contact_ids,
	    @FormParam("data") String tagsString, @FormParam("filter") String filter,
	    @PathParam("current_user") Long current_user) throws JSONException
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

	ContactFilterResultFetcher fetcher = new ContactFilterResultFetcher(filter, 200, contact_ids, current_user);

	while (fetcher.hasNextSet())
	{
	    // ContactUtil.deleteContactsbyListSupressNotification(fetcher.nextSet());
	    ContactUtil.removeTagsToContactsBulk(fetcher.nextSet(), tagsArray);
	}

	BulkActionNotifications.publishconfirmation(BulkAction.BULK_ACTIONS.REMOVE_TAGS, Arrays.asList(tagsArray)
	        .toString(), String.valueOf(fetcher.getAvailableContacts()));
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
	    BillingRestriction restrictions = BillingRestrictionUtil.getBillingRestriction(true);
	    new CSVUtil(restrictions).createContactsFromCSV(blobStream, contact, ownerId);
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

    /**
     * Sends email to bulk contacts based on filter id
     * 
     * @param currentUserId
     *            - Current user id.
     * @param contact_ids
     *            - list of Contact ids.
     * @param filter
     *            - filter id
     * @param data
     *            - data request parameter
     * @throws JSONException
     */
    @Path("/contacts/send-email/{current_user_id}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void sendEmail(@PathParam("current_user_id") Long currentUserId,
	    @FormParam("contact_ids") String contact_ids, @FormParam("filter") String filter,
	    @FormParam("data") String data) throws JSONException
    {

	int count = 0;

	JSONObject emailData = new JSONObject(data);

	List<Contact> contacts_list = new ArrayList<Contact>();

	ContactFilterResultFetcher fetcher = new ContactFilterResultFetcher(filter, 200, contact_ids, currentUserId);

	count = fetcher.getAvailableContacts() > 0 ? fetcher.getAvailableContacts() : fetcher.getAvailableCompanies();
	while (fetcher.hasNextSet())
	{
	    int noEmailsCount = ContactBulkEmailUtil.sendBulkContactEmails(emailData, fetcher.nextSet());

	    count -= noEmailsCount;
	}

	System.out.println("contacts : " + fetcher.getAvailableContacts());
	System.out.println("companies : " + fetcher.getAvailableCompanies());

	String message = "";
	if (fetcher.getAvailableContacts() > 0)
	    message = fetcher.getAvailableContacts() + " Contacts deleted";
	else if (fetcher.getAvailableCompanies() > 0)
	    message = fetcher.getAvailableCompanies() + " Companies deleted";

	if (fetcher.getAvailableContacts() > 0)
	    BulkActionNotifications.publishNotification("Email successfully sent to " + count + " Contacts");
	else if (fetcher.getAvailableCompanies() > 0)
	    BulkActionNotifications.publishNotification("Email successfully sent to " + count + " companies");
	else
	    BulkActionNotifications.publishNotification("Email successfully sent to 0 contacts/companies");

	// Record email sent stats
	AccountEmailStatsUtil.recordAccountEmailStats(NamespaceManager.get(), count);
    }

    /**
     * Sends email with contacts csv as an attachment
     * 
     * @param currentUserId
     *            - Current user id.
     * @param contact_ids
     *            - list of Contact ids.
     * @param filter
     *            - filter id
     * @param data
     *            - data request parameter
     * @throws JSONException
     */
    @Path("/contacts/export-contacts-csv/{current_user_id}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void exportContactsCSV(@PathParam("current_user_id") Long currentUserId,
	    @FormParam("contact_ids") String contact_ids, @FormParam("filter") String filter,
	    @FormParam("data") String data) throws JSONException
    {
	int count = 0;

	if (StringUtils.isBlank(data))
	{
	    System.out.println("Not proceeding further as data is null.");
	    return;
	}

	System.out.println("Email obtained is " + data);
	System.out.println("Namespace is in exportContactsCSV " + NamespaceManager.get());

	List<Contact> contacts_list = new ArrayList<Contact>();
	String path = null;

	// If filter is not empty, 500 contacts are fetched on every
	// iteration
	if (!StringUtils.isEmpty(filter))
	{
	    contacts_list = BulkActionUtil.getFilterContacts(filter, null, currentUserId);

	    String currentCursor = null;
	    String previousCursor = null;
	    int firstTime = 0;

	    do
	    {
		count += contacts_list.size();

		// Create new file for first time, then append content to the
		// existing file.
		++firstTime;
		if (firstTime == 1)
		    path = ContactExportBlobUtil.writeContactCSVToBlobstore(contacts_list, false);
		else
		    ContactExportBlobUtil.editExistingBlobFile(path, contacts_list, false);

		previousCursor = contacts_list.get(contacts_list.size() - 1).cursor;

		if (!StringUtils.isEmpty(previousCursor))
		{
		    contacts_list = BulkActionUtil.getFilterContacts(filter, previousCursor, currentUserId);

		    currentCursor = contacts_list.size() > 0 ? contacts_list.get(contacts_list.size() - 1).cursor
			    : null;
		    continue;
		}

		break;
	    } while (contacts_list.size() > 0 && !StringUtils.equals(previousCursor, currentCursor));

	    // Close channel after contacts completed
	    ContactExportBlobUtil.editExistingBlobFile(path, null, true);
	}
	else if (!StringUtils.isEmpty(contact_ids))
	{
	    contacts_list = ContactUtil.getContactsBulk(new JSONArray(contact_ids));

	    count += contacts_list.size();

	    // Create new file and write to blob and close the channel. All
	    // contacts are fetched at a time, so no need of editing existing
	    // file.
	    path = ContactExportBlobUtil.writeContactCSVToBlobstore(contacts_list, true);
	}

	// Retrieves partitions of data of a file having given path
	List<String> fileData = ContactExportBlobUtil.retrieveBlobFileData(path);

	// Send every partition as separate email
	for (String partition : fileData)
	    ContactExportEmailUtil.exportContactCSVAsEmail(data, partition, String.valueOf(count));

	// Deletes blob
	ContactExportBlobUtil.deleteBlobFile(path);

	BulkActionNotifications.publishconfirmation(BulkAction.EXPORT_CONTACTS_CSV);
    }

    /**
     * Fetches Contact prefs based on duration in path and initializes sync
     * 
     * @param duration
     */
    @Path("/contact-sync/google/{duration}")
    @POST
    public void syncGoogleContacts(@PathParam("duration") String duration)
    {
	System.out.println("BACKENDS START");

	if (StringUtils.isEmpty(duration))
	    return;

	SyncFrequency interval = SyncFrequency.valueOf(duration);

	// Fetches all Prefs and start sync
	List<ContactPrefs> prefs = ContactPrefsUtil.getprefs(interval);

	System.out.println(prefs);
	for (ContactPrefs pref : prefs)
	{
	    try
	    {
		BulkActionUtil.setSessionManager(pref.getDomainUser().getId());
		ContactSyncUtil.syncContacts(pref);
	    }
	    catch (Exception e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}

    }

    /**
     * Fetches {@link ContactPrefs} based on prefs id and initializes contact
     * sync
     * 
     * @param pref_id
     */

    @Path("/contact-sync/google/duration/{prefs_id}")
    @POST
    public void syncGoogleContactsBasedOnPrefs(@PathParam("prefs_id") String pref_id)
    {
	if (pref_id == null)
	    return;

	// Fetches contact prefs object and initilizes sync
	ContactPrefs contactPrefs = ContactPrefsUtil.get(Long.parseLong(pref_id));
	System.out.println(contactPrefs);

	if (contactPrefs == null)
	    return;

	try
	{
	    BulkActionUtil.setSessionManager(contactPrefs.getDomainUser().getId());
	    System.out.println("Namespacemanager : " + NamespaceManager.get());
	    ContactSyncUtil.syncContacts(contactPrefs);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    /**
     * Removes workflow related entities like logs, crons, contact's
     * campaign-status. Inorder to avoid Deadline exception when workflow is
     * deleted, it's related entities are deleted using backend.
     * 
     * @param campaignId
     *            - deleted campaign id.
     */
    @Path("/remove-workflow-related/{campaign_id}")
    @POST
    public void removeWorkflowRelatedEntities(@PathParam("campaign_id") String campaignId)
    {
	System.out.println("Removing workflow related entities through backend...");

	System.out.println("Campaign id is " + campaignId);

	System.out.println("Namespace in backend is " + NamespaceManager.get());

	if (StringUtils.isBlank(campaignId))
	{
	    System.out.println("Campaign id is null or empty...");
	    return;
	}

	try
	{
	    // Deletes CampaignStatus from contact
	    CampaignSubscribersUtil.removeCampaignStatus(campaignId);

	    // Deletes Related Crons.
	    CronUtil.removeTask(campaignId, null);

	    // Deletes logs of workflow
	    LogUtil.deleteSQLLogs(campaignId, null);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while deleting workflow related entities" + e.getMessage());
	}
    }
}
