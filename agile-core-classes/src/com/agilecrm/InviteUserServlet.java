package com.agilecrm;

import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.services.ServiceLocator;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.InvitedUser;
import com.agilecrm.user.service.DomainUserService;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.InvitedUsersUtil;

public class InviteUserServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	/**
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ServletException
	 */

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

		try {
			
			InvitedUser user = validateUser(request);
			request.setAttribute("id", request.getParameter("v"));
			request.setAttribute("user_email", user.email);
			String userName = user.email.split("@")[0];
			request.setAttribute("userName", userName);
			System.out.println("User email = " + user.email);

			// Show form
			request.getRequestDispatcher("/invited-user-profile.jsp").forward(request, response);
		}
		catch (Exception e) {
			request.setAttribute("error", e.getMessage());
			request.getRequestDispatcher("/invited-user-profile.jsp?error=" + URLEncoder.encode(e.getMessage()))
					.forward(request, response);
		}
	}

	/**
	 * Update user profile
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ServletException
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

		try {

			System.out.println("post method");
			InvitedUser user = validateUser(request);
			
			// Get details
			String email = request.getParameter("default-email");
			String password = request.getParameter("password");
			String role = request.getParameter("role");
			String name = request.getParameter("name");
			String phone = request.getParameter("cphone");
			String updated_email = request.getParameter("email");

			request.setAttribute("user_email", email);

			// Update domain user
			DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(email);
			if (domainUser == null)
				throw new Exception("We have not been able to locate any user "+email);

			System.out.println("domainuser with that email address = " + domainUser);
			domainUser.password = password;
			domainUser.name = name;
			domainUser.email = updated_email;
			domainUser.role = DomainUserUtil.getDomainUserRole(role);
			domainUser.phone = phone;
			//domainUser.is_send_email = false;
			domainUser.is_send_password = true;
			domainUser.save();
			
			DomainUserService domainUserService = (DomainUserService) ServiceLocator.lookupService(DomainUserService.ServiceID);
			
			domainUserService.sendWelcomeEmail(domainUser);
			
			user.verification_code = "verify";
			user.save();

			System.err.println("User verify = " + user);
			/*request.setAttribute("status", "success");
			request.setAttribute("Defaultemail", domainUser.email);
			request.getRequestDispatcher("/invited-user-profile.jsp").forward(request, response);*/
			new LoginServlet().loginAgile(request, response);

		} catch (Exception e) {
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			request.getRequestDispatcher(
					"/invited-user-profile.jsp?error=" + URLEncoder.encode(e.getMessage(), "UTF-8"))
					.forward(request, response);
			return;
		}
		request.getRequestDispatcher(
				"/invited-user-profile.jsp?success=" + "Successfully updated")
				.forward(request, response);
		
	}

	InvitedUser validateUser(HttpServletRequest request) throws Exception{

		String id = request.getParameter("v");
		if (StringUtils.isBlank(id))
			throw new Exception("Invalid User");

		System.out.println("id = " + id);

		InvitedUser user = InvitedUsersUtil.getUserById(id);
		if (user == null)
			throw new Exception("Invalid User");

		if (user.verification_code.equals("verify"))
			throw new Exception("Already Updated");
		
		return user;
	}
}