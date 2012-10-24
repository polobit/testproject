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
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;

@SuppressWarnings("serial")
public class RegisterServlet extends HttpServlet
{

    public void doPost(HttpServletRequest request, HttpServletResponse response)
	    throws IOException, ServletException
    {
	doGet(request, response);
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)
	    throws IOException, ServletException
    {
	// Check if this domain is valid and not given out to anyone else
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
	    if (StringUtils.isEmpty(NamespaceManager.get())
		    || DomainUser.count() != 0)
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
	    request.getRequestDispatcher(
		    "register.jsp?error=" + URLEncoder.encode(e.getMessage()))
		    .forward(request, response);

	    return;
	}

	// Return to Login Page
	request.getRequestDispatcher("register.jsp").forward(request, response);
    }

    public void registerOAuth(HttpServletRequest request,
	    HttpServletResponse response) throws Exception
    {

	// Get server type
	String server = request.getParameter("server");

	// Get User Info
	UserInfo userInfo = (UserInfo) request.getSession().getAttribute(
		SessionManager.AUTH_SESSION_COOKIE_NAME);
	if (userInfo != null)
	{
	    DomainUser domainUser = createUser(request, response, userInfo, "");
	    response.sendRedirect("https://" + domainUser.domain
		    + ".agilecrm.com/");
	    return;
	}

	// Get OAuth URL
	String url = Util.getOauthURL(server);
	if (url == null)
	    throw new Exception("OAuth Server not found for " + server
		    + " - try again");

	// Delete Login Session
	request.getSession().removeAttribute(
		SessionManager.AUTH_SESSION_COOKIE_NAME);

	response.sendRedirect("/openid?hd=" + URLEncoder.encode(url));
	return;
    }

    void registerAgile(HttpServletRequest request, HttpServletResponse response)
	    throws Exception
    {
	// Get User Name
	String email = request.getParameter("email");

	// Get Password
	String password = request.getParameter("password");

	// Get Name
	String name = request.getParameter("name");

	if (email == null || password == null)
	    throw new Exception(
		    "Invalid Input. Email or password has been left blank.");

	email = email.toLowerCase();

	// Create User
	UserInfo userInfo = new UserInfo("agilecrm.com", email, name);
	DomainUser domainUser = createUser(request, response, userInfo,
		password);

	// Redirect to home page
	response.sendRedirect("https://" + domainUser.domain + ".agilecrm.com/");
    }

    DomainUser createUser(HttpServletRequest request,
	    HttpServletResponse response, UserInfo userInfo, String password)
	    throws Exception
    {
	// Get Domain
	String domain = NamespaceManager.get();
	if (StringUtils.isEmpty(domain))
	    throw new Exception("Invalid Domain. Please go to choose domain.");

	// Get Domain User with this name, password - we do not check for domain
	// as validity is verified in AuthFilter
	DomainUser domainUser = DomainUser.getDomainUserFromEmail(userInfo
		.getEmail());
	if (domainUser != null)
	{
	    // Delete Login Session
	    request.getSession().removeAttribute(
		    SessionManager.AUTH_SESSION_COOKIE_NAME);

	    throw new Exception(
		    "User with same email address already exists in our system for "
			    + domainUser.domain + " domain");
	}

	request.getSession().setAttribute(
		SessionManager.AUTH_SESSION_COOKIE_NAME, userInfo);

	// Create Domain User, Agile User
	domainUser = new DomainUser(domain, userInfo.getEmail(),
		userInfo.getName(), password, true, true);

	// Set IP Address
	domainUser.setInfo(DomainUser.IP_ADDRESS, "");
	domainUser.setInfo(DomainUser.COUNTRY,
		request.getHeader("X-AppEngine-Country"));
	domainUser.setInfo(DomainUser.CITY,
		request.getHeader("X-AppEngine-City"));
	domainUser.setInfo(DomainUser.LAT_LONG,
		request.getHeader("X-AppEngine-CityLatLong"));

	domainUser.save();
	return domainUser;
    }
}