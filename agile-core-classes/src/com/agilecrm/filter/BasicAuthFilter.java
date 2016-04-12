package com.agilecrm.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.json.simple.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.account.util.APIKeyUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.MD5Util;
import com.google.appengine.api.NamespaceManager;
import com.google.gdata.util.common.base.Charsets;

/**
 * <code>BasicAuthFilter</code> is a simple Servlet Filter for HTTP Basic Auth.
 * Filters the requests, with url path starts with "/dev", to allow access based
 * on APIKey allocated to domain and domain user email id. Verifies the domain
 * user and the APIkey related to domain to allow access.
 * <p>
 * It expects domain user email and APIKey seperated by : and encrypted and set
 * in request headers (with key "Authorization")
 * <p>
 * 
 */
public class BasicAuthFilter implements Filter
{

    public static final String PARAM_USER = "user";
    public static final String PARAM_PASSWORD = "password";
    public static final String PARAM_REALM = "realm";

    public static String _realm = "agilecrm";

    @Override
    public void destroy()
    {
	// Nothing to do.
    }

    /**
     * Filter the request, retrives the domain user email, its respective APIKey
     * and verifies them to allow access
     */
    @Override
    public void doFilter(final ServletRequest request, final ServletResponse response, final FilterChain chain)
	    throws IOException, ServletException
    {
	System.out.println("Basic OAuth Filter");

	final HttpServletRequest httpRequest = (HttpServletRequest) request;
	final HttpServletResponse httpResponse = (HttpServletResponse) response;

	// Gets the "Authorization" from header, which is set with domain user
	// and APIKey
	final String auth = httpRequest.getHeader("Authorization");

	// If Authorization in header is not null, then retrieves domain user
	// and password from the header
	if (auth != null)
	{
	    final int index = auth.indexOf(' ');
	    if (index > 0)
	    {
		final String[] credentials = StringUtils.split(
			new String(Base64.decodeBase64(auth.substring(index).getBytes()), Charsets.UTF_8), ':');

		if (credentials.length == 2)
		{
		    // Get user & password
		    String user = credentials[0];
		    String password = credentials[1];

		    String email = "";
		    if (user != null)
		    {
			System.out.println("User = " + user);
			email = user.toLowerCase();
		    }

		    // Get AgileUser
		    DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(email);

		    if (domainUser == null || !domainUser.domain.equals(NamespaceManager.get()))
		    {
			JSONObject duser = new JSONObject();

			duser.put("status", "401");
			duser.put("exception message", "authentication issue");

			httpResponse.setContentType("application/json");
			httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			httpResponse.getWriter().write(duser.toString());

			return;
		    }

		    // Domain should be checked to avoid saving in other domains

		    // If domain user exists and the APIKey matches, request
		    // is
		    // given access
		    if (isValidPassword(password, domainUser) || isValidAPIKey(password, domainUser))
		    {
			try
			{
			    setUser(domainUser);
			    chain.doFilter(httpRequest, httpResponse);
			    return;
			}
			catch (Exception e)
			{
			    System.out.println("Error");

			    System.out.println(e.getMessage());

			    JSONObject address = new JSONObject();

			    address.put("status", "500");
			    address.put("exception message", e.getMessage());

			    httpResponse.setContentType("application/json");
			    httpResponse.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

			    httpResponse.getWriter().write(address.toString());
			    System.err.println("This code has below error : ");
			    e.printStackTrace();
			    return;
			}
		    }

		}
	    }
	}

	System.out.println("Error");
	httpResponse.setHeader("WWW-Authenticate", "Basic realm=\"" + _realm + "\"");
	httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException
    {
	// Nothing to do
    }

    /**
     * Sets user in session, so it can be used while filling owner to entities
     * 
     * @param domainUser
     */
    public void setUser(DomainUser domainUser)
    {
	UserInfo userInfo = new UserInfo("agilecrm.com/dev", domainUser.email, domainUser.name);

	SessionManager.set(userInfo);
    }

    /**
     * Checks if API key sent in request matches with user.
     * 
     * @param apiKey
     * @param user
     * @return
     */
    boolean isValidAPIKey(String apiKey, DomainUser user)
    {
	// Gets APIKey, to authenticate the user
	APIKey key = APIKey.getAPIKeyRelatedToUser(user.id);

	if (key == null)
	    return false;

	String apiKeyFromDB = key.api_key;

	// Checks APIKey received in request and APIKey from DB
	if (StringUtils.equals(apiKey, apiKeyFromDB))
	    return true;

	return false;
    }

    /**
     * Checks if password sent in request is valid and matches with encoded
     * password in domainuser
     * 
     * @param password
     * @param user
     * @return
     */
    boolean isValidPassword(String password, DomainUser user)
    {

	// Encodes password received in request, so it can be verified with
	// encoded pasword in domain user
	String hashedPassword = MD5Util.getMD5HashedPassword(password);

	// Gets encoded password from domain user
	String passwordFromDB = user.getHashedString();

	if (StringUtils.equals(hashedPassword, passwordFromDB))
	    return true;

	return false;
    }

}