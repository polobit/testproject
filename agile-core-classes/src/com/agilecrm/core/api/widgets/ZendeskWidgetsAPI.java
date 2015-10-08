package com.agilecrm.core.api.widgets;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.social.ZendeskUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.ExceptionUtil;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * <code>ZendeskWidgetsAPI</code> class includes REST calls to interact with
 * {@link ZendeskUtil} class
 * 
 * <p>
 * It is called from client side for adding, retrieving and updating tickets in
 * Zendesk
 * </p>
 * 
 * @author Tejaswi
 * @since August 2013
 * 
 */
@Path("/api/widgets/zendesk")
public class ZendeskWidgetsAPI {

	/**
	 * Retrieves Tickets from Zendesk based on the email and {@link Widget} Id
	 * provided
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param email
	 *            {@link String} email of the {@link Contact}
	 * @return {@link String} form of Tickets {@link JSONArray}
	 */
	@Path("get/{widget-id}/{email}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getTicketsFromZendesk(@PathParam("widget-id") Long widgetId,
			@PathParam("email") String email) {
		try {
			// Retrieves widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);

			if (widget != null) {
				// Calls ZendeskUtil to retrieve tickets for contacts email
				return ZendeskUtil.getContactTickets(widget, email);
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Adds a Ticket to Zendesk based on the given parameters and {@link Widget}
	 * id
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param name
	 *            {@link String} name of the {@link Contact} to be added to
	 *            Ticket
	 * @param subject
	 *            {@link String} subject of the Ticket to be added
	 * @param email
	 *            {@link String} email of the {@link Contact} to be added to
	 *            Ticket
	 * @param description
	 *            {@link String} description of the Ticket to be added
	 * @return {@link String} form of Ticket added
	 */
	@Path("add/{widget-id}")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	public String addTicketInZendesk(@PathParam("widget-id") Long widgetId,
			@FormParam("name") String name,
			@FormParam("subject") String subject,
			@FormParam("email") String email,
			@FormParam("message") String description) {
		try {
			// Retrieves widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				String response = ZendeskUtil.addTicket(widget, name, email,
						subject, description);

				/*
				 * Since response in coming in the form of String, check for
				 * message 'Authentication Exception' in the response and throw
				 * the error Manually with suitable message.
				 */
				if (response.contains("Authentication exception")) {
					throw new Exception(
							"Unable to add Ticket. Permission Denied.");
				}

				// Calls ZendeskUtil method to add a ticket in Zendesk
				return response;
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Updates an existing Ticket in Zendesk based on the {@link Widget} id and
	 * ticket number provided with the given description as comment
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param ticketNumber
	 *            {@link String} Id of the Ticket to be updated
	 * @param description
	 *            {@link String} description of the Ticket to be added as
	 *            comment
	 * @return {@link String} form of Ticket updated
	 */
	@Path("update/{widget-id}")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	public String updateTicketinZendesk(@PathParam("widget-id") Long widgetId,
			@FormParam("ticketNumber") String ticketNumber,
			@FormParam("message") String description) {
		try {
			// Retrieves widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// Calls ZendeskUtil and updates ticket in Zendesk
				return ZendeskUtil.updateTicket(widget, ticketNumber,
						description);
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Retrieves the agent information from his Zendesk account
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @return {@link String} form of {@link JSONObject}
	 */
	@Path("agent/{widget-id}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getZendeskAgentInfo(@PathParam("widget-id") Long widgetId) {
		try {
			// Retrieves widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// Calls ZendeskUtil and retrieves Zendesk account user
				// information
				return ZendeskUtil.getUserInfo(widget, "");
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Retrieves the tickets from Zendesk server based on its status for a
	 * specified contact
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param email
	 *            {@link String} email of the contact
	 * @param status
	 *            {@link String} status of the ticket
	 * @return {@link String} form of {@link JSONObject}
	 */
	@Path("ticket/status/{widget-id}/{email}/{status}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getTicketsOnstatus(@PathParam("widget-id") Long widgetId,
			@PathParam("email") String email, @PathParam("status") String status) {
		try {
			// Retrieves widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// Calls ZendeskUtil and retrieves tickets by its status
				return ZendeskUtil.getTicketsByStatus(widget, email, status);
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Retrieves the agent information based on his zendesk user name from
	 * Agent's Zendesk account and open tickets based on contact email
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param email
	 *            {@link String} email of the contact
	 * @return {@link String} form of {@link JSONObject}
	 */
	@Path("profile/{widget-id}/{email}")
	@GET
	@Produces(MediaType.TEXT_PLAIN + "; charset=UTF-8;")
	public String getZendeskProfile(@PathParam("widget-id") Long widgetId,
			@PathParam("email") String email) {
		try {
			// Retrieves widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// Retrieves user information from zendesk.
				return ZendeskUtil.getZendeskProfile(widget, email);
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}
}
