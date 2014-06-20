package com.agilecrm.scribe.login.util;

import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.scribe.builder.api.Api;
import org.scribe.builder.api.YahooApi;
import org.scribe.oauth.OAuthService;

import com.agilecrm.scribe.api.GoogleApi;
import com.agilecrm.scribe.login.serviceproviders.GoogleLoginService;
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

	YAHOO(YahooLoginService.class, YahooApi.class);

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

	if (domainUser == null)
	{

	    // resp.sendRedirect("/register");
	    req.getSession().setAttribute("return_url", "/register");
	    return;
	}

	// If the namespace is different, redirect to the correct domain
	String domain = NamespaceManager.get();
	System.out.println(domainUser + " " + domain);
	String returnURL = (String) req.getSession().getAttribute("return_url");
	if (domainUser != null && domainUser.domain != null && domain != null
		&& !domain.equalsIgnoreCase(domainUser.domain))
	{
	    // String path = "https://" + domainUser.domain +
	    // ".agilecrm.com/scribe?service=" +
	    // ScribeServlet.SERVICE_TYPE_GOOGLE_OAUTH2;

	    // String path = "https://" + domainUser.domain +
	    // "-dot-mcsandbox-dot-agile-crm-cloud.appspot.com/oauth";
	    String path = "https://" + domainUser.domain + ".agilecrm.com/oauth";
	    if (returnURL != null)
		path += "?return_url=" + URLEncoder.encode(returnURL);

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
    }

    public static OAuthService getLoginService(HttpServletRequest request, HttpServletResponse response,
	    String serviceName)
    {
	String server = (String) request.getParameter("hd");

	String serverFromSession = (String) request.getSession().getAttribute(OAUTH_SERVER_ATTRIBUTE);

	System.out.println("*********************************************");
	System.out.println(serverFromSession);
	if (StringUtils.isEmpty(server) && StringUtils.isEmpty(serverFromSession))
	    return null;

	if (server == null)
	    server = serverFromSession;
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