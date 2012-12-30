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
 * <code>AgileAuthFilter</code> is a Servlet Filter on HTTP request with urls:
 * /home, /, /core/*, /scribe, /upload.jsp. It Checks if session is available,
 * so it allows access further, if session is not available then redirects to
 * login.
 * 
 * It also allow access to urls with "js/api", as JSAPIFilter authenticates the
 * request based on APIKey instead of checking for sessions and userInfo
 * 
 * 
 * @author Timo B. Huebel (me@tbh.name) (initial creation)
 */
public class AgileAuthFilter implements Filter
{
    public static final String LOGIN_RETURN_PATH_SESSION_PARAM_NAME = "redirect_uri_on_login";

    @Override
    public void destroy()
    {
	// Nothing to do.
    }

    /**
     * Validates the session and the domain user with respect to namespace set
     * in Namespace Filter. If session cookie is not available then it redirects
     * to login page, where new session cookie is set.
     */
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

	// If it is JS API, we will pass it through JSAPIFilter is used to
	// filter the request i.e., to check the API key allocated to the domain
	if (httpRequest.getRequestURI().contains("js/api"))
	{
	    System.out.println("JS API - ignoring filter");
	    chain.doFilter(request, response);
	    return;
	}

	// If no sessions are there, redirect to login page
	if (httpRequest.getSession(false) == null)
	{
	    setRedirectURI(httpRequest);
	    httpResponse.sendRedirect("/login");
	    return;
	}

	// Check if UserInfo is already there
	UserInfo userInfo = (UserInfo) httpRequest.getSession().getAttribute(
		SessionManager.AUTH_SESSION_COOKIE_NAME);
	if (userInfo == null)
	{
	    setRedirectURI(httpRequest);
	    httpResponse.sendRedirect("/login");
	    return;
	}

	// Add this in session manager
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
	if (domainUser != null && domainUser.domain != null && domain != null
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

    public void setRedirectURI(HttpServletRequest request)
    {
	request.getSession().setAttribute(LOGIN_RETURN_PATH_SESSION_PARAM_NAME,
		"#contacts");
    }
}