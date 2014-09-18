/**
 * 
 */
package com.thirdparty.shopify;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.sync.Type;
import com.agilecrm.widgets.Widget;
import com.thirdparty.google.ContactPrefs;

/**
 * @author Jitendra
 * 
 */
public class ShopifyServlet extends HttpServlet
{

    public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException
    {
	String token = req.getParameter("code");

	String redirectUrl = "/#sync/shopify";
	String type = (String) req.getSession().getAttribute("type");

	if (token != null)
	{
	    if (type.equalsIgnoreCase("widget"))
	    {
		String id = saveWidgetPref(req, token);
		if (id != null)
		{

		    redirectUrl = "#Shopify/" + id;
		}
	    }
	    else
	    {
		saveToken(req, token);
	    }
	    res.sendRedirect(redirectUrl);

	}
    }

    /**
     * save sync preferences
     * 
     * @param req
     * @param token
     */
    private void saveToken(HttpServletRequest req, String token)
    {
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
    {
	Widget shopifyWidget = new Widget();
	String shop = req.getParameter("shop");
	shop = shop + ".myshopify.com";
	JSONObject prefs = new JSONObject();
	try
	{
	    prefs.put("widget_type", Widget.WidgetType.BILLING);
	    prefs.put("token", token);
	    prefs.put("shop", shop);
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}
	shopifyWidget.prefs = prefs.toString();
	shopifyWidget.save();
	if (shopifyWidget.id != null)
	{
	    return shopifyWidget.id.toString();
	}
	return null;

    }
}
