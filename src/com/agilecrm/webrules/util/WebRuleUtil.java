package com.agilecrm.webrules.util;

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
}
