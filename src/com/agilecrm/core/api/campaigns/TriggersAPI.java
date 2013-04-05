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

import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.TriggerUtil;

/**
 * <code>TriggersAPI</code> includes REST calls to interact with {@link Trigger}
 * class to initiate Trigger CRUD operations.
 * <p>
 * It is called from client side to create, fetch, update and delete triggers.
 * It also interact with {@link Trigger} class to fetch the data of Trigger
 * class from database.
 * </p>
 * 
 * @author Naresh
 * 
 */
@Path("/api/triggers")
public class TriggersAPI
{
    /**
     * Gets all triggers.
     * 
     * @return List of all triggers.
     */
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Trigger> getTriggers()
    {
	return TriggerUtil.getAllTriggers();
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
    public Trigger createTrigger(Trigger trigger)
    {
	trigger.save();
	return trigger;
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
    public Trigger updateTrigger(Trigger trigger)
    {
	trigger.save();
	return trigger;
    }

    /**
     * Deletes single trigger.
     * 
     * @param id
     *            Trigger id that should be deleted.
     */
    @Path("{trigger_id}")
    @DELETE
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void deleteTrigger(@PathParam("trigger_id") Long id)
    {
	Trigger trigger = TriggerUtil.getTrigger(id);

	if (trigger != null)
	    trigger.delete();
    }

    /**
     * Deletes multiple triggers
     * 
     * @param model_ids
     *            Trigger ids that are selected to delete
     * @throws JSONException
     *             throws Exception when triggerIds are failed to convert to
     *             json
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteTriggers(@FormParam("ids") String model_ids)
	    throws JSONException
    {
	JSONArray triggersJSONArray = new JSONArray(model_ids);
	TriggerUtil.deleteTriggersBulk(triggersJSONArray);
    }
}
