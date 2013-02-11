package com.agilecrm.social;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class SocialUpdateStream
{
    public String id;
    public long created_time;
    public String message = "";
    public String type = "";
    public boolean is_retweeted = false;
    public String toString()
    {
	return id + " " + created_time + " " + message;
    }

}
