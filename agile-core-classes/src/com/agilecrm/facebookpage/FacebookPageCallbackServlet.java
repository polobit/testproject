package com.agilecrm.facebookpage;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 
 */
public class FacebookPageCallbackServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;


    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
	doPost(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
	HttpSession currentSession = request.getSession();	
	response.setContentType("text/plain");
	String fbAccessToken = FacebookPageUtil.getAccessToken(request.getParameter("code"));
	if(!fbAccessToken.isEmpty()) {
		currentSession.setAttribute("fbpage_user_accesstoken", fbAccessToken);
		currentSession.setAttribute("fbpage_logged_in", true);
		System.out.println(currentSession.getAttribute("fbpage_user_accesstoken"));
	}
	response.sendRedirect("/#facebook-integration");
    }

}