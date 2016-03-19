package com.agilecrm.util;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;

import com.google.appengine.api.modules.ModulesService;
import com.google.appengine.api.modules.ModulesServiceFactory;
import com.google.appengine.api.taskqueue.DeferredTaskContext;
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
    private static final String APP_ID;
    private static final String RELEASE_VERSION;

    private static final boolean IS_LOCAL_DEVELOPMENT_SERVER;
    private static final boolean IS_PRODUCTION_APP;

    /**
     * Cloudfront paths
     */
    private static final String CLOUDFRONT_SERVER_URL = "//doxhze3l6s7v9.cloudfront.net/";
    private static final String CLOUDFRONT_BASE_URL;

    private static final String CLOUDFRONT_STATIC_FILES_PATH;

    static
    {
	if (SystemProperty.environment.value() != null)
	{
	    APP_ID = SystemProperty.applicationId.get();
	    IS_LOCAL_DEVELOPMENT_SERVER = (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development);
	    IS_PRODUCTION_APP = "agile-crm-cloud".equals(APP_ID);
	    RELEASE_VERSION = SystemProperty.applicationVersion.get().split("\\.")[0];
	}
	else
	{
	    APP_ID = "agile-crm-cloud";
	    IS_LOCAL_DEVELOPMENT_SERVER = true;
	    IS_PRODUCTION_APP = "agile-crm-cloud".equals(APP_ID);
	    RELEASE_VERSION = "default";
	}

	System.out.println("is local server : " + IS_LOCAL_DEVELOPMENT_SERVER);

	/**
	 * Returns cloudfornt URL with extension app/ or beta/ depending
	 */
	CLOUDFRONT_BASE_URL = IS_LOCAL_DEVELOPMENT_SERVER ? "" : (CLOUDFRONT_SERVER_URL
		+ (IS_PRODUCTION_APP ? "app/" + RELEASE_VERSION : "beta/" + RELEASE_VERSION) + "/");
	System.out.println("CLOUDFRONT_BASE_URL : " + CLOUDFRONT_BASE_URL);

	// Static files are placed separately as they are not uploaded after
	// every release.
	CLOUDFRONT_STATIC_FILES_PATH = IS_LOCAL_DEVELOPMENT_SERVER ? "" : CLOUDFRONT_SERVER_URL
		+ (IS_PRODUCTION_APP ? "app/static/" : "beta/static/") + "flatfull/";

	System.out.println("CLOUDFRONT_STATIC_FILES_PATH : " + CLOUDFRONT_STATIC_FILES_PATH);

    }

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
	String applicationId = SystemProperty.applicationId.get();

	return "https://" + domain + "-dot-" + version + "-dot-" + applicationId + ".appspot.com/";
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

	String applicationId = SystemProperty.applicationId.get();

	return "https://" + domain + "-dot-" + version + "-dot-" + applicationId + ".appspot.com/";
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

	if (StringUtils.equals(applicationId, "agilecrmbeta"))
	    return "https://" + domain + "-dot-sandbox-dot-agilesanbox.appspot.com/";

	return VersioningUtil.getDefaultLoginUrl(domain);
    }
    
    public static String getBaseServerURL()
    {
	return CLOUDFRONT_SERVER_URL;
    }

    public static boolean isBackgroundThread()
    {
	ModulesService service = ModulesServiceFactory.getModulesService();
	if (service == null)
	    return false;

	String module = service.getCurrentModule();
	System.out.println("current module : " + module);
	if (!"default".equals(module))
	{
	    return true;
	}

	HttpServletRequest request = DeferredTaskContext.getCurrentRequest();

	System.out.println("deferred task request : " + request);

	if (request != null)
	{
	    return true;
	}

	return false;
    }
    
    public static String getCurrentModuleName()
    {
    	ModulesService service = ModulesServiceFactory.getModulesService();
    	if (service == null)
    	    return "";
    	
    	String moduleName = service.getCurrentModule();
    	System.out.println("current module : " + moduleName);
    	
    	return moduleName;
    }
    /**
     * Returns app release version
     * 
     * @return
     */
    public static String getVersion()
    {
	return RELEASE_VERSION;
    }

    /**
     * Returns application id
     * 
     * @return
     */
    public static String getApplicationAPPId()
    {
	return APP_ID;
    }

    /**
     * Return true if environment is local system
     * 
     * @return
     */
    public static boolean isLocalHost()
    {
	return IS_LOCAL_DEVELOPMENT_SERVER;
    }

    /**
     * Return true if it is production app. Can be used with not condition to
     * check it is beta version
     * 
     * @return
     */
    public static final boolean isProductionAPP()
    {
	return IS_PRODUCTION_APP;
    }

    public static final String getCloudFrontBaseURL()
    {
	return CLOUDFRONT_BASE_URL;
    }

    /**
     * Static lib files are places seperately
     * 
     * @return
     */
    public static final String getStaticFilesBaseURL()
    {
	return CLOUDFRONT_STATIC_FILES_PATH;
    }

    public static void main(String[] args)
    {
	System.out.println(isBackgroundThread());
    }
}
