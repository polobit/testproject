package com.agilecrm.filter;

import java.io.IOException;
import java.util.Arrays;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.GMailGadgetServlet;
import com.agilecrm.Globals;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.backends.BackendServiceFactory;
import com.google.appengine.api.utils.SystemProperty;

/**
 * <code>NamespaceFilter</code> filters every request to application, to set/
 * Check the namespace/subdomain. If url is incorrect it will forward to choose
 * domain page.
 * <p>
 * If the url path starts with "/backend/" then filter forwards request without
 * verification of namespace, because it is required to run specific
 * functionalities with out session or namespace being set i.e., to run crons,
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

	// Read Subdomain
	String subdomain = request.getServerName().split("\\.")[0];

	// Excludes if it is running in backends
	if (subdomain.equalsIgnoreCase(Globals.BULK_ACTION_BACKENDS_URL)
		|| BackendServiceFactory.getBackendService().getCurrentBackend() != null)
	    return true;

	// Lowercase
	subdomain = subdomain.toLowerCase();

	// Get Server URL without subdomain
	String url = request.getServerName().replaceAll(subdomain, "");
	if (url.startsWith("."))
	    url = url.substring(1);

	// If not agilecrm.com or helptor.com etc. - show chooseDomain
	if (!Arrays.asList(Globals.URLS).contains(url.toLowerCase()))
	{
	    redirectToChooseDomain(request, response);
	    return false;
	}

	// If my or any special domain - support etc, choose subdomain
	if (Arrays.asList(Globals.LOGIN_DOMAINS).contains(subdomain))
	{
	    redirectToChooseDomain(request, response);
	    return false;
	}

	// Set Google Apps Namespace if googleapps
	if (subdomain.equalsIgnoreCase(Globals.GOOGLE_APPS_DOMAIN))
	{
	    return setupGoogleAppsNameSpace(request, response);

	}

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
	try
	{

	    String owner_id = request.getParameter("opensocial_owner_id");
	    System.out.println("open id in namespace filter : " + owner_id);

	    // Using openid, we are not able to support wildcard realms
	    String appsDomain = request.getParameter("domain");

	    /*
	     * If Gadget Level API which does not understand redirect, we /*
	     * just set the namespace.
	     * 
	     * Request url should be changed if there is one time session key,
	     * so session
	     */
	    if (!StringUtils.isEmpty(request.getParameter(GMailGadgetServlet.SESSION_KEY_NAME))
		    && !StringUtils.isEmpty(appsDomain))
	    {
		String namespace = appsDomain.split("\\.")[0];
		System.out.println("Setting Google Apps - Namespace " + appsDomain);
		String url = getFullUrl((HttpServletRequest) request);
		System.out.println(url);
		url = url.replace(Globals.GOOGLE_APPS_DOMAIN + ".", namespace + ".");

		HttpServletResponse httpResponse = (HttpServletResponse) response;
		System.out.println("Redirecting it to " + url);
		httpResponse.sendRedirect(url);
		return true;
	    }

	    if (!StringUtils.isEmpty(owner_id))
	    {
		return true;
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	redirectToChooseDomain(request, response);
	return false;
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
	// If URL path starts with "/backend", then request is forwarded without
	// namespace verification i.e., no filter on url which starts with
	// "/backend" (crons, StripeWebhooks etc..)
	String path = ((HttpServletRequest) request).getRequestURI();
	if (path.startsWith("/backend"))
	{
	    chain.doFilter(request, response);
	    return;
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

}