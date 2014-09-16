package com.agilecrm.core.api.bulkactions.backends;

import java.io.IOException;
import java.io.InputStream;

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
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.BulkActionUtil.ActionType;
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

	createActivity(request, action_type);

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
		return;
	    }

	    /*
	     * Else data will be sent as payload which takes byte data
	     */
	    BulkActionUtil.changeOwner(bytes, request.getParameterMap(), ActionType.CHANGE_OWNER.getUrl(), contentType,
		    Method.POST);
	    return;
	}
	if (ActionType.ASIGN_WORKFLOW.equals(ActionType.valueOf(action_type)))
	{

	    if (filterId != null)
	    {
		BulkActionUtil.enrollCampaign(filterId, request.getParameterMap(), ActionType.ASIGN_WORKFLOW.getUrl(),
		        contentType, Method.POST);
		return;
	    }

	    BulkActionUtil.enrollCampaign(bytes, request.getParameterMap(), ActionType.ASIGN_WORKFLOW.getUrl(),
		    contentType, Method.POST);
	    return;
	}

	if (ActionType.REMOVE_ACTIVE_SUBSCRIBERS.equals(ActionType.valueOf(action_type)))
	{
	    System.out.println("Filter id in Remove Active Subscribers is " + filterId);
	    if (filterId != null && filterId.equals("all-active-subscribers"))
	    {
		BulkActionUtil.removeActiveSubscribers(filterId, request.getParameterMap(),
		        ActionType.REMOVE_ACTIVE_SUBSCRIBERS.getUrl(), contentType, Method.POST);
		return;
	    }

	    BulkActionUtil.removeActiveSubscribers(bytes, request.getParameterMap(),
		    ActionType.REMOVE_ACTIVE_SUBSCRIBERS.getUrl(), contentType, Method.POST);
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
	    return;
	}

	System.out.println(bytes.length);

	BulkActionUtil.postDataToBulkActionBackend(bytes, ActionType.valueOf(action_type).getUrl(), contentType,
	        Method.POST);
    }

    public void createActivity(@Context HttpServletRequest request, String action_type)
    {
	try
	{
	    String contact_ids = "", data = "";
	    if (("DELETE").equals(action_type))
		contact_ids = request.getParameter("ids");
	    else if (("EMAIL_SENT").equals(action_type))
	    {
		contact_ids = request.getParameter("ids");

	    }
	    else if (("ASIGN_WORKFLOW").equals(action_type))
	    {
		contact_ids = request.getParameter("contact_ids");
		Workflow workflow = WorkflowUtil.getWorkflow(Long.parseLong(request.getParameter("workflow_id")));
		data = workflow.name;
	    }
	    else if (("CHANGE_OWNER").equals(action_type))
	    {
		contact_ids = request.getParameter("contact_ids");
		DomainUser domainuser = DomainUserUtil.getDomainUser(Long.parseLong(request.getParameter("owner")));
		data = domainuser.name;
	    }
	    else
	    {
		contact_ids = request.getParameter("contact_ids");
		data = request.getParameter("data");
	    }

	    System.out.println("contactids in bulk actions api " + contact_ids);
	    System.out.println(data);
	    JSONArray jsncontact_ids = new JSONArray(contact_ids);
	    System.out.println("contactids in bulk actions api json array " + jsncontact_ids);
	    ActivitySave.createBulkActionActivity(jsncontact_ids, action_type, data);

	}
	catch (JSONException e1)
	{
	    // TODO Auto-generated catch block
	    e1.printStackTrace();
	}
    }
}
