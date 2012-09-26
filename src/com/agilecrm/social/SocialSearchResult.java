package com.agilecrm.social;

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
    public String location = "";
    public String friends = "";
    public String tweets = "";

    public String toString()
    {
	return id + " " + name + " " + picture + " " + url + " " + summary
		+ " " + headline + " " + num_connections + " " + location + " "
		+ friends + " " + tweets;
    }
}
