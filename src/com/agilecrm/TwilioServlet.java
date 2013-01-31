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
import com.google.appengine.api.NamespaceManager;

public class TwilioServlet extends HttpServlet
{

    public void service(HttpServletRequest request, HttpServletResponse response)
	    throws IOException
    {

	String accountSid = request.getParameter("AccountSid");
	System.out.println(accountSid);

	String state = request.getParameter("state");
	String url = state.split(",")[0];
	String widgetId = state.split(",")[1];

	System.out.println("state : " + state);
	System.out.println("url : " + url);
	System.out.println("widgetId" + widgetId);

	String oldNamespace = NamespaceManager.get();
	String namespace = url.split("://")[1].split("\\.")[0];

	System.out.println(namespace);

	NamespaceManager.set(namespace);

	// Check if UserInfo is already there
	UserInfo userInfo = (UserInfo) request.getSession().getAttribute(
		SessionManager.AUTH_SESSION_COOKIE_NAME);

	if (userInfo != null)
	{
	    System.out.println("domain id : " + userInfo.getClaimedId());
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

	Widget widget = WidgetUtil.getWidget(Long.parseLong(widgetId));
	System.out.println(widget);

	if (widget == null)
	{
	    System.out.println("widget is null");
	    response.sendRedirect(url);
	    return;
	}

	widget.addProperty("token", accountSid);
	System.out.println(widget);
	widget.save();

	NamespaceManager.set(oldNamespace);
	response.sendRedirect(url);

    }
}