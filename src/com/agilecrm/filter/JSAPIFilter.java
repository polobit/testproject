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

import com.agilecrm.account.APIKey;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;

/**
 * <code>JSAPIFilter</code> is a simple Servlet Filter for JS API Auth. Verifies
 * APIkey related to domain to allow access
 * <p>
 * Request to url path "/js/api/" should include query parameter "id" with
 * APIKey as value
 * </p>
 * 
 */
public class JSAPIFilter implements Filter
{
    @Override
    public void destroy()
    {
	// Nothing to do.
    }

    /**
     * Gets the id from the request and tries to match with the APIKey of
     * current namespace (namespace is set in the NamespaceFilter according to
     * domain in the url), if key matches request it allowed for further access
     */
    @Override
    public void doFilter(final ServletRequest request, final ServletResponse response, final FilterChain chain) throws IOException, ServletException
    {

	final HttpServletRequest httpRequest = (HttpServletRequest) request;
	final HttpServletResponse httpResponse = (HttpServletResponse) response;

	// Gets the id from the request
	String agileId = httpRequest.getParameter("id");

	// If APIKey from the request is not null, If key in the request matches
	// with APIKey of current namespace/domain request is allowed to access
	// functionalities in "js/api".
	if (agileId != null)
	{
	    // Check if ApiKey
	    if (APIKey.isPresent(agileId))
	    {
		UserInfo userInfo = (UserInfo) httpRequest.getSession().getAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);

		// Get AgileUser
		DomainUser domainUser = APIKey.getDomainUserRelatedToAPIKey(agileId);

		if (userInfo == null || !userInfo.getEmail().equalsIgnoreCase(domainUser.email))
		{
		    userInfo = new UserInfo("agilecrm.com", domainUser.email, domainUser.name);

		    httpRequest.getSession().setAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME, userInfo);

		}

		SessionManager.set(userInfo);
		chain.doFilter(httpRequest, httpResponse);
		return;
	    }
	}

	System.out.println("Error - Key does not match for JS API");
	httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException
    {
	// Nothing to do
    }
}