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
import com.agilecrm.widgets.util.DefaultWidgets;
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

	String callback = (String) req.getSession().getAttribute("url");

	if (token != null)
	{
	    if (callback.equalsIgnoreCase("shopify"))
	    {
		String id = saveWidgetPref(req, token);
		if (id != null)
		{

		    res.sendRedirect("/#Shopify/shopify");
		    return ;
		}
	    }
	    else
	    {
		saveToken(req, token);
		res.sendRedirect("/#sync/shopify");
		return ;
	    }

	}
	return ;
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
	Widget shopifyWidget = DefaultWidgets.getDefaultWidgetByName("Shopify");
	if (shopifyWidget != null)
	{
	    String shop = req.getParameter("shop");
	    shop = shop + ".myshopify.com";
	    shopifyWidget.addProperty("token", token);
	    shopifyWidget.addProperty("shop", shop);
	    shopifyWidget.save();
	}
	return shopifyWidget.id.toString();

    }
}
