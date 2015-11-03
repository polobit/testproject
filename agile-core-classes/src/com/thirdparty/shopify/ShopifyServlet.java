/**
 * 
 */
package com.thirdparty.shopify;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.contact.sync.Type;
import com.agilecrm.scribe.util.ScribeUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.DefaultWidgets;
import com.thirdparty.google.ContactPrefs;

/**
 * @author Jitendra
 * 
 */
public class ShopifyServlet extends HttpServlet {

	public void doGet(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		String token = req.getParameter("code");

		String callback = (String) req.getSession().getAttribute("url");
		String returnURL = null;
		String widgetMsgType = "success";
		String widgetMsg = "Shopify widget saved successfully.";

		if (token != null) {
			if (callback.equalsIgnoreCase("shopify")) {
				// Saving the shopify widget.
				try {
					String widgetID = saveWidgetPref(req, token);
					if (widgetID != null) {
						returnURL = ("/#Shopify/" + widgetID);
					} else {
						widgetMsgType = "error";
						widgetMsg = "Error occured while saving shopify";
					}
				} catch (Exception e) {
					widgetMsgType = "error";
					widgetMsg = "Error occured while saving shopify : "
							+ e.getMessage();
				}
			} else {
				saveToken(req, token);
				returnURL = "/#sync/shopify";
				if (ScribeUtil.isWindowPopUpOpened("shopify", returnURL, req,
						res))
					;
				return;

			}
		}

		req.getSession().setAttribute("widgetMsgType", widgetMsgType);
		req.getSession().setAttribute("widgetMsg", widgetMsg);
		res.sendRedirect(returnURL);
	}

	/**
	 * save sync preferences
	 * 
	 * @param req
	 * @param token
	 */
	private void saveToken(HttpServletRequest req, String token) {
		String shop = req.getParameter("shop");
		shop = shop + ".myshopify.com";
		ContactPrefs prefs = new ContactPrefs();
		prefs.token = token;
		prefs.othersParams = shop;
		prefs.type = Type.SHOPIFY;
		prefs.save();
	}

	/**
	 * save widget preferences
	 * 
	 * @param req
	 * @param token
	 */
	private String saveWidgetPref(HttpServletRequest req, String token)
			throws Exception {
		Widget shopifyWidget = DefaultWidgets.getDefaultWidgetByName("Shopify");

		String temp = (String) req.getSession().getAttribute("isForAll");
		System.out.println("is for all " + temp);

		if (shopifyWidget != null) {
			String shop = req.getParameter("shop");
			shop = shop + ".myshopify.com";
			shopifyWidget.addProperty("token", token);
			shopifyWidget.addProperty("shop", shop);
			if (temp != null) {
				shopifyWidget.isForAll = Boolean.parseBoolean(temp);
				req.getSession().removeAttribute("isForAll");
			}
			shopifyWidget.save();
		}
		return shopifyWidget.id.toString();

	}
}
