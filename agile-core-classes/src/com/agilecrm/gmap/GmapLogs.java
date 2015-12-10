package com.agilecrm.gmap;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.annotate.JsonAutoDetect;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.cursor.Cursor;

import eu.bitwalker.useragentutils.UserAgent;

@XmlRootElement
@JsonAutoDetect
public class GmapLogs extends Cursor {
	
	public String guid;
	
	public String visit_time;
	
	public String city_lat_long;
	
	public String email;
	
	public String user_agent;
	
	public String city;
	
	public String region;
	
	public String country;
	
	public String ref;
	
	public String sid;
	
	public String page_views;
	
	/**
     * Default Log.
     */
    public GmapLogs()
    {

    }
    
	/**
     * Returns name of contact that subscribes to campaign as an xml element.
     * 
     * @return Contact name.
     * @throws Exception
     */
    @XmlElement
    public Contact getContact() throws Exception
    {
	if (email != "")
	{
	    Contact contact = ContactUtil.searchContactByEmail(email);

	    if (contact != null)
		return contact;
	}

	return null;
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
	    //Not required for now 
	    /*userAgentJSON.put("browser_version",
		    UserAgent.parseUserAgentString(user_agent).getBrowser().getVersion(user_agent).getMajorVersion());*/

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
