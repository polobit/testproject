package com.agilecrm.gmap;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonAutoDetect;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;

@XmlRootElement
@JsonAutoDetect
public class GmapLogs {
	
	public String guid;
	
	public String visit_time;
	
	public String city_lat_long;
	
	public String email;
	
	public String user_agent;
	
	public String city;
	
	public String region;
	
	public String country;
	
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
}
