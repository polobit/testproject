package com.agilecrm.core.api.widgets;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.agilecrm.social.FreshBooksUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.ExceptionUtil;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * <code>FreshBooksWidgetsAPI</code> class includes REST calls to interact with
 * {@link FreshBooksUtil} class
 * 
 * <p>
 * It is called from client side to retrieve clients, invoices and client from
 * FreshBooks account
 * </p>
 * 
 * @author Tejaswi
 * @since August 2013
 * 
 */
@Path("/api/widgets/freshbooks")
public class FreshBooksWidgetsAPI {

	/**
	 * Gets the clients info from the freshbook based on the contact email.
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param email
	 *            {@link String} email of the contact
	 * @return {@link String} form of {@link JSONObject}
	 */
	@Path("clients/{widget-id}/{email}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getClientsFromFreshBooks(
			@PathParam("widget-id") Long widgetId,
			@PathParam("email") String email) {
		String result = null;
		// Retrieves widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget != null) {

			try {
				// Calls FreshBooksUtil method to retrieve clients
				result = FreshBooksUtil.getClients(widget, email);
			} catch (Exception e) {
				throw ExceptionUtil.catchWebException(e);
			}
		}
		return result;
	}

	/**
	 * Gets the invoices form the freshbook based on the contact client id.
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param clientId
	 *            {@link String} client id of the contact
	 * @return {@link String} form of {@link JSONObject}
	 */
	@Path("invoices/{widget-id}/{client_id}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getInvoicesFromFreshBooks(
			@PathParam("widget-id") Long widgetId,
			@PathParam("client_id") String clientId) {
		String result = null;
		// Retrieves widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget != null) {

			try {
				// Calls FreshBooksUtil method to retrieve invoices of client
				result = FreshBooksUtil.getInvoicesOfClient(widget, clientId);
			} catch (Exception e) {
				throw ExceptionUtil.catchWebException(e);
			}
		}
		return result;

	}

	/**
	 * Retrieves items to which invoices are added for a client from agnet's
	 * FreshBooks account
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @return {@link String} form of {@link JSONObject}
	 */
	@Path("items/{widget-id}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getItemsFromFreshBooks(@PathParam("widget-id") Long widgetId) {
		String result = null;
		// Retrieves widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget != null) {
			try {
				// Calls FreshBooksUtil method to retrieve items in FreshBooks
				result = FreshBooksUtil.getItems(widget);
			} catch (Exception e) {
				throw ExceptionUtil.catchWebException(e);
			}
		}
		return result;
	}

	/**
	 * Retrieves taxes to which invoices are charged for a client from agnet's
	 * FreshBooks account
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @return {@link String} form of {@link JSONObject}
	 */
	@Path("taxes/{widget-id}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getTaxesFromFreshBooks(@PathParam("widget-id") Long widgetId) {
		String result = null;
		// Retrieves widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);
		if (widget != null) {
			try {
				// Calls FreshBooksUtil method to retrieve taxes in FreshBooks
				result = FreshBooksUtil.getTaxes(widget);
			} catch (Exception e) {
				throw ExceptionUtil.catchWebException(e);
			}
		}
		return result;

	}

	/**
	 * Adds a client to agent's FreshBooks account based on the given parameters
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param firstName
	 *            {@link String} first name of the contact
	 * @param lastName
	 *            {@link String} last name of the contact
	 * @param email
	 *            {@link String} email of the contact
	 * @return {@link String} form of {@link JSONObject}
	 */
	@Path("add/client/{widget-id}/{first_name}/{last_name}/{email}/{organisation}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String addClientToFreshBooks(@PathParam("widget-id") Long widgetId,
			@PathParam("first_name") String firstName,
			@PathParam("last_name") String lastName,
			@PathParam("email") String email,
			@PathParam("organisation") String organisation) {
		String result = null;
		// Retrieves widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget != null) {
			
			if(firstName.equalsIgnoreCase("undefined")){
				firstName = "";
			}
			
			if(lastName.equalsIgnoreCase("undefined")){
				lastName = "";
			}
			
			
			try {
				if (organisation.equals("undefined")) {
					organisation = "";
				}
				// Calls FreshBooksUtil method to add client items in FreshBooks
				result = FreshBooksUtil.addClient(widget, firstName, lastName,
						email, organisation);
			} catch (Exception e) {
				throw ExceptionUtil.catchWebException(e);
			}
		}
		return result;
	}

	/**
	 * Adds invoice to an existing contact in FreshBooks based on item name
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param firstName
	 *            {@link String} first name of the contact
	 * @param lastName
	 *            {@link String} last name of the contact
	 * @param email
	 *            {@link String} email of the contact
	 * @param itemName
	 *            {@link String} name of the item
	 * @param quantity
	 *            {@link String} quantity of items
	 * @return {@link String} form of {@link JSONObject}
	 */
	@Path("add/invoice/{widget-id}")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String addInvoiceToClientInFreshBooks(
			@PathParam("widget-id") Long widgetId,
			@FormParam("first_name") String firstName,
			@FormParam("last_name") String lastName,
			@FormParam("email") String email,
			@FormParam("lines_info") String linesInfo) {
		String result = null;
		// Retrieves widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget != null) {

			try {
				// Calls FreshBooksUtil method to add invoice in FreshBooks
				// account
				result = FreshBooksUtil.addInvoice(widget, firstName, lastName,
						email, linesInfo);
			} catch (Exception e) {
				throw ExceptionUtil.catchWebException(e);
			}
		}
		return result;
	}
}