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
import com.agilecrm.core.DomainUser;
import com.google.gdata.util.common.base.Charsets;

/**
 * A very simple Servlet Filter for HTTP Basic Auth. Only supports exactly one
 * user with a password. Please note, HTTP Basic Auth is not encrypted and hence
 * unsafe!
 * 
 * @author Timo B. Huebel (me@tbh.name) (initial creation)
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

    @Override
    public void doFilter(final ServletRequest request,
	    final ServletResponse response, final FilterChain chain)
	    throws IOException, ServletException
    {
	System.out.println("Basic OAuth Filter");

	final HttpServletRequest httpRequest = (HttpServletRequest) request;
	final HttpServletResponse httpResponse = (HttpServletResponse) response;

	final String auth = httpRequest.getHeader("Authorization");
	if (auth != null)
	{
	    final int index = auth.indexOf(' ');
	    if (index > 0)
	    {
		final String[] credentials = StringUtils.split(new String(
			Base64.decodeBase64(auth.substring(index).getBytes()),
			Charsets.UTF_8), ':');

		if (credentials.length == 2)
		{
		    // Get user & password
		    String user = credentials[0];
		    String password = credentials[1];

		    // Get AgileUser
		    DomainUser domainUser = DomainUser
			    .getDomainUserFromEmail(user);

		    // Check if ApiKey
		    String apiKey = APIKey.getAPIKey().api_key;

		    System.out.println(user + " " + password + " " + domainUser
			    + " " + apiKey);

		    if (domainUser != null && password.equals(apiKey))
		    {
			chain.doFilter(httpRequest, httpResponse);
			return;
		    }
		}
	    }
	}

	System.out.println("Error");
	httpResponse.setHeader("WWW-Authenticate", "Basic realm=\"" + _realm
		+ "\"");
	httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException
    {
	// Nothing to do
    }
}