package com.agilecrm.plugin.oauth;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * <code>OAuth2Servlet</code> handles the request after OAuth2.0 specification
 * for any service
 * 
 * @author Tejaswi
 * @since Aug 2013
 */
@SuppressWarnings("serial")
public class OAuth2Servlet extends HttpServlet
{

    /**
     * This method is called after OAuth2.0 . Request returns along with the
     * code and state parameters for any OAuth2.0 request and redirected to
     * state with code appended as query param
     */
    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
    {

	/*
	 * This parameter specifies the path from where the request is made and
	 * helps us to redirect there
	 */
	String state = request.getParameter("state");

	System.out.println("OAuth2Servlet state " + state);

	// handle facebook popup windows
	if ("facebook".equalsIgnoreCase(request.getParameter("act")))
	{
	    PrintWriter out = response.getWriter();
	    response.setContentType("text/html");
	    out.println("<script type=\"text/javascript\">");
	    out.println("this.close()");
	    out.println("</script>");
	    return;
	}

	/*
	 * This parameter specifies the code which is required to generate
	 * access token after OAuth2.0
	 */
	String code = request.getParameter("code");

	System.out.println("OAuth2Servlet code " + code);

	/*
	 * If state is not null, the response is redirected to the path
	 * specified in state along with code as query parameter
	 */
	if (state != null)
	    response.sendRedirect(state + "?code=" + code);
    }
}