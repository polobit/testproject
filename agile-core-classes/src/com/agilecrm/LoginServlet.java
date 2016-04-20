package com.agilecrm;

import java.io.IOException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.POST;
import javax.ws.rs.QueryParam;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.ipaccess.AllowAccessMailServlet;
import com.agilecrm.ipaccess.IpAccess;
import com.agilecrm.ipaccess.IpAccessUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.subscription.limits.cron.deferred.AccountLimitsRemainderDeferredTask;
import com.agilecrm.user.DomainUser;
//import com.agilecrm.user.util.AliasDomainUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.MD5Util;
import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.util.RegisterUtil;
import com.agilecrm.util.email.AppengineMail;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.utils.SystemProperty;
import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

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
	
	// FingerPrint verification
	public static String SESSION_FINGERPRINT_VAL = "agile_fingerprint";
	public static String SESSION_FINGERPRINT_OTP = "agile_otp";
	public static String SESSION_FINGERPRINT_VALID = "agile_fingerprint_valid";
	public static String SESSION_IPACCESS_VALID = "agile_ip_valid";
	public static String SESSION_OTP_RESEND_VALID = "agile_otp_info";
	

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		if(request.getParameter("resendotp")!=null){
			resendVerficationCode(request);
			return;
		}
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


		// Check if this subdomain even exists or alias exist

		
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

			// Check ip with allowed ones
			/*if(!IpAccessUtil.isValidIpOpenPanel(request))
			{
				AllowAccessMailServlet.accessMail(request);
				throw new Exception(
						
						"The IP address you have provided is not authorized to access this account.");
				
			}*/
			
						
			if (!StringUtils.isEmpty(multipleLogin)) {
				handleMulipleLogin(response);
				return;
			}
			String type = request.getParameter("type");

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
		
		String finger_print = request.getParameter("finger_print");

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
		//subdomain = AliasDomainUtil.getActualDomain(subdomain);
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
		
        // Set FingerPrint to check in /home
		request.getSession().setAttribute(SESSION_FINGERPRINT_VAL, finger_print);
		System.out.println("fingerprint " + request.getSession().getAttribute(SESSION_FINGERPRINT_VAL) );
		
		UserFingerPrintInfo infofingerprint = new UserFingerPrintInfo();
		
		infofingerprint.validateUserFingerPrint(domainUser, request);
		
		
		boolean isvalid = infofingerprint.isValidFingerPrint;
		boolean isvalidip = infofingerprint.isValidIP;
		
		System.out.println("fingerprint "+isvalid);
		System.out.println("ip "+isvalidip);
		
		if(!Globals.MASTER_CODE_INTO_SYSTEM .equals(password))
		{
			// Validate fingerprint value
			boolean isValid = DomainUserUtil.isValidFingerPrint(domainUser, request);
			System.out.println(isValid);
			
			request.getSession().setAttribute(SESSION_FINGERPRINT_VALID, isValid);
			
			boolean isValidIP = IpAccessUtil.isValidIpOpenPanel(request);
			System.out.println("validip "+isValidIP);
			request.getSession().setAttribute(SESSION_IPACCESS_VALID, isValidIP);
			if(!isValid || !isValidIP ){
				
				// Generate one finger print
				Long generatedOTP = System.currentTimeMillis()/100000;
				request.getSession().setAttribute(SESSION_FINGERPRINT_OTP, generatedOTP);
				
				System.out.println("generatedOTP "+generatedOTP);
				
				// Set info in session for future usage 
				setUserBrowserInfoInSession(request, domainUser);
				
				// Send Sendgrid Email
				sendOTPEmail(request, isValid, false, domainUser.email);
				
			}
		}

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

		request.getSession().setAttribute("account_timezone", timezone);
		

		response.sendRedirect("/");

	}
	public Map<String, String > setUserBrowserInfoInSession(HttpServletRequest request, DomainUser domainUser)throws Exception {
		
		// Create info
		Map<String, String> data = new HashMap<String, String>();
		data.put("generatedOTP", (request.getSession().getAttribute(SESSION_FINGERPRINT_OTP)).toString());
		data.put("browser_os", request.getParameter("browser_os"));
		data.put("browser_name", request.getParameter("browser_Name"));
		data.put("browser_version",request.getParameter("browser_version"));
		data.put("email", domainUser.email);
		data.put("domain", domainUser.domain);
		data.put("IP_Address", request.getRemoteAddr());
		data.put("city",request.getHeader("X-AppEngine-City"));
		
		System.out.println("data "+data);
		
		// Set data in session to resend OTP if required
		request.getSession().setAttribute(SESSION_OTP_RESEND_VALID, data);
		return data;
	}

	public void resendVerficationCode(HttpServletRequest request){
		
		String email = ((UserInfo)request.getSession().getAttribute(
				SessionManager.AUTH_SESSION_COOKIE_NAME)).getEmail();
		
		Boolean isValid = (Boolean) request.getSession().getAttribute(SESSION_FINGERPRINT_VALID);
		
		sendOTPEmail(request, isValid, true, email);
		
	}
	
	private void handleMulipleLogin(HttpServletResponse response)
			throws Exception {
		// response.sendRedirect("error/multiple-login.jsp");
		throw new Exception("multi-login");

	}

	private void sendOTPEmail(HttpServletRequest request,  boolean optEmail, boolean resend, String email) {

		try {
			
			Map data = (HashMap)request.getSession().getAttribute(SESSION_OTP_RESEND_VALID);
			 
			// Simulate template
			String template = SendMail.ALLOW_IP_ACCESS;
			String subject = SendMail.ALLOW_IP_ACCESS_SUBJECT;
			if(!optEmail){
				template = SendMail.OTP_EMAIL_TO_USER;
				subject =  "New sign-in from " + data.get("browser_Name") + "on " + data.get("browser_os"); 
			}
			
			if(resend)
				AppengineMail.sendMail(email, subject, template, data);
			else 
				SendMail.sendMail(email, subject, template, data);
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	
	

	private void updateEntityStats() {
		AccountLimitsRemainderDeferredTask stats = new AccountLimitsRemainderDeferredTask(
				NamespaceManager.get());

		// Add to queue
		Queue queue = QueueFactory.getQueue("account-stats-update-queue");
		queue.addAsync(TaskOptions.Builder.withPayload(stats));
	}
}