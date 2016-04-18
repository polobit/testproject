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

import com.agilecrm.session.KnowledgebaseManager;
import com.agilecrm.session.KnowledgebaseUserInfo;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
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
public class KnowledgebaseAuthFilter implements Filter
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
	public void doFilter(final ServletRequest request, final ServletResponse response, final FilterChain chain)
			throws IOException, ServletException
	{
		System.out.println("Helpcenter Auth Filter.......");

		// Reset the thread local
		KnowledgebaseManager.set((KnowledgebaseUserInfo) null);

		HttpServletRequest httpRequest = (HttpServletRequest) request;
		HttpServletResponse httpResponse = (HttpServletResponse) response;

		// Check if UserInfo is already there
		KnowledgebaseUserInfo userInfo = (KnowledgebaseUserInfo) httpRequest.getSession().getAttribute(
				KnowledgebaseManager.AUTH_SESSION_COOKIE_NAME);

		if (userInfo != null)
		{
			// Add this in session manager
			KnowledgebaseManager.set((HttpServletRequest) request);
			
			// Add this in session manager
			SessionManager.set((HttpServletRequest) request);
			
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

			// Check if the domain of the user is same as namespace. Otherwise,
			// Redirect
			if (domainUser != null && domainUser.domain != null && domain != null
					&& !domain.equalsIgnoreCase(domainUser.domain))
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