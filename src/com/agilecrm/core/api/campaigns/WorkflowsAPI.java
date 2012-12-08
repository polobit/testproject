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

import com.agilecrm.workflows.Workflow;

/**
 * <code>WorkflowsAPI</code> includes REST calls to interact with
 * {@link Workflow} class to initiate {@link Workflow} CRUD operations.
 * <p>
 * It is called from client side to create, fetch, update and delete
 * workflows.It also interact with {@link Workflow} class to fetch the data of
 * Workflow class from database.
 * </p>
 * 
 * @author maintenance
 * 
 */
@Path("/api/workflows")
public class WorkflowsAPI
{

    // Workflows
    // This method is called if TEXT_PLAIN is request
    /**
     * Gets list of workflows based on query parameters page-size and cursor.At
     * first only the list of workflows with the page_size are retrieved,when
     * cursor scroll down,rest of workflows are retrieved
     * 
     * @param count
     *            Number of workflows for a page
     * @param cursor
     *            Points the rest of workflows that are over the limit.
     * @return list of workflows
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Workflow> getWorkflows(@QueryParam("page_size") String count,
	    @QueryParam("cursor") String cursor)
    {
	if (count != null)
	{
	    return Workflow.getAllWorkflows(Integer.parseInt(count), cursor);
	}
	return Workflow.getAllWorkflows();
    }

    /**
     * Saves new workflow
     * 
     * @param workflow
     *            Workflow object that is newly created
     * @return Created workflow
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Workflow createWorkflow(Workflow workflow)
    {
	workflow.save();
	return workflow;
    }

    /**
     * Updates workflow
     * 
     * @param workflow
     *            Workflow object that is updated
     * @return updated workflow
     */
    @Path("{id}")
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Workflow updateWorkflow(Workflow workflow)
    {

	workflow.save();
	return workflow;
    }

    /**
     * Deletes single workflow based on id
     * 
     * @param id
     *            Respective workflow id
     */
    @Path("{id}")
    @DELETE
    public void deleteWorkflow(@PathParam("id") Long id)
    {
	Workflow workflow = Workflow.getWorkflow(id);
	if (workflow != null)
	    workflow.delete();
    }

    /**
     * Deletes selected workflows using their keys list
     * 
     * @param model_ids
     *            array of workflow ids as String
     * @throws JSONException
     */
    // Bulk operations - delete
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteWorkflows(@FormParam("model_ids") String model_ids)
	    throws JSONException
    {
	JSONArray workflowsJSONArray = new JSONArray(model_ids);

	Workflow.dao.deleteBulkByIds(workflowsJSONArray);
    }

}