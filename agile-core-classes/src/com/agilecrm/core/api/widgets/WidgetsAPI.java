package com.agilecrm.core.api.widgets;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.util.SMSGatewayUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.Type;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.social.BrainTreeUtil;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.widgets.CustomWidget;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.Widget.WidgetType;
import com.agilecrm.widgets.util.CustomWidgets;
import com.agilecrm.widgets.util.WidgetUtil;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactsImportUtil;

/**
 * <code>WidgetsAPI</code> class includes REST calls to interact with
 * {@link WidgetUtil} class
 * <p>
 * It is called from client side for adding a widget, show available widgets,
 * saves the position of the saved widgets in contacts details page
 * </p>
 * 
 */
@Path("/api/widgets")
public class WidgetsAPI {

	/**
	 * Gets list of available widgets
	 * 
	 * @return {@link List} of {@link Widget}
	 */
	@Path("default")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Widget> getAvailableWidgets() {
		return WidgetUtil.getAvailableWidgets();
	}

	/**
	 * Gets List of widgets added for current user
	 * 
	 * @return {@link List} of {@link Widget}
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Widget> getWidgets() {
		// Returns list of widgets saved by current user
		return WidgetUtil.getActiveWidgetsForCurrentUser();
	}

	/**
	 * Gets List of widgets added for current user
	 * 
	 * @param name
	 *            name of the widget
	 * @return {@link List} of {@link Widget}
	 */
	@Path("{widget_name}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Widget getWidgetByName(@PathParam("widget_name") String name) {
		return WidgetUtil.getWidget(name);
	}

	/**
	 * Saves a widget, can also save custom widget by specifying script url to
	 * load and preferences to connect.
	 * 
	 * @param widget
	 *            {@link Widget}
	 * @return {@link Widget}
	 * @throws JSONException
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Widget createWidget(Widget widget) throws Exception {
		System.out.println("In widgets api create");
		if (widget != null) {
			WidgetsAPI.checkValidDetails(widget);
			widget.save();
			return widget;
		}

		return null;
	}

	/**
	 * Saves a widget, can also save custom widget by specifying script url to
	 * load and preferences to connect.
	 * 
	 * @param customWidget
	 *            {@link CustomWidget}
	 * @return {@link CustomWidget}
	 */
	@Path("/custom")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Widget createCustomWidget(CustomWidget customWidget) {
		System.out.println("In custom widgets api create");
		if (customWidget != null) {
			customWidget.name = customWidget.name.replaceAll("[^a-zA-Z]+", "");
			if (WidgetUtil.checkIfWidgetNameExists(customWidget.name)) {
				return null;
			}

			customWidget.save();

			Widget widget = new Widget();
			widget.isForAll = customWidget.custom_isForAll;
			widget.script = customWidget.script;
			widget.logo_url = customWidget.logo_url;
			widget.fav_ico_url = customWidget.fav_ico_url;
			widget.description = customWidget.description;
			widget.name = customWidget.name;
			widget.widget_type = customWidget.widget_type;
			widget.save();

			customWidget.is_added = true;

			return customWidget;
		}
		return null;
	}

	/**
	 * Updates a widget
	 * 
	 * @param widget
	 *            {@link Widget}
	 * @return {@link Widget}
	 */
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Widget updateWidget(Widget widget) throws Exception {
		if (widget != null) {
			WidgetsAPI.checkValidDetails(widget);
			widget.save();
			return widget;
		}
		return null;
	}

	/**
	 * Deletes an widget based on widget name
	 * 
	 * @param widget_name
	 *            {@link String}
	 */
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void deleteWidget(@QueryParam("widget_name") String widget_name) {
		// Deletes widget based on name
		Widget widget = WidgetUtil.getWidget(widget_name);
		if (widget != null) {
			// default widgets are removed from database on deletion
			widget.delete();
		}
	}

	/**
	 * Removes a custom widget based on widget name from database from
	 * {@link CustomWidget} database and deletes it for all agile users
	 * 
	 * @param widget_name
	 *            {@link String}
	 */
	@Path("/remove")
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void removeCustomWidget(@QueryParam("widget_name") String widget_name) {
		// Deletes widget based on name
		CustomWidgets.deleteCurrentUserWidget(widget_name);
	}

	/**
	 * Saves position of widget, used to show widgets in order according to
	 * position ascending order
	 * 
	 * @param widgets
	 *            {@link List} of {@link Widget}
	 */
	@Path("positions")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public void savePositions(List<Widget> widgets) {
		if (widgets != null) {
			// UI sends only ID and Position
			for (Widget widget : widgets) {
				Widget fullWidget = WidgetUtil.getWidget(widget.id);
				System.out.println(fullWidget);
				fullWidget.position = widget.position;
				fullWidget.save();
			}
		}
	}

