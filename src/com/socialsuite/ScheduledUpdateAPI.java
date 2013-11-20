package com.socialsuite;

import java.util.Date;
import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.google.appengine.api.datastore.EntityNotFoundException;

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
@Path("/social/scheduledupdate")
public class ScheduledUpdateAPI
{
	/**
	 * Create new scheduledUpdate in database related to current domain user.
	 * 
	 * @param scheduledUpdate
	 *            - Object of {@link ScheduledUpdate}
	 */
	@POST
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML, MediaType.TEXT_PLAIN })
	public ScheduledUpdate createScheduledUpdate(@FormParam("streamId") Long streamId,
			@FormParam("scheduled_date") Date date, @FormParam("scheduled_time") String time,
			@FormParam("message") String message)
	{
		Stream stream = StreamUtil.getStream(streamId);
		ScheduledUpdate scheduledUpdate = new ScheduledUpdate(stream.domain_user_id, stream.screen_name,
				stream.network_type.toString(), stream.token, stream.secret, message, date, time);
		System.out.print("scheduledUpdate message:" + scheduledUpdate.message + "scheduledUpdate n/w type: "
				+ scheduledUpdate.network_type);

		System.out.println("scheduledUpdate: " + scheduledUpdate.toString());
		scheduledUpdate.save();
		System.out.println("scheduledUpdate: " + scheduledUpdate.toString());
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
		System.out.println("In getAllScheduledUpdates.");
		return ScheduledUpdate.getScheduledUpdates();
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
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public ScheduledUpdate getScheduledUpdate(@PathParam("id") Long id) throws EntityNotFoundException
	{
		System.out.print("In get stream Id : " + id);
		return ScheduledUpdate.getScheduledUpdate(id);
	}

	/**
	 * Delete scheduled update as per Id.
	 * 
	 * @param id
	 *            - unique scheduled update id.
	 */
	@DELETE
	@Path("/{id}")
	public void deleteScheduledUpdate(@PathParam("id") Long id)
	{
		System.out.print("Delete scheduled update id : " + id);
		ScheduledUpdate scheduledUpdate = ScheduledUpdate.getScheduledUpdate(id);
		if (scheduledUpdate != null)
		{
			scheduledUpdate.delete();
		}
	}
}
