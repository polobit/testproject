package com.socialsuite.cron;

import java.util.List;

import javax.ws.rs.Consumes;
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

import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.socialsuite.util.ScheduleUpdateUtil;

/**
 * <code>ScheduledUpdateAPI</code> is the API class for Social Suite
 * ScheduledUpdate. This class includes REST calls to interact with
 * ScheduledUpdate class.
 * <p>
 * It is called from client side for Adding a ScheduledUpdate for posts/updates.
 * Also used to show available ScheduledUpdateAPI.
 * </p>
 * 
 * @author Farah
 * 
 */
@Path("/scheduledupdate")
public class ScheduledUpdateAPI
{
	/**
	 * Create new scheduledUpdate in database related to current domain user.
	 * 
	 * @param scheduledUpdate
	 *            - Object of {@link ScheduledUpdate}
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public ScheduledUpdate createScheduledUpdate(ScheduledUpdate scheduledUpdate)
	{
		scheduledUpdate.save();
		return scheduledUpdate;
	}

	/**
	 * Update existing scheduledUpdate in database related to current domain
	 * user.
	 * 
	 * @param scheduledUpdate
	 *            - Object of {@link ScheduledUpdate}
	 */
	@PUT
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public ScheduledUpdate updateScheduledUpdate(ScheduledUpdate scheduledUpdate)
	{
		scheduledUpdate.save();
		return scheduledUpdate;
	}

	/**
	 * Return the list of ScheduledUpdate available in dB related to current
	 * Domain User.
	 * 
	 * @return List<ScheduledUpdate> - Objects ScheduledUpdate
	 */

	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<ScheduledUpdate> getAllScheduledUpdates()
	{
		return ScheduleUpdateUtil.getScheduledUpdates();
	}

	/**
	 * Return the count of ScheduledUpdate available in dB related to current
	 * Domain User.
	 * 
	 * @return int - count of Objects ScheduledUpdate
	 */

	@GET
	@Path("/getscheduledupdatescount")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public int getScheduledUpdatesCount()
	{
		return ScheduleUpdateUtil.getScheduledUpdatesCount();
	}

	/**
	 * Return the list of ScheduledUpdate available in dB related to
	 * screen_name.
	 * 
	 * @param screen_name
	 *            - screen_name of account holder.
	 * 
	 * @return List<ScheduledUpdate> - Objects ScheduledUpdate
	 */
	@GET
	@Path("/getscheduledupdates/{screen_name}")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<ScheduledUpdate> getScheduledUpdates(@PathParam("screen_name") String screen_name)
	{
		return ScheduleUpdateUtil.getScheduledUpdates(screen_name);
	}

	/**
	 * Return the details of ScheduledUpdate as per Id.
	 * 
	 * @param id
	 *            - unique ScheduledUpdate id.
	 * 
	 * @return ScheduledUpdate - Object with required ScheduledUpdate id.
	 */
	@GET
	@Path("/getscheduledupdate/{id}")
	@Produces({ MediaType.APPLICATION_JSON })
	public ScheduledUpdate getScheduledUpdate(@PathParam("id") Long id) throws EntityNotFoundException
	{
		return ScheduleUpdateUtil.getScheduledUpdate(id);
	}

	/**
	 * Delete scheduled update as per Id.
	 * 
	 * @param id
	 *            - unique scheduled update id.
	 */
	@GET
	@Path("/{id}")
	@Produces(MediaType.TEXT_PLAIN)
	public String deleteScheduledUpdate(@PathParam("id") Long id)
	{
		ScheduledUpdate scheduledUpdate = ScheduleUpdateUtil.getScheduledUpdate(id);

		if (scheduledUpdate != null)
		{
			scheduledUpdate.delete();
			return "Successful";
		}
		return null;
	}

	/**
	 * Deletes the bulk of scheduled updates. Bulk operations - delete.
	 * 
	 * @param model_ids
	 *            array of deal ids as String.
	 * @throws JSONException
	 */
	@Path("/bulk")
	@POST
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public void deleteScheduledUpdates(@FormParam("ids") String model_ids) throws JSONException
	{
		JSONArray scheduledUpdatesJSONArray = new JSONArray(model_ids);

		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");

		ScheduledUpdate.dao.deleteBulkByIds(scheduledUpdatesJSONArray);

		NamespaceManager.set(oldNamespace);
	}
}
