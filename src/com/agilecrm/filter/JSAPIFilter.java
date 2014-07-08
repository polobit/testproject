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

import com.agilecrm.account.APIKey;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.JSAPIUtil;

/**
 * <code>JSAPIFilter</code> is a simple Servlet Filter for JS API Auth. Verifies
 * APIkey related to domain to allow access
 * <p>
 * Request to url path "/js/api/" should include query parameter "id" with
 * APIKey as value
 * </p>
 * 
 */
public class JSAPIFilter implements Filter
{
    private final String callbackParameter = "callback";

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
	String agileId = httpRequest.getParameter("id");

	// If APIKey from the request is not null, If key in the request matches
	// with APIKey of current namespace/domain request is allowed to access
	// functionalities in "js/api".
	if (agileId != null)
	{
	    // Check if ApiKey
	    if (APIKey.isValidJSKey(agileId))
	    {
		UserInfo userInfo = (UserInfo) httpRequest.getSession().getAttribute(
			SessionManager.AUTH_SESSION_COOKIE_NAME);

		// Get AgileUser
		DomainUser domainUser = APIKey.getDomainUserRelatedToJSAPIKey(agileId);

		// Domain becomes null if user is deleted
		if (domainUser != null)
		    userInfo = new UserInfo("agilecrm.com", domainUser.email, domainUser.name);

		SessionManager.set(userInfo);
		chain.doFilter(httpRequest, httpResponse);
		return;
	    }
	    sendJSONErrorResponse((HttpServletRequest) request, (HttpServletResponse) response,
		    JSAPIUtil.generateJSONErrorResponse(JSAPIUtil.Errors.UNAUTHORIZED));
	    return;
	}

	sendJSONErrorResponse((HttpServletRequest) request, (HttpServletResponse) response,
		JSAPIUtil.generateJSONErrorResponse(JSAPIUtil.Errors.API_KEY_MISSING));
    }

    private void sendJSONErrorResponse(HttpServletRequest request, HttpServletResponse response, String responseString)
	    throws IOException
    {
	if (!isJSONPRequest(request))
	{
	    System.out.println("Error - Key does not match for JS API");
	    response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
	    return;
	}

	// enclosed with in callback parameter.
	ServletOutputStream out = response.getOutputStream();
	out.println(getCallbackParameter(request) + "(");
	out.println(responseString);
	out.println(");");

	response.setContentType("text/javascript");
    }

    /**
     * Checks whether request received is a valid JSONP request. It checks for
     * the callback parameter.
     * 
     * @param httpRequest
     * @return ({@link Boolean}
     */
    private boolean isJSONPRequest(HttpServletRequest httpRequest)
    {
	String callbackMethod = getCallbackParameter(httpRequest);
	return (callbackMethod != null && callbackMethod.length() > 0);
    }

    /**
     * Reads the callback parameter sent in JSONP request which is a unique
     * number generated and assigned to widow as a callback function.
     * 
     * @param request
     * @return
     */
    private String getCallbackParameter(HttpServletRequest request)
    {
	return request.getParameter(callbackParameter);
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException
    {
	// Nothing to do
    }
}