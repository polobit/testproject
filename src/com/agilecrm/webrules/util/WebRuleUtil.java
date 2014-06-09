package com.agilecrm.webrules.util;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.agilecrm.webrules.WebRule;

public class WebRuleUtil
{
    public static List<WebRule> getAllWebRules()
    {
	return WebRule.dao.fetchAll();
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
