package com.agilecrm.widgets.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.widgets.CustomWidget;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.Widget.IntegrationType;
import com.agilecrm.widgets.Widget.WidgetType;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>WidgetUtil</code> class provides static function to perform operations
 * on widgets, such as fetching widgets for current user and based on id/name
 */
public class WidgetUtil {
	// Dao
	private static ObjectifyGenericDao<Widget> dao = new ObjectifyGenericDao<Widget>(
			Widget.class);

	/**
	 * Gets the all widgets including custom widgets which are displayed in the
	 * user pref widgets page.
	 * 
	 * @return {@link List} of {@link Widget}s
	 */
	public static List<Widget> getAvailableWidgets() {
		List<Widget> allWidgets = new ArrayList<Widget>();

		// Fetch all custom widgets and add it to list
		allWidgets.addAll(CustomWidgets.getUserCustomWidgets());

		// Gets list of all configurable widgets.
		allWidgets.addAll(DefaultWidgets.getAvailableDefaultWidgets());

		setIsAddedStatus(allWidgets);
		System.out.println("In get available widgets");
		System.out.println(allWidgets);

		return allWidgets;
	}

	/**
	 * Gets the list of configured widgets of current user.
	 * 
	 * @param widgets
	 *            {@link List} of {@link Widget}
	 * @return {@link List} of {@link Widget}
	 */
	public static List<Widget> setIsAddedStatus(List<Widget> widgets) {

		// Getting the list widget saved by the current user.
		List<Widget> currentWidgets = getAddedWidgetsForCurrentUser();
		AgileUser agileUser = AgileUser.getCurrentAgileUser();
		DomainUser dmu = agileUser.getDomainUser();

		for (Widget widget : widgets) {
			for (Widget currentWidget : currentWidgets) {
				if (currentWidget.name.equals(widget.name)) {
					if (dmu.is_admin) {
						JSONArray currentUsers = new JSONArray();

						String userID = agileUser.id.toString();
						String oldUsersArrayStr = currentWidget.listOfUsers;
						JSONArray userArray = WidgetUtil.getWigetUsersList(widget.name);
						boolean removeAdmin = false;
						
						if(oldUsersArrayStr == null){							
							currentUsers.put(userID);
						}else if(!(oldUsersArrayStr.contains(userID))){
							removeAdmin = true;
						}
						
						for (int i = 0; i < userArray.length(); i++) {
							try {
								String tempID = userArray.getString(i);
								if (!(removeAdmin && tempID.equals(userID))) {
									currentUsers.put(userArray.getLong(i));
								}
							} catch (JSONException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
						}

						widget.listOfUsers = currentUsers.toString();
						currentWidget.listOfUsers = currentUsers.toString();
						//currentWidget.save();
					}
					// Setting true to know that widget is configured.
					widget.is_added = true;
					widget.id = currentWidget.id;
					widget.prefs = currentWidget.prefs;
					widget.script_type = currentWidget.script_type;
					if(widget.widget_type.equals(WidgetType.CUSTOM)){
						if(widget.script_type == null){
							if(widget.script != null){
								widget.script_type = "script";
							}else {
								widget.script_type = "url";
							}
						}
					}
				}
			}
		}
		return widgets;
	}

	/**
	 * Gets all the widget of the current user.
	 * 
	 * <p>
	 * Default widgets - which are added and Custom widgets - which are added
	 * </p>
	 * 
	 * @return {@link List} of {@link Widget}s
	 */
	public static List<Widget> getAddedWidgetsForCurrentUser() {
		Objectify ofy = ObjectifyService.begin();

		// Creates Current AgileUser key
		Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
				AgileUser.getCurrentAgileUser().id);

		/*
		 * Fetches list of widgets related to AgileUser key and adds is_added
		 * field as true to default widgets if not present
		 */
		List<Widget> widgets = ofy.query(Widget.class).ancestor(userKey)
				.filter("widget_type !=", WidgetType.INTEGRATIONS).list();

		for (int i = 0; i < widgets.size(); i++) {
			Widget widget = widgets.get(i);
			if (WidgetType.EMAIL.equals(widget.widget_type)) {
				System.out
						.println("Converting widget type email to integrations...");

				widget.widget_type = WidgetType.INTEGRATIONS;
				widget.save();

				// Remove from list
				widgets.remove(widget);

				break;
			}
		}

		return widgets;
	}

