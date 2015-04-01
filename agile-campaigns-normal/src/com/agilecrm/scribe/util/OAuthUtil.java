package com.agilecrm.scribe.util;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.oauth.OAuthService;

import com.agilecrm.scribe.ScribeServlet;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.thirdparty.google.GoogleServiceUtil;

/**
 * <code>OAuthUtil</code> class contains methods required for OAuth Login
 * 
 * @author Manohar
 * @since Mar 2014
 */
public class OAuthUtil
{

    // Get Email from Email Scope
    public static String getEmail(OAuthService service, String code)
    {
	// Get Access Token
	HashMap<String, Object> tokenMap = GoogleServiceUtil.exchangeAuthTokenForAccessToken(code, ScribeServlet.GOOGLE_OAUTH2_SCOPE);

	// Access URL
	String accessURL = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, accessURL);

	// Send OAuth Request
	Token token = new Token(((String) tokenMap.get("access_token")), "dummy");
	service.signRequest(token, oAuthRequest);
	Response response = oAuthRequest.send();
	System.out.println(response.getBody());

	String email = "";
	try
	{
	    JSONObject jsonObject = new JSONObject(response.getBody());
	    email = jsonObject.getString("email");
	    System.out.println("Email " + email);
	}
	catch (Exception e)
	{
	}

	return email;
    }

    // Login
    public static void login(HttpServletRequest req, HttpServletResponse resp, String code, OAuthService service) throws IOException
    {
	String email = getEmail(service, code);

	// Redirect to register if Domain User is not found
	DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(email);
	if (domainUser == null)
	{
	    resp.sendRedirect("/register");
	    System.out.println("User Not found ");
	    return;
	}

	// If the namespace is different, redirect to the correct domain
	String domain = NamespaceManager.get();
	System.out.println(domainUser + " " + domain);
	String returnURL = (String) req.getSession().getAttribute("return_url");
	if (domainUser != null && domainUser.domain != null && domain != null && !domain.equalsIgnoreCase(domainUser.domain))
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
	UserInfo userInfo = new UserInfo("agilecrm.com", email, domainUser.name);
	req.getSession().setAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME, userInfo);
	SessionManager.set(userInfo);
    }
}