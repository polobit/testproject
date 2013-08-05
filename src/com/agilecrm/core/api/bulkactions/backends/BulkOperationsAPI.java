package com.agilecrm.core.api.bulkactions.backends;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
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
		if (!StringUtils.isEmpty(filter))
		{
			List<Contact> contacts = BulkActionUtil.getFilterContacts(filter, current_user_id);

			ContactUtil.deleteContactsbyList(contacts);
			count = contacts.size();
		}

		else if (!StringUtils.isEmpty(model_ids))
		{
			List<Contact> contacts = ContactUtil.getContactsBulk(new JSONArray(model_ids));

			ContactUtil.deleteContactsbyList(contacts);
			count = contacts.size();
		}

		BulkActionNotifications.publishconfirmation(BulkAction.BULK_ACTIONS.DELETE, String.valueOf(count));
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
		List<Contact> contact_list = null;

		if (!StringUtils.isEmpty(filter))
		{
			contact_list = BulkActionUtil.getFilterContacts(filter, current_user);
		}
		else if (!StringUtils.isEmpty(contact_ids))
			contact_list = ContactUtil.getContactsBulk(new JSONArray(contact_ids));

		Contact.changeOwnerToContactsBulk(contact_list, new_owner);

		BulkActionNotifications.publishconfirmation(BulkAction.BULK_ACTIONS.OWNER_CHANGE,
				String.valueOf(contact_list.size()));
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

		if (!StringUtils.isEmpty(filter))
			contact_list = BulkActionUtil.getFilterContacts(filter, current_user_id);
		else if (!StringUtils.isEmpty(contact_ids))
			contact_list = ContactUtil.getContactsBulk(new JSONArray(contact_ids));

		WorkflowUtil.subscribeDeferred(contact_list, workflowId);

		BulkActionNotifications.publishconfirmation(BulkAction.BULK_ACTIONS.ENROLL_CAMPAIGN,
				String.valueOf(contact_list.size()));
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

		int count = 0;
		if (!StringUtils.isEmpty(filter))
		{
			List<Contact> contacts = BulkActionUtil.getFilterContacts(filter, current_user);
			ContactUtil.addTagsToContactsBulk(contacts, tagsArray);

			count = contacts.size();
		}
		else if (!StringUtils.isEmpty(contact_ids))
		{
			List<Contact> contacts = ContactUtil.getContactsBulk(new JSONArray(contact_ids));

			ContactUtil.addTagsToContactsBulk(contacts, tagsArray);
			count = contacts.size();
		}
		BulkActionNotifications.publishconfirmation(BulkAction.BULK_ACTIONS.ADD_TAGS, Arrays.asList(tagsArray)
				.toString(), String.valueOf(count));
	}

	@Path("/upload/{owner_id}/{key}")
	@POST
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void contactsBulkSave(Contact contact, @PathParam("owner_id") String ownerId, @PathParam("key") String key)
	{
		// Contact contact = null;
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
			String csv = IOUtils.toString(blobStream);

			System.out.println(contact);

			// Calls utility method to save contacts in csv with owner id,
			// according to contact prototype sent
			ContactUtil.createContactsFromCSV(csv, contact, ownerId);
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
}
