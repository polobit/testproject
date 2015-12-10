package com.agilecrm.core.api.widgets;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.social.FacebookUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.ExceptionUtil;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * <code>FacebookWidgetsApi</code> class includes REST calls to interact with
 * {@link FacebookUtil} class
 * 
 * <p>
 * It is called from client side for retrieving Facebook contacts details
 * </p>
 * 
 * @author Rajitha Arelli
 * @since June 2014
 * 
 */
@Path("/api/widgets/facebook")
public class FacebookWidgetsApi {

	String errorMessage = "Authentication Error. Please reconfigure your Facebook widget.";

	/**
	 * Contacts to Facebook and search facebook profiles based on user name
	 * 
	 * @param widgetId
	 * @param firstname
	 * @return JSONObject
	 */
	@Path("contacts/{widget-id}")
	@GET
	@Produces(MediaType.TEXT_PLAIN + "; charset=UTF-8;")
	public JSONObject getFacebookUsersDetails(
			@PathParam("widget-id") Long widgetId,
			@QueryParam("searchKey") String firstname) {
		System.out.println("am in FacebookWidgetsApi");
		// Retrieves widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget != null) {
			// Calls FacebookUtil method to retrieve customer details
			try {
				FacebookUtil facebookUtil = new FacebookUtil(
						Globals.FACEBOOK_APP_ID, Globals.FACEBOOK_APP_SECRET,
						widget.getProperty("token"));

				return facebookUtil.searchContactsByName(firstname);
			} catch (Exception e) {
				throw ExceptionUtil.catchWebException(e);
			}
		}
		return null;
	}

	/**
	 * Get facebook profile base on userid
	 * 
	 * @param widgetId
	 * @param id
	 * @return JSONObject
	 */
	@Path("userProfile/{widget-id}/{id}")
	@GET
	@Produces(MediaType.TEXT_PLAIN + "; charset=UTF-8;")
	public JSONObject getFacebookUserById(
			@PathParam("widget-id") Long widgetId, @PathParam("id") String id) {
		System.out.println("am in getFacebookUserById");
		// Retrieves widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget != null) {
			// Calls StripePluginUtil method to retrieve customer details
			try {
				FacebookUtil facebookUtil = new FacebookUtil(
						Globals.FACEBOOK_APP_ID, Globals.FACEBOOK_APP_SECRET,
						widget.getProperty("token"));
				JSONObject res = facebookUtil.getFacebookProfileById(id);
				System.out.println(res);
				return res;
			} catch (Exception e) {
				throw ExceptionUtil.catchWebException(e);
			}
		}
		return null;
	}

	/**
	 * gives Facebook Current user
	 * 
	 * @param widgetId
	 * @param id
	 * @return String
	 */
	@Path("currentUserProfile/{widget-id}")
	@GET
	@Produces(MediaType.TEXT_PLAIN + "; charset=UTF-8;")
	public String getFacebookCurrentUser(@PathParam("widget-id") Long widgetId) {
		System.out.println("currentUserProfile");
		// Retrieves widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget != null) {
			// Calls StripePluginUtil method to retrieve customer details
			try {
				FacebookUtil facebookUtil = new FacebookUtil(
						Globals.FACEBOOK_APP_ID, Globals.FACEBOOK_APP_SECRET,
						widget.getProperty("token"));
				return facebookUtil.getFacebookCurrentUser();
			} catch (Exception e) {
				throw ExceptionUtil.catchWebException(e);
			}
		}
		return null;
	}

}