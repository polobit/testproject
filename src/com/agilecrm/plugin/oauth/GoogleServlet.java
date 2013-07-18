package com.agilecrm.plugin.oauth;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class GoogleServlet extends HttpServlet
{

    public void service(HttpServletRequest request, HttpServletResponse response)
	    throws IOException
    {

	String state = request.getParameter("state");

	System.out.println("state " + state);

	String code = request.getParameter("code");

	System.out.println(code);

	if (state != null)
	    response.sendRedirect(state + "?code=" + code);
	else
	    response.sendRedirect("https://agile-crm-cloud.appspot.com/scribe?code="
		    + code);
    }
}