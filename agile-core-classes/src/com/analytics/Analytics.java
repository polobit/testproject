package com.analytics;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlElement;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnore;
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
    @JsonIgnore
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
    public String ref_url;

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
     * JsonArray string having urls with their respective time
     */
    public String urls_with_time_spent;

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
	if (StringUtils.isEmpty(user_agent))
	    return "";

	JSONObject userAgentJSON = new JSONObject();
	try
	{
	    UserAgent userAgent = UserAgent.parseUserAgentString(user_agent);

	    String browserName = StringUtils.lowerCase(userAgent.getBrowser().getGroup().toString());
	    String os = StringUtils.lowerCase(userAgent.getOperatingSystem().getGroup().toString());
	    String deviceType = StringUtils.lowerCase(userAgent.getOperatingSystem().getDeviceType().toString());

	    // Browser Name
	    if (!StringUtils.isBlank(browserName) && !browserName.equals("unknown"))
		userAgentJSON.put("browser_name", browserName);

	    // Browser version
	    userAgentJSON.put("browser_version",
		    UserAgent.parseUserAgentString(user_agent).getBrowser().getVersion(user_agent).getMajorVersion());

	    // OS
	    if (!StringUtils.isBlank(os) && !os.equals("unknown"))
		userAgentJSON.put("os", os);

	    // Device Type
	    if (!StringUtils.isBlank(deviceType) && !deviceType.equals("unknown"))
		userAgentJSON.put("device_type", deviceType);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
	return userAgentJSON.toString();
    }
}
