package com.agilecrm;

import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.core.DomainUser;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.util.Util;
import com.google.appengine.api.utils.SystemProperty;

@SuppressWarnings("serial")
public class LoginServlet extends HttpServlet
{
    public void doPost(HttpServletRequest request, HttpServletResponse response)
	    throws IOException, ServletException
    {
	doGet(request, response);
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)
	    throws IOException, ServletException
    {

	// Delete Login Session
	request.getSession().removeAttribute(
		SessionManager.AUTH_SESSION_COOKIE_NAME);

	// Check if this subdomain even exists
	if (DomainUser.count() == 0)
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
		    loginOAuth(request, response);
		}
		else if (type.equalsIgnoreCase("agile"))
		{
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

	// Get Domain User with this name, password - we do not check for domain
	// as validity is verified in AuthFilter
	DomainUser domainUser = DomainUser.getDomainUserFromEmail(email);
	if (domainUser == null)
	    throw new Exception("We have not been able to locate any user");

	// Check if Encrypted passwords are same
	if (!StringUtils.equals(domainUser.password, Util.encrypt(password)))
	    if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
		throw new Exception("Incorrect password. Please try again.");

	// Set Cookie and forward to /home
	UserInfo userInfo = new UserInfo("agilecrm.com", email, domainUser.name);
	request.getSession().setAttribute(
		SessionManager.AUTH_SESSION_COOKIE_NAME, userInfo);

	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
	{
	    response.sendRedirect("https://" + domainUser.domain
		    + ".agilecrm.com/");
	}
	else
	    response.sendRedirect("/");

    }
}
