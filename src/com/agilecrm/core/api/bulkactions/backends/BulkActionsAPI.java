package com.agilecrm.core.api.bulkactions.backends;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.io.IOUtils;

import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.BulkActionUtil.ActionType;
import com.agilecrm.contact.util.BulkActionsDeferredTask;
import com.agilecrm.session.SessionManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;

@Path("/api/bulk")
public class BulkActionsAPI
{

    @GET
    @Path("/filter/update")
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void PerformChangeAction(ContactFilter filter,
	    @QueryParam("action_type") String action_type,
	    @QueryParam("id") String id)
    {
	// Created a deferred task for report generation
	BulkActionsDeferredTask reportsDeferredTask = new BulkActionsDeferredTask(
		filter, action_type, id);

	Queue queue = QueueFactory.getQueue("reports-queue");

	// Add to queue
	queue.add(TaskOptions.Builder.withPayload(reportsDeferredTask));
    }

    @POST
    @Path("/filter/update1")
    public void PerformChangeAction(@Context HttpServletRequest request)
    {
	InputStream stream = null;
	byte[] bytes = null;
	
	request.setAttribute("current_domain_user_id", SessionManager.get()
		.getDomainId());

	System.out.println(request.getAttribute("current_domain_user_id"));

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



	String action_type = request.getParameter("action_type");
	System.out.println(request.getParameterMap());
	String contentType = request.getHeader("Content-Type");

	if (ActionType.DELETE.equals(ActionType.valueOf(action_type)))
	    BulkActionUtil.postDataToBulkActionBackend(bytes,
		    ActionType.DELETE.getUrl(), contentType, Method.POST);

	else if (ActionType.ADD_TAG.equals(ActionType.valueOf(action_type)))
	    BulkActionUtil.postDataToBulkActionBackend(bytes,
		    ActionType.ADD_TAG.getUrl(), contentType, Method.POST);

	else if (ActionType.CONTACTS_UPLOAD.equals(ActionType
		.valueOf(action_type)))
	    BulkActionUtil.postDataToBulkActionBackend(bytes,
		    ActionType.CONTACTS_UPLOAD.getUrl(), contentType,
		    Method.POST);

	else if (ActionType.CHANGE_OWNER
		.equals(ActionType.valueOf(action_type)))
	    BulkActionUtil.changeOwner(bytes, request.getParameterMap(),
		    ActionType.CHANGE_OWNER.getUrl(), contentType, Method.POST);

	else if (ActionType.ASIGN_WORKFLOW.equals(ActionType
		.valueOf(action_type)))
	    BulkActionUtil.enrollCampaign(bytes, request.getParameterMap(),
		    ActionType.ASIGN_WORKFLOW.getUrl(), contentType,
		    Method.POST);
	
    }
}
