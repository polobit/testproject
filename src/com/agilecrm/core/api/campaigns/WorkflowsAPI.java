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
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.status.CampaignStatus;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.agilecrm.workflows.status.util.CampaignSubscribersUtil;
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
 * @author Manohar
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
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Workflow createWorkflow(Workflow workflow)
    {
	try
	{
	    workflow.save();
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Status.BAD_REQUEST).entity(e.getMessage()).build());
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
    public Workflow updateWorkflow(Workflow workflow)
    {
	try
	{
	    workflow.save();
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Status.BAD_REQUEST).entity(e.getMessage()).build());
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
	    workflow.delete();
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
    @Path("active-contacts/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON + "; charset=utf-8", MediaType.APPLICATION_XML + "; charset=utf-8" })
    public String getActiveContacts(@PathParam("id") String workflow_id, @QueryParam("page_size") String count, @QueryParam("cursor") String cursor)
    {

	List<Contact> contacts = CampaignSubscribersUtil.getSubscribers(Integer.parseInt(count), cursor, workflow_id + "-" + CampaignStatus.Status.ACTIVE);

	if (contacts == null)
	    return null;

	JSONArray contactsArr = CampaignSubscribersUtil.insertCampaignId(workflow_id, contacts);

	return contactsArr.toString();
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
    @Path("completed-contacts/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON + "; charset=utf-8", MediaType.APPLICATION_XML + "; charset=utf-8" })
    public String getCompletedContacts(@PathParam("id") String workflow_id, @QueryParam("page_size") String count, @QueryParam("cursor") String cursor)
    {
	List<Contact> contacts = CampaignSubscribersUtil.getSubscribers(Integer.parseInt(count), cursor, workflow_id + "-" + CampaignStatus.Status.DONE);

	if (contacts == null)
	    return null;

	JSONArray contactsArr = CampaignSubscribersUtil.insertCampaignId(workflow_id, contacts);

	return contactsArr.toString();
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
    public void removeActiveSubscriber(@PathParam("campaign-id") String workflowId, @PathParam("contact-id") String contactId)
    {
	// if any one of the path params is empty
	if (StringUtils.isEmpty(contactId) || StringUtils.isEmpty(contactId))
	    return;

	// Remove from Cron.
	CronUtil.removeTask(workflowId, contactId);

	// Updates CampaignStatus to REMOVE
	CampaignStatusUtil.setStatusOfCampaign(contactId, workflowId, CampaignStatus.Status.REMOVED);
    }

}