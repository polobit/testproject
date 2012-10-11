package com.agilecrm;

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

public class JSAPIFilter implements Filter
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
	System.out.println("JSAPI Filter");

	final HttpServletRequest httpRequest = (HttpServletRequest) request;
	final HttpServletResponse httpResponse = (HttpServletResponse) response;

	String agileId = httpRequest.getParameter("id");

	// Check if ApiKey
	String apiKey = APIKey.getAPIKey().api_key;
	if (agileId != null && agileId.equals(apiKey))
	{
	    chain.doFilter(httpRequest, httpResponse);
	    return;
	}

	System.out.println("Error");
	httpResponse.setHeader("WWW-Authenticate", "Namespace incorrect");
	httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException
    {
	// Nothing to do
    }

}
