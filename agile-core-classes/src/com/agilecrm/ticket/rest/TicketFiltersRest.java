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

import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.ticket.entitys.TicketFilters;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.utils.TicketFiltersUtil;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.webrules.WebRule;
import com.agilecrm.webrules.util.WebRuleUtil;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

/**
 * <code>TicketFiltersRest</code> class responsible for providing CRUD
 * operations on {@link TicketFilters}.
 * 
 * @author Sasi 30-sep-2015
 * 
 */
@Path("/api/tickets/filters")
public class TicketFiltersRest
{
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<TicketFilters> getFilters()
	{
		try
		{
			return TicketFiltersUtil.getAllFilters(DomainUserUtil.getCurentUserKey());
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	@POST
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String createFilter(TicketFilters newFilter)
	{
		try
		{
			newFilter.setOwner_key(DomainUserUtil.getCurentUserKey());
			
			TicketFilters.dao.put(newFilter);

			return new JSONObject().put("status", "success").toString();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	@PUT
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String updateFilter(TicketFilters filter)
	{
		try
		{
			TicketFilters.dao.put(filter);

			return new JSONObject().put("status", "success").toString();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	@POST
	@Path("/bulk")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public String deleteGroups(@FormParam("ids") String model_ids)
	{
		try
		{
			JSONArray filterIDsArray = new JSONArray(model_ids);
			TicketFilters.dao.deleteBulkByIds(filterIDsArray);

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
