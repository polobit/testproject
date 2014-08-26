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
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.workflows.automation.Automation;
import com.agilecrm.workflows.automation.util.AutomationUtil;

/**
 * <code>AutomtionsAPI</code> includes REST calls to interact with {@link Automation}
 * class to initiate Configuration CRUD operations.
 * <p>
 * It is called from client side to create, fetch, update and delete configurations.
 * It also interact with {@link Automation} class to fetch the data of Configuration
 * class from database.
 * </p>
 * 
 * @author Ramesh
 * 
 */
@Path("/api/automations")
public class AutomationsAPI
{
    /**
     * Gets all configurations.
     * 
     * @return List of all configurations.
     */
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Automation> getAutomations()
    {
	return AutomationUtil.getAllAutomations();
    }

    /**
     * Saves new trigger.
     * 
     * @param trigger
     *            Trigger object that is newly created.
     * @return Created trigger.
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Automation createAutomation(Automation automation)
    {
    automation.save();
	return automation;
    }

    /**
     * Updates trigger.
     * 
     * @param trigger
     *            Trigger object that is updated.
     * @return Updated trigger.
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Automation updateAutomation(Automation automation)
    {
	automation.save();
	return automation;
    }

    /**
     * Deletes single automation.
     * 
     * @param id
     *            Automation id that should be deleted.
     */
    @Path("{configuration_id}")
    @DELETE
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void deleteAutomation(@PathParam("configuration_id") Long id)
    {
	Automation configuration = AutomationUtil.getAutomation(id);

	if (configuration != null)
	    configuration.delete();
    }

    /**
     * Deletes multiple configurations
     * 
     * @param model_ids
     *            Configuration ids that are selected to delete
     * @throws JSONException
     *             throws Exception when configurationIds are failed to convert to
     *             json
     */
    @Path("/bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteAutomation(@FormParam("ids") String model_ids)
	    throws JSONException
    {
	JSONArray configurationsJSONArray = new JSONArray(model_ids);
	AutomationUtil.deleteAutomationsBulk(configurationsJSONArray);
    }
}
