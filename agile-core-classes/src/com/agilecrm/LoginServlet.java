package com.agilecrm;

import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.subscription.limits.cron.deferred.AccountLimitsRemainderDeferredTask;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.MD5Util;
import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.util.RegisterUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.utils.SystemProperty;

/**
 * <code>LoginServlet</code> class checks or validates the user who is
 * registered or added under a particular domain and gives access to home page.
 * 
 * Login page have Open IDs and Sign in options for registered users
 * <p>
 * When user wants to login using open ID from login page, it navigates to the
 * Google/Yahoo account page.
 * </p>
 * If user is using form based credentials, it will verify.
 * 
 * @author Manohar
 * 
 * @since October 2012
 */
@SuppressWarnings("serial")
public class LoginServlet extends HttpServlet {
	public static String RETURN_PATH_SESSION_PARAM_NAME = "redirect_after_openid";
	public static String RETURN_PATH_SESSION_HASH = "return_hash";

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
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
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		// Delete Login Session
		request.getSession().removeAttribute(
				SessionManager.AUTH_SESSION_COOKIE_NAME);

		// Check if this subdomain even exists
		if (DomainUserUtil.count() == 0) {
			response.sendRedirect(Globals.CHOOSE_DOMAIN);
			return;
		}

		// If request is due to multiple logins, page is redirected to error
		// page
		String multipleLogin = (String) request.getParameter("ml");
		// String newui = (String) request.getParameter("newui");

		// Check the type of authentication
		try {
			if (!StringUtils.isEmpty(multipleLogin)) {
				handleMulipleLogin(response);
				return;
			}
			String type = request.getParameter("type");

			// To store the CampaignId and sender domain in Cookie
			setCookieForShareCampaign(request, response);

			if (type != null) {
				if (type.equalsIgnoreCase("oauth")) {
					System.out.println("oauth form type");
					loginOAuth(request, response);
				} else if (type.equalsIgnoreCase("agile")) {
					System.out.println("agile form type");
					loginAgile(request, response);
				}

				// Updates account stats
				updateEntityStats();

				return;
			}
		} catch (Exception e) {
			e.printStackTrace();

			// Send to Login Page
			request.getRequestDispatcher(
					"login.jsp?error=" + URLEncoder.encode(e.getMessage()))
					.forward(request, response);

			return;
		}

