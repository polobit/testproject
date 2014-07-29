/**
 * 
 */
package com.thirdparty.shopify;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.contact.sync.SyncClient;
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

	String redirectUrl = "/#google-apps";

	if (token != null)
	{
	    saveToken(req, token);
	    res.sendRedirect(redirectUrl);
	}
    }

    private void saveToken(HttpServletRequest req, String token)
    {
	String shop = req.getParameter("shop");
	shop = shop + ".myshopify.com";
	ContactPrefs prefs = new ContactPrefs();
	prefs.token = token;
	prefs.othersParams = shop;
	prefs.client = SyncClient.SHOPIFY;
	prefs.save();
    }
}
