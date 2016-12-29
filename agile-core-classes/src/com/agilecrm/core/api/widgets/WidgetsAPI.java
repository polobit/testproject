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
import com.agilecrm.social.KnowlarityUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.widgets.CustomWidget;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.Widget.WidgetType;
import com.agilecrm.widgets.util.CustomWidgets;
import com.agilecrm.widgets.util.WidgetUtil;
import com.googlecode.objectify.Key;
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
			if (widget.widget_type == WidgetType.CUSTOM) {
				widget.display_name = widget.name;
				widget.name = widget.name.replaceAll("[^a-zA-Z]+", "");
				if (WidgetUtil.checkIfWidgetNameExists(widget.name)) {
					return null;
				}
			}

			JSONObject jsonObject = WidgetsAPI.checkValidDetails(widget);

			AgileUser agileUser = AgileUser.getCurrentAgileUser();
			if (agileUser != null) {
				Key<AgileUser> currentUser = new Key<AgileUser>(
						AgileUser.class, agileUser.id);
				widget.setOwner(currentUser);
				if (jsonObject != null) {
					widget.prefs = jsonObject.toString();
				}
				widget.save();
				return widget;
			}
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
	public Widget createCustomWidget(Widget widget) {
		System.out.println("In custom widgets api create");
		if (widget != null) {
			if (widget.widget_type == WidgetType.CUSTOM) {
				widget.display_name = widget.name;
				widget.name = widget.name.replaceAll("[^a-zA-Z]+", "");
				if (WidgetUtil.checkIfWidgetNameExists(widget.name)) {
					return null;
				}
			}

			widget.save();
			widget.is_added = true;
			return widget;
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

			// if (widget.widget_type == WidgetType.CUSTOM) {
			// widget.display_name = widget.name;
			// widget.name = widget.name.replaceAll("[^a-zA-Z]+", "");
			// if (WidgetUtil.checkIfWidgetNameExists(widget.name) > 1) {
			// return null;
			// }
			// }

			AgileUser agileUser = AgileUser.getCurrentAgileUser();
			if (agileUser != null) {
				Key<AgileUser> currentUser = new Key<AgileUser>(
						AgileUser.class, agileUser.id);
				widget.setOwner(currentUser);
				widget.save();
				return widget;
			}
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
			try {
				CustomWidget.deleteCustomWidget(widget_name);
			} catch (Exception e) {
				e.printStackTrace();
			}
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
	public void savePositions(List<Widget> widgets) {
		if (widgets != null) {
			// UI sends only ID and Position
			for (Widget widget : widgets) {
				Widget fullWidget = WidgetUtil.getWidget(widget.id);
				System.out.println(fullWidget);
				fullWidget.position = widget.position;
				Widget.save(fullWidget);
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

		Widget customWidget = WidgetUtil.getWidget(widget_name);
		if (customWidget == null || customWidget.url == null
				|| customWidget.url.length() == 0) {
			customWidget = CustomWidgets.getCustomWidget(widget_name);
		}
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
	    
		//Adding sms widgets if Plivo or twilio is there
		/*Widget widget = SMSGatewayUtil.getSMSGatewayWidgetForSMS();
		if(widget !=null)
			widgets.add(widget);*/
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
	public String saveWidgetPrivilages(String obj) throws Exception {
		List<String> finalUserList = new ArrayList<String>();
		if (obj != null) {
			// Gets current agile user.
			AgileUser agileUser = AgileUser.getCurrentAgileUser();
			Long agileUserID = agileUser.id;
			// Gets the current domain user.
			DomainUser domainUser = agileUser.getDomainUser();
			if (domainUser.is_admin) {

				JSONObject widgetObj = new JSONObject(obj);
				String widgetName = widgetObj.getString("name");

				// Checked users list from widget.
				String newUsersStr = widgetObj.getString("listOfUsers");
				JSONArray newUserArray = new JSONArray(newUsersStr);

				// Fetching user ids from the DB to know who are already
				// configured.
				JSONArray oldUserArray = WidgetUtil
						.getWigdetsActiveUsersList(widgetName);
				String oldUsersStr = oldUserArray.toString();

				int newUserSize = newUserArray.length();
				int oldUserSize = oldUserArray.length();
				int loopSize = oldUserSize;

				if (newUserSize > oldUserSize) {
					loopSize = newUserSize;
				}

				for (int i = 0; i < loopSize; i++) {

					// Deleting widget.
					if (i < oldUserSize) {
						String oldUserID = oldUserArray.getString(i);
						// Checking to know the unchecked old users.
						if (!(newUsersStr.contains(oldUserID))) {
							AgileUser agileLocalUser = AgileUser
									.getCurrentAgileUser(Long
											.parseLong(oldUserID));
							DomainUser oldDomainUser = agileLocalUser
									.getDomainUser();
							Widget widget = WidgetUtil.getWidget(widgetName,
									agileLocalUser.id);
							if (widget != null) {
								if (oldDomainUser.is_admin) {
									// If the user is admin, we are making him
									// inactive.
									widget.updateStatus(false, agileUserID);
								} else {
									WidgetUtil.deleteWidgetByUserID(oldUserID,
											widgetName);
									// If it was custom widget we will delete
									// custom widget.
									if (widget.widget_type
											.equals(WidgetType.CUSTOM)) {
										CustomWidget
												.deleteCustomWidgetByUserID(
														oldUserID, widgetName);
									}
								}
							}
						} else {
							finalUserList.add(oldUserID);
						}
					}

					// Creating widget.
					if (i < newUserSize) {
						String newUserID = newUserArray.getString(i);
						// Checking to know the checked new users.
						if (!(oldUsersStr.contains(newUserID))) {
							AgileUser agileLocalUser = AgileUser
									.getCurrentAgileUser(Long
											.parseLong(newUserID));
							if (agileLocalUser != null) {
								Key<AgileUser> userKey = AgileUser
										.getCurrentAgileUserKeyFromDomainUser(agileLocalUser.domain_user_id);
								DomainUser localDomainUser = agileLocalUser
										.getDomainUser();

								// Making admin widget clone for new users.
								Widget widget = WidgetUtil.getWidget(
										widgetName, agileUser.id);

								if (widget == null) {
									Widget customwidget = WidgetUtil
											.getCustomWidget(widgetName,
													agileUser.id);
									widget = new Widget();
									widget.prefs = customwidget.prefs;
									widget.widget_type = Widget.WidgetType.CUSTOM;
									widget.logo_url = customwidget.logo_url;
									widget.mini_logo_url = customwidget.mini_logo_url;
									widget.description = customwidget.description;
									widget.display_name = customwidget.display_name;
									widget.name = customwidget.name;
									widget.fav_ico_url = customwidget.fav_ico_url;
									widget.integration_type = customwidget.integration_type;
									widget.script = customwidget.script;
									widget.script_type = customwidget.script_type;
									widget.url = customwidget.url;
									widget.add_by = agileUserID;
									widget.isActive = false;
									widget.id = null;
									Key<AgileUser> adminUserKey = AgileUser
											.getCurrentAgileUserKeyFromDomainUser(agileUser.domain_user_id);
									widget.saveByUserKey(adminUserKey, widget);
								}

								if (localDomainUser != null
										&& localDomainUser.is_admin) {
									Widget adminWidget = WidgetUtil.getWidget(
											widgetName, agileLocalUser.id);
									if (adminWidget != null) {
										adminWidget.updateStatus(true,
												agileUserID);
										continue;
									}
								}
								widget.add_by = agileUserID;
								widget.isActive = true;
								widget.id = null;
								widget.saveByUserKey(userKey, widget);
							}
						} else {
							finalUserList.add(newUserID);
						}
					}
				}
			}
		}
		return finalUserList.toString();
	}

	@Path("getWidgetUsersIds/{widget_id}/{widget_name}")
	@GET
	public String getWidgetUsersIds(@PathParam("widget_id") String widgetID,
			@PathParam("widget_name") String widgetName) throws Exception {
		String result = null;
		AgileUser agileUser = AgileUser.getCurrentAgileUser();
		DomainUser dmu = agileUser.getDomainUser();
		
		// Logic to find the admin user are active for widget or not.
		if (dmu.is_admin) {
			JSONArray userIdsJson = WidgetUtil.getWigdetsActiveUsersList(widgetName);
			result = userIdsJson.toString();			
		}		
		return result;
	}

	public static JSONObject checkValidDetails(Widget widget) throws Exception {
		JSONObject result = null;
		if (widget.name.equals("Braintree")) {
			JSONObject prefsObj = new JSONObject(widget.prefs);
			String merchantId = prefsObj.getString("merchant_id");
			String publicKey = prefsObj.getString("public_key");
			String privateKey = prefsObj.getString("private_key");
			BrainTreeUtil bUtil = new BrainTreeUtil(merchantId, publicKey,
					privateKey);
			JSONArray resultObj = bUtil.getTransactions("test@agilecrm.com");
		} else if (widget.name.equals("Uservoice")) {
			String prefs = widget.prefs;
			JSONObject prefsObj = new JSONObject(prefs);
			String API_KEY = prefsObj.getString("uv_api_key");
			String API_SECRET = prefsObj.getString("uv_secert_key");
			String domain = prefsObj.getString("uv_domain_name");
			UservoiceAPI uv = new UservoiceAPI(domain, API_KEY, API_SECRET);
		} 
//		else if (widget.name.equals("Knowlarity")) {
//			String prefs = widget.prefs;
//			KnowlarityUtil knowlarity = new KnowlarityUtil(prefs);
//			result = knowlarity.checkAgentIsValid();
//		  knowlarity.checkAgentIsValid();
//		}
		return result;
	}
}