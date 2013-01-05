package com.agilecrm.filter.util;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RedirectUtil
{

    public static final String LOGIN_RETURN_PATH_SESSION_PARAM_NAME = "redirect_uri_on_login";

    public static void redirecTotURIOnLogin(HttpServletRequest request,
	    HttpServletResponse response)
    {
	String redirect = (String) request.getSession().getAttribute(
		LOGIN_RETURN_PATH_SESSION_PARAM_NAME);

	if (redirect != null)
	    request.getSession().removeAttribute(
		    LOGIN_RETURN_PATH_SESSION_PARAM_NAME);
	else
	    redirect = "/";

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
