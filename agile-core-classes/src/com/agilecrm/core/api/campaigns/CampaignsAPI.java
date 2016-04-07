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

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.status.CampaignStatus.Status;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.agilecrm.workflows.status.util.EmailSubscriptionDeferredTask.SubscriptionType;
import com.agilecrm.workflows.status.util.UnsubscribeEmailUtil;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.Log;
import com.campaignio.logger.util.CampaignLogsSQLUtil;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.wrapper.CampaignLogWrapper;
import com.campaignio.wrapper.LogWrapper;

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
    public void subscribeContact(@PathParam("contact-id") Long contactId, @PathParam("workflow-id") Long workflowId)
    {
	Contact contact = ContactUtil.getContact(contactId);
	if (contact == null)
	{
	    System.out.println("Null contact");
	    return;
	}

	/*
	 * Contact is converted to list so that WorkflowUtil uses
	 * TaskletManager's executeCampaign method having deferredTask
	 */
	List<Contact> contactList = new ArrayList<Contact>();
	contactList.add(contact);

	WorkflowSubscribeUtil.subscribeDeferred(contactList, workflowId);
	Workflow workflow = WorkflowUtil.getWorkflow(workflowId);
	ActivityUtil.createContactActivity(ActivityType.CAMPAIGN, contact, "", workflow.name, "");
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
    public List<CampaignLogWrapper> getContactLogs(@PathParam("contact-id") String contactId,
	    @QueryParam("cursor") String offset, @QueryParam("page_size") String pageSize)
    {
	if (StringUtils.isBlank(offset))
	    offset = "0";
	if (StringUtils.isBlank(pageSize))
	    pageSize = "20";
	return CampaignLogsSQLUtil.getCampaignLogs(null, contactId, offset, pageSize, null);
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
    public List<LogWrapper> getCampaignContactLogs(@PathParam("contact-id") String contactId,
	    @PathParam("campaign-id") String campaignId)
    {
	return LogUtil.getSQLLogs(campaignId, contactId, null, null, null);
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
    public List<LogWrapper> getCampaignLogs(@PathParam("campaign-id") String campaignId,
	    @QueryParam("log-type") String logType, @QueryParam("cursor") String offset,
	    @QueryParam("page_size") String pageSize)
    {

	if (StringUtils.isBlank(offset))
	    offset = "0";
	if (StringUtils.isBlank(pageSize))
	    pageSize = "20";
	// limited logs to 20 per page
	return LogUtil.getSQLLogs(campaignId, null, offset, pageSize, logType);
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
    public List<LogWrapper> getRecentCampaignLogs(@QueryParam("page_size") String limit)
    {
	return LogUtil.getSQLLogs(null, null, "0", limit, null);
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
     * Subscribes single contact with the campaign.
     * 
     * @param email
     *            email of a contact that is subscribed.
     * @param workflowId
     *            Id of a work flow / Campaign.
     */
    @Path("enroll/email")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String subscribeContactByEmail(@FormParam("email") String email, @FormParam("workflow-id") Long workflowId)
    {
	// Get the contact based on the Email and subscribe it to the Campaign.
	Contact contact = ContactUtil.searchContactByEmail(email);
	if (contact == null)
	{
	    System.out.println("Null contact");
	    return "No Contact.";
	}

	/*
	 * Contact is converted to list so that WorkflowUtil uses
	 * TaskletManager's executeCampaign method having deferredTask
	 */
	List<Contact> contactList = new ArrayList<Contact>();
	contactList.add(contact);

	WorkflowSubscribeUtil.subscribeDeferred(contactList, workflowId);
	return "Success";
    }

    /**
     * Unsubscribe contact from campaign based on email of contact
     * 
     * @param email
     *            email of the contact
     * @param workflowId
     *            the iId of the workflow/campaign to Unsubscribe.
     * @return
     */
    @Path("unsubscribe")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String unsubscribeCampaign(@FormParam("email") String email, @FormParam("workflow-id") Long workflowId)
    {
	try
	{
	    // Get the contact based on the Email and Unsubscribe it from the
	    // Campaign.
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return "No Contact.";

	    ObjectMapper mapper = new ObjectMapper();

	    String campaignId = workflowId.toString();
	    String campaignName = WorkflowUtil.getCampaignName(campaignId);

	    // Remove the task related the contact for this campaign from
	    // CronJobs.
	    CronUtil.removeTask(campaignId, contact.id.toString());

	    // Set the status as removed for the campaign in the Contact.
	    CampaignStatusUtil.setStatusOfCampaign(contact.id.toString(), campaignId, campaignName, Status.REMOVED);

	    return mapper.writeValueAsString(contact);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    @Path("resubscribe")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void resubscribeCampaign(@FormParam("id") Long contactId, @FormParam("workflow-id") String workflowId)
    {
	Contact contact = ContactUtil.getContact(contactId);

	if (contact == null)
	    return;

	UnsubscribeEmailUtil.emailSubscriptionByQueue(contactId, workflowId, null, SubscriptionType.RESUBSCRIBE);
    }

    /**
     * Gets logs with respect to campaign.
     * 
     * @param campaignId
     *            Id of a campaign.
     * @return logs with respect to campaign.
     */
    @Path("logs/ContactActivities")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<LogWrapper> getContactActivityLogs(@QueryParam("cursor") String cursor,
	    @QueryParam("page_size") String count, @QueryParam("log_type") String log_type)
    {

	if (StringUtils.isBlank(cursor))
		cursor = "0";
	if (StringUtils.isBlank(count))
	        count = "20";
	return LogUtil.getConatctActivitiesSQLLogs(log_type, cursor, count);
    }

}