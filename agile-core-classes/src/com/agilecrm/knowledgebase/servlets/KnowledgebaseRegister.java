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
		String pageToRedirect = "/helpcenter/register.jsp";

		try
		{
			// Fetch UserInfo from the session attribute
			KnowledgebaseUserInfo userInfo = (KnowledgebaseUserInfo) request.getSession().getAttribute(
					KnowledgebaseManager.AUTH_SESSION_COOKIE_NAME);

			if (userInfo != null)
			{
				sendRedirectToHome(response);
				return;
			}

			// Add domain JSON to request scope
			String domainName = URLUtil.getDomainNameFromRequest(request);
			
			JSONObject domainJSON;
			
			String domainInfo = (String) request.getAttribute("domain_info");
			
			if (StringUtils.isBlank(domainInfo))
			{
				domainJSON = TicketDomain.getDomainJSON(domainName);
				request.setAttribute("domain_info", domainJSON.toString());
			}
			else
				domainJSON = new JSONObject(domainInfo);

			// Get the command name
			String command = request.getParameter("command");
			if (StringUtils.isNotBlank(command) && StringUtils.equalsIgnoreCase(command, "register"))
			{
				registerHCUser(request, response, domainJSON);
				return;
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
			String loginError = e.getMessage();

			pageToRedirect = (loginError == null) ? "/helpcenter/register.jsp" : "/helpcenter/register.jsp?error="
					+ loginError;
		}

		// Return to Login Page
		request.getRequestDispatcher(pageToRedirect).forward(request, response);
		return;

	}

	private void registerHCUser(HttpServletRequest request, HttpServletResponse response, JSONObject domainJSON)
			throws Exception
	{

		// Get User Name
		String name = request.getParameter("name");

		// Get User Name
		String email = request.getParameter("email");

		// Get Password
		String password = request.getParameter("password");

		if (StringUtils.isBlank(name) || StringUtils.isBlank(email) || StringUtils.isBlank(password))
			throw new Exception("Invalid Input. Email or password has been left blank.");

		email = email.toLowerCase();

		// Get user
		if (HelpCenterUsers.getUserFromEmail(email, domainJSON) != null)
			throw new Exception("User with same email address already exists in our system.");

		// Add new user
		JSONObject customerJSON = HelpCenterUsers.addNewUser(name, email, password, domainJSON);

		// Send verification email
		HelpCenterVerifyUsers.sendVerificationEmail(customerJSON, domainJSON);

		// Create session
		processHCLogin(request, response, email, customerJSON, domainJSON, "customer");
		return;

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

		HelpCenterSessionInfo hcSessionInfo = new HelpCenterSessionInfo(email, loginJSON, domainJSON, role);

		request.getSession().setAttribute(HelpCenterSessionManager.AUTH_SESSION_COOKIE_NAME, hcSessionInfo);

		HelpCenterSessionManager.set(request);

		sendRedirectToHome(response);

		return;

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
