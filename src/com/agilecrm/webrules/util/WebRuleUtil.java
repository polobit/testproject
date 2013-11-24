package com.agilecrm.webrules.util;

import java.util.List;

import com.agilecrm.webrules.WebRule;

public class WebRuleUtil
{
    public static List<WebRule> getAllWebRules()
    {
	return WebRule.dao.fetchAll();
    }
}
