package com.agilecrm.core.api.campaigns;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.bounce.EmailBounceStatus.EmailBounceType;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.status.CampaignStatus;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.agilecrm.workflows.status.util.CampaignSubscribersUtil;
import com.agilecrm.workflows.unsubscribe.util.UnsubscribeStatusUtil;
import com.agilecrm.workflows.util.WorkflowDeleteUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.cron.util.CronUtil;

/**
 * <code>WorkflowsAPI</code> includes REST calls to interact with
 * {@link Workflow} class to initiate {@link Workflow} CRUD operations.
 * <p>
 * It is called from client side to create, fetch, update and delete workflows.
 * It also interact with {@link Workflow} class to fetch the data of Workflow
 * class from database.
 * </p>
 * 
 * @author Naresh
 * 
 */
@Path("/api/workflows")
public class WorkflowsAPI
{
    /**
     * Gets list of workflows based on query parameters page-size and cursor. At
     * first only the list of workflows with the page_size are retrieved, when
     * cursor scroll down, rest of workflows are retrieved. This method is
     * called if TEXT_PLAIN is request.
     * 
     * @param count
     *            Number of workflows for a page.
     * @param cursor
     *            Points the rest of workflows that are over the limit.
     * @return list of workflows.
     */

    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Workflow> getWorkflows(@QueryParam("page_size") String count, @QueryParam("cursor") String cursor)
    {
	if (count != null)
	{
	    return WorkflowUtil.getAllWorkflows(Integer.parseInt(count), cursor);
	}
	return WorkflowUtil.getAllWorkflows();
    }

