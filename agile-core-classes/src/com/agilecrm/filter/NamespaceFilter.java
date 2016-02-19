package com.agilecrm.filter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Calendar;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.Globals;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.AliasDomain;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.AliasDomainUtil;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;

/**
 * <code>NamespaceFilter</code> filters every request to application, to set/
 * Check the namespace/subdomain. If url is incorrect it will forward to choose
 * domain page.
 * <p>
 * If the url path starts with "/backend/" then filter forwards request without
 * verification of namespace, because it is required to run specific
 * webhooks from stripe etc
 * </p>
 * 
 */
public class NamespaceFilter implements Filter
{
    /**
     * Sets the namespace to the subdomain in the request url, when namespace is
     * not aready set or request is to create a new domain, forgot domain.
     * 
     * @param request
     * @param response
     * @return
     * @throws IOException
     */
    private boolean setNamespace(ServletRequest request, ServletResponse response) throws IOException
    {
	// Reset the thread local, which is again set after user loggedin or
	// when registered () i.e., AgileAuthFilter redirects to login page if
	// userInfo is null
	SessionManager.set((UserInfo) null);

	// If namespace is already set, then returns true to allow access
	// further
	if (NamespaceManager.get() != null)
	    return true;

	// If Localhost - just return
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
	{
	    return true;
	}

	// If it is choose domain, just return
	if (((HttpServletRequest) request).getRequestURI().contains("choose-domain"))
	    return true;

	// If it is enter domain, just return
	if (((HttpServletRequest) request).getRequestURI().contains("enter-domain"))
	    return true;

	// If it is forgot domain, just return
	if (((HttpServletRequest) request).getRequestURI().contains("forgot-domain"))
	    return true;

	// If it is facebook page tab, just return
	if (((HttpServletRequest) request).getRequestURI().contains("facebookpagetab"))
	    return true;

	if (((HttpServletRequest) request).getRequestURI().contains("/_ah/mail"))
	    return true;

	// Read Subdomain
	String subdomain = NamespaceUtil.getNamespaceFromURL(request.getServerName());
	System.out.println(subdomain);

	// Excludes if it is running in backends
	if (subdomain.equalsIgnoreCase(Globals.BULK_ACTION_BACKENDS_URL)
		|| subdomain.equalsIgnoreCase(Globals.BULK_BACKENDS)
		|| subdomain.equalsIgnoreCase(Globals.NORMAL_BACKENDS))
	    return true;

	// Lowercase
	subdomain = subdomain.toLowerCase();

	// Get Server URL without subdomain
	String url = request.getServerName().replaceAll(subdomain, "");
	if (url.startsWith("."))
	    url = url.substring(1);

	// If not agilecrm.com or helptor.com etc. - show chooseDomain
	if (!Arrays.asList(Globals.URLS).contains(url.toLowerCase())
		&& !url.toLowerCase().contains(Globals.SUB_VERSION_URL))
	{
	    redirectToChooseDomain(request, response);
	    return false;
	}

	// If request is from register and domain is "my", request is forwarded
	// to register jsp without setting domain
	if (((HttpServletRequest) request).getRequestURI().contains("/register") && "my".equals(subdomain))
	    return true;

	// If my or any special domain - support etc, choose subdomain
	if (Arrays.asList(Globals.LOGIN_DOMAINS).contains(subdomain))
	{
	    redirectToChooseDomain(request, response);
	    return false;
	}

	subdomain = AliasDomainUtil.getActualDomain(subdomain);
	// Set the subdomain as name space
	System.out.println("Setting the domain " + subdomain + " " + ((HttpServletRequest) request).getRequestURL());
	NamespaceManager.set(subdomain);
	return true;
    }

    /**
     * Creates a full url with query parameters in the request appended to the
     * url
     * 
     * @param req
     * @return
     */
    private static String getFullUrl(HttpServletRequest req)
    {
	String reqUrl = req.getRequestURL().toString();
	String queryString = req.getQueryString(); // d=789
	if (queryString != null)
	{
	    reqUrl += "?" + queryString;
	}
	return reqUrl;
    }

    /**
     * Sets up google apps
     * 
     * @param request
     * @param response
     * @return
     */
    private boolean setupGoogleAppsNameSpace(ServletRequest request, ServletResponse response)
    {
	return true;
    }

    /**
     * Redirects to choose domain.
     * 
     * @param request
     * @param response
     */
    public void redirectToChooseDomain(ServletRequest request, ServletResponse response)
    {
	// Redirect to choose domain page if not localhost - on localhost - we
	// do it on empty namespace
	if (!request.getServerName().equalsIgnoreCase("localhost")
		&& !request.getServerName().equalsIgnoreCase("127.0.0.1"))
	{
	    try
	    {
		HttpServletResponse httpResponse = (HttpServletResponse) response;

		httpResponse.sendRedirect(Globals.CHOOSE_DOMAIN);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();

	    }
	}
    }

    /**
     * Sets namespace or redirects to choose domain based on the url and
     * sessions. If url path starts with "/backend", reqeust is forwarded
     * without setting a namespace or redirecting to choose domain page
     * 
     * @param request
     * @param response
     * @param chain
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException,
	    ServletException
    {
	System.out.println(request.getServerName());

	/*
	 * DomainUser domainUser = new DomainUser(null, "yaswanth@invox.com",
	 * "hungry", "password", true, true); try { domainUser.save(); } catch
	 * (Exception e) { // TODO Auto-generated catch block
	 * e.printStackTrace(); }
	 */
	
	/*AliasDomain aliasDomain = new AliasDomain("testDomain", "testAlias");
	   try { aliasDomain.save(); } catch
	  (Exception e) { // TODO Auto-generated catch block
	  e.printStackTrace(); }*/

	// If URL path starts with "/backend", then request is forwarded without
	// namespace verification i.e., no filter on url which starts with
	// "/backend" (crons, StripeWebhooks etc..)
	String path = ((HttpServletRequest) request).getRequestURI();
	if (path.startsWith("/backend") || path.startsWith("/remote_api"))
	{
	    chain.doFilter(request, response);
	    return;
	}

	 // For IE cache issue fix
	  if(isRequestFromIEClient(request)){
		  HttpServletResponse res = (HttpServletResponse) response;
		  res.setDateHeader("Expires", Calendar.getInstance().getTimeInMillis());	  
	  }
	  
	// Returns true if name space is set or namespace is already set for the
	// application. If request is not to access the
	// application but to create new domain (choosing domain) then it
	// returns true, allowing further access
	boolean handled = setNamespace(request, response);

	// Chain into the next request if not redirected
	if (handled)
	    chain.doFilter(request, response);
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException
    {
	// Nothing to do
    }

    @Override
    public void destroy()
    {
	// Nothing to do
    }
    
    public boolean isRequestFromIEClient(ServletRequest request){
    	try {
    		HttpServletRequest req = (HttpServletRequest) request;
    		String userAgent = req.getHeader("user-agent");
    		
    	    return userAgent.contains("MSIE");
    	
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
    	
    	return false;
    }
}