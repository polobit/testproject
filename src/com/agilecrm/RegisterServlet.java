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
import com.agilecrm.util.RegisterUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;

/**
 * <code>RegisterServlet</code> class registers the user gives access to the
 * account in agile crm.
 * 
 * Register page have Open ID�s and Sign in options for registering users.
 * <p>
 * When user wants to register using open ID from register page it navigates to
 * the Google account page after providing the credentials it will navigate to
 * the Dashboard (Same applicable for the Yahoo).
 * </p>
 * 
 * If user wants to register using the Email ID, it will check for the valid
 * credentials if provided navigates to dashbord. if not shows error in register
 * page.
 * 
 * @author mantra
 * 
 * @since October 2012
 */

@SuppressWarnings("serial")
public class RegisterServlet extends HttpServlet
{

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
	doGet(request, response);
    }

    /**
     * If the user registering under a domain which is already existing, or the
     * domain is empty then it is redirected to choose domain page.
     * <p>
     * It checks whether user wants to register using existing google/yahoo
     * accounts(Oauth registration) or by giving his own credentials(Agile
     * registration).
     * </p>
     * 
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
	String type = request.getParameter("type");

	// Check if this domain is valid and not given out to anyone else
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
	    if (StringUtils.isEmpty(NamespaceManager.get())
		    || (DomainUserUtil.count() != 0 && StringUtils.isEmpty(type)))
	    {
		response.sendRedirect(Globals.CHOOSE_DOMAIN);
		return;
	    }

	try
	{

	    if (type != null)
	    {
		if (type.equalsIgnoreCase("oauth"))
		{
		    registerOAuth(request, response);
		}
		else if (type.equalsIgnoreCase("agile"))
		{
		    registerAgile(request, response);
		}

		return;
	    }
	}
	catch (Exception e)
	{

	    // Send to Login Page
	    request.getRequestDispatcher("register.jsp?error=" + URLEncoder.encode(e.getMessage())).forward(request,
		    response);
	    return;
	}

	// Return to Login Page
	request.getRequestDispatcher("register.jsp").forward(request, response);
    }

    /**
     * If the user is registering using Oauth, it first checks if user
     * information already exists then if exists domain user is created and it
     * is redirected to home page, if not - it checks for the url, if it is
     * present it deletes the previous session and to OpenId Servlet.
     * <p>
     * Then if user allows it gets the user information from that account then
     * sets the session and domain user is created and is redirected to home
     * page, else if user do not allow to share that accounts information it is
     * again redirected to choose domain page.
     * </p>
     * 
     * @param request
     * @param response
     * @throws Exception
     */
    public void registerOAuth(HttpServletRequest request, HttpServletResponse response) throws Exception
    {

	// Get User Info
	UserInfo userInfo = (UserInfo) request.getSession().getAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);

	// If userInfo and domain count is zero the it is considered as new
	// registration, else considered as open ID registration
	if (userInfo != null)
	{
	    if (DomainUserUtil.count() == 0)
	    {
		DomainUser domainUser = createUser(request, response, userInfo, "");
		response.sendRedirect("https://" + domainUser.domain + ".agilecrm.com/");
		return;
	    }

	    String redirect = (String) request.getSession().getAttribute(LoginServlet.RETURN_PATH_SESSION_PARAM_NAME);

	    if (redirect != null)
	    {
		request.getSession().removeAttribute(LoginServlet.RETURN_PATH_SESSION_PARAM_NAME);
		response.sendRedirect(redirect);
		return;
	    }

	    response.sendRedirect("/");
	    return;

	}

	// Get server type
	String server = request.getParameter("server");

	// Get OAuth URL
	String url = RegisterUtil.getOauthURL(server);
	if (url == null)
	    throw new Exception("OAuth Server not found for " + server + " - try again");

	// Delete Login Session
	request.getSession().removeAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);

	response.sendRedirect("/openid?hd=" + URLEncoder.encode(url));
	return;
    }

    /**
     * If the user registers with Agile form, it will check for username, email,
     * password and if present, all these data is stored in UserInfo class
     * object and domain user is created in the new domain.
     * 
     * @param request
     * @param response
     * @throws Exception
     */
    void registerAgile(HttpServletRequest request, HttpServletResponse response) throws Exception
    {
	// Get User Name
	String email = request.getParameter("email");

	// Get Password
	String password = request.getParameter("password");

	// Get Name
	String name = request.getParameter("name");

	if (email == null || password == null)
	    throw new Exception("Invalid Input. Email or password has been left blank.");

	email = email.toLowerCase();

	// Create User
	UserInfo userInfo = new UserInfo("agilecrm.com", email, name);
	DomainUser domainUser = createUser(request, response, userInfo, password);

	// Redirect to home page
	response.sendRedirect("https://" + domainUser.domain + ".agilecrm.com/");
    }

    /**
     * For creating Domain user, it will check whether the user is present
     * already with that email, Domain user is not created and if present throws
     * exception.Otherwise, it will capture all information of user such as IP
     * address, Country, city, etc.. is saved.
     * <p>
     * In this case, Domain user created is owner of that domain and he should
     * be admin and cannot be disabled.
     * </p>
     * 
     * @param request
     * @param response
     * @param userInfo
     * @param password
     * @return DomainUser
     * @throws Exception
     */
    DomainUser createUser(HttpServletRequest request, HttpServletResponse response, UserInfo userInfo, String password)
	    throws Exception
    {
	// Get Domain
	String domain = NamespaceManager.get();
	if (StringUtils.isEmpty(domain))
	    if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
		throw new Exception("Invalid Domain. Please go to choose domain.");

	// Get Domain User with this name, password - we do not check for domain
	// as validity is verified in AuthFilter
	DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(userInfo.getEmail());
	if (domainUser != null)
	{
	    // Delete Login Session
	    request.getSession().removeAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);

	    throw new Exception("User with same email address already exists in our system for " + domainUser.domain
		    + " domain");
	}

	request.getSession().setAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME, userInfo);

	// Create Domain User, Agile User
	domainUser = new DomainUser(domain, userInfo.getEmail(), userInfo.getName(), password, true, true);

	// Set IP Address
	domainUser.setInfo(DomainUser.IP_ADDRESS, "");
	domainUser.setInfo(DomainUser.COUNTRY, request.getHeader("X-AppEngine-Country"));
	domainUser.setInfo(DomainUser.CITY, request.getHeader("X-AppEngine-City"));
	domainUser.setInfo(DomainUser.LAT_LONG, request.getHeader("X-AppEngine-CityLatLong"));

	domainUser.save();

	userInfo.setDomainId(domainUser.id);
	return domainUser;
    }
}