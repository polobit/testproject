package com.agilecrm.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * A very simple Servlet Filter for HTTP Basic Auth. Only supports exactly one
 * user with a password. Please note, HTTP Basic Auth is not encrypted and hence
 * unsafe!
 * 
 * @author Timo B. Huebel (me@tbh.name) (initial creation)
 */
public class AgileAuthFilter implements Filter
{

    @Override
    public void destroy()
    {
	// Nothing to do.
    }

    @Override
    public void doFilter(final ServletRequest request,
	    final ServletResponse response, final FilterChain chain)
	    throws IOException, ServletException
    {
	// System.out.println("Agile Auth Filter");

	// Reset the thread local
	SessionManager.set((UserInfo) null);

	HttpServletRequest httpRequest = (HttpServletRequest) request;
	HttpServletResponse httpResponse = (HttpServletResponse) response;

	// If it is JS API, we will pass it through
	if (httpRequest.getRequestURI().contains("js/api"))
	{
	    System.out.println("JS API - ignoring filter");
	    chain.doFilter(request, response);
	    return;
	}

	// If no sessions are there, redirect
	if (httpRequest.getSession(false) == null)
	{
	    httpResponse.sendRedirect("/login");
	    return;
	}

	// Check if UserInfo is already there
	UserInfo userInfo = (UserInfo) httpRequest.getSession().getAttribute(
		SessionManager.AUTH_SESSION_COOKIE_NAME);
	if (userInfo == null)
	{
	    httpResponse.sendRedirect("/login");
	    return;
	}

	// Add this in session mnager
	SessionManager.set((HttpServletRequest) request);

	// For registering all entities - AgileUser is a just a random class we
	// are using
	ObjectifyGenericDao<AgileUser> dao = new ObjectifyGenericDao<AgileUser>(
		AgileUser.class);

	// Check if userinfo is valid for this namespace
	DomainUser domainUser = DomainUserUtil.getDomainCurrentUser();

	System.out.println("Current domain user " + domainUser);

	// Get Namespace
	String domain = NamespaceManager.get();

	// Send to register
	if (domainUser == null)
	{
	    // User Not Found

	}

	// Check if the domain of the user is same as namespace. Otherwise,
	// Redirect
	if (domainUser != null && domainUser.domain != null
		&& !domain.equalsIgnoreCase(domainUser.domain))
	{
	    // Probably forward to the domain again he registered
	    System.out.println("Forwarding to actual domain "
		    + domainUser.domain);

	    // Remove from Current Session
	    ((HttpServletRequest) request).getSession().removeAttribute(
		    SessionManager.AUTH_SESSION_COOKIE_NAME);

	    httpResponse.sendRedirect("https://" + domainUser.domain
		    + ".agilecrm.com");
	    return;
	}

	// If the user is disabled
	if (domainUser != null && domainUser.is_disabled)
	{
	    httpRequest.getRequestDispatcher("/error/user-disabled.jsp")
		    .include(request, response);
	    return;
	}

	chain.doFilter(request, response);
	return;
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException
    {
	// Nothing to do
    }
}