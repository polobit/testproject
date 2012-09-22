package com.agilecrm;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class GoogleAppsServlet extends HttpServlet
{
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
	    throws IOException
    {

	// Get Apps Domain - hd
	String appsDomain = req.getParameter("hd");
	if (appsDomain == null)
	{
	    resp.getWriter().println("Error occurred. Invalid namespace.");
	    return;
	}

	System.out.println(appsDomain);
	String subdomain = appsDomain.split("\\.")[0];

	// Construct URL and redirect to login
	resp.sendRedirect("https://" + subdomain + ".agilecrm.com/login" + "?"
		+ req.getQueryString());
    }
}
