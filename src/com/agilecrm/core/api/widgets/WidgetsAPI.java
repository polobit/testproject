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
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.map.ObjectMapper;

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
public class WidgetsAPI
{

	// Widget
	/**
	 * Gets list of available widgets
	 * 
	 * @return {@link List} of {@link Widget}
	 */
	@Path("default")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Widget> getAvailableWidgets()
	{
		return WidgetUtil.getAvailableWidgets();
	}

	/**
	 * Gets List of widgets added for current user
	 * 
	 * @return {@link List} of {@link Widget}
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Widget> getWidgets()
	{
		// Returns list of widgets saved by current user
		return WidgetUtil.getAddedWidgetsForCurrentUser();
	}
	
	
	/**
	 * Gets List of widgets added for current user
	 * 
	 * @return {@link List} of {@link Widget}
	 */
	@Path("{widget_name}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Widget getWidgetByName(@PathParam("widget_name") String name)
	{
		return WidgetUtil.getWidget(name);
	}

	/**
	 * Saves a widget, can also save custom widget by specifying script url to
	 * load and preferences to connect.
	 * 
	 * @param widget
	 *            {@link Widget}
	 * @return {@link Widget}
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Widget createWidget(Widget widget)
	{
		System.out.println("In widgets api create");

		if (widget == null)
			return null;

		widget.save();
		return widget;
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
	public Widget createCustomWidget(CustomWidget customWidget)
	{
		System.out.println("In custom widgets api create");
		if (customWidget == null)
			return null;

		if (WidgetUtil.checkIfWidgetNameExists(customWidget.name))
			return null;

		System.out.println(customWidget);

		customWidget.save();
		return customWidget;
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
	public Widget updateWidget(Widget widget)
	{
		if (widget == null)
			return null;

		widget.save();
		return widget;
	}

	/**
	 * Deletes an widget based on widget name
	 * 
	 * @param widget_name
	 *            {@link String}
	 */
	@Path("{widget_name}")
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void deleteWidget(@PathParam("widget_name") String widget_name)
	{
		// Deletes widget based on name
		Widget widget = WidgetUtil.getWidget(widget_name);

		if (widget == null)
			return;

		// default widgets are removed from database on deletion
		widget.delete();
	}

	/**
	 * Removes a custom widget based on widget name from database from
	 * {@link CustomWidget} database and deletes it for all agile users
	 * 
	 * @param widget_name
	 *            {@link String}
	 */
	@Path("/remove/{widget_name}")
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void removeCustomWidget(@PathParam("widget_name") String widget_name)
	{
		// Deletes widget based on name
		CustomWidget customWidget = CustomWidgets.getCustomWidget(widget_name);

		if (customWidget == null)
			return;

		// check if widget is custom widget and delete it
		if (WidgetType.CUSTOM == customWidget.widget_type)
		{
			// removes the widget for all agile users
			WidgetUtil.removeWidgetForAllUsers(widget_name);

			// removes it from custom widgets database
			customWidget.delete();
		}
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
	public void savePositions(List<Widget> widgets)
	{
		if (widgets == null)
			return;

		// UI sends only ID and Position
		for (Widget widget : widgets)
		{
			Widget fullWidget = WidgetUtil.getWidget(widget.id);
			System.out.println(fullWidget);
			fullWidget.position = widget.position;
			fullWidget.save();
		}
	}

	/**
	 * Connects to the remote object based on the given url and reads the
	 * response to return
	 * 
	 * @param url
	 * @return response of remote object
	 */
	@Path("script/{contact-id}/{widget_name}")
	@POST
	public static String accessURLToReadScript(@PathParam("contact-id") Long contactId,
			@PathParam("widget_name") String widget_name)
	{
		// Get contact and widget based on their id
		Contact contact = ContactUtil.getContact(contactId);
		System.out.println("In accessURLToReadScript");

		// Deletes widget based on name
		CustomWidget customWidget = CustomWidgets.getCustomWidget(widget_name);
		String data = "";

		try
		{
			data = new ObjectMapper().writeValueAsString(contact);
			System.out.println(data);
		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return HTTPUtil.accessURLToReadScript(customWidget.url, "POST", data);
	}

	@Path("salesforce/contacts/{user-id}/{password}/{api-key}")
	@GET
	public static void getSalesContacts(@PathParam("user-id") String userId, @PathParam("password") String password,
			@PathParam("api-key") String apiKey)

	{
		try
		{

			ContactPrefs contactPrefs = new ContactPrefs();
			contactPrefs.type = Type.SALESFORCE;
			//contactPrefs.userName = userId;// "tejaswitest@gmail.com";
			//contactPrefs.password = password;// "agile1234";
			contactPrefs.apiKey = apiKey;// "CgBv3oy3GAY7eoNNQnx7yb2e";
			System.out.println("here");

			contactPrefs.save();

			// initialize backend to save contacts
			ContactsImportUtil.initilaizeImportBackend(contactPrefs);

		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.out.println(e.getMessage());
		}

	}
}