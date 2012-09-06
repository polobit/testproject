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

	// Get Server URL without subdomain
	String url = request.getServerName().replaceAll(subdomain, "");
	if (url.startsWith("."))
	    url = url.substring(1);

	if (Arrays.asList(Globals.URLS).contains(url.toLowerCase()))
	{
	    // Set the subdomain as name space
	    System.out.println("Setting the domain " + subdomain);
	    NamespaceManager.set(subdomain);
	    return true;
	}

	// Redirect to choose domain page if not localhost - on localhost - we
	// do it on empty namespace
	if (!request.getServerName().equalsIgnoreCase("localhost")
		&& !request.getServerName().equalsIgnoreCase("127.0.0.1"))
	{
	    try
	    {
		HttpServletResponse httpResponse = (HttpServletResponse) response;
		httpResponse.sendRedirect("/choose-domain.html");
		return false;
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();

	    }
	}

	return true;
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
