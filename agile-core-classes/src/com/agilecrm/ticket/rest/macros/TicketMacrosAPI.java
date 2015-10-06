package com.agilecrm.ticket.rest.macros;

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
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;

import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.ticket.macros.TicketMacroUtil;
import com.agilecrm.ticket.macros.TicketMacros;

/**
 * <code>TicketMacrosAPI</code> includes REST calls to interact with
 * {@link TicketMacros} class to initiate {@link TicketMacros} CRUD operations.
 * <p>
 * It is called from client side to create, fetch, update and delete
 * TicketMacros. It also interact with {@link TicketMacros} class to fetch the
 * data of TicketMacros class from database.
 * </p>
 * 
 * @author Vaishnavi
 * 
 */
@Path("/api/ticket/macros")
public class TicketMacrosAPI
{

	/**
	 * Gets list of macros based on query parameters page-size and cursor. At
	 * first only the list of macros with the page_size are retrieved, when
	 * cursor scroll down, rest of macros are retrieved. This method is called
	 * if TEXT_PLAIN is request.
	 * 
	 * @param count
	 *            Number of macros for a page.
	 * @param cursor
	 *            Points the rest of macros that are over the limit.
	 * @return list of macros.
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<TicketMacros> getTicketMacros(@QueryParam("page_size") String count, @QueryParam("cursor") String cursor)
	{
		if (count != null)
		{
			return TicketMacroUtil.getAllTicketMacros(Integer.parseInt(count), cursor);
		}
		return TicketMacroUtil.getAllTicketMacros();
	}

	/**
	 * Returns single macro for the given id.
	 * 
	 * @param macroId
	 *            - macro id
	 * @return
	 */
	@Path("{id}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public TicketMacros getTicketMacro(@PathParam("id") String macroId)
	{
		return TicketMacroUtil.getMacro(Long.parseLong(macroId));
	}

	/**
	 * Creates new Macro and saves details in database
	 * 
	 * @param macro
	 *            macro object that is newly created.
	 * @return Created macro.
	 * @throws PlanRestrictedException
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public TicketMacros createMacro(TicketMacros macroDetails) throws PlanRestrictedException, WebApplicationException
	{

		TicketMacros ticketMacro = new TicketMacros(macroDetails.name, macroDetails.actions);
		ticketMacro.save();

		return ticketMacro;
	}

	/**
	 * Updates existing Macro details of a user in database
	 * 
	 * @param macro
	 *            macro object that is updated.
	 * @return updated macro.
	 */
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public TicketMacros updateMacro(TicketMacros newMacro) throws Exception
	{

		// Get existoing macro fron DB
		TicketMacros oldMacro = TicketMacroUtil.getMacro(newMacro.id);

		// Update data with new details
		oldMacro.name = newMacro.name;
		oldMacro.actions = newMacro.actions;

		oldMacro.save();
		return oldMacro;
	}

	/**
	 * Deletes single macro based on id.
	 * 
	 * @param id
	 *            Respective macro id.
	 */
	@Path("{id}")
	@DELETE
	public void deleteMacro(@PathParam("id") Long id)
	{

		TicketMacros macro = TicketMacroUtil.getMacro(id);

		if (macro != null)
			macro.delete();
	}

	/**
	 * Deletes macro(s) from database for given macroId's
	 * 
	 * @param macroArray
	 *            contains Id's of macro to be deleted
	 * @return Success response
	 * @throws Exception
	 */
	@POST
	@Path("/delete")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public void deletemacros(@FormParam("ids") String model_ids) throws Exception
	{

		JSONArray workflowsJSONArray = new JSONArray(model_ids);

		// Delete Macros
		TicketMacros.dao.deleteBulkByIds(workflowsJSONArray);

	}
}