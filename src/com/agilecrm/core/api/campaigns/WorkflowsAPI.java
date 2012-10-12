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
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.workflows.Trigger;
import com.agilecrm.workflows.Workflow;

@Path("/api/workflows")
public class WorkflowsAPI
{

    // Workflows
    // This method is called if TEXT_PLAIN is request
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Workflow> getWorkflows(@QueryParam("cursor") String cursor,
	    @QueryParam("page_size") String count)
    {
	if (count != null)
	{
	    return Workflow.getAllWorkflows(Integer.parseInt(count), cursor);
	}
	return Workflow.getAllWorkflows();
    }

    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Workflow createWorkflow(Workflow workflow)
    {
	workflow.save();
	return workflow;
    }

    @Path("{id}")
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Workflow updateWorkflow(Workflow workflow)
    {
	System.out.println("Updating " + workflow);

	workflow.save();
	return workflow;
    }

    @Path("{id}")
    @DELETE
    public void deleteWorkflow(@PathParam("id") Long id)
    {
	Workflow workflow = Workflow.getWorkflow(id);
	if (workflow != null)
	    workflow.delete();
    }

    // Bulk operations - delete
    @Path("bulk")
    @DELETE
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteWorkflows(@FormParam("model_ids") String model_ids)
	    throws JSONException
    {
	JSONArray workflowsJSONArray = new JSONArray(model_ids);

	Workflow.dao.deleteBulkByIds(workflowsJSONArray);
    }

    // Triggers
    @Path("triggers")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Trigger> getTriggers()
    {
	return Trigger.getAllTriggers();
    }

    @Path("triggers")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Trigger createTrigger(Trigger trigger)
    {
	trigger.save();
	return trigger;
    }

    @Path("triggers")
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Trigger updateTrigger(Trigger trigger)
    {
	trigger.save();
	return trigger;
    }

    @Path("triggers/{trigger_id}")
    @DELETE
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void deleteTrigger(@PathParam("trigger_id") Long id)
    {
	Trigger trigger = Trigger.getTrigger(id);
	if (trigger != null)
	    trigger.delete();

    }

    // Bulk operations - Triggers delete
    @Path("triggers/bulk")
    @DELETE
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteTriggers(@FormParam("model_ids") String model_ids)
	    throws JSONException
    {
	JSONArray triggersJSONArray = new JSONArray(model_ids);

	Trigger.deleteTriggersBulk(triggersJSONArray);
    }

}