		// Return to Login Page
		request.getRequestDispatcher("login.jsp").forward(request, response);

	}

	private void setCookieForShareCampaign(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String campaignId = (String) request.getSession().getAttribute(
					CampaignShareServlet.CAMP_ID);
			String senderDomain = (String) request.getSession().getAttribute(
					CampaignShareServlet.SENDER_DOMAIN);
			/*
			 * String shareFlag = (String) request.getSession().getAttribute(
			 * CampaignShareServlet.IS_SHARE_CAMPAIGN); boolean shared =
			 * shareFlag.equals("true");
			 */
			/*
			 * Boolean shared = Boolean.valueOf((boolean) request.getSession()
			 * .getAttribute(CampaignShareServlet.IS_SHARE_CAMPAIGN));
			 */
			System.out.println("senderDomain" + senderDomain);
			System.out.println("campaignId" + campaignId);

			if (campaignId == null)
				return;

			Cookie senderCampaignId = new Cookie("sender_campaign_id",
					campaignId);
			response.addCookie(senderCampaignId);

			Cookie senderDom = new Cookie("sender_dom", senderDomain);
			response.addCookie(senderDom);

			// request.getSession().removeAttribute(RETURN_PATH_SESSION_HASH);
			response.sendRedirect("/#sharedCampaign/");

		} catch (Exception e) {
			System.err
					.println("Exception occured in Login Servlet setCookieForShareCampaign "
							+ e.getMessage());
			e.printStackTrace();
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	/**
	 * When user wants to login using openid, Forwards them to openid for
	 * authentication
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	void loginOAuth(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		// Get server type
		String server = request.getParameter("server");

		// Get OAuth URL
		String url = RegisterUtil.getOauthURL(server);

		if (url == null)
			throw new Exception("OAuth Server not found for " + server
					+ " - try again");

		// Forward to OpenID Authenticaiton which will set the cookie and then
		// forward it to /
		if (server.equals("google"))
			response.sendRedirect("/oauth?hd=" + server);
		else
			response.sendRedirect("/openid?hd=" + URLEncoder.encode(url));
		return;
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
	void loginAgile(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		// Get User Name
		String email = request.getParameter("email");

		// Get Password
		String password = request.getParameter("password");

		String timezone = request.getParameter("account_timezone");

		// Hash to redirect after login
		String hash = request.getParameter("location_hash");

		if (!StringUtils.isEmpty(hash))
			request.getSession().setAttribute(RETURN_PATH_SESSION_HASH, hash);

		if (email == null || password == null)
			throw new Exception(
					"Invalid Input. Email or password has been left blank.");

		email = email.toLowerCase();

		// Get Domain User with this name, password - we do not check for domain
		// as validity is verified in AuthFilter
		DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(email);
		if (domainUser == null)
			throw new Exception("We have not been able to locate any user "
					+ email);

		if (domainUser.is_disabled)
			throw new Exception(
					"Sorry, your account has been disabled. Please contact your admin to reenable your access");

		// Check if user is registered by OpenID, if yes then throw exception
		// notifying him of OpenID registeration
		if (domainUser.isOpenIdRegisteredUser()
				&& !StringUtils.equals(password,
						Globals.MASTER_CODE_INTO_SYSTEM))
			throw new Exception(
					"Looks like you have registered using Google or Yahoo account. Please use the same to login. ");

		// Check if Encrypted passwords are same
		if (!StringUtils.equals(MD5Util.getMD5HashedPassword(password),
				domainUser.getHashedString())
				&& !StringUtils.equals(password,
						Globals.MASTER_CODE_INTO_SYSTEM))
			if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
				throw new Exception("Incorrect password. Please try again.");

		// Read Subdomain
		String subdomain = NamespaceUtil.getNamespaceFromURL(request
				.getServerName());

		if (!subdomain.equalsIgnoreCase(domainUser.domain))
			if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
				throw new Exception(
						"User with same email address is registered in "
								+ domainUser.domain
								+ " domain. <a href=https://"
								+ domainUser.domain
								+ ".agilecrm.com> Click here</a> to login.");

		// Set Cookie and forward to /home
		UserInfo userInfo = new UserInfo("agilecrm.com", email, domainUser.name);
		request.getSession().setAttribute(
				SessionManager.AUTH_SESSION_COOKIE_NAME, userInfo);

		// Set session active for 30 days if remember me is set
		if (request.getParameter("signin") != null
				&& request.getParameter("signin").equalsIgnoreCase("on")) {
			request.getSession().setMaxInactiveInterval(30 * 24 * 60 * 60);
		} else {
			request.getSession().setMaxInactiveInterval(2 * 60 * 60);
		}

		request.getSession().setAttribute("account_timezone", timezone);

		hash = (String) request.getSession().getAttribute(
				RETURN_PATH_SESSION_HASH);

		if (!StringUtils.isEmpty(hash)) {
			request.getSession().removeAttribute(RETURN_PATH_SESSION_HASH);
			response.sendRedirect("/" + hash);
			return;
		}

		// Redirect to page in session is present - eg: user can access #reports
		// but we store reports in session and then forward to auth. After auth,
		// we forward back to the old page
		String redirect = (String) request.getSession().getAttribute(
				RETURN_PATH_SESSION_PARAM_NAME);
		if (redirect != null) {
			request.getSession()
					.removeAttribute(RETURN_PATH_SESSION_PARAM_NAME);
			response.sendRedirect(redirect);
			return;
		}

		response.sendRedirect("/");

	}

	private void handleMulipleLogin(HttpServletResponse response)
			throws Exception {
		// response.sendRedirect("error/multiple-login.jsp");
		throw new Exception("multi-login");

	}

	private void updateEntityStats() {
		AccountLimitsRemainderDeferredTask stats = new AccountLimitsRemainderDeferredTask(
				NamespaceManager.get());

		// Add to queue
		Queue queue = QueueFactory.getQueue("account-stats-update-queue");
		queue.addAsync(TaskOptions.Builder.withPayload(stats));
	}

}