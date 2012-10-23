package com.agilecrm.filter;

import java.io.IOException;
import java.util.Arrays;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.Globals;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.google.appengine.api.NamespaceManager;

/*
 *  Filter set the namespace. If the url is incorrect - it will forward to choose domain page
 */
public class NamespaceFilter implements Filter
{
    private boolean setNamespace(ServletRequest request,
	    ServletResponse response)
    {
	// Reset the thread local
	SessionManager.set((UserInfo) null);

	// Return if already set
	if (NamespaceManager.get() != null)
	    return true;

	// If Localhost - just return
	if (request.getServerName().equalsIgnoreCase("localhost")
		|| request.getServerName().equalsIgnoreCase("127.0.0.1"))
	{
	    return true;
	}

	// Read Subdomain
	String subdomain = request.getServerName().split("\\.")[0];

	// Lowercase
	subdomain = subdomain.toLowerCase();

	// Get Server URL without subdomain
	String url = request.getServerName().replaceAll(subdomain, "");
	if (url.startsWith("."))
	    url = url.substring(1);

	// If not agilecrm.com or helptor.com etc. - show chooseDomain
	if (!Arrays.asList(Globals.URLS).contains(url.toLowerCase()))
	{
	    redirectToChooseDomain(request, response);
	    return false;
	}

	// If my or any special domain - support etc, choose subdomain
	if (Arrays.asList(Globals.LOGIN_DOMAINS).contains(subdomain))
	{
	    redirectToChooseDomain(request, response);
	    return false;
	}

	// Set Google Apps Namespace if googleapps
	if (subdomain.equalsIgnoreCase(Globals.GOOGLE_APPS_DOMAIN))
	{
	    return setupGoogleAppsNameSpace(request, response);

	}

	// Set the subdomain as name space
	System.out.println("Setting the domain " + subdomain + " "
		+ ((HttpServletRequest) request).getRequestURL());
	NamespaceManager.set(subdomain);
	return true;
    }

    private static String getFullUrl(HttpServletRequest req)
    {
	String reqUrl = req.getRequestURL().toString();
	String queryString = req.getQueryString(); // d=789
	if (queryString != null)
	{
	    reqUrl += "?" + queryString;
	}
	return reqUrl;
    }

    // Set up Google Apps
    private boolean setupGoogleAppsNameSpace(ServletRequest request,
	    ServletResponse response)
    {
	try
	{
	    // Using openid, we are not able to support wildcard realms
	    String appsDomain = request.getParameter("hd");
	    if (appsDomain != null)
	    {
		String namespace = appsDomain.split("\\.")[0];
		System.out.println("Setting Google Apps - Namespace "
			+ appsDomain);

		// If Gadget Level API which does not understand redirect, we
		// just set the namespace
		if (request.getParameter("opensocial_owner_id") != null)
		{
		    // Set the namespace
		    NamespaceManager.set(namespace);
		    return true;
		}

		String url = getFullUrl((HttpServletRequest) request);
		url = url.replace(Globals.GOOGLE_APPS_DOMAIN + ".", namespace
			+ ".");

		HttpServletResponse httpResponse = (HttpServletResponse) response;
		System.out.println("Redirecting it to " + url);
		httpResponse.sendRedirect(url);
		return false;
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	redirectToChooseDomain(request, response);
	return false;
    }

    public void redirectToChooseDomain(ServletRequest request,
	    ServletResponse response)
    {
	// Redirect to choose domain page if not localhost - on localhost - we
	// do it on empty namespace
	if (!request.getServerName().equalsIgnoreCase("localhost")
		&& !request.getServerName().equalsIgnoreCase("127.0.0.1"))
	{
	    try
	    {
		HttpServletResponse httpResponse = (HttpServletResponse) response;
		httpResponse.sendRedirect("/choose-domain.html");
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();

	    }
	}
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
	    FilterChain chain) throws IOException, ServletException
    {
	// If Cron, just there is no filters to do
	String path = ((HttpServletRequest) request).getRequestURI();
	if (path.startsWith("/cron"))
	{
	    chain.doFilter(request, response);
	    return;
	}

	// Set namespace
	boolean handled = setNamespace(request, response);

	// Chain into the next request if not redirected
	if (handled)
	    chain.doFilter(request, response);
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException
    {
	// Nothing to do

    }

    @Override
    public void destroy()
    {
	// Nothing to do
    }

}
