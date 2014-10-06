package com.agilecrm.core.api.bulkactions.backends;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URLDecoder;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilterResultFetcher;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.BulkActionUtil.ActionType;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.google.appengine.api.taskqueue.TaskOptions.Method;

@Path("/api/bulk")
public class BulkActionsAPI
{
    /**
     * Accepts all the bulk actions requests from client and sends it to
     * backends with appropriate data.
     * 
     * <p>
     * It checks whether there is filter available, which indicates that action
     * should be performed on all contacts which satisfies that filter criteria.
     * <p>
     * <p>
     * If filter exists then data is sent as param else request data is
     * converted in to byte data and sent
     * <p>
     * 
     * @param request
     * @param filterId
     * @param action_type
     */
    @POST
    @Path("/update")
    @Produces(MediaType.APPLICATION_FORM_URLENCODED)
    public void PerformChangeAction(@Context HttpServletRequest request, @QueryParam("filter") String filterId,
	    @QueryParam("action_type") String action_type)
    {

	InputStream stream = null;
	byte[] bytes = null;

	// createActivity(request, action_type);

	/**
	 * Reads request body in to bytes if filter is null i.e., action is to
	 * be performed on the contacts with the ids sent in the reqeust
	 */
	if (filterId == null)
	{
	    try
	    {
		stream = request.getInputStream();
		bytes = IOUtils.toByteArray(stream);
	    }
	    catch (IOException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}

	/*
	 * Get the content type, as same content type will be set while sending
	 * request to backend
	 */

	String contentType = request.getHeader("Content-Type");

	/*
	 * Checks the type of action(change owner/delete/tags/campaign), and
	 * sends request accordingly. This verification is required for change
	 * owner and campaign as we need to set owner id/workflow id
	 * respectively in their urls
	 */
	if (ActionType.CHANGE_OWNER.equals(ActionType.valueOf(action_type)))
	{
	    /*
	     * If filter is not null the filter id is sent, which is set as
	     * param value
	     */
	    if (filterId != null)
	    {
		System.out.println("filter id is not null");
		BulkActionUtil.changeOwner(filterId, request.getParameterMap(), ActionType.CHANGE_OWNER.getUrl(),
		        contentType, Method.POST);
		createActivityWithFilter(request, action_type);
		return;
	    }

	    /*
	     * Else data will be sent as payload which takes byte data
	     */
	    BulkActionUtil.changeOwner(bytes, request.getParameterMap(), ActionType.CHANGE_OWNER.getUrl(), contentType,
		    Method.POST);
	    try
	    {
		createActivity(bytes, action_type, request);
	    }
	    catch (JSONException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	    return;
	}
	if (ActionType.ASIGN_WORKFLOW.equals(ActionType.valueOf(action_type)))
	{

	    if (filterId != null)
	    {
		BulkActionUtil.enrollCampaign(filterId, request.getParameterMap(), ActionType.ASIGN_WORKFLOW.getUrl(),
		        contentType, Method.POST);
		createActivityWithFilter(request, action_type);
		return;
	    }

	    BulkActionUtil.enrollCampaign(bytes, request.getParameterMap(), ActionType.ASIGN_WORKFLOW.getUrl(),
		    contentType, Method.POST);
	    try
	    {
		createActivity(bytes, action_type, request);
	    }
	    catch (JSONException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	    return;
	}

	if (ActionType.REMOVE_ACTIVE_SUBSCRIBERS.equals(ActionType.valueOf(action_type)))
	{
	    System.out.println("Filter id in Remove Active Subscribers is " + filterId);
	    if (filterId != null && filterId.equals("all-active-subscribers"))
	    {
		BulkActionUtil.removeActiveSubscribers(filterId, request.getParameterMap(),
		        ActionType.REMOVE_ACTIVE_SUBSCRIBERS.getUrl(), contentType, Method.POST);
		createActivityWithFilter(request, action_type);
		return;
	    }

	    BulkActionUtil.removeActiveSubscribers(bytes, request.getParameterMap(),
		    ActionType.REMOVE_ACTIVE_SUBSCRIBERS.getUrl(), contentType, Method.POST);
	    try
	    {
		createActivity(bytes, action_type, request);
	    }
	    catch (JSONException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	    return;
	}

	System.out.println("action type : " + ActionType.valueOf(action_type));
	/*
	 * If filter is null and request is not of type change owner or enroll
	 * campaign.
	 */
	if (filterId != null)
	{
	    System.out.println("filter id : " + filterId);
	    BulkActionUtil.postDataToBulkActionBackend(ActionType.valueOf(action_type).getUrl(), contentType,
		    Method.POST, filterId, request.getParameter("data"));
	    createActivityWithFilter(request, action_type);
	    return;
	}

	System.out.println(bytes.length);

	BulkActionUtil.postDataToBulkActionBackend(bytes, ActionType.valueOf(action_type).getUrl(), contentType,
	        Method.POST);
	try
	{
	    createActivity(bytes, action_type, request);
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    /**
     * creates activity log when filter is removed
     * 
     * @param data
     * @param action_type
     * @param request
     * @throws JSONException
     */
    public void createActivity(byte[] data, String action_type, HttpServletRequest request) throws JSONException
    {
	ByteArrayInputStream byte_stream = new ByteArrayInputStream(data);
	BufferedReader reader = new BufferedReader(new InputStreamReader(byte_stream));

	String bulkactionids = "";
	String line = "";

	String[] encodeddata;
	String[] encodedcontacts;
	String decoded_data;
	String decoded_contact_ids;

	// Read the event object from request
	try
	{
	    while ((line = reader.readLine()) != null)
	    {
		bulkactionids += (line);
	    }
	    System.out.println("data after converting from stream " + bulkactionids);

	    if (bulkactionids != null && bulkactionids != "")
	    {

		if (("ADD_TAG").equals(action_type) || ("REMOVE_TAG").equals(action_type))
		{
		    String[] splited_data = bulkactionids.split("&");
		    encodeddata = splited_data[0].split("=");
		    encodedcontacts = splited_data[1].split("=");
		    decoded_data = URLDecoder.decode(encodeddata[1]);
		    decoded_contact_ids = URLDecoder.decode(encodedcontacts[1]);
		    if (decoded_contact_ids != null)
		    {
			JSONArray contact_ids = new JSONArray(decoded_contact_ids);
			ActivitySave.createBulkActionActivity(contact_ids.length(), action_type, decoded_data);

		    }
		}

		else if (("SEND_EMAIL").equals(action_type))
		{
		    String[] splited_data = bulkactionids.split("&");
		    encodedcontacts = splited_data[0].split("=");
		    encodeddata = splited_data[1].split("=");
		    decoded_data = URLDecoder.decode(encodeddata[1]);
		    decoded_contact_ids = URLDecoder.decode(encodedcontacts[1]);
		    if (decoded_contact_ids != null)
		    {
			JSONArray contact_ids = new JSONArray(decoded_contact_ids);
			Contact contact = ContactUtil.getContact(contact_ids.getLong(0));
			if (!("COMPANY").equals(contact.type.toString()))
			ActivitySave.createBulkActionActivity(contact_ids.length(), action_type, decoded_data);

		    }
		}
		else if (("ASIGN_WORKFLOW").equals(action_type))
		{
		    String[] splited_data = bulkactionids.split("=");
		    decoded_contact_ids = URLDecoder.decode(splited_data[1]);
		    Map<String, Object> requestParameter = request.getParameterMap();
		    String workflowId = ((String[]) requestParameter.get("workflow_id"))[0];

		    Workflow workflow = WorkflowUtil.getWorkflow(Long.parseLong(workflowId));
		    String workflowname = workflow.name;

		    if (decoded_contact_ids != null)
		    {
			JSONArray contact_ids = new JSONArray(decoded_contact_ids);
			ActivitySave.createBulkActionActivity(contact_ids.length(), action_type, workflowname);

		    }

		}
		else if (("CHANGE_OWNER").equals(action_type))
		{
		    String[] splited_data = bulkactionids.split("=");
		    decoded_contact_ids = URLDecoder.decode(splited_data[1]);
		    Map<String, Object> parameter = request.getParameterMap();
		    String ownerId = ((String[]) parameter.get("owner"))[0];
		    DomainUser domainuser = DomainUserUtil.getDomainUser(Long.parseLong(ownerId));
		    if (decoded_contact_ids != null)
		    {
			JSONArray contact_ids = new JSONArray(decoded_contact_ids);
			Contact contact = ContactUtil.getContact(contact_ids.getLong(0));
			if (!("COMPANY").equals(contact.type.toString()))
			ActivitySave.createBulkActionActivity(contact_ids.length(), action_type, domainuser.name);

		    }
		}
		else if (("DELETE").equals(action_type))
		{
		    String[] splited_data = bulkactionids.split("=");
		    decoded_contact_ids = URLDecoder.decode(splited_data[1]);
		    if (decoded_contact_ids != null)
		    {
			JSONArray contact_ids = new JSONArray(decoded_contact_ids);
			Contact contact = ContactUtil.getContact(contact_ids.getLong(0));
			if (!("COMPANY").equals(contact.type.toString()))
			ActivitySave.createBulkActionActivity(contact_ids.length(), action_type, "");

		    }
		}

	    }

	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    /**
     * creates activity log when filter is applied
     * 
     * @param request
     * @param action_type
     */
    public void createActivityWithFilter(HttpServletRequest request, String action_type)
    {

	String filterid = request.getParameter("filter");
	System.out.println(filterid + "filter id bulk actions api");

	Long currentDomainUserId = SessionManager.get().getDomainId();

	System.out.println("current domain user id " + currentDomainUserId);

	int contactssize = new ContactFilterResultFetcher(filterid, 0, "", currentDomainUserId).getAvailableContacts();
	System.out.println("contactssize " + contactssize);

	try
	{

	    if (("ADD_TAG").equals(action_type) || ("REMOVE_TAG").equals(action_type))
	    {
		String data = request.getParameter("data");
		if (contactssize > 0)
		{
		    ActivitySave.createBulkActionActivity(contactssize, action_type, data);

		}

	    }
	    else if (("ASIGN_WORKFLOW").equals(action_type))
	    {

		Map<String, Object> requestParameter = request.getParameterMap();
		String workflowId = ((String[]) requestParameter.get("workflow_id"))[0];

		Workflow workflow = WorkflowUtil.getWorkflow(Long.parseLong(workflowId));
		String workflowname = workflow.name;
		if (contactssize > 0)
		{
		    ActivitySave.createBulkActionActivity(contactssize, action_type, workflowname);

		}

	    }
	    else if (("CHANGE_OWNER").equals(action_type))
	    {

		Map<String, Object> parameter = request.getParameterMap();
		String ownerId = ((String[]) parameter.get("owner"))[0];
		DomainUser domainuser = DomainUserUtil.getDomainUser(Long.parseLong(ownerId));
		if (contactssize > 0)
		{
		    ActivitySave.createBulkActionActivity(contactssize, action_type, domainuser.name);

		}
	    }

	    else if (("DELETE").equals(action_type) || ("SEND_EMAIL").equals(action_type))
	    {

		if (contactssize > 0)
		{
		    ActivitySave.createBulkActionActivity(contactssize, action_type, "");

		}
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }
}
