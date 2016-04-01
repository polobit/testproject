package com.agilecrm.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.account.APIKey;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.JSAPIUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>JSAPIFilter</code> is a simple Servlet Filter for JS API Auth. Verifies
 * APIkey related to domain to allow access
 * <p>
 * Request to url path "/js/api/" should include query parameter "id" with
 * APIKey as value
 * </p>
 * 
 */
public class DevAPIFilter implements Filter
{

    @Override
    public void destroy()
    {
	// Nothing to do.
    }

    /**
     * Gets the id from the request and tries to match with the APIKey of
     * current namespace (namespace is set in the NamespaceFilter according to
     * domain in the url), if key matches request it allowed for further access
     */
    @Override
    public void doFilter(final ServletRequest request, final ServletResponse response, final FilterChain chain)
	    throws IOException, ServletException
    {

	final HttpServletRequest httpRequest = (HttpServletRequest) request;
	final HttpServletResponse httpResponse = (HttpServletResponse) response;

	// Gets the id from the request
	String domain = httpRequest.getParameter("domain");
	String password = httpRequest.getParameter("password");
	String username = httpRequest.getParameter("username");
	
	// If APIKey from the request is not null, If key in the request matches
	// with APIKey of current namespace/domain request is allowed to access
	// functionalities in "js/api".
	if (domain != null && password != null && username != null)
	{
	    // Get AgileUser
	    DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(username);
	    // Domain should be checked to avoid saving in other domains
	    if (domainUser != null && domainUser.domain != null && domainUser.domain.equals(NamespaceManager.get())
		    && !StringUtils.isEmpty(password))
	    {
		// If domain user exists and the APIKey matches, request is
		// given access
		if (isValidPassword(password, domainUser) || APIKey.isValidJSKey(password)
		        || APIKey.isPresent(password))
		{
		    UserInfo userInfo = new UserInfo("agilecrm.com/js", domainUser.email, domainUser.name);

		    SessionManager.set(userInfo);
		    chain.doFilter(httpRequest, httpResponse);
		    return;
		}
		sendJSONErrorResponse((HttpServletRequest) request, (HttpServletResponse) response,
		        JSAPIUtil.generateJSONErrorResponse(JSAPIUtil.Errors.UNAUTHORIZED));
		return;
	    }
	}
	sendJSONErrorResponse((HttpServletRequest) request, (HttpServletResponse) response,
	        JSAPIUtil.generateJSONErrorResponse(JSAPIUtil.Errors.API_KEY_MISSING));
    }

    private void sendJSONErrorResponse(HttpServletRequest request, HttpServletResponse response, String responseString)
	    throws IOException
    {
    	
    	System.out.println("Error - Key does not match for JS API");
	    response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
	
    }

    
    @Override
    public void init(FilterConfig arg0) throws ServletException
    {
	// Nothing to do
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

	// Gets encoded password from domain user
	String passwordFromDB = user.getHashedString();

	if (StringUtils.equals(password, passwordFromDB))
	    return true;

	return false;
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
}