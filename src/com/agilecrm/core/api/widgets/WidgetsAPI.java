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

import com.agilecrm.util.HTTPUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.Widget.WidgetType;
import com.agilecrm.widgets.util.WidgetUtil;

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
		if (widget == null)
			return null;

		System.out.println("In widgets api create");

		/*
		 * For custom widgets, we fetch the script using HTTP connections from
		 * the given url for it and store it as a string in script field. If
		 * widget type is custom, read the script
		 */
		if (WidgetType.CUSTOM.equals(widget.widget_type))
			widget.script = HTTPUtil.accessURLToReadScript(widget.url);

		System.out.println(widget);

		widget.save();
		return widget;
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

		/*
		 * For custom widgets, we doesn't remove it from database and just make
		 * is added button as false, as we get the information from database
		 * every time unlike default widgets
		 */
		if (widget != null && widget.widget_type.equals(WidgetType.CUSTOM))
		{
			widget.is_added = false;
			widget.save();
			return;
		}

		// default widgets are removed from database on deletion
		widget.delete();
	}

	/**
	 * Removes a custom widget based on widget name from database
	 * 
	 * @param widget_name
	 *            {@link String}
	 */
	@Path("/remove/{widget_name}")
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void removeWidget(@PathParam("widget_name") String widget_name)
	{
		// Deletes widget based on name
		Widget widget = WidgetUtil.getWidget(widget_name);

		if (widget == null)
			return;

		// check if widget is custom widget and delete it
		if (widget.widget_type.equals(WidgetType.CUSTOM))
		{
			widget.delete();
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

}