package com.agilecrm.knowledgebase.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

import com.agilecrm.knowledgebase.entity.HelpcenterUser;
import com.agilecrm.knowledgebase.util.HelpcenterUserUtil;
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
		String pageToRedirect = "/helpcenter/register.jsp";

		try
		{
			// Get Agent session
			KnowledgebaseUserInfo hcSessionInfo = (KnowledgebaseUserInfo) request.getSession().getAttribute(
					KnowledgebaseManager.AUTH_SESSION_COOKIE_NAME);

			if (hcSessionInfo != null)
			{
				sendRedirectToHome(response);
				return;
			}

			// Get the command name
			String command = request.getParameter("command");

			if (StringUtils.isNotBlank(command) && StringUtils.equalsIgnoreCase(command, "register"))
			{
				registerHCUser(request, response);
				return;
			}

		}
		catch (Exception e)
		{
			String loginError = e.getMessage();

			pageToRedirect = (loginError == null) ? "/helpcenter/register.jsp" : "/helpcenter/register.jsp?error="
					+ loginError;
		}

		// Return to Login Page
		request.getRequestDispatcher(pageToRedirect).forward(request, response);
		return;
	}

	private void registerHCUser(HttpServletRequest request, HttpServletResponse response) throws Exception
	{
		// Get User Name
		String email = request.getParameter("email");

		// Get Password
		String password = request.getParameter("password");

		// Get Name
		String name = request.getParameter("name");

		System.out.println("email = " + email);
		System.out.println("name = " + name);
		System.out.println("password = " + password);

		// throw new Exception("User already exists with same name.");

		HelpcenterUser user = HelpcenterUserUtil.getUser(email);

		if (user != null)
			throw new Exception("User already exists with same email.");

		user = new HelpcenterUser(name, email, password);
		user.save();
		
		HelpcenterUserUtil.sendVerificationEmail(user);
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
			response.sendRedirect("/helpcenter");
			return;
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}
}
