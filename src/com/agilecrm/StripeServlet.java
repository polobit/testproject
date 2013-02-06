package com.agilecrm;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class StripeServlet extends HttpServlet
{

    public void service(HttpServletRequest request, HttpServletResponse response)
	    throws IOException
    {

	String state = request.getParameter("state");

	System.out.println("state" + state);

	String code = request.getParameter("code");

	System.out.println(code);

	response.sendRedirect("https://" + state + ".agilecrm.com/scribe?code="
		+ code);

    }
}