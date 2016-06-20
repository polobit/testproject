package com.agilecrm.apilimitcheck;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;

import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.util.CacheUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * 
 * @author ghanshyam
 *
 */
public class APILimitCheck {

    // Constant for Cached Limit Key
    public static final String API_LIMIT_CACHED_KEY = "_api_limit_cached_key";

    /**
     * 
     * @param planType
     * @return
     */
    public static int getCountLimitByPlan(String planType) {
	switch (planType) {
	case "FREE":
	    return 500;
	case "STARTER":
	    return 5000;
	case "REGULAR":
	    return 10000;
	case "PRO":
	    return 25000;
	case "ENTERPRISE":
	    return 25000;
	default:
	    break;
	}
	return 1000;
    }
    
    public static boolean isRequestFromSecurityLevelDomain()
    {
    String domain = NamespaceManager.get();
    List<String> whiteList = new ArrayList<String>();
    whiteList.add("our");
    
    if(!StringUtils.isEmpty(domain) && whiteList.contains(domain))
    	return true;
    
    return false;
    }

    /***
     * 
     * @param domainUser
     * @throws Exception
     */
    public static void checkAPILimit(String namespace) throws Exception {

	if(isRequestFromSecurityLevelDomain())
	    return;
	// Get session info
	UserInfo info = SessionManager.get();
	if (info == null)
	    throw new Exception("Invalid user.");

	// Get actual limit from session
	int apiLimit = info.getAPICallsLimit();

	// Validate cached limits till now
	checkAPILimitByPlan(namespace, apiLimit);
    }

    /**
     * 
     * @param namespaceName
     * @param countLimit
     * @throws Exception
     */
    private static void checkAPILimitByPlan(String namespaceName, int countLimit)
	    throws Exception {

	System.out.println("API limit count = " + countLimit + " assigned");

	ApiLimitCache apiLimitCache = getUserCachedApiCallsCount(namespaceName);
	
	if(apiLimitCache != null)
	    System.out.println("Api Limit Cache = " +apiLimitCache.toString());
	
	// Get cached count
	int count = apiLimitCache.api_count;
	long lastCallAPITime = apiLimitCache.lastTimeCalled;
	
	System.out.println("Count = " + count + " and Last Time = " + lastCallAPITime);
	
	boolean isSameDay = DateUtils.isSameDay(getTodaysStartCalTime(),
		getCallWithGivenTime(namespaceName));
	
	System.out.println("Is call came for same day = " +isSameDay);
	
	if (!isSameDay) {
	    System.out.println("This is not same day ");
	    deleteUserCachedApiCallsCount(namespaceName);
	    //increaseUserCachedApiCallsCount(namespaceName, 1, System.currentTimeMillis());
	    return;
	}

	if (count > countLimit) {
	    throw new Exception(
		    "API call cannot be completed as you have exceeded the "
			    + countLimit + " calls per/day");
	} else {
	    increaseUserCachedApiCallsCount(namespaceName, count, lastCallAPITime);
	}

    }

    /**
     * 
     * @param namespaceName
     * @return
     */
    private static ApiLimitCache getUserCachedApiCallsCount(String namespaceName) {
	ApiLimitCache apiLimitCache = (ApiLimitCache) CacheUtil.getCache(namespaceName + API_LIMIT_CACHED_KEY);

	if (apiLimitCache == null ) {
	    return new ApiLimitCache(0,System.currentTimeMillis());
	}

	return apiLimitCache;

    }

    /**
     * 
     * @param namespaceName
     * @param lastCallAPITime 
     */
    private static void increaseUserCachedApiCallsCount(String namespaceName,
	    Integer count, long lastCallAPITime) {
	// Reset to default
	if (count == null)
	    count = 0;
	count = count + 1;
	Long lastCallTime = System.currentTimeMillis();
	ApiLimitCache alc = new ApiLimitCache(count,lastCallTime);
	
	System.out.println("Last call time = " +lastCallAPITime);
	System.out.println("Data going to saved = " +alc.toString());
	
	CacheUtil.setCache(namespaceName + API_LIMIT_CACHED_KEY, alc);
    }

    /**
     * Set cache at delete point with count 1 and current time
     * 
     * @param namespaceName
     */
    private static void deleteUserCachedApiCallsCount(String namespaceName) {
	int count = 1;
	Long lastCallTime = System.currentTimeMillis();
	ApiLimitCache alc = new ApiLimitCache(count,lastCallTime);
	System.out.println("Setting new cache value = " +alc);
	CacheUtil.setCache(namespaceName + API_LIMIT_CACHED_KEY, alc);
    }

    static Calendar getTodaysStartCalTime() {
	Calendar cal = Calendar.getInstance();

	cal.set(Calendar.HOUR, 0);
	cal.set(Calendar.MINUTE, 0);
	cal.set(Calendar.SECOND, 0);
	cal.set(Calendar.MILLISECOND, 0);

	return cal;
    }

    static Calendar getCallWithGivenTime(String namespaceName) {
	Long timeInMills = null;
	ApiLimitCache apiLimitCache = (ApiLimitCache) CacheUtil.getCache(namespaceName + API_LIMIT_CACHED_KEY);
	if (apiLimitCache == null) {
	    timeInMills = System.currentTimeMillis();
	}else{
	    timeInMills = apiLimitCache.lastTimeCalled;
	}

	Calendar cal = Calendar.getInstance();
	cal.setTimeInMillis(timeInMills);
	return cal;
    }

}