package com.agilecrm;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

	String[] params = state.split(",");
	String url = params[0];
	String id = params[1];

	NamespaceManager.set(state);
	Widget widget = WidgetUtil.getWidget("Twilio");
	widget.addProperty("token", accountSid);
	System.out.println(widget.toString());
	widget.save();
	NamespaceManager.set(oldNamespace);

	response.sendRedirect("https://" + url + "/#contacts/" + id);

	// response.sendRedirect("http://example.com/myapp");
    }
}