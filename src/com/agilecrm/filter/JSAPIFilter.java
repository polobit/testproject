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

/**
 * <code>JSAPIFilter</code> is a simple Servlet Filter for HTTP Basic Auth.
 * Filters the requests, with url path starts with "/core/js", to allow access
 * using APIKey allocated to domain. Verifies APIkey related to domain to allow
 * access
 * <p>
 * Request to url path "/js/api/" should include query parameter "id" with
 * APIKey as is value
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
    public void doFilter(final ServletRequest request,
	    final ServletResponse response, final FilterChain chain)
	    throws IOException, ServletException
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
	    String apiKey = APIKey.getAPIKey().api_key;
	    if (APIKey.isPresent(apiKey))
	    {
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
