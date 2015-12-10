package com.agilecrm.social.stubs;

import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.social.linkedin.LinkedInUtil;
import com.agilecrm.social.twitter.TwitterUtil;

/**
 * <code>SocialUpdateStream</code> contains fields required by
 * {@link TwitterUtil} and {@link LinkedInUtil} classes.
 * 
 * <p>
 * {@link TwitterUtil} and {@link LinkedInUtil} classes wraps the updates or
 * tweets returned by LinkedIn and Twitter in this object, to return the
 * response in a proper format
 * </p>
 * 
 * @author Tejaswi
 * @since Jan 2013
 */
@XmlRootElement
public class SocialUpdateStream
{
    /** Update or tweet id */
    public String id;

    /** Created time of update */
    public long created_time;

    /** Update message */
    public String message = "";

    /** Update type (Connection or Share in LinkedIn) */
    public String type = "";

    /** Stores {@link Boolean} whether tweet is retweeted by Agile User profile */
    public boolean is_retweeted = false;

    /** Stores {@link Boolean} whether tweet is retweet */
    public boolean is_retweet = false;

    /** Picture URL of person who tweeted the tweet */
    public String tweeted_person_pic_url;

    /** Profile URL of person who tweeted the tweet */
    public String tweeted_person_profile_url;

    public String toString()
    {
	return id + " " + created_time + " " + message;
    }

}
