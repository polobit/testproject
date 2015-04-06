package com.agilecrm.social.stubs;

import java.util.List;

import javax.persistence.Embedded;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.social.linkedin.LinkedInUtil;
import com.agilecrm.social.twitter.TwitterUtil;

/**
 * <code>SocialSearchResult</code> contains fields required by
 * {@link TwitterUtil} and {@link LinkedInUtil} classes.
 * 
 * <p>
 * {@link TwitterUtil} and {@link LinkedInUtil} classes wraps the responses
 * returned by LinkedIn and Twitter in this object, to return the response in a
 * proper format
 * </p>
 * 
 * @author Tejaswi
 * @since Jan 2013
 */
@XmlRootElement
public class SocialSearchResult
{
	/** LinkedIn Id or Twitter Id */
	public String id = "";

	/** Name of the LinkedIn or Twitter profile */
	public String name = "";

	/** Screen name of Twitter profile */
	public String screen_name = "";

	/** Picture URL of LinkedIn or Twitter profile */
	public String picture = "";

	/** Public URL of LinkedIn or Twitter profile */
	public String url = "";

	/** Work summary of LinkedIn or Twitter profile */
	public String summary = "";

	/** Title of LinkedIn or Twitter profile */
	public String headline = "";

	/** No of connections in LinkedIn and followers in Twitter */
	public String num_connections = "";

	/** No of tweets in Twitter */
	public String tweet_count = "";

	/** Place information of LinkedIn or Twitter profile */
	public String location = "";

	/** No of connections in LinkedIn and following in Twitter */
	public String friends_count = "";

	/** Recent update or tweet of LinkedIn or Twitter profile */
	public String current_update = "";

	/** Degree of connection in LinkedIn */
	public String distance = "";

	/**
	 * Stores {@link Boolean} whether conatct's LinkedIn or Twitter profile is
	 * connected with Agile user LinkedIn or Twitter profile
	 */
	public boolean is_connected;

	/**
	 * Stores {@link Boolean} whether Agile user follows Twitter profile of
	 * contact
	 */
	public boolean is_follow_request_sent;

	/**
	 * Stores {@link Boolean} whether Agile user is followed by Twitter profile
	 * of contact
	 */
	public boolean is_followed_by_target;

	/** Recent update id or tweet id */
	public long current_update_id;

	/** Three present work positions in LinkedIn */
	@SuppressWarnings("rawtypes")
	public List three_current_positions;

	/** Three past work positions in LinkedIn */
	@SuppressWarnings("rawtypes")
	public List three_past_positions;

	public SocialSearchResult searchResult;

	/** Stores list of tweets or updates */
	@Embedded
	public List<SocialUpdateStream> updateStream = null;

	public String toString()
	{
		return id + " " + name + " " + picture + " " + url + " " + summary + " " + headline + " " + num_connections
				+ " " + location + " " + friends_count + " " + current_update + " " + distance + " ";
	}
}
