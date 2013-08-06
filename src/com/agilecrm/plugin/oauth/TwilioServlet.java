package com.agilecrm.plugin.oauth;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.session.SessionManager;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.google.appengine.api.NamespaceManager;

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
	 * Retrieve account SID of the authenticated Twilio account, which is to
	 * be saved in widget preferences to make calls from it
	 */
	String accountSid = request.getParameter("AccountSid");

	/*
	 * This parameter specifies the path from where the request is made and
	 * helps us to redirect there after saving widget preferences
	 */
	String state = request.getParameter("state");
	System.out.println("Twilio state after OAuth " + state);

	// Extract the namespace from state
	String namespace = state.split("://")[1].split("\\.")[0];
	System.out.println("Twilio namespace after OAuth " + namespace);

	/*
	 * Set the namespace and set the session before saving widget
	 * preferences, so that preferences are saved in the current agile user
	 * account related to that namespace
	 */
	NamespaceManager.set(namespace);
	System.out.println("Namespace set in Twilio");

	try
	{
	    SessionManager.set(request);
	    System.out.println("Session set in Twilio");
	}
	catch (ServletException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	Widget widget = WidgetUtil.getWidget("Twilio");

	// if widget not found for Twilio, redirect without saving to state
	if (widget == null)
	{
	    response.sendRedirect(state);
	    return;
	}

	/*
	 * If widget found save prefrences and redirect to the path specified by
	 * state parameter
	 */
	widget.addProperty("account_sid", accountSid);
	widget.save();

	response.sendRedirect(state);

    }
}