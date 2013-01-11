package com.agilecrm.social;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class SocialUpdateStream
{
    public Long id;
    public long created_time;
    public String message = "";
    public String type = "";

    public String toString()
    {
	return id + " " + created_time + " " + message;
    }

}
