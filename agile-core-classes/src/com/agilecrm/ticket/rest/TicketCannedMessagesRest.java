package com.agilecrm.ticket.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.ticket.entitys.TicketCannedMessages;
import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.utils.TicketCannedMessagesUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;

/**
 * <code>TicketCannedMessagesRest</code> class responsible for providing CRUD
 * operations on {@link TicketCannedMessages}.
 * 
 * @author Sasi on 9-Oct-2015
 * 
 */
@Path("/api/tickets/canned-messages")
public class TicketCannedMessagesRest
{
	/**
	 * 
	 * @return List of {@link TicketCannedMessages}
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<TicketCannedMessages> getCannedMessages()
	{
		try
		{
			List<TicketCannedMessages> list = TicketCannedMessagesUtil.getCannedMessages(DomainUserUtil
					.getCurentUserKey());

			if (list == null || list.size() == 0)
				list = TicketCannedMessagesUtil.createDefault();

			return list;
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
	 * @param cannedMessage
	 * @return success string
	 */
	@POST
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String createCannedMessgae(TicketCannedMessages cannedMessage)
	{
		try
		{
			if (cannedMessage == null || StringUtils.isBlank(cannedMessage.title)
					|| StringUtils.isBlank(cannedMessage.message))
				throw new Exception("Required parameters missing.");

			String title = cannedMessage.title.toLowerCase();
			Key<DomainUser> domainUser = DomainUserUtil.getCurentUserKey();

			if (TicketCannedMessagesUtil.getCannedMessageByName(title, domainUser) != null)
				throw new Exception("Canned Message with same name already exists. Please choose different name.");

			cannedMessage.title = title;
			cannedMessage.setOwner_key(domainUser);

			List<Long> label_keys = (cannedMessage.labels == null) ? new ArrayList<Long>() : cannedMessage.labels;

			System.out.println("label_keys = " + label_keys);

			List<Key<TicketLabels>> labelsKeysList = new ArrayList<Key<TicketLabels>>();
			for (Long label_key : label_keys)
				labelsKeysList.add(new Key<TicketLabels>(TicketLabels.class, label_key));

			System.out.println("labelsKeysList = " + labelsKeysList);

			cannedMessage.set_Labels(labelsKeysList);

			TicketCannedMessages.dao.put(cannedMessage);

			return new JSONObject().put("status", "success").toString();
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
	 * @param cannedMessage
	 * @return success string
	 */
	@PUT
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String updateCannedMessgae(TicketCannedMessages cannedMessage)
	{
		try
		{
			if (cannedMessage == null || cannedMessage.id == null || StringUtils.isBlank(cannedMessage.title)
					|| StringUtils.isBlank(cannedMessage.message))
				throw new Exception("Required parameters missing.");

			String title = cannedMessage.title.toLowerCase();

			/**
			 * Get canned message with same name if exists
			 */
			TicketCannedMessages oldCannedMessage = TicketCannedMessagesUtil.getCannedMessageByName(title,
					DomainUserUtil.getCurentUserKey());

			/**
			 * Verifying if there exists a canned response with name
			 */
			if (oldCannedMessage != null)
				if (!cannedMessage.equals(oldCannedMessage))
					throw new Exception("Canned Message with same name already exists. Please choose different name.");

			cannedMessage.setOwner_key(DomainUserUtil.getCurentUserKey());

			List<Long> label_keys = cannedMessage.labels;

			System.out.println("label_keys = " + label_keys);

			List<Key<TicketLabels>> labelsKeysList = new ArrayList<Key<TicketLabels>>();
			for (Long label_key : label_keys)
				labelsKeysList.add(new Key<TicketLabels>(TicketLabels.class, label_key));

			System.out.println("labelsKeysList = " + labelsKeysList);

			cannedMessage.set_Labels(labelsKeysList);

			TicketCannedMessages.dao.put(cannedMessage);

			return new JSONObject().put("status", "success").toString();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Deletes canned messages by IDs
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
			JSONArray idsArray = new JSONArray(model_ids);
			TicketCannedMessages.dao.deleteBulkByIds(idsArray);

			return new JSONObject().put("status", "success").toString();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
}
