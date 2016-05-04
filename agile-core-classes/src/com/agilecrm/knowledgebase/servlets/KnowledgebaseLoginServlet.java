package com.agilecrm.knowledgebase.servlets;

import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.Globals;
import com.agilecrm.knowledgebase.entity.HelpcenterUser;
import com.agilecrm.knowledgebase.util.HelpcenterUserUtil;
import com.agilecrm.session.KnowledgebaseManager;
import com.agilecrm.session.KnowledgebaseUserInfo;
import com.agilecrm.session.KnowledgebaseUserInfo.Role;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.AliasDomainUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.MD5Util;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.utils.SystemProperty;

/**
 * 
 * @author Sasi
 * 
 */
public class KnowledgebaseLoginServlet extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public static String RETURN_PATH_SESSION_PARAM_NAME = "redirect_after_openid";
	public static String RETURN_PATH_SESSION_HASH = "return_hash";

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
	{
		doGet(request, response);
	}

	/**
	 * Checks type i.e whether the user logs in from Oauth(openId) form or from
	 * Agile(form based) login.
	 * 
	 * For the first time type is null, so we include login.jsp
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
	{
		// Delete Login Session
		request.getSession().removeAttribute(KnowledgebaseManager.AUTH_SESSION_COOKIE_NAME);

		// Check if this subdomain even exists or alias exist
		if (DomainUserUtil.count() == 0)
		{
			response.sendRedirect(Globals.CHOOSE_DOMAIN);
			return;
		}

		// If request is due to multiple logins, page is redirected to error
		// page
		String multipleLogin = (String) request.getParameter("ml");

		// Check the type of authentication
		try
		{
			if (!StringUtils.isEmpty(multipleLogin))
			{
				handleMulipleLogin(response);
				return;
			}
			String type = request.getParameter("type");

			if (type != null)
			{
				if (type.equalsIgnoreCase("agile"))
				{
					System.out.println("agile form type");
					loginAgile(request, response);
				}

				return;
			}
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));

			// Send to Login Page
			request.getRequestDispatcher("/helpcenter/login.jsp?error=" + URLEncoder.encode(e.getMessage())).forward(
					request, response);

			return;
		}

		// Return to Login Page
		request.getRequestDispatcher("/helpcenter/login.jsp").forward(request, response);
	}

	/**
	 * <p>
	 * If the type is Agile form based, it will check for user name, password or
	 * whether the user exists with this user name previously. If present
	 * matches with the Data store credentials...,i.e. user password is stored
	 * in hash format in data store, so while matching we will convert the
	 * password given by user in login into hash format and then compare them.
	 * If any error occurs throws exception and with error login.jsp is
	 * included.
	 * </p>
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	void loginAgile(HttpServletRequest request, HttpServletResponse response) throws Exception
	{
		// Get User Name
		String email = request.getParameter("email");

		// Get Password
		String password = request.getParameter("password");

		HelpcenterUser user = HelpcenterUserUtil.getUser(email);

		if (user == null)
			throw new Exception("We have not been able to locate any user " + email);

		if (!password.equals(user.password))
			throw new Exception("Incorrect password. Please try again.");

		if (!user.is_verified)
		{
			HelpcenterUserUtil.sendVerificationEmail(user);
			throw new Exception(
					"You haven't verified your email address yet. Just now we have sent an verification email. Please verify to login.");
		}

		KnowledgebaseUserInfo userInfo = new KnowledgebaseUserInfo("agilecrm.com", email, user.name, Role.CUSTOMER, user.id);

		System.out.println("Creating user info object....");
		System.out.println("userInfo: ");
		System.out.println(userInfo);
		
		System.out.println("Setting user info in request session....");
		request.getSession().setAttribute(KnowledgebaseManager.AUTH_SESSION_COOKIE_NAME, userInfo);
		
		System.out.println("Setting user info in thread local....");
		KnowledgebaseManager.set(userInfo);
		
		System.out.print("Redirecting to home page...");
		
		response.sendRedirect("/helpcenter");
	}

	private void handleMulipleLogin(HttpServletResponse response) throws Exception
	{
		// response.sendRedirect("error/multiple-login.jsp");
		throw new Exception("multi-login");
	}
}