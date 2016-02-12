package com.agilecrm.ticket.rest;

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

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.utils.TicketLabelsUtil;
import com.agilecrm.validator.TagValidator;

/**
 * 
 * @author Sasi on 20-Nov-2015
 * 
 */
@Path("/api/tickets/labels")
public class TicketLabelsRest
{
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<TicketLabels> getLabels()
	{
		return TicketLabelsUtil.fetchAll();
	}

	@POST
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public TicketLabels createLabel(TicketLabels ticketLabel)
	{
		try
		{
			if (!TagValidator.getInstance().validate(ticketLabel.label))
				throw new Exception(
						"Sorry, Label name should start with an alphabet and can not contain special characters other than underscore,space and hyphen");

			return TicketLabelsUtil.createLabel(ticketLabel);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	@PUT
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public TicketLabels updateLabel(TicketLabels ticketLabel)
	{
		try
		{
			if (!TagValidator.getInstance().validate(ticketLabel.label))
				throw new Exception(
						"Sorry, Label name should start with an alphabet and can not contain special characters other than underscore and space - "
								+ ticketLabel.label);

			return TicketLabelsUtil.updateLabel(ticketLabel);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	@POST
	@Path("/bulk")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public String deleteLabels(@FormParam("ids") String model_ids) throws JSONException
	{
		try
		{
			TicketLabels.dao.deleteBulkByIds(new JSONArray(model_ids));
		}
		catch (Exception e)
		{
			e.printStackTrace();
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return new JSONObject().put("status", "success").toString();
	}
}