	/**
	 * Gets all the widget of the current user.
	 * 
	 * <p>
	 * Default widgets - which are added and Custom widgets - which are added
	 * </p>
	 * 
	 * @return {@link List} of {@link Widget}s
	 */
	public static List<Widget> getActiveWidgetsForCurrentUser() {
		List<Widget> finalWidgets = new ArrayList<Widget>();

		AgileUser agileuser = AgileUser.getCurrentAgileUser();

		if (agileuser != null) {
			DomainUser domainUser = agileuser.getDomainUser();

			// Creates Current AgileUser key
			Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
					agileuser.id);

			/*
			 * Fetches list of widgets related to AgileUser key and adds
			 * is_added field as true to default widgets if not present
			 */
			Objectify ofy = ObjectifyService.begin();
			List<Widget> widgets = ofy.query(Widget.class).ancestor(userKey)
					.filter("widget_type !=", WidgetType.INTEGRATIONS).list();
			if (domainUser != null && domainUser.is_admin) {
				String userID = agileuser.id.toString();
				if (widgets != null) {					
					for (int i = 0; i < widgets.size(); i++) {						
						Widget widget = widgets.get(i);		
						if (widget.listOfUsers != null && userID != null) {
							if(widget.listOfUsers.contains(userID)){
								finalWidgets.add(widget);
							}
						}else{
							finalWidgets.add(widget);
						}
					}
				}
			}else{
				finalWidgets = widgets;
			}
		}

