package com.agilecrm;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;

public class TwilioVerificationServlet extends HttpServlet
{
    public void service(HttpServletRequest request, HttpServletResponse response)
	    throws IOException
    {

	/* Use this as the caller ID when making calls from a browser. */
	String verification_status = request.getParameter("VerificationStatus");

	// Check if UserInfo is already there
	UserInfo userInfo = (UserInfo) request.getSession().getAttribute(
		SessionManager.AUTH_SESSION_COOKIE_NAME);

	if (userInfo != null)
	{
	    try
	    {
		SessionManager.set((HttpServletRequest) request);
	    }
	    catch (ServletException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }

	}

	Widget widget = WidgetUtil.getWidget("Twilio");

	if (widget == null)
	{
	    return;
	}

	widget.addProperty("verificaton_status", verification_status);
	widget.save();

    }
}