    /**
     * Returns single workflow for the given id.
     * 
     * @param workflowId
     *            - workflow id
     * @return
     */
    @Path("{workflow-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Workflow getWorkflow(@PathParam("workflow-id") String workflowId)
    {
	Workflow workflow = WorkflowUtil.getWorkflow(Long.parseLong(workflowId));
	return workflow;
    }

    /**
     * Saves new workflow.
     * 
     * @param workflow
     *            Workflow object that is newly created.
     * @return Created workflow.
     * @throws PlanRestrictedException
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Workflow createWorkflow(Workflow workflow) throws PlanRestrictedException, WebApplicationException
    {
	workflow.save();
	try
	{
	    ActivityUtil.createCampaignActivity(ActivityType.CAMPAIGN_CREATE, workflow, null);
	}
	catch (Exception e)
	{
	    System.out.println("exception occured while creating workflow creation activity");
	}

	return workflow;
    }

    /**
     * Updates workflow.
     * 
     * @param workflow
     *            Workflow object that is updated.
     * @return updated workflow.
     */
    @Path("{id}")
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Workflow updateWorkflow(Workflow workflow) throws Exception
    {
	workflow.save();

	try
	{
	    ActivityUtil.createCampaignActivity(ActivityType.CAMPAIGN_EDIT, workflow, null);
	}
	catch (Exception e)
	{
	    System.out.println("exception occured while creating workflow creation activity");
	}

	return workflow;
    }

    /**
     * Deletes single workflow based on id.
     * 
     * @param id
     *            Respective workflow id.
     */
    @Path("{id}")
    @DELETE
    public void deleteWorkflow(@PathParam("id") Long id)
    {
	Workflow workflow = WorkflowUtil.getWorkflow(id);

	if (workflow != null)
	{
	    try
	    {
		ActivityUtil.createCampaignActivity(ActivityType.CAMPAIGN_DELETE, workflow, null);
	    }
	    catch (Exception e)
	    {
		System.out.println("exception occured while creating workflow creation activity");
	    }
	    workflow.delete();
	}
    }

    /**
     * Deletes selected workflows using their keys list.Deletes related
     * campaignStats
     * 
     * @param model_ids
     *            array of workflow ids as String.
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteWorkflows(@FormParam("ids") String model_ids) throws JSONException
    {
	JSONArray workflowsJSONArray = new JSONArray(model_ids);

	try
	{
	    ActivitySave.createLogForBulkDeletes(EntityType.CAMPAIGN, workflowsJSONArray,
		    String.valueOf(workflowsJSONArray.length()), "");
	}
	catch (Exception e)
	{
	    System.out.println("exception occured while creating workflow creation activity");
	}

	Workflow.dao.deleteBulkByIds(workflowsJSONArray);

	// Deletes CampaignStats
	WorkflowDeleteUtil.deleteRelatedEntities(workflowsJSONArray);

    }

    /**
     * Returns active subscribers of given campaign.
     * 
     * @param workflow_id
     *            - campaign-id
     * @param count
     *            - count (or limit) of subscribers per request
     * @param cursor
     *            - cursor object
     * @return
     */
    @Path("active-subscribers/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON + "; charset=utf-8", MediaType.APPLICATION_XML + "; charset=utf-8" })
    public List<Contact> getActiveContacts(@PathParam("id") String workflow_id, @QueryParam("page_size") String count,
	    @QueryParam("cursor") String cursor)
    {
	return CampaignSubscribersUtil.getSubscribers(Integer.parseInt(count), cursor, workflow_id + "-"
	        + CampaignStatus.Status.ACTIVE);
    }

    /**
     * Returns list of contacts having campaignStatus Done for the given
     * campaign-id.
     * 
     * @param workflow_id
     *            - workflow id.
     * @param count
     *            - count (or limit) of subscribers per request
     * @param cursor
     *            - cursor object
     * @return
     */
    @Path("completed-subscribers/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON + "; charset=utf-8", MediaType.APPLICATION_XML + "; charset=utf-8" })
    public List<Contact> getCompletedContacts(@PathParam("id") String workflow_id,
	    @QueryParam("page_size") String count, @QueryParam("cursor") String cursor)
    {
	return CampaignSubscribersUtil.getSubscribers(Integer.parseInt(count), cursor, workflow_id + "-"
	        + CampaignStatus.Status.DONE);
    }

    /**
     * Returns removed subscribers of given campaign.
     * 
     * @param workflow_id
     *            - campaign-id
     * @param count
     *            - count (or limit) of subscribers per request
     * @param cursor
     *            - cursor object
     * @return
     */
    @Path("removed-subscribers/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Contact> getRemovedContacts(@PathParam("id") String workflow_id, @QueryParam("page_size") String count,
	    @QueryParam("cursor") String cursor)
    {
	return CampaignSubscribersUtil.getSubscribers(Integer.parseInt(count), cursor, workflow_id + "-"
	        + CampaignStatus.Status.REMOVED);
    }

    /**
     * Removes subscriber from Cron and updates status to REMOVED
     * 
     * @param workflowId
     *            - workflow id.
     * @param contactId
     *            - contact id.
     */
    @Path("remove-active-subscriber/{campaign-id}/{contact-id}")
    @DELETE
    public void removeActiveSubscriber(@PathParam("campaign-id") String workflowId,
	    @PathParam("contact-id") String contactId)
    {
	// if any one of the path params is empty
	if (StringUtils.isEmpty(workflowId) || StringUtils.isEmpty(contactId))
	    return;

	// Remove from Cron.
	CronUtil.removeTask(workflowId, contactId);

	// Updates CampaignStatus to REMOVE
	CampaignStatusUtil.setStatusOfCampaign(contactId, workflowId, WorkflowUtil.getCampaignName(workflowId),
	        CampaignStatus.Status.REMOVED);
    }

    /**
     * Returns all subscribers including active, completed and removed
     * subscribers of given campaign.
     * 
     * @param workflow_id
     *            - workflow id.
     * @param count
     *            - count (or limit) of subscribers per request
     * @param cursor
     *            - cursor object
     * @return
     */
    @Path("all-subscribers/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML + "; charset=utf-8", MediaType.APPLICATION_JSON + "; charset=utf-8" })
    public List<Contact> getAllWorkflowContacts(@PathParam("id") String workflow_id,
	    @QueryParam("page_size") String count, @QueryParam("cursor") String cursor)
    {
	return CampaignSubscribersUtil.getContactsByCampaignId(Integer.parseInt(count), cursor, workflow_id);
    }

    /**
     * Returns Unsubscribed subscribers
     * 
     * @param workflow_id
     *            - campaign-id
     * @param count
     *            - count (or limit) of subscribers per request
     * @param cursor
     *            - cursor object
     * @return
     */
    @Path("unsubscribed-subscribers/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML + "; charset=utf-8", MediaType.APPLICATION_JSON + "; charset=utf-8" })
    public List<Contact> getUnsubscribedContacts(@PathParam("id") String workflow_id,
	    @QueryParam("page_size") String count, @QueryParam("cursor") String cursor)
    {
	return UnsubscribeStatusUtil.getUnsubscribeContactsByCampaignId(Integer.parseInt(count), cursor, workflow_id);
    }

    /**
     * Returns Hard Bounced contacts
     * 
     * @param count
     *            - count (or limit) of subscribers per request
     * @param cursor
     *            - cursor object
     * @return
     */
    @Path("hardbounced-subscribers/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML + "; charset=utf-8", MediaType.APPLICATION_JSON + "; charset=utf-8" })
    public List<Contact> getHardBouncedContacts(@PathParam("id") String workflow_id,
	    @QueryParam("page_size") String count, @QueryParam("cursor") String cursor)
    {
	return CampaignSubscribersUtil.getBoucedContactsByCampaignId(Integer.parseInt(count), cursor,
	        EmailBounceType.HARD_BOUNCE, workflow_id);
    }

    /**
     * Returns Soft Bounced contacts
     * 
     * @param count
     *            - count (or limit) of subscribers per request
     * @param cursor
     *            - cursor object
     * @return
     */
    @Path("softbounced-subscribers/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML + "; charset=utf-8", MediaType.APPLICATION_JSON + "; charset=utf-8" })
    public List<Contact> getSoftBouncedContacts(@PathParam("id") String workflow_id,
	    @QueryParam("page_size") String count, @QueryParam("cursor") String cursor)
    {
	return CampaignSubscribersUtil.getBoucedContactsByCampaignId(Integer.parseInt(count), cursor,
	        EmailBounceType.SOFT_BOUNCE, workflow_id);
    }

    /**
     * Returns spam reported contacts
     * 
     * @param count
     *            - count (or limit) of subscribers per request
     * @param cursor
     *            - cursor object
     * @return
     */
    @Path("spam-reported-subscribers/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML + "; charset=utf-8", MediaType.APPLICATION_JSON + "; charset=utf-8" })
    public List<Contact> getSpamReportedContacts(@PathParam("id") String workflow_id,
	    @QueryParam("page_size") String count, @QueryParam("cursor") String cursor)
    {
	return CampaignSubscribersUtil.getBoucedContactsByCampaignId(Integer.parseInt(count), cursor,
	        EmailBounceType.SPAM, workflow_id);
    }

}