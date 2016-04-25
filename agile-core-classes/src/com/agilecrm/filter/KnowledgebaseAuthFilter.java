package com.agilecrm.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import com.agilecrm.session.KnowledgebaseManager;
import com.agilecrm.session.KnowledgebaseUserInfo;

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

		// Check if UserInfo is already there
		KnowledgebaseUserInfo userInfo = (KnowledgebaseUserInfo) httpRequest.getSession().getAttribute(
				KnowledgebaseManager.AUTH_SESSION_COOKIE_NAME);

		if (userInfo != null)
		{
			// Add this in session manager
			KnowledgebaseManager.set((HttpServletRequest) request);
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