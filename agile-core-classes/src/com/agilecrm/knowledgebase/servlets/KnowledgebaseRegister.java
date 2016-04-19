package com.agilecrm.knowledgebase.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.session.KnowledgebaseManager;
import com.agilecrm.session.KnowledgebaseUserInfo;

/**
 * 
 * @author Sasi
 * 
 */
public class KnowledgebaseRegister extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Handle request to get
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
	{
		doGet(request, response);
	}

	/**
	 * Creates session to agent with proper credentials. Redirects to login if
	 * credentials are wrong.
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
	{

	}

	private void registerHCUser(HttpServletRequest request, HttpServletResponse response, JSONObject domainJSON)
			throws Exception
	{

	}

	/**
	 * login user as admin
	 * 
	 * @param request
	 * @param response
	 * @param domainJSON
	 * @throws Exception
	 */
	public void processHCLogin(HttpServletRequest request, HttpServletResponse response, String email,
			JSONObject loginJSON, JSONObject domainJSON, String role) throws Exception
	{
	}

	private void sendRedirectToHome(HttpServletResponse response)
	{
		try
		{
			// Get target URL
			response.sendRedirect("/helpcenter");
			return;
		}
		catch (Exception e)
		{
		}
	}
}