		return finalWidgets;
	}

	/**
	 * Gets the widget of current user based on widget id.
	 * 
	 * @param id
	 *            {@link Long}, widget id
	 * @return {@link Widget}
	 */
	public static Widget getWidget(Long id) {
		try {
			// Retrieves current AgileUser key
			Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
					AgileUser.getCurrentAgileUser().id);

			// Gets Widget key based on id and AgileUser Key
			Key<Widget> widgetKey = new Key<Widget>(userKey, Widget.class, id);

			// Returns widget based on widget key created.
			return dao.get(widgetKey);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Get the widget based on the name and type.
	 * 
	 * @param name
	 *            - widget name
	 * @param widgetType
	 *            - widget type
	 * @return
	 */
	public static Widget getWidgetByNameAndType(String name,
			IntegrationType inegrationType) {
		Map<String, Object> conditionsMap = new HashMap<String, Object>();

		conditionsMap.put("name", name);
		conditionsMap.put("integration_type", inegrationType);

		return dao.getByProperty(conditionsMap);
	}

	/**
	 * Gets the widget of current user based on the widget name.
	 * 
	 * @param name
	 *            {@link String}. Name of the widget
	 * @return {@link Widget}
	 */
	public static Widget getWidget(String name) {
		try {
			System.out.println("In get widget bu name ");

			// Getting the widget based on widget name and current user id.
			return getWidget(name, AgileUser.getCurrentAgileUser().id);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * @author prakash To get added widget with itegation type
	 * 
	 * 
	 * @param name
	 *            {@link Integration type}. Type of the widget
	 * @return {@link Widget}
	 */
	public static List<Widget> getWidget(WidgetType type) {
		try {
			System.out.println("In get widget by type ");

			// Getting the widget based on widget name and current user id.
			return getWidget(type, AgileUser.getCurrentAgileUser().id);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * @author - prakash Gets the widget based on the widget type and user id.
	 * 
	 * @param name
	 *            {@link Integration type}. Type of the widget
	 * @param agileUserId
	 *            {@link Long} agile user id
	 * @return {@link Widget}
	 */
	public static List<Widget> getWidget(WidgetType type, Long agileUserId) {
		try {
			Objectify ofy = ObjectifyService.begin();

			// Gets the Current AgileUser key to query on widgets
			Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
					agileUserId);

			// Queries on widget name, with current AgileUser Key
			return ofy.query(Widget.class).ancestor(userKey)
					.filter("widget_type", type).list();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Gets the widget based on the widget name and user id.
	 * 
	 * @param name
	 *            {@link String}. Name of the widget
	 * @param agileUserId
	 *            {@link Long} agile user id
	 * @return {@link Widget}
	 */
	public static Widget getWidget(String name, Long agileUserId) {
		try {
			Objectify ofy = ObjectifyService.begin();

			// Gets the Current AgileUser key to query on widgets
			Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
					agileUserId);

			// Queries on widget name, with current AgileUser Key
			return ofy.query(Widget.class).ancestor(userKey)
					.filter("name", name).get();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public static JSONArray getWigetUsersList(String name) {
		JSONArray userIDs = new JSONArray();
		String domain = NamespaceManager.get();
		System.out.println("*** domain " + domain);

		// if(domain != null){
		List<DomainUser> users = DomainUserUtil.getUsers(domain);
		for (DomainUser dUser : users) {
			AgileUser aUser = AgileUser
					.getCurrentAgileUserFromDomainUser(dUser.id);
			if (aUser != null) {
				Widget userWidget = WidgetUtil.getWidget(name, aUser.id);
				if (userWidget != null) {
					userIDs.put(aUser.id);
				}
			}
		}
		// }

		return userIDs;
	}

	public static List<Widget> getWigetUserListByAdmin(String name) {
		try {
			Objectify ofy = ObjectifyService.begin();

			// Queries on widget name, with current AgileUser Key
			return ofy.query(Widget.class).filter("name", name)
					.filter("add_by_admin", true).list();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Gets the widget based on the widget name and user id.
	 * 
	 * @param name
	 *            {@link String}. Name of the widget
	 * @param agileUserId
	 *            {@link Long} agile user id
	 * @return {@link Widget}
	 */
	public static Widget getCustomWidget(String name, Long agileUserId) {
		try {
			Objectify ofy = ObjectifyService.begin();

			// Gets the Current AgileUser key to query on widgets
			Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
					agileUserId);

			// Queries on widget name, with current AgileUser Key
			return ofy.query(CustomWidget.class).ancestor(userKey)
					.filter("name", name).get();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Removes the widget for all the users based on the widget name.
	 * 
	 * @param name
	 *            name of the {@link Widget}
	 */
	public static void removeWidgetForAllUsers(String name) {
		dao.deleteKeys(dao.listKeysByProperty("name", name));
	}

	public static void deleteWidget(String id, String name) {
		Objectify ofy = ObjectifyService.begin();

		// Creates Current AgileUser key
		Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, id);

		/*
		 * Fetches list of widgets related to AgileUser key and adds is_added
		 * field as true to default widgets if not present
		 */
		List<Widget> widgets = ofy.query(Widget.class).ancestor(userKey)
				.filter("name", name).list();
		for (Widget widget : widgets) {
			widget.delete();
		}
	}

	public static void deleteWidgetByUserID(String id, String name) {
		Objectify ofy = ObjectifyService.begin();

		// Creates Current AgileUser key
		AgileUser agileUser = AgileUser.getCurrentAgileUser(Long.parseLong(id));
		if (agileUser != null) {
			Key<AgileUser> userKey = AgileUser
					.getCurrentAgileUserKeyFromDomainUser(agileUser.domain_user_id);

			/*
			 * Fetches list of widgets related to AgileUser key and adds
			 * is_added field as true to default widgets if not present
			 */
			List<Widget> widgets = ofy.query(Widget.class).ancestor(userKey)
					.filter("name", name).list();
			for (Widget widget : widgets) {
				widget.delete();
			}
		}
	}

	/**
	 * 
	 * 
	 * @param name
	 */
	public static void removeCurrentUserCustomWidget(String name) {
		Objectify ofy = ObjectifyService.begin();

		// Creates Current AgileUser key
		Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
				AgileUser.getCurrentAgileUser().id);

		/*
		 * Fetches list of widgets related to AgileUser key and adds is_added
		 * field as true to default widgets if not present
		 */
		List<CustomWidget> widgets = ofy.query(CustomWidget.class)
				.ancestor(userKey).filter("name", name).list();

		for (CustomWidget customWidget : widgets) {
			// check if widget is custom widget and delete it.
			if (WidgetType.CUSTOM == customWidget.widget_type) {
				customWidget.delete();
			}
		}
	}

	/**
	 * Check the widget is exists/not based on the widget name.
	 * 
	 * @param name
	 * @return
	 */
	public static boolean checkIfWidgetNameExists(String name) {
		if (name == null)
			return false;

		for (Widget defaultWidget : DefaultWidgets.getAvailableDefaultWidgets())
			if (defaultWidget.name.equals(name))
				return true;

		if (CustomWidgets.getCount("name", name) != 0)
			return true;

		return false;
	}

	/**
	 * Gets a list of integrations which are a part of widgets in datastore. If
	 * there is none, a temporary widget is created inorder to iniatilse the
	 * template. Refer setting-web-to-lead.html
	 * 
	 * @return
	 */
	public static List<Widget> getIntegrationGateways() {

		Objectify ofy = ObjectifyService.begin();

		List<Widget> listOfIntegrations = ofy.query(Widget.class)
				.filter("widget_type", "INTEGRATIONS").list();

		// For current Users
		listOfIntegrations.addAll(ofy.query(Widget.class)
				.filter("widget_type", WidgetType.EMAIL).list());

		return listOfIntegrations;
	}
}