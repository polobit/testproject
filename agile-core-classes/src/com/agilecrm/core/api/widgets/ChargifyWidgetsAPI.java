package com.agilecrm.core.api.widgets;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.social.ChargifyUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.ExceptionUtil;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * The class <code>Chargify</code> is an intermediate rest class between
 * AgileCRM Client and <code>ChargifyUtil</code> class.
 * 
 * <p>
 * Client (AgileCRM client) can connect to this class using the REST calls to
 * perform preChat, chat and postChat requests.
 * </p>
 * 
 * @author Rajitha
 * @see ChargifyUtil
 * @since July 2014
 */
@Path("/api/widgets/chargify")
public class ChargifyWidgetsAPI {

	/**
	 * GetChargifyClientProfile method will be called from AgileCRM when widget
	 * is loaded. getChargifyClientProfile method just acts as a controller,
	 * receives request from AgileCRM forwards to ChargifyUtil class depending
	 * upon the command, it calls the appropriate method in ChargifyUtil &
	 * returns the results.
	 * 
	 * @param widget
	 *            -id Contains widget-id
	 * @param email
	 *            email contains user emailID
	 * 
	 * @return String with the client response
	 * @throws WebApplicationException
	 *             if the response sent by ChargifyUtil is an exception or if
	 *             widget is null
	 */
	@Path("clients/{widget-id}/{email}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getChargifyClientProfile(
			@PathParam("widget-id") Long widgetId,
			@PathParam("email") String email) throws WebApplicationException {
		try {
			Widget widget = WidgetUtil.getWidget(widgetId);
			// Getting widget from widgetId
			if (widget != null) {
				// Creating chargifyutil Object
				ChargifyUtil ChargifyUtil = new ChargifyUtil(
						widget.getProperty("chargify_api_key"),
						widget.getProperty("chargify_subdomain"));

				// Get customer array
				JSONArray customerJSONArray = ChargifyUtil.getCustomerId(email
						.toLowerCase());

				System.out.println(customerJSONArray);

				// Throw exception if now customer found for email
				if (customerJSONArray.length() == 0) {
					throw new Exception("Customer not found");
				}

				// Iterate through each object and format the response
				if (customerJSONArray.length() > 0) {
					JSONObject customerJson = customerJSONArray
							.getJSONObject(0);

					// Get subscriptions for the customer
					String subscriptions = ChargifyUtil
							.getSubscriptions(customerJson);

					// Get invoices for the customer
					String invoices = ChargifyUtil.getInvoices(customerJson);

					// Constructing jsonObject with customer,subscriptions
					// and invoices
					return (new JSONObject().put("customer", customerJson).put(
							"subscriptions", new JSONArray(subscriptions)).put(
							"invoices", new JSONArray(invoices))).toString();

				}
				return "";
			}

			return null;
		} catch (Exception e) {
			e.printStackTrace();
			throw ExceptionUtil.catchWebException(e);
		}
	}

	/**
	 * Adds a Customer to agent's Chargify account based on the given parameters
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param first_name
	 *            {@link String} first_name of the contact
	 * @param last_name
	 *            {@link String} last_name of the contact
	 * @param email
	 *            {@link String} email of the contact
	 * @return {@link String} form of {@link JSONObject}
	 */
	@Path("add/customer/{widget-id}/{first_name}/{last_name}/{email}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String addCustomerToChargify(@PathParam("widget-id") Long widgetId,
			@PathParam("first_name") String firstName,
			@PathParam("last_name") String lastName,
			@PathParam("email") String email) {
		// Retrieves widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget != null) {
			try {
				ChargifyUtil ChargifyUtil = new ChargifyUtil(
						widget.getProperty("chargify_api_key"), "agilecrm");
				// Calls ChargifyUtil method to add Contact to Chargify account
				return ChargifyUtil.createCustomer(firstName, lastName, email);
			} catch (Exception e) {
				throw ExceptionUtil.catchWebException(e);
			}
		}
		return null;
	}
}
