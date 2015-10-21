/**
 * 
 */
package com.campaignio.servlets;

import java.io.IOException;
import java.net.URL;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.SendEmail;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * 
 * <code>OnlineLinkForEmail</code> is the servlet that enables users to read
 * campaign emails in the web browser.
 * 
 * @author Ramesh
 * 
 */
@SuppressWarnings("serial")
public class OnlineLinkForEmail extends HttpServlet
{
    /**
     * Enables users to read campaign emails in online.
     * 
     * @param request
     *            - HttpServletRequest
     * @param response
     *            - HttpServletResponse
     **/
    public void service(HttpServletRequest request, HttpServletResponse res) throws IOException
    {
	// Fetches domain name from url. E.g. From admin.agilecrm.com, returns
	// admin
	URL url = new URL(request.getRequestURL().toString());
	String path = url.getPath();
	try
	{
	    while (path.endsWith("/"))
	    {
		path = path.substring(0, path.length() - 1);
	    }
	    while (path.startsWith("/"))
	    {
		path = path.substring(1, path.length());
	    }
	    // Split tokens
	    String[] tokens = path.split("/");
	    if (tokens != null && tokens.length == 4)
	    {
		String campaignIdString = tokens[1];
		String subscriberIdString = tokens[2];
		String nodeId = tokens[3];
		if (StringUtils.isNotBlank(campaignIdString) && StringUtils.isNotBlank(subscriberIdString)
		        && StringUtils.isNotBlank(nodeId))
		{
		    Long campaignId = Long.parseLong(campaignIdString);
		    Long subscriberId = Long.parseLong(subscriberIdString);
		    Contact contact = ContactUtil.getContact(subscriberId);
		    List<String> dateCustomFieldLabels = AgileTaskletUtil.getDateCustomLabelsFromCache();
		    if (contact != null)
		    {
			JSONObject subscriberJSON = null;
			JSONObject campaignJSON = null;
			JSONObject nodeJSON = null;
			try
			{
			    subscriberJSON = AgileTaskletUtil.getSubscriberJSON(contact, dateCustomFieldLabels, null);
			    campaignJSON = WorkflowUtil.getWorkflowJSON(campaignId);
			    if (campaignJSON != null && campaignJSON.length() > 0)
				nodeJSON = TaskletUtil.getNodeJSON(campaignJSON, nodeId);
			    else
				sendErrorMessage(res);
			}
			catch (Exception e)
			{
			    System.out
				    .println("Exception occured while getting objects(Campaign,Subscriber,Node) JSON from ids" + e.getMessage());
			    System.out.println("CampaignId: " + campaignId + " " + "SubscriberId: " + subscriberId
				    + " " + "NodeId: " + nodeId);
			}
			JSONObject data = new JSONObject();
			if (subscriberJSON != null && subscriberJSON.length() > 0 && nodeJSON != null
			        && nodeJSON.length() > 0)
			{
			    String html = TaskletAdapter.getStringValue(nodeJSON, subscriberJSON, data,
				    SendEmail.HTML_EMAIL);
			    res.setContentType("text/html; charset=UTF-8");
			    res.getWriter().write(html);
			}
			else
			    sendErrorMessage(res);
		    }
		    else
			sendErrorMessage(res);
		}
	    }
	}
	catch (Exception e)
	{
	    System.out.println("Exception occured while reading content of email node" + e.getMessage());
	}
    }

    /**
     * 
     * @param res
     */
    private void sendErrorMessage(HttpServletResponse res)
    {
	try
	{
		res.setContentType("text/html; charset=UTF-8");
	    res.getWriter().write("Requested content is no longer available");
	}
	catch (Exception e)
	{
	    System.out.println("Exception occured while sending error message for online link email");
	    e.printStackTrace();
	}
    }

}
