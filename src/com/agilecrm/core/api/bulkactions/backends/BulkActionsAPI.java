package com.agilecrm.core.api.bulkactions.backends;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

import org.apache.commons.io.IOUtils;

import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.BulkActionUtil.ActionType;
import com.agilecrm.session.SessionManager;
import com.google.appengine.api.taskqueue.TaskOptions.Method;

@Path("/api/bulk")
public class BulkActionsAPI
{
    @POST
    @Path("/update")
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

	

	if (ActionType.CHANGE_OWNER
		.equals(ActionType.valueOf(action_type)))
	{
	    BulkActionUtil.changeOwner(bytes, request.getParameterMap(),
		    ActionType.CHANGE_OWNER.getUrl(), contentType, Method.POST);
	    return;
	}
	if (ActionType.ASIGN_WORKFLOW.equals(ActionType
		.valueOf(action_type)))
	{
	    BulkActionUtil.enrollCampaign(bytes, request.getParameterMap(),
		    ActionType.ASIGN_WORKFLOW.getUrl(), contentType,
		    Method.POST);
	    return;
	}

	BulkActionUtil.postDataToBulkActionBackend(bytes,
		ActionType.valueOf(action_type).getUrl(), contentType,
		Method.POST);
	
    }
}
