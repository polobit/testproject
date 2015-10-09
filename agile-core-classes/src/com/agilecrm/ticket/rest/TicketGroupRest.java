package com.agilecrm.ticket.rest;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;

/**
 * <code>TicketGroupRest</code> class responsible for providing CRUD operations
 * on {@link TicketGroups}.
 * 
 * @author Sasi 30-sep-2015
 * 
 */
@Path("/api/tickets/groups")
public class TicketGroupRest
{
	/**
	 * @return List of {@link TicketGroups}
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<TicketGroups> getGroups()
	{
		try
		{
			return TicketGroupUtil.getAllGroups();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * 
	 * @return
	 */
	@GET
	@Path("/create-default")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public TicketGroups createDefaultGroup()
	{
		return TicketGroupUtil.createDefaultGroup();
	}

	/**
	 * Saves new Ticket Group
	 * 
	 * @param ticketGroup
	 * @return created {@link TicketGroups}
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public TicketGroups createGroup(TicketGroups ticketGroup)
	{
		try
		{
			String groupName = ticketGroup.group_name.trim();

			List<Long> agents_keys = ticketGroup.agents_keys;

			if (agents_keys == null || agents_keys.size() == 0)
				throw new Exception("Please atleast one User to create Ticket Group.");

			TicketGroups existingGroup = TicketGroupUtil.getTicketGroupByName(groupName);

			if (existingGroup != null)
				throw new Exception("Ticket Group with name" + groupName
						+ " already exists. Please choose a different Group name");

			List<Key<DomainUser>> agents_key_list = new ArrayList<Key<DomainUser>>();

			for (Long agent_key : agents_keys)
				agents_key_list.add(new Key<DomainUser>(DomainUser.class, agent_key));

			ticketGroup.setAgents_key_list(agents_key_list);
			ticketGroup.setOwner_key(DomainUserUtil.getCurentUserKey());
			ticketGroup.updated_time = Calendar.getInstance().getTimeInMillis();

			TicketGroups.ticketGroupsDao.put(ticketGroup);

			return ticketGroup;
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Deletes tickets by ID
	 * 
	 * @param ticketGroup
	 * @return ticketGroup
	 * @throws JSONException
	 */
	@POST
	@Path("/bulk")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public String deleteGroups(@FormParam("ids") String model_ids) throws JSONException
	{
		try
		{
			JSONArray groupIDsArray = new JSONArray(model_ids);
			TicketGroups.ticketGroupsDao.deleteBulkByIds(groupIDsArray);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return new JSONObject().put("status", "success").toString();
	}

	@GET
	@Path("/delete")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String deleteGroup(@QueryParam("id") Long groupID)
	{
		TicketGroups.ticketGroupsDao.deleteKey(new Key<TicketGroups>(TicketGroups.class, groupID));

		return "Success";
	}
}