package com.agilecrm.util;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RegisterUtil
{
    /**
     * Gets OAuth domain name and returns its associated url
     * 
     * @param provider
     * @return url of the given domain name
     */
    public static String getOauthURL(String provider)
    {
	Map<String, String> openIdProviders = new HashMap<String, String>();
	openIdProviders.put("google", "www.google.com/accounts/o8/id");
	openIdProviders.put("yahoo", "me.yahoo.com");
	openIdProviders.put("myspace", "myspace.com");
	openIdProviders.put("aol", "aol.com");
	openIdProviders.put("myopenid.com", "stats.agilecrm.com");

	return openIdProviders.get(provider.toLowerCase());
    }

    public static boolean isWrongURL(HttpServletRequest request)
    {
	// Read Subdomain
	String subdomain = NamespaceUtil.getNamespaceFromURL(request.getServerName());

	if (subdomain != null && !"my".equals(subdomain) && request.getRequestURI().contains("/register"))
	{
	    return true;
	}

	return false;
    }

    public static void redirectToRegistrationpage(HttpServletRequest request, HttpServletResponse resp)
    {
	try
	{
	    resp.sendRedirect(VersioningUtil.getURL("my", request) + "register");
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }
}
