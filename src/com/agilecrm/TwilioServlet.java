package com.agilecrm;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.datanucleus.util.StringUtils;

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
	System.out.println(state);
	String oldNamespace = NamespaceManager.get();
	String namespace = state.split("://")[1].split("\\.")[0];

	if (StringUtils.isEmpty(namespace))
	    return;

	NamespaceManager.set(namespace);
	Widget widget = WidgetUtil.getWidget("Twilio");
	widget.addProperty("token", accountSid);
	System.out.println(widget);
	widget.save();
	NamespaceManager.set(oldNamespace);

	response.sendRedirect(state);

    }

}