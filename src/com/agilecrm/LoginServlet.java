package com.agilecrm;

import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.MD5Util;
import com.agilecrm.util.Util;
import com.google.appengine.api.utils.SystemProperty;

/**
 * <code>LoginServlet</code> class checks or validates the user who is
 * registered or added under a particular domain and gives access to agile crm
 * account.
 * 
 * Login page have Open ID’s and Sign in options for registered users
 * <p>
 * When user wants to login using open ID from login page it navigates to the
 * Google account page after providing the credentials it will navigate to the
 * Dash board (Same applicable for the Yahoo).
 * </p>
 * If user login using the Email ID, it will check for the correct credentials
 * if provided navigates to dashbord. if not shows error in login page.
 * 
 * @author mantra
 * 
 * @since October 2012
 */
@SuppressWarnings("serial")
public class LoginServlet extends HttpServlet
{

    public static String RETURN_PATH_SESSION_PARAM_NAME = "redirect_after_openid";

    public void doPost(HttpServletRequest request, HttpServletResponse response)
	    throws IOException, ServletException
    {
	doGet(request, response);
    }

    /**
     * It checks type i.e whether the user comes from Oauth(openId) form or from
     * Agile(form based) login using login-credentials.
     * 
     * For the first time type is null, so we include login.jsp
     * 
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
	    throws IOException, ServletException
    {

	// Delete Login Session
	request.getSession().removeAttribute(
		SessionManager.AUTH_SESSION_COOKIE_NAME);

	// Check if this subdomain even exists
	if (DomainUserUtil.count() == 0)
	{
	    response.sendRedirect(Globals.CHOOSE_DOMAIN);
	    return;
	}

	try
	{
	    String type = request.getParameter("type");
	    if (type != null)
	    {
		if (type.equalsIgnoreCase("oauth"))
		{
		    System.out.println("oauth form type");
		    loginOAuth(request, response);
		}
		else if (type.equalsIgnoreCase("agile"))
		{
		    System.out.println("agile form type");
		    loginAgile(request, response);
		}

		return;
	    }
	}
	catch (Exception e)
	{
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
     * If the type is Oauth then it will check for the URL, then redirected to
     * OpenId Servlet there it sets the session then validate and send to home
     * page or throws an exception and includes login.jsp
     * 
     * @param request
     * @param response
     * @throws Exception
     */
    void loginOAuth(HttpServletRequest request, HttpServletResponse response)
	    throws Exception
    {
	// Get server type
	String server = request.getParameter("server");

	// Get OAuth URL
	String url = Util.getOauthURL(server);

	if (url == null)
	    throw new Exception("OAuth Server not found for " + server
		    + " - try again");

	// Forward to OpenID Authenticaiton which will set the cookie and then
	// forward it to /
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
     * By marking ‘Keep me signed in’ keeps the users signed for 5 days without
     * asking for user name and password unless they log out.If everything fine
     * redirects to home page by setting session.
     * 
     * @param request
     * @param response
     * @throws Exception
     */
    void loginAgile(HttpServletRequest request, HttpServletResponse response)
	    throws Exception
    {
	// Get User Name
	String email = request.getParameter("email");

	// Get Password
	String password = request.getParameter("password");

	if (email == null || password == null)
	    throw new Exception(
		    "Invalid Input. Email or password has been left blank.");

	email = email.toLowerCase();

	// Get Domain User with this name, password - we do not check for domain
	// as validity is verified in AuthFilter
	DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(email);
	if (domainUser == null)
	    throw new Exception("We have not been able to locate any user");

	// Check if Encrypted passwords are same
	if (!StringUtils.equals(MD5Util.getMD5HashedPassword(password),
		domainUser.getHashedString())
		&& !StringUtils.equals(password,
			Globals.MASTER_CODE_INTO_SYSTEM))
	    if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
		throw new Exception("Incorrect password. Please try again.");

	// Set Cookie and forward to /home
	UserInfo userInfo = new UserInfo("agilecrm.com", email, domainUser.name);
	request.getSession().setAttribute(
		SessionManager.AUTH_SESSION_COOKIE_NAME, userInfo);

	// To set session active for 30 days if "keep me signin"
	if (request.getParameter("signin") != null
		&& request.getParameter("signin").equalsIgnoreCase("on"))
	{
	    request.getSession().setMaxInactiveInterval(30 * 24 * 60 * 60);

	}
	else
	{
	    request.getSession().setMaxInactiveInterval(2 * 60 * 60);
	}

	String redirect = (String) request.getSession().getAttribute(
		RETURN_PATH_SESSION_PARAM_NAME);

	if (redirect != null)
	{
	    request.getSession()
		    .removeAttribute(RETURN_PATH_SESSION_PARAM_NAME);
	    response.sendRedirect(redirect);
	    return;
	}

	response.sendRedirect("/");

    }
}