	/**
	 * Connects to the remote object based on the given URL and reads the
	 * response to return
	 * 
	 * @param url
	 * @return response of remote object
	 */
	@Path("script/{contact-id}/{widget_name}")
	@POST
	public static String accessURLToReadScript(
			@PathParam("contact-id") Long contactId,
			@PathParam("widget_name") String widget_name) {
		// Get contact and widget based on their id
		Contact contact = ContactUtil.getContact(contactId);
		System.out.println("In accessURLToReadScript");

		// Deletes widget based on name
		CustomWidget customWidget = CustomWidgets.getCustomWidget(widget_name);
		String data = "";

		try {
			data = new ObjectMapper().writeValueAsString(contact);
			System.out.println(data);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return HTTPUtil.accessURLToReadScript(customWidget.url, "POST", data);
	}

	/**
	 * Gets the contacts from the salesforce.
	 * 
	 * @param userId
	 * @param password
	 * @param apiKey
	 */
	@Path("salesforce/contacts/{user-id}/{password}/{api-key}")
	@GET
	public static void getSalesContacts(@PathParam("user-id") String userId,
			@PathParam("password") String password,
			@PathParam("api-key") String apiKey)

	{
		try {

			ContactPrefs contactPrefs = new ContactPrefs();
			contactPrefs.type = Type.SALESFORCE;
			// contactPrefs.userName = userId;// "tejaswitest@gmail.com";
			// contactPrefs.password = password;// "agile1234";
			contactPrefs.apiKey = apiKey;// "CgBv3oy3GAY7eoNNQnx7yb2e";
			System.out.println("here");

			contactPrefs.save();

			// initialize backend to save contacts
			ContactsImportUtil.initilaizeImportBackend(contactPrefs, true);

		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
		}

	}

	/**
	 * Gets a list of widgets based on widget_type which is INTEGRATIONS
	 * 
	 * @return
	 */
	@Path("/integrations")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Widget> getIntegrations() {
		// Returns list of widgets
		return WidgetUtil.getIntegrationGateways();
	}

	/**
	 * Deletes the current id in Integrations
	 * 
	 * @param id
	 */
	@Path("/integrations/{id}")
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void deleteGatewayWidget(@PathParam("id") Long id) {

		Widget widget = SMSGatewayUtil.getSMSGatewayWidget();
		if (widget != null) {
			widget.delete();
		}
		System.err.println("The widget is null and id is " + id);
	}

	/**
	 * return the default_call widget otherwise null
	 * 
	 * name and default_call are the attribute to be ooked at ui side...
	 * 
	 * 
	 * @return null or widget
	 */

	@Path("/availableCallWidgets")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Widget> getDefaultCallWIdgetName() {
		List<Widget> widgets = new ArrayList<Widget>();
		// ArrayList<String> callOptionName = new ArrayList<>();

		widgets.addAll(WidgetUtil.getWidget(WidgetType.CALL));
		/*
		 * if(!widgets.isEmpty()){ for(Widget widget : widgets){
		 * callOptionName.add(widget.name); }
		 * System.out.println("Available call options : " +
		 * callOptionName.toString()); }else{
		 * System.out.println("No default call widget found sending null ...");
		 * }
		 */

		return widgets;
	}

	/**
	 * Saves position of widget, used to show widgets in order according to
	 * position ascending order
	 * 
	 * @param widgets
	 *            {@link List} of {@link Widget}
	 */
	@Path("saveWidgetPrivilages")
	@POST
	public void saveWidgetPrivilages(String obj) throws Exception {
		if (obj != null) {
			JSONObject widgetObj = new JSONObject(obj);
			Widget widget = WidgetUtil.getWidget(widgetObj.getLong("id"));
			widget.listOfUsers = widgetObj.getString("listOfUsers");
			widget.save();

		}
	}

	public static void checkValidDetails(Widget widget) throws Exception {
		if (widget.name.equals("Braintree")) {
			JSONObject prefsObj = new JSONObject(widget.prefs);
			String merchantId = prefsObj.getString("merchant_id");
			String publicKey = prefsObj.getString("public_key");
			String privateKey = prefsObj.getString("private_key");
			BrainTreeUtil bUtil = new BrainTreeUtil(merchantId, publicKey,
					privateKey);
			JSONArray resultObj = bUtil.getTransactions("test@agilecrm.com");
		}
		if (widget.name.equals("Uservoice")) {
			String prefs = widget.prefs;
			JSONObject prefsObj = new JSONObject(prefs);
			String API_KEY = prefsObj.getString("uv_api_key");
			String API_SECRET = prefsObj.getString("uv_secert_key");
			String domain = prefsObj.getString("uv_domain_name");
			UservoiceAPI uv = new UservoiceAPI(domain, API_KEY, API_SECRET);
		}
	}
}
