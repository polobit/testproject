package com.agilecrm.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

/**
 * <code>JSONRequestFilter</code> handles requests sent to JSAPI. It handles the
 * request and writes the response back to callback function sent from the
 * client, which invokes callback function after request is processed.
 * 
 * @author Manohar
 * 
 */
public class JSONPRequestFilter implements Filter
{
    private final String callbackParameter = "callback";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException
    {
	if (!(request instanceof HttpServletRequest))
	{
	    throw new ServletException("This filter can only process HttpServletRequest requests");
	}

	final HttpServletRequest httpRequest = (HttpServletRequest) request;

	// Checks if request is JSONP request based on callback parameter
	if (isJSONPRequest(httpRequest))
	{
	    // Gets response output streams, and writes response of JSAPI call
	    // enclosed with in callback parameter.
	    ServletOutputStream out = response.getOutputStream();
	    out.println(getCallbackParameter(httpRequest) + "(");
	    chain.doFilter(request, response);
	    out.println(");");

	    response.setContentType("application/javascript");
	}
	else
	{
	    chain.doFilter(request, response);
	}
    }

    /**
     * Checks whether request received is a valid JSONP request. It checks for
     * the callback parameter.
     * 
     * @param httpRequest
     * @return ({@link Boolean}
     */
    private boolean isJSONPRequest(HttpServletRequest httpRequest)
    {
	String callbackMethod = getCallbackParameter(httpRequest);
	return (callbackMethod != null && callbackMethod.length() > 0);
    }

    /**
     * Reads the callback parameter sent in JSONP request which is a unique
     * number generated and assigned to widow as a callback function.
     * 
     * @param request
     * @return
     */
    private String getCallbackParameter(HttpServletRequest request)
    {
	return request.getParameter(callbackParameter);
    }

    @Override
    public void destroy()
    {
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException
    {
    }
}