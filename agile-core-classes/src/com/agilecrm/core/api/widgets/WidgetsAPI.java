package com.agilecrm.core.api.widgets;

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

import com.agilecrm.account.util.SMSGatewayUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.Type;
import com.agilecrm.contact.util.ContactUtil;
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
	 * Gets list of available configurable widgets which are shown on user
	 * preference widgets panel.
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
	 * Gets List of configured widgets of the current user
	 * 
	 * @return {@link List} of {@link Widget}
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Widget> getWidgets() {
		// Returns list of widgets saved by current user
		return WidgetUtil.getAddedWidgetsForCurrentUser();
	}

	/**
	 * Gets widget of the current user based on the name widget.
	 * 
	 * @return {@link List} of {@link Widget}
	 */
	@Path("{widget_name}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Widget getWidgetByName(@PathParam("widget_name") String name) {
		return WidgetUtil.getWidget(name);
	}

	/**
	 * Saves the widget.
	 * 
	 * @param widget
	 *            {@link Widget}
	 * @return {@link Widget}
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Widget createWidget(Widget widget) {
		System.out.println("In widgets api create");

		if (widget == null) {
			return null;
		}

		widget.save();
		return widget;
	}

	/**
	 * Saves the custom widget.
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
		if (customWidget == null) {
			return null;
		}

		// Removes the special character in name of custom widget.
		customWidget.name = customWidget.name.replaceAll("[^a-zA-Z]+", "");

		if (WidgetUtil.checkIfWidgetNameExists(customWidget.name)) {
			return null;
		}

		System.out.println(customWidget);

		customWidget.save();
		return customWidget;
	}

	/**
	 * Updates the widget.
	 * 
	 * @param widget
	 *            {@link Widget}
	 * @return {@link Widget}
	 */
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Widget updateWidget(Widget widget) {
		if (widget == null) {
			return null;
		}

		widget.save();
		return widget;
	}

	/**
	 * Deletes the widget based on widget name
	 * 
	 * @param widget_name
	 *            {@link String}
	 */
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void deleteWidget(@QueryParam("widget_name") String widget_name) {
		// Deletes widget based on name
		Widget widget = WidgetUtil.getWidget(widget_name);

		if (widget == null) {
			return;
		}
		// default widgets are removed from database on deletion
		widget.delete();
	}

	/**
	 * Deletes the custom widget based on the widget name.
	 * 
	 * @param widget_name
	 *            {@link String}
	 */
	@Path("/remove")
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void removeCustomWidget(@QueryParam("widget_name") String widget_name) {
			// removes the widget for all agile users
			WidgetUtil.removeCurrentUserCustomWidget(widget_name);
			System.out.println("TEst code.....");
	}

	/**
	 * Saves the position of the widget to display in the contact details page.
	 * 
	 * @param widgets
	 *            {@link List} of {@link Widget}
	 */
	@Path("positions")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public void savePositions(List<Widget> widgets) {
		if (widgets == null) {
			return;
		}

		// UI sends only ID and Position
		for (Widget widget : widgets) {
			Widget fullWidget = WidgetUtil.getWidget(widget.id);
			System.out.println(fullWidget);
			fullWidget.position = widget.position;
			fullWidget.save();
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
	 * Gets contacts from the sales force.
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
	 * Gets all the widgets of type integration.
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
}
