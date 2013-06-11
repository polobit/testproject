package com.agilecrm.db;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlElement;

import org.json.JSONObject;

import eu.bitwalker.useragentutils.UserAgent;

/**
 * <code>Analytics</code> is just the wrapper class of Analytics to map the SQL
 * columns with the variables. UserAgent string is parsed to get browser, OS and
 * other required content.
 * 
 * @author Naresh
 * 
 */
public class Analytics
{

    @Id
    public Long id;

    /**
     * Domain
     */
    public String domain;

    /**
     * Unique with respect to browser. Retrieved from cookie of browser.
     */
    public String guid;

    /**
     * Session Id. Retrieved from cookie of browser.
     */
    public String sid;

    /**
     * URL of page where analytics code is pasted
     */
    public String url;

    /**
     * IP Address of client
     */
    public String ip;

    /**
     * States whether new session or not.
     */
    public String is_new;

    /**
     * Referred URL.
     */
    public String ref;

    /**
     * UserAgent String retrieved from request header.
     */
    public String user_agent;

    /**
     * Actually NOW() time in SQL. Stores time of row insertion
     */
    public String stats_time;

    /**
     * Converted NOW() time into epoch-time, required in timeline,
     * contact-detail-tabs etc.
     */
    public String created_time;

    /**
     * Country, Region, city and its latitudes-longitudes are generated from
     * AppEngine Headers.
     */
    public String country;
    public String region;
    public String city;
    public String city_lat_long;

    /**
     * User email. Retrieved from cookie of browser.
     */
    public String email;

    /**
     * Constructs Default Analytics
     */
    public Analytics()
    {

    }

    /**
     * Returns json with browser, os, device-type from UserAgent string.
     * 
     * @return - String
     * @throws Exception
     */
    @XmlElement
    public String getParsedUserAgent() throws Exception
    {
	if (user_agent == null)
	    return null;

	JSONObject userAgentJSON = new JSONObject();
	try
	{
	    // Browser Name
	    userAgentJSON.put("browser_name",
		    UserAgent.parseUserAgentString(user_agent).getBrowser()
			    .getName());

	    // Browser version
	    userAgentJSON.put("browser_version",
		    UserAgent.parseUserAgentString(user_agent).getBrowser()
			    .getVersion(user_agent).getMajorVersion());

	    // OS
	    userAgentJSON.put("os", UserAgent.parseUserAgentString(user_agent)
		    .getOperatingSystem());

	    // Device Type
	    userAgentJSON.put("device_type",
		    UserAgent.parseUserAgentString(user_agent)
			    .getOperatingSystem().getDeviceType());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
	return userAgentJSON.toString();
    }

}
