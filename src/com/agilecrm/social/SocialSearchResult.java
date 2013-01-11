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
    public String location = "";
    public String friends = "";
    public String currentUpdate = "";
    public String distance = "";
    @Embedded
    public List<SocialUpdateStream> updateStream = null;

    public String toString()
    {
	return id + " " + name + " " + picture + " " + url + " " + summary
		+ " " + headline + " " + num_connections + " " + location + " "
		+ friends + " " + currentUpdate + " " + distance + " ";
    }
}
