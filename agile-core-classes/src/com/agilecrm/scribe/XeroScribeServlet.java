package com.agilecrm.scribe;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.agilecrm.scribe.util.ScribeUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * <code>XeroScribeServlet</code> is used to handle response return from plugin
 * url xero methods and save data in to back end.If widget with widgetId is
 * exist update that widget data and save.
 */
@SuppressWarnings("serial")
public class XeroScribeServlet extends HttpServlet {

	/** static variable for type xero */
	public static final String SERVICE_TYPE_XERO = "xero";

	/**
	 * Process the post request to servlet request, request can be sent either
	 * from application client or from service provider (After connecting to
	 * provider and returned). If request parameters have "oauth_token" and
	 * "oauth_verifier" then request is from provider with token keys which are
	 * saved in widget.
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doGet(req, resp);
	}

	/**
	 * Process the get request to servlet request, request can be sent either
	 * from application client or from service provider (After connecting to
	 * provider and returned). If request parameters have "oauth_token" and
	 * "oauth_verifier" then request is from provider with token keys which are
	 * saved in widget.
	 */

	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {

		Long widgetID = null;
		/**
		 * data return from xero contains accesstoken,tokensecret etc
		 */
		String data = req.getParameter("data");
		String isForAll = (String) req.getParameter("isForAll");
		System.out.println("isForAll " + isForAll);
		System.out.println("data is :" + data);

		String returnURL = (String) req.getSession().getAttribute("return_url");
		String resultType = "error";
		String statusMSG = "Error occurred while saving Xero widget";

		if (data != null) {
			System.out.println(data);
			try {
				widgetID = saveXeroPrefs(data, isForAll);
				if (widgetID != null) {
					System.out.println("return url " + returnURL);
					// If return URL is null, redirect to dashboard
					System.out.println(returnURL);
					if (returnURL == null) {
						returnURL = "/#Xero/" + widgetID;
					}
					resultType = "success";
					statusMSG = "Xero widget saved successfully.";
				} else {
					returnURL = "/#add-widgets";
				}
			} catch (Exception e) {
				returnURL = "/#add-widgets";
				statusMSG += " : " + e.getMessage();
			}

			req.getSession().setAttribute("widgetMsgType", resultType);
			req.getSession().setAttribute("widgetMsg", statusMSG);
			resp.sendRedirect(returnURL);

			// Delete return url Attribute
			req.getSession().removeAttribute("return_url");
		}
	}

	/**
	 * If service type is xero, we make a post request with the code and get the
	 * access token and saved into xero widgets
	 * 
	 * @param {@link HttpServletRequest}
	 * @param data
	 *            {@link String} code retrieved after OAuth
	 * @throws IOException
	 */
	public static Long saveXeroPrefs(String data, String isForAll)
			throws Exception {
		Long widgetID = null;
		System.out.println("In Xero save");

		/*
		 * Make a post request and retrieve tokens
		 */
		HashMap<String, String> properties = new ObjectMapper().readValue(data,
				new TypeReference<HashMap<String, String>>() {
				});
		properties.put("isForAll", isForAll);
		String widgetId = properties.get("widget_id");
		if (widgetId == null) {
			widgetID = ScribeUtil.saveWidgetPrefsByName(SERVICE_TYPE_XERO,
					properties);
		} else {
			Widget widget = WidgetUtil.getWidget(Long.parseLong(widgetId));
			if (widget != null) {
				properties.remove("widget_id");
				widgetID = ScribeUtil.saveWidgetPrefs(widget, properties);
			}
		}
		return widgetID;
	}
}
