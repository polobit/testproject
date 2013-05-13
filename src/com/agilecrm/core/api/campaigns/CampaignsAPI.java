package com.agilecrm.core.api.campaigns;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.Log;
import com.campaignio.logger.util.LogUtil;

/**
 * <code>CampaignsAPI</code> includes REST calls to interact with {@link Log}
 * class and {@link WorkflowUtil} class. Usually calls include when single
 * contact or list of contacts subscribe to campaign, CampaignsAPI uses
 * {@link WorkflowUtil} class to run workflow with respect to contact.
 * <p>
 * <code>CampaignsAPI</code> includes calls to get and delete logs with
 * respective to campaigns. {@link Log} class is used to get and delete logs.
 * </p>
 * 
 * @author Manohar
 * 
 */
@Path("/api/campaigns")
public class CampaignsAPI
{
    /**
     * Subscribes single contact with the campaign.
     * 
     * @param contactId
     *            Id of a contact that is subscribed.
     * @param workflowId
     *            Id of a workflow.
     */
    @Path("enroll/{contact-id}/{workflow-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void subscribeContact(@PathParam("contact-id") Long contactId,
	    @PathParam("workflow-id") Long workflowId)
    {
	Contact contact = ContactUtil.getContact(contactId);
	if (contact == null)
	{
	    System.out.println("Null contact");
	    // return "true";
	}

	/*
	 * Contact is converted to list so that WorkflowUtil uses
	 * TaskletManager's executeCampaign method having deferredTask
	 */
	List<Contact> contactList = new ArrayList<Contact>();
	contactList.add(contact);

	WorkflowUtil.subscribeDeferred(contactList, workflowId);
	// return "true";
    }

    /**
     * Returns list of logs with respect to contact.
     * 
     * @param contactId
     *            Id of a contact that subscribes to campaign.
     * @return list of logs.
     */
    @Path("logs/contact/{contact-id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Log> getContactLogs(@PathParam("contact-id") String contactId)
    {
	return LogUtil.getSQLLogs(null, contactId, null);
    }

    /**
     * Returns logs from log object with respect to both campaign and contact.
     * 
     * @param contactId
     *            Id of a contact that subscribes to campaign.
     * @param campaignId
     *            Id of a campaign.
     * @return logs with respect to both campaign and contact.
     */
    @Path("logs/contact/{contact-id}/{campaign-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Log> getCampaignContactLogs(
	    @PathParam("contact-id") String contactId,
	    @PathParam("campaign-id") String campaignId)
    {
	return LogUtil.getSQLLogs(campaignId, contactId, null);
    }

    /**
     * Gets logs with respect to campaign.
     * 
     * @param campaignId
     *            Id of a campaign.
     * @return logs with respect to campaign.
     */
    @Path("logs/{campaign-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Log> getCampaignLogs(@PathParam("campaign-id") String campaignId)
    {
	return LogUtil.getSQLLogs(campaignId, null, null);
    }

    /**
     * Returns recent logs upto given limit.
     * 
     * @param limit
     *            - required number of logs
     * @return List
     */
    @Path("logs/recent")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Log> getRecentCampaignLogs(@QueryParam("page_size") String limit)
    {
	// System.out.println("limit : " + limit);
	return LogUtil.getSQLLogs(null, null, limit);
    }

    /**
     * Removes logs with respect to campaign id.
     * 
     * @param id
     *            Id of a campaign.
     */
    @Path("logs/{campaign-id}")
    @DELETE
    public void deleteCampaignLogs(@PathParam("campaign-id") String id)
    {
	LogUtil.deleteSQLLogs(id, null);
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
    @Path("enroll/bulk/{workflow-id}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void subscribeContactsBulk(
	    @FormParam("contact_ids") String contact_ids,
	    @PathParam("workflow-id") Long workflowId) throws JSONException
    {
	JSONArray contactsJSONArray = new JSONArray(contact_ids);

	// Get contacts list
	List<Contact> contacts_list = ContactUtil
		.getContactsBulk(contactsJSONArray);
	if (contacts_list.size() == 0)
	{
	    System.out.println("Null contact");
	    // return "true";
	}

	WorkflowUtil.subscribeDeferred(contacts_list, workflowId);
	// return "true";
    }
}