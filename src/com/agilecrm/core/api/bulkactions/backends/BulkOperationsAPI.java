package com.agilecrm.core.api.bulkactions.backends;

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

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.google.appengine.api.NamespaceManager;

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
    public void deleteContacts(@FormParam("ids") String model_ids,
	    @FormParam("filter") String filter,
	    @PathParam("current_user") Long current_user_id)
	    throws JSONException
    {
	if (!StringUtils.isEmpty(filter))
	    ContactUtil.deleteContactsbyList(BulkActionUtil.getFilterContacts(
		    filter, current_user_id));

	else if (!StringUtils.isEmpty(model_ids))
	    ContactUtil.deleteContactsbyList(ContactUtil
		    .getContactsBulk(new JSONArray(model_ids)));
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
    public void changeOwnerToContacts(
	    @FormParam("contact_ids") String contact_ids,
	    @PathParam("new_owner") String new_owner,
	    @FormParam("filter") String filter,
	    @PathParam("current_user") Long current_user) throws JSONException
    {
	List<Contact> contact_list = null;

	if (!StringUtils.isEmpty(filter))
	{
	    contact_list = BulkActionUtil.getFilterContacts(filter,
		    current_user);
	}
	else if (!StringUtils.isEmpty(contact_ids))
	    contact_list = ContactUtil.getContactsBulk(new JSONArray(
		    contact_ids));

	Contact.changeOwnerToContactsBulk(contact_list, new_owner);
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
    public void subscribeContactsBulk(
	    @FormParam("contact_ids") String contact_ids,
	    @PathParam("workflow-id") Long workflowId,
	    @FormParam("filter") String filter,
	    @PathParam("current_user_id") Long current_user_id)
	    throws JSONException
    {
	List<Contact> contact_list = null;

	if (!StringUtils.isEmpty(filter))
	    contact_list = BulkActionUtil.getFilterContacts(filter,
		    current_user_id);
	else if (!StringUtils.isEmpty(contact_ids))
	    contact_list = ContactUtil.getContactsBulk(new JSONArray(
		    contact_ids));

	WorkflowUtil.subscribeDeferred(contact_list, workflowId);
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
    public void addTagsToContacts(@FormParam("contact_ids") String contact_ids,
	    @FormParam("data") String tagsString,
	    @FormParam("filter") String filter,
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
	    tagsArray = new ObjectMapper().readValue(tagsJSONArray.toString(),
		    String[].class);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	if (tagsArray == null)
	    return;

	if (!StringUtils.isEmpty(filter))
	{
	    ContactUtil.addTagsToContactsBulk(
		    BulkActionUtil.getFilterContacts(filter, current_user),
		    tagsArray);
	}
	else if (!StringUtils.isEmpty(contact_ids))
	    ContactUtil.addTagsToContactsBulk(
		    ContactUtil.getContactsBulk(new JSONArray(contact_ids)),
		    tagsArray);

	JSONObject object = new JSONObject();
    }
}
