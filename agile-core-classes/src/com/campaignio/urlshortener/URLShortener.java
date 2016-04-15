package com.campaignio.urlshortener;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Unindexed;

/**
 * <code>URLShortener</code> considers Id, long url, contact id and tracking id
 * as instance variables. It uses shortener url for shortening long urls.
 * 
 * @author Manohar
 * 
 */
@XmlRootElement
@Cached
public class URLShortener
{
    /**
     * Unique Id.
     */
    @Id
    public Long id;

    /**
     * Long url.
     */
    public String long_url;

    /**
     * Contact Id.
     */
    public String subscriber_id;

    /**
     * Tracker ID.
     */
    public String tracker_id;

    /**
     * Campaign Id
     */
    public String campaign_id;
    
    public enum ShortenURLType
    {
    	SMS, EMAIL, TWEET
    };
    
    private ShortenURLType type = ShortenURLType.EMAIL;

    /**
     * Shortener Url - "https://click.agilecrm.com/backend/click"
     */
    public static final String SHORTENER_URL = "http://agle.cc/";
    
    @Unindexed
    private String push = null;

    /**
     * Dao for URLShortener class.
     */
    private static ObjectifyGenericDao<URLShortener> dao = new ObjectifyGenericDao<URLShortener>(URLShortener.class);

    /**
     * Default URLShortener.
     */
    public URLShortener()
    {
    }

    /**
     * Constructs a new {@link URLShortener}.
     * 
     * @param longURL
     *            Long url.
     * @param subscriberId
     *            Contact Id that subscribes to campaign.
     * @param trackerId
     *            Tracking id to track urls.
     */
    public URLShortener(String longURL, String subscriberId, String trackerId, String campaignId)
    {
	this.long_url = longURL;
	this.subscriber_id = subscriberId;
	this.tracker_id = trackerId;
	this.campaign_id = campaignId;
    }

    public void setURLShortenerType(ShortenURLType type)
    {
    	this.type = type;
    }
    
    public ShortenURLType getURLShortenerType()
    {
    	return type;
    }
    
    public void setPushParameter(String push)
    {
    	this.push = push;
    }
    
    public String getPushParameter()
    {
    	return push;
    }
    
    /**
     * Saves URLShortener Object in empty namespace.
     */
    public void save()
    {
	dao.put(this);
    }

    public String toString()
    {
	return "Long URL: " + long_url + " Subscriber ID: " + subscriber_id + " Tracker ID: " + tracker_id
		+ " Campaign ID: " + campaign_id;

    }
}