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
    public boolean is_retweet = false;
    public String tweeted_person_pic_url;
    public String tweeted_person_profile_url;

    public String toString()
    {
	return id + " " + created_time + " " + message;
    }

}
