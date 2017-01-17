package com.agilecrm.widgets.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

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
					String userID = agileUser.id.toString();
					
					// Removing the custom widget if it was already saved in the widget entity.
					if(currentWidget instanceof CustomWidget){
						Widget tempWidget = WidgetUtil.getWidget(widget.name, agileUser.id);
						if(tempWidget != null){
							widgets.remove(widget);
							continue;
						}
					}					
					
					// Setting true to know that widget is configured.
					widget.is_added = true;
					widget.id = currentWidget.id;
					widget.prefs = currentWidget.prefs;
					widget.script_type = currentWidget.script_type;
					widget.url = currentWidget.url;
					widget.script = currentWidget.script;
					widget.listOfUsers = currentWidget.listOfUsers;
					
					//To support the old custom widget and to get the logo URLs, script and webhook URLs. 
					if(widget.widget_type.equals(WidgetType.CUSTOM)){
						Widget customWidget = null;
						
						if(widget.script_type == null){							
							if(widget.script != null && widget.script.length() != 0){
								widget.script_type = "script";
							}else {
								widget.script_type = "url";
								// Adding webhook URL by fetching from custom widget if missing.								
								if(widget.url == null || widget.url.length() == 0){									
										customWidget = WidgetUtil.getCustomWidget(currentWidget.name, Long.parseLong(userID));
										if(customWidget != null){
											widget.url = customWidget.url;
										}
								}
							}					
							widget.save();
						}	
						
						// Fix for mini logo url is missing.
						if(widget.mini_logo_url == null || widget.mini_logo_url.length() == 0){
							if(customWidget == null){
								customWidget = WidgetUtil.getCustomWidget(currentWidget.name, Long.parseLong(userID));									
							}							
							
							if(customWidget != null){
								widget.mini_logo_url = customWidget.mini_logo_url;
								widget.save();
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
		List<Widget> widgets = ofy.query(Widget.class).ancestor(userKey).filter("widget_type !=", WidgetType.INTEGRATIONS).list();

		//Converting widget type email to integrations.
		for (int i = 0; i < widgets.size(); i++) {
			Widget widget = widgets.get(i);
			if (WidgetType.EMAIL.equals(widget.widget_type)) {
				System.out.println("Converting widget type email to integrations...");
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
			Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, agileuser.id);

			/*
			 * Fetches list of widgets related to AgileUser key and adds
			 * is_added field as true to default widgets if not present
			 */
			Objectify ofy = ObjectifyService.begin();
			List<Widget> widgets = ofy.query(Widget.class).ancestor(userKey).filter("widget_type !=", WidgetType.INTEGRATIONS).list();
			
			if (domainUser != null && domainUser.is_admin) {				
				if (widgets != null) {					
					for (int i = 0; i < widgets.size(); i++) {						
						Widget widget = widgets.get(i);								
						if(widget.isActive){
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

	public static JSONArray getWigdetsActiveUsersList(String name) {
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
				if (userWidget != null && userWidget.isActive) {
					userIDs.put(aUser.id);
				}
			}
		}
		// }

		return userIDs;
	}

	public static List<JSONObject> getWigdetsObjectList(String name) {
		List<JSONObject> userList = new ArrayList<JSONObject>();
		String domain = NamespaceManager.get();
		System.out.println("*** domain " + domain);

		// if(domain != null){
		List<DomainUser> users = DomainUserUtil.getUsers(domain);
		
		for (DomainUser dUser : users) {
			AgileUser aUser = AgileUser.getCurrentAgileUserFromDomainUser(dUser.id);
			if (aUser != null) {
				Widget userWidget = WidgetUtil.getWidget(name, aUser.id);
				if (userWidget != null) {
					JSONObject obj = new JSONObject();
					try {
						obj.put("userID", aUser.id);
						obj.put("isActive", userWidget.isActive);
						obj.put("addBy", userWidget.add_by);
						obj.put("isAdminUser", dUser.is_admin);
						userList.add(obj);
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}				
				}
			}
		}
		// }

		return userList;
	}
	
	public static List<Widget> getActiveWidgetsByName(String name) {
		try {
			Objectify ofy = ObjectifyService.begin();

			// Queries on widget name, with current AgileUser Key
			return ofy.query(Widget.class).filter("name", name).filter("isActive",true).list();
			
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	public static List<Widget> getWigetUserListByAdmin(String name, Long agileUserID) {
		try {
			Objectify ofy = ObjectifyService.begin();

			// Queries on widget name, with current AgileUser Key
			return ofy.query(Widget.class).filter("name", name)
					.filter("add_by", agileUserID).list();
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
	
	public static void updateWidgetStatus(String id, String name, boolean status) {
		Objectify ofy = ObjectifyService.begin();

		// Creates Current AgileUser key
		AgileUser agileUser = AgileUser.getCurrentAgileUser(Long.parseLong(id));
		if (agileUser != null) {
			Key<AgileUser> userKey = AgileUser.getCurrentAgileUserKeyFromDomainUser(agileUser.domain_user_id);

			/*
			 * Fetches list of widgets related to AgileUser key and adds
			 * is_added field as true to default widgets if not present
			 */
			Widget widget = ofy.query(Widget.class).ancestor(userKey).filter("name", name).get();
			if(widget != null){
				widget.isActive = status;
				widget.save();
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
		
		
		if (WidgetUtil.getWidgetCount("name", name) != 0)
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
	
	public static int getWidgetCount(String propertyName, Object propertyValue) {
		ObjectifyGenericDao<Widget> widgetDao = new ObjectifyGenericDao<Widget>(Widget.class);
		return widgetDao.getCountByProperty(propertyName, propertyValue);
	}
	
	/**
	 * Check widgets limit
	 * exclude INTEGRATION and CUSTOM widget_type
	 * 
	 * if any user having more widgets than limit returns 'count' other wise returns '0'
	 * @return
	 */
	public static int checkForDowngrade(int limit, List<AgileUser> users){
		int widgetCount = 0;
		ObjectifyGenericDao<Widget> widgetDao = new ObjectifyGenericDao<Widget>(Widget.class);
		for(AgileUser agileUser : users){
			widgetCount = widgetDao.ofy().query(Widget.class).ancestor(new Key<AgileUser>(AgileUser.class, agileUser.id)).filter("widget_type !=", WidgetType.INTEGRATIONS).filter("widget_type !=", WidgetType.CUSTOM).count();
			if(widgetCount > limit)
				return widgetCount;
		}
		return widgetCount;
	}
	
}