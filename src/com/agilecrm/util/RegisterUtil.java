package com.agilecrm.util;

import java.util.HashMap;
import java.util.Map;

public class RegisterUtil
{
    /**
     * Gets OAuth domain name and returns its associated url
     * 
     * @param provider
     * @return url of the given domain name
     */
    public static String getOauthURL(String provider)
    {
	Map<String, String> openIdProviders = new HashMap<String, String>();
	openIdProviders.put("google", "www.google.com/accounts/o8/id");
	openIdProviders.put("yahoo", "me.yahoo.com");
	openIdProviders.put("myspace", "myspace.com");
	openIdProviders.put("aol", "aol.com");
	openIdProviders.put("myopenid.com", "stats.agilecrm.com");

	return openIdProviders.get(provider.toLowerCase());
    }
}
