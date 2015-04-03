package com.thirdparty.ecommerce;

import java.io.IOException;
import java.io.PrintWriter;

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
 * 
 */
public class EcommerceWebhookFilter implements Filter
{

    /**
     * Default constructor.
     */
    public EcommerceWebhookFilter()
    {
	// TODO Auto-generated constructor stub
    }

    /**
     * @see Filter#destroy()
     */
    public void destroy()
    {
	// TODO Auto-generated method stub
    }

    /**
     * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
     */
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException
    {
	HttpServletRequest req = (HttpServletRequest) request;
	HttpServletResponse res = (HttpServletResponse) response;

	// Gets the id from the request
	String agileId = req.getParameter("api-key");
	String domain = req.getParameter("domain");

	System.out.println("api-key : " + agileId + " domain : " + domain);

	if (agileId != null)
	{
	    // Check if ApiKey
	    if (APIKey.isValidJSKey(agileId) || APIKey.isPresent(agileId))
	    {
		System.out.println("OK");
		chain.doFilter(req, res);
		return;
	    }
	    else
	    {
		res.setContentType("application/json");
		PrintWriter out = res.getWriter();
		out.println("{\"error\" : \"Invalid credentials\"}");
		return;
	    }

	}
	else
	{
	    res.setContentType("application/json");
	    PrintWriter out = res.getWriter();
	    out.println("{\"error\" : \"Api key is required\"}");
	}
    }

    /**
     * @see Filter#init(FilterConfig)
     */
    public void init(FilterConfig fConfig) throws ServletException
    {
	// TODO Auto-generated method stub
    }

}
