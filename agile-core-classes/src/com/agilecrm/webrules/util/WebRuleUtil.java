package com.agilecrm.webrules.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.util.CacheUtil;
import com.agilecrm.webrules.WebRule;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Query;

public class WebRuleUtil
{
	// Cache key
	public static final String CACHE_KEY = "webrules_cache";
	
    public static List<WebRule> getAllWebRules()
    {
    	return getCachedWebRules();
    }
    
    // Get cached webrules
    public static List<WebRule> getCachedWebRules(){
    	
    	String keyName = NamespaceManager.get() + "_" + CACHE_KEY;
    	Object cachedRules = CacheUtil.getCache(keyName);
    	ObjectMapper mapper = new ObjectMapper();
    	List<WebRule> rulesList = null;
    	
    	try {
    		if(cachedRules == null){
        		rulesList = WebRule.dao.fetchAllByKeys(WebRule.dao.listKeysByProperty(new HashMap()));
        		CacheUtil.setCache(keyName, mapper.writeValueAsString(rulesList));
        	} else {
        		rulesList = mapper.readValue(cachedRules.toString(), mapper.getTypeFactory().constructCollectionType(List.class, WebRule.class));

        	}
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
    	
    	
	    return rulesList;
    }
    
    // Delete rules from cache
    public static void deleteRulesFromCache() {
    	CacheUtil.deleteCache(NamespaceManager.get() + "_" + CACHE_KEY);
    }
    
    
    //returns all webrule count 
    public static int getCount(){
    	
    	return WebRule.dao.count();
    }
    
    
    // Fill Countries
    public static List<WebRule> fillCountry(List<WebRule> webRules, HttpServletRequest request)
    {
	for (WebRule webRule : webRules)
	{
	    // Fill the country
	    webRule.country = request.getHeader("X-AppEngine-Country");
	}

	return webRules;
    }

    public static List<WebRule> getActiveWebrules(List<WebRule> webRules)
    {
	List<WebRule> activeWebRules = new ArrayList<WebRule>();

	for (WebRule webRule : webRules)
	{
	    try
	    {
		if (webRule.disabled == false)
		    activeWebRules.add(webRule);
	    }
	    catch (Exception e)
	    {
		activeWebRules.add(webRule);
	    }
	}
	return activeWebRules;
    }
    
    public static String getPhoneNumberByWebruleId(Long wid)
    {
	Query<WebRule> query = WebRule.dao.ofy().query(WebRule.class);
	query.filter("id", wid);
	WebRule webrule = query.get();	
	String number=  WebRule.getPhoneNumber(webrule);
	return number;
    }
}
