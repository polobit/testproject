package com.agilecrm.plugin.oauth;

import java.io.IOException;
import java.net.URL;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.DefaultWidgets;

/**
 * <code>TwilioServlet</code> handles OAuth request from Twilio server
 * 
 * @author Tejaswi
 * 
 */
@SuppressWarnings("serial")
public class TwilioServlet extends HttpServlet
{

    /**
     * This method is called after Twilio OAuth. Request returns along with the
     * authenticated account SID and hits the main server with state parameter
     * which specifies where the request has to be returned
     */
    public void service(HttpServletRequest request, HttpServletResponse response)
	    throws IOException
    {

	/*
	 * This parameter specifies the path from where the request is made and
	 * helps us to redirect there after saving widget preferences
	 */
	String state = request.getParameter("state");
	System.out.println("Twilio state after OAuth " + state);

	URL url = new URL(state);

	// Extract the NameSpace from state
	String nameSpace = NamespaceUtil.getNamespaceFromURL(url);

	System.out.println("Twilio NameSpace after OAuth " + nameSpace);

	String sessionAttribute = request.getParameter("from_domain");
	if (sessionAttribute == null)
	{
	    // Get query string from request
	    String queryString = request.getQueryString();
	    System.out.println("Redirecting to domain page: " + "https://"
		    + nameSpace
		    + ".agilecrm.com/auth/TwilioServlet?from_domain=true&"
		    + queryString);
	    response.sendRedirect("https://" + nameSpace
		    + ".agilecrm.com/auth/TwilioServlet?from_domain=true&"
		    + queryString);
	    return;
	}

	/*
	 * Retrieve account SID of the authenticated Twilio account, which is to
	 * be saved in widget preferences to make calls from it
	 */
	String accountSid = request.getParameter("AccountSid");


	Widget widget = DefaultWidgets.getDefaultWidgetByName("Twilio");
	
	System.out.println("widget" + widget);
	
	// if widget not found for Twilio, redirect without saving to state
	if (widget == null)
	{
	    System.out.println("widget not foun : " + state);
	    response.sendRedirect(state);
	    return;
	}

	/*
	 * If widget found save prefrences and redirect to the path specified by
	 * state parameter
	 */
	widget.addProperty("account_sid", accountSid);
	widget.save();

	System.out.println("widget saved " + widget.toString());
	System.out.println("Redirected to: " + state);
	response.sendRedirect(state);

    }
}