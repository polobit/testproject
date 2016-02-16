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

import com.agilecrm.LoginServlet;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.VersioningUtil;
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
    public void doFilter(final ServletRequest request, final ServletResponse response, final FilterChain chain) throws IOException, ServletException
    {
	System.out.println("Agile Auth Filter");

	// Reset the thread local
	SessionManager.set((UserInfo) null);

	HttpServletRequest httpRequest = (HttpServletRequest) request;
	HttpServletResponse httpResponse = (HttpServletResponse) response;

	// If it is JS API, we will pass it through JSAPIFilter is used to
	// filter the request i.e., to check the API key allocated to the
	// domain
	// if(!(httpRequest.getRequestURI().contains("xero")||httpRequest.getRequestURI().contains("freshbooks")))
	// {
	if (httpRequest.getRequestURI().contains("js/api") || httpRequest.getRequestURI().contains("php/api")
		|| httpRequest.getRequestURI().contains("/core/api/bulk-actions") || httpRequest.getRequestURI().contains("/core/api/opportunity/backend")
		|| httpRequest.getRequestURI().contains("oauth") || httpRequest.getRequestURI().contains("/gmail")
		|| httpRequest.getRequestURI().contains("/core/api/webevents")|| httpRequest.getRequestURI().contains("/core/hook")
		|| httpRequest.getRequestURI().contains("/core/api/documentviewer") 
		|| httpRequest.getRequestURI().contains("/download-attachment") || httpRequest.getRequestURI().contains("/core/api/forms/form"))
	{
	    System.out.println("JS API - ignoring filter");
	    chain.doFilter(request, response);
	    return;
	}
	// }

	// If no sessions are there, redirect to login page

	if (httpRequest.getSession(false) == null)
	{
	    redirectToLogin(httpRequest, httpResponse);
	    return;
	}

	// Check if UserInfo is already there
	UserInfo userInfo = (UserInfo) httpRequest.getSession().getAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);
	if (userInfo == null)
	{
	    redirectToLogin(httpRequest, httpResponse);
	    return;
	}

	// Add this in session manager
	SessionManager.set((HttpServletRequest) request);

	// For registering all entities - AgileUser is a just a random class we
	// are using
	ObjectifyGenericDao<AgileUser> dao = new ObjectifyGenericDao<AgileUser>(AgileUser.class);

	// Check if userinfo is valid for this namespace
	DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();

	// Get Namespace
	String domain = NamespaceManager.get();

	// Send to register
	if (domainUser == null)
	{
	    ((HttpServletRequest) request).getSession().removeAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);

	    // Remove user info from session, redirect to auth-failed.jsp.
	    SessionManager.set((UserInfo) null);
	    httpResponse.sendRedirect("error/auth-failed.jsp");
	}

	setAccessScopes(request, domainUser);

	// Check if the domain of the user is same as namespace. Otherwise,
	// Redirect
	if (domainUser != null && domainUser.domain != null && domain != null && !domain.equalsIgnoreCase(domainUser.domain))
	{
	    // Probably forward to the domain again he registered
	    System.out.println("Forwarding to actual domain " + domainUser.domain);

	    // Remove from Current Session
	    ((HttpServletRequest) request).getSession().removeAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);

	    System.out.println(VersioningUtil.getLoginUrl(domainUser.domain, request));
	    httpResponse.sendRedirect(VersioningUtil.getLoginUrl(domainUser.domain, request));
	    return;
	}

	// If the user is disabled
	if (domainUser != null && domainUser.is_disabled)
	{
	    httpRequest.getRequestDispatcher("/error/user-disabled.jsp").include(request, response);
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

    /**
     * Sets current url in session to redirect after login, if url does not
     * contain "/core" uri. if url does contains "core" in request uri then
     * error is sent in response error is sent as response
     * 
     * @param request
     * @param response
     * @throws IOException
     */
    private void redirectToLogin(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
	// Gets the reqeust uri
	String uri = request.getRequestURI();

	// If uri doesn't contain "core" in it, then uri is set in session for
	// redirection
	if (uri.contains("/core"))
	{
	    // Sends error response, so that user is notified about session
	    // expiry
	    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "You are not logged in.");
	    return;
	}

	// Store the URI so that we can redirect after he successfully logins
	request.getSession().setAttribute(LoginServlet.RETURN_PATH_SESSION_PARAM_NAME, uri);

	response.sendRedirect("/login");
    }

    /**
     * Sets scopes in session if scopes are changed
     * 
     * @param request
     * @param user
     */
    public void setAccessScopes(ServletRequest request, DomainUser user)
    {
	UserInfo info = SessionManager.get();
	System.out.println();
	System.out.println(user.scopes);
	if (info.getScopes() == null || (user.scopes.size() != info.getScopes().size() || !info.getScopes().containsAll(user.scopes)))
	{
	    System.out.println("does not contain all scopes");
	    System.out.println(info.getScopes());
	    System.out.println(user.scopes);
	    info.setScopes(user.scopes);
	    ((HttpServletRequest) request).getSession().setAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME, info);
	}
    }
}