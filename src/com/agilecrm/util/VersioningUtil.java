package com.agilecrm.util;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;

import com.google.appengine.api.utils.SystemProperty;

/**
 * <code>VersioningUitl</code> class checks request version and builds login
 * URLs accordingly.
 * 
 * @author Yaswanth
 * 
 */
public class VersioningUtil
{

    /**
     * Returns default url to main version
     * 
     * @param domain
     * @return
     */
    public static String getDefaultLoginUrl(String domain)
    {
	return "https://" + domain + ".agilecrm.com/";
    }

    /**
     * Returns home url to other versions
     * 
     * @param domain
     * @param version
     * @return
     */
    public static String getLoginURL(String domain, String version)
    {
	System.out.println("version : " + version);
	return "https://" + domain + "-dot-" + version + "-dot-agile-crm-cloud.appspot.com";
    }

    /**
     * Gets domain from the request and returns login URL according to version
     * of app
     * 
     * @param domain
     * @param request
     * @return
     */
    public static String getLoginUrl(String domain, ServletRequest request)
    {
	String appVersion = getAppVersion(request);
	System.out.println("version : " + appVersion);
	if (StringUtils.isEmpty(appVersion))
	    return getDefaultLoginUrl(domain);

	return getLoginURL(domain, appVersion);
    }

    /**
     * Returns version of the application. Fetches url from request and returns
     * version id
     * 
     * @param request
     * @return
     */
    public static String getAppVersion(ServletRequest request)
    {
	return getAppVersion(request.getServerName());
    }

    public static String getURL(String domain, HttpServletRequest request)
    {
	String version = getAppVersion(request);

	if (StringUtils.isEmpty(version))
	    return "https://" + domain + ".agilecrm.com/";
	
	return "https://" + domain + "-dot-" + SystemProperty.version + "-dot-" + SystemProperty.applicationId +".appspot.com/";
    }

    /**
     * Returns URL string from URL string
     * 
     * @param host
     * @return
     */
    public static String getAppVersion(String host)
    {
	return host.contains("-dot-") ? host.split("\\-dot-")[1] : null;
    }

    /**
     * Returns host url based on application id
     * 
     * @param domain
     * @return
     */
    public static String getHostURLByApp(String domain)
    {

	String applicationId = SystemProperty.applicationId.get();

	if (StringUtils.equals(applicationId, "agilecrmbeta"))
	    return "https://" + domain + "-dot-sandbox-dot-agilecrmbeta.appspot.com/";

	return VersioningUtil.getDefaultLoginUrl(domain);
    }
}
