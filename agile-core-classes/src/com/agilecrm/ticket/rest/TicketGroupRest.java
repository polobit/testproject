package com.agilecrm.ticket.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
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

import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.EmailTemplates;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketStats;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketStatsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
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
	public List<TicketGroups> getGroups(@QueryParam("only_groups") Boolean onlyGroups)
	{
		try
		{
			if (onlyGroups == null)
				return TicketGroupUtil.getAllGroupsWithDomainUsers();

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
	 * @return List of Domain Users
	 */
	@GET
	@Path("/{group_id}/users")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<DomainUser> getDomainUsersInGroup(@PathParam("group_id") Long groupID)
	{
		String oldnamespace = NamespaceManager.get();

		try
		{
			TicketGroups ticketGroup = TicketGroups.ticketGroupsDao.get(groupID);
			List<Long> domainUserIdsList = ticketGroup.agents_keys;

			List<Key<DomainUser>> domainUserKeyList = new ArrayList<Key<DomainUser>>();

			NamespaceManager.set("");

			for (Long id : domainUserIdsList)
				domainUserKeyList.add(new Key<DomainUser>(DomainUser.class, id));

			List<DomainUser> domainUsers = DomainUserUtil.dao.fetchAllByKeys(domainUserKeyList);

			return domainUsers;
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
		finally
		{
			NamespaceManager.set(oldnamespace);
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
				throw new Exception("Please select atleast one User to create Ticket Group.");

			TicketGroups existingGroup = TicketGroupUtil.getTicketGroupByName(groupName);

			if (existingGroup != null)
				throw new Exception("Ticket Group with name " + groupName
						+ " already exists. Please choose a different Group name.");

			List<Key<DomainUser>> agents_key_list = new ArrayList<Key<DomainUser>>();

			for (Long agent_key : agents_keys)
				agents_key_list.add(new Key<DomainUser>(DomainUser.class, agent_key));

			ticketGroup.setAgents_key_list(agents_key_list);
			ticketGroup.save();

			// Updating ticket count DB
			TicketStatsUtil.updateEntity(TicketStats.GROUPS_COUNT);

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
	 * Updates Ticket Group
	 * 
	 * @param ticketGroup
	 * @return created {@link TicketGroups}
	 */
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public TicketGroups updateGroup(TicketGroups ticketGroup)
	{
		try
		{
			String groupName = ticketGroup.group_name.trim();

			List<Long> agents_keys = ticketGroup.agents_keys;

			if (agents_keys == null || agents_keys.size() == 0)
				throw new Exception("Please select atleast one User to create Ticket Group.");

			TicketGroups existingGroup = TicketGroupUtil.getTicketGroupByName(groupName);

			if (existingGroup != null && !existingGroup.equals(ticketGroup))
				throw new Exception("Ticket Group with name " + groupName
						+ " already exists. Please choose a different Group name.");

			List<Key<DomainUser>> agents_key_list = new ArrayList<Key<DomainUser>>();

			for (Long agent_key : agents_keys)
				agents_key_list.add(new Key<DomainUser>(DomainUser.class, agent_key));

			TicketGroups dbGroup = null;

			try
			{
				dbGroup = TicketGroupUtil.getTicketGroupById(ticketGroup.id);
			}
			catch (Exception e)
			{
				throw new Exception("No group found with id " + ticketGroup.id + " or group has been deleted.");
			}

			// Set updated values
			dbGroup.group_name = ticketGroup.group_name;
			dbGroup.setAgents_key_list(agents_key_list);
			dbGroup.send_as = ticketGroup.send_as;
			dbGroup.feedback_flag = ticketGroup.feedback_flag;

			dbGroup.email_template_key = (ticketGroup.template_id != null) ? new Key<>(EmailTemplates.class,
					ticketGroup.template_id) : null;

			dbGroup.save();

			return dbGroup;
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
			TicketGroups.delete(new JSONArray(model_ids));
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