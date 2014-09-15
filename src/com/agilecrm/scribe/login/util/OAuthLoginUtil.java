package com.agilecrm.scribe.login.util;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.scribe.builder.api.Api;
import org.scribe.builder.api.YahooApi;
import org.scribe.oauth.OAuthService;

import com.agilecrm.LoginServlet;
import com.agilecrm.scribe.api.GoogleApi;
import com.agilecrm.scribe.api.LinkedinAPI;
import com.agilecrm.scribe.login.serviceproviders.GoogleLoginService;
import com.agilecrm.scribe.login.serviceproviders.LinkedinLoginService;
import com.agilecrm.scribe.login.serviceproviders.OAuthLoginService;
import com.agilecrm.scribe.login.serviceproviders.YahooLoginService;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>OAuthUtil</code> class contains methods required for OAuth Login
 * 
 * @author Manohar
 * @since Mar 2014
 */
public class OAuthLoginUtil
{

    public static final String OAUTH_SERVER_ATTRIBUTE = "oauth_server";

    public static enum OpenIdServiceProvider
    {

	GOOGLE(GoogleLoginService.class, GoogleApi.class),

	YAHOO(YahooLoginService.class, YahooApi.class),

	LINKEDIN(LinkedinLoginService.class, LinkedinAPI.class);

	Class<? extends OAuthLoginService> loginService;
	Class<? extends Api> apiClass;

	OpenIdServiceProvider(Class<? extends OAuthLoginService> loginService, Class<? extends Api> apiClass)
	{
	    this.loginService = loginService;
	    this.apiClass = apiClass;
	}

	public OAuthLoginService getLoginService()
	{
	    try
	    {
		return loginService.newInstance();
	    }
	    catch (InstantiationException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
		return null;
	    }
	    catch (IllegalAccessException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
		return null;
	    }
	}

	public Class<? extends Api> getApiClass()
	{
	    return apiClass;
	}

    }

    public static UserInfo getUserInfo(HttpServletRequest req, HttpServletResponse resp, OAuthService service,
	    String code)
    {
	String server = (String) req.getSession().getAttribute(OAUTH_SERVER_ATTRIBUTE);
	if (StringUtils.isEmpty(server))
	    return null;

	OpenIdServiceProvider serviceProvider = null;
	try
	{
	    serviceProvider = OpenIdServiceProvider.valueOf(server.toUpperCase());
	}
	catch (EnumConstantNotPresentException e)
	{
	    return null;
	}

	// System.out.println(GoogleServiceUtil.exchangeAuthTokenForAccessToken(code,
	// ScribeServlet.GOOGLE_OAUTH2_SCOPE));
	OAuthLoginService loginService = null;
	try
	{
	    loginService = GoogleLoginService.class.newInstance();
	}
	catch (ReflectiveOperationException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return null;
	}

	loginService.getService();

	loginService.getToken(code);

	System.out.println("login service");
	return loginService.getUserInfo();
    }

    // Login
    public static void login(HttpServletRequest req, HttpServletResponse resp, String code, OAuthService service)
	    throws IOException
    {
	// email = getEmail(service, code);

	UserInfo userInfo = getUserInfo(req, resp, service, code);
	DomainUser domainUser = null;

	// Redirect to register if Domain User is not found
	if (userInfo != null && userInfo.getEmail() != null)
	{
	    domainUser = DomainUserUtil.getDomainUserFromEmail(userInfo.getEmail());
	}

	req.getSession().setAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME, userInfo);

	System.out.println(domainUser);

	String returnURL = (String) req.getSession().getAttribute("return_url");

	boolean isGmailGadgetRequest = !StringUtils.isEmpty(returnURL) && returnURL.contains("gmail?command=");

	if (domainUser == null)
	{
	    // Request is Gmail gadget request, page should be redirected to
	    // register page.
	    if (isGmailGadgetRequest)
	    {
		req.getSession().removeAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);
		resp.sendRedirect(returnURL);

		return;
	    }
	    // Oauth should be set as query parameter so it creates new account
	    // based on session info set
	    req.getSession().setAttribute("return_url", "/register?type=oauth");
	    return;
	}

	// If the namespace is different, redirect to the correct domain
	String domain = NamespaceManager.get();
	System.out.println(domainUser + " " + domain);

	// If return url contains gmail?command= then request is to associate
	// google gadget to user
	if (isGmailGadgetRequest)
	{
	    System.out.println("return to gmail gadget service");
	    return;
	}

	if (domainUser != null && domainUser.domain != null && domain != null
		&& !domain.equalsIgnoreCase(domainUser.domain))
	{
	    // String path = "https://" + domainUser.domain +
	    // ".agilecrm.com/scribe?service=" +
	    // ScribeServlet.SERVICE_TYPE_GOOGLE_OAUTH2;

	    // String path = "https://" + domainUser.domain +
	    // "-dot-mcsandbox-dot-agile-crm-cloud.appspot.com/oauth";
	    String path = "https://" + domainUser.domain + ".agilecrm.com/";

	    System.out.println("Redirecting to " + path);

	    // Remove from Current Session
	    req.getSession(false).removeAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);
	    resp.sendRedirect(path);
	    return;
	}

	// Set Cookie and forward. Scribe Servlet will redirect to either home
	// or return_url
	req.getSession().setAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME, userInfo);
	SessionManager.set(userInfo);

	// Redirect to page in session is present - eg: user can access #reports
	// but we store reports in session and then forward to auth. After auth,
	// we forward back to the old page

	req.getSession().removeAttribute("return_url");

	String redirect = (String) req.getSession().getAttribute(LoginServlet.RETURN_PATH_SESSION_PARAM_NAME);
	if (redirect != null)
	{
	    req.getSession().removeAttribute(LoginServlet.RETURN_PATH_SESSION_PARAM_NAME);
	    resp.sendRedirect(redirect);
	    return;
	}

	resp.sendRedirect("/");
    }

    public static OAuthService getLoginService(HttpServletRequest request, HttpServletResponse response,
	    String serviceName)
    {
	String server = (String) request.getParameter("hd");

	String serverFromSession = (String) request.getSession().getAttribute(OAUTH_SERVER_ATTRIBUTE);

	System.out.println("*********************************************");
	System.out.println(serverFromSession);
	if (server == null)
	    server = serverFromSession;

	if (StringUtils.isEmpty(server) && StringUtils.isEmpty(serverFromSession))
	    server = "google";

	System.out.println(server);
	OpenIdServiceProvider serviceProvider = null;
	try
	{
	    serviceProvider = OpenIdServiceProvider.valueOf(server.toUpperCase());
	}
	catch (EnumConstantNotPresentException e)
	{
	    return null;
	}

	request.getSession().setAttribute(OAUTH_SERVER_ATTRIBUTE, server);
	String callbackURL = request.getRequestURL().toString();
	OAuthLoginService loginService = serviceProvider.getLoginService();
	loginService.setCallback(callbackURL);

	// Gets session and sets attribute "oauth.service" to service type
	request.getSession().setAttribute("oauth.service", serviceName);
	return loginService.getService();
    }
}