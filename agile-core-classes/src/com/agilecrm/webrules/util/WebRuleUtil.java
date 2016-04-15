package com.agilecrm.webrules.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.agilecrm.contact.Contact;
import com.agilecrm.webrules.WebRule;
import com.googlecode.objectify.Key;

public class WebRuleUtil
{
    public static List<WebRule> getAllWebRules()
    {
	    return WebRule.dao.fetchAllByKeys(WebRule.dao.listKeysByProperty(new HashMap()));
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
}
