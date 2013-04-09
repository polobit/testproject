package com.agilecrm.social;

import java.util.List;

import javax.persistence.Embedded;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class SocialSearchResult
{

    public String id = "";
    public String name = "";
    public String picture = "";
    public String url = "";
    public String summary = "";
    public String headline = "";
    public String num_connections = "";
    public String tweet_count = "";
    public String location = "";
    public String friends_count = "";
    public String current_update = "";
    public String distance = "";
    public boolean is_connected;
    public boolean is_follow_request_sent;
    public boolean is_followed_by_target;
    public long current_update_id;
    public List three_current_positions;
    @SuppressWarnings("rawtypes")
    public List three_past_positions;

    @Embedded
    public List<SocialUpdateStream> updateStream = null;

    public String toString()
    {
	return id + " " + name + " " + picture + " " + url + " " + summary
		+ " " + headline + " " + num_connections + " " + location + " "
		+ friends_count + " " + current_update + " " + distance + " ";
    }
}
