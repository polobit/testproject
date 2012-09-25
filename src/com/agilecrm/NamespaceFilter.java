package com.agilecrm;

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

import com.google.appengine.api.NamespaceManager;

/*
 *  Filter set the namespace. If the url is incorrect - it will forward to choose domain page
 */
public class NamespaceFilter implements Filter
{

    @Override
    public void destroy()
    {
	// Nothing to do
    }

    private boolean setNamespace(ServletRequest request,
	    ServletResponse response)
    {
	// Return if already set
	if (NamespaceManager.get() != null)
	    return true;

	// If Localhost - just return
	if (request.getServerName().equalsIgnoreCase("localhost")
		|| request.getServerName().equalsIgnoreCase("127.0.0.1"))
	{
	    return true;
	}

	/*
	 * // Get User Id UserService userService =
	 * UserServiceFactory.getUserService();
	 * 
	 * // Check if logged in if (!userService.isUserLoggedIn()) return true;
	 * 
	 * String userId = userService.getCurrentUser().getUserId();
	 */

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
	    if (setupGoogleAppsNameSpace(request, response))
		return true;
	}

	// Set the subdomain as name space
	System.out.println("Setting the domain " + subdomain);
	NamespaceManager.set(subdomain);
	return true;

    }

    // Set up Google Apps
    private boolean setupGoogleAppsNameSpace(ServletRequest request,
	    ServletResponse response)
    {

	// Google AppEngine currently does not support wildcard realms
	// We use a special domain googleapps.xxx.com

	// Check if Session if Google Apps is present
	String namespace = (String) request
		.getAttribute(Globals.GOOGLE_APP_SESSION_ID);
	if (namespace != null)
	{
	    NamespaceManager.set(namespace);
	    return true;
	}

	// Check if hd is present, then set the domain
	// Get Apps Domain - hd
	String appsDomain = request.getParameter("hd");
	if (appsDomain != null)
	{

	    System.out.println(appsDomain);
	    namespace = appsDomain.split("\\.")[0];

	    // Set Namespace
	    NamespaceManager.set(namespace);

	    // Set in session
	    request.setAttribute(Globals.GOOGLE_APP_SESSION_ID, namespace);
	    return true;
	}

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

	// System.out.println("Setting namespace");

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

}
