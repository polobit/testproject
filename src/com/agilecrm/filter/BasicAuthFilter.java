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

import com.agilecrm.account.APIKey;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
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

		    // Get AgileUser
		    DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(user);

		    // Gets APIKey, to authenticate the user
		    String apiKey = APIKey.getAPIKeyRelatedToUser(domainUser.id).api_key;

		    System.out.println(user + " " + password + " " + domainUser + " " + apiKey);

		    // If domain user exists and the APIKey matches, request is
		    // given access
		    if (domainUser != null && password.equals(apiKey))
		    {
			UserInfo userInfo = new UserInfo("agilecrm.com", domainUser.email, domainUser.name);

			SessionManager.set(userInfo);

			chain.doFilter(httpRequest, httpResponse);
			return;
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
}