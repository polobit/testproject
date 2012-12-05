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

import com.agilecrm.triggers.Trigger;
import com.agilecrm.triggers.TriggerUtil;

@Path("/api/triggers")
public class TriggersAPI
{

    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Trigger> getTriggers()
    {
	return TriggerUtil.getAllTriggers();
    }

    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Trigger createTrigger(Trigger trigger)
    {
	trigger.save();
	return trigger;
    }

    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Trigger updateTrigger(Trigger trigger)
    {
	trigger.save();
	return trigger;
    }

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

    // Bulk operations - Triggers delete
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteTriggers(@FormParam("model_ids") String model_ids)
	    throws JSONException
    {
	JSONArray triggersJSONArray = new JSONArray(model_ids);

	TriggerUtil.deleteTriggersBulk(triggersJSONArray);
    }

}
