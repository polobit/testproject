package com.agilecrm.filter.util;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RedirectUtil
{
    public static void redirectURIFromSession(HttpServletRequest request,
	    HttpServletResponse response, String session_attribute)
    {
	String redirect = (String) request.getSession().getAttribute(
		session_attribute);

	if (redirect == null)
	{
	    redirect = "/";
	}
	else
	    request.getSession().removeAttribute(session_attribute);

	try
	{
	    response.sendRedirect(redirect);
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }
}
