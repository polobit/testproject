package com.campaignio.urlshortener.util;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.util.EmailLinksConversion;
import com.campaignio.urlshortener.URLShortener;
import com.campaignio.urlshortener.URLShortener.ShortenURLType;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;

/**
 * <code>URLShortenerUtil</code> is the class to convert urls from long urls to
 * short urls or vice-versa. It appends purl keyword and random number to the
 * shorten url.
 * 
 * @author Manohar
 * 
 */
public class URLShortenerUtil
{
    /**
     * Dao for URLShortener class
     */
    private static ObjectifyGenericDao<URLShortener> dao = new ObjectifyGenericDao<URLShortener>(URLShortener.class);

    /**
     * Gets URLShortener object from shortened urls
     * 
     * @param shortURL
     *            Short url that needs to be converted
     * @return URLShortener
     */
    public static URLShortener getURLShortener(String shortURL)
    {
	try
	{
	    if (shortURL == null)
		return null;

	    // Remove all /
	    while (shortURL.endsWith("/"))
	    {
		shortURL = shortURL.substring(0, shortURL.length() - 1);
	    }

	    // Split tokens
	    String[] tokens = shortURL.split("/");

	    String shortKey = tokens[tokens.length - 1];

	    // Split shortKey and get url key.
	    String[] keys = shortKey.split("-");
	    String urlKey = keys[keys.length - 1];

	    long keyNumber = Base62.fromOtherBaseToDecimal(62, urlKey);
	    URLShortener urlShortener = dao.get(keyNumber);

	    return urlShortener;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets shortened Url appending with purl keyword, random number
     * 
     * @param url
     *            Url that needs to be converted to shortened url
     * @param keyword
     *            Purl keyword given in send email node
     * @param subscriberId
     *            Contact Id that subscribes to campaign
     * @param trackingId
     *            Tracking id
     * @return shortened url appending with keyword and random number
     * @throws Exception
     */
    public static String getShortURL(String url, String keyword, String subscriberId, String trackingId, String campaignId) throws Exception
    {
	URLShortener urlShortener = new URLShortener(url, subscriberId, trackingId, campaignId);
	urlShortener.save();

	return buildShortURL(keyword, urlShortener);
    }

	public static String buildShortURL(String keyword, URLShortener urlShortener)
	{
		// Get Key
		long keyNumber = urlShortener.id;

		// Let's convert into base62
		String urlKey = Base62.fromDecimalToOtherBase(62, keyNumber);

		// Gets current namespace to append url
		String domain = NamespaceManager.get();
		
		// For localhost
		if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
			domain = "localhost";

		if (StringUtils.isEmpty(domain))
		    return null;

		// Converts domain using Rot13.
		String domainKey = Rot13.convertStringUsingRot13(domain);

		// When keyword is null initialize with space
		if (keyword == null || keyword.trim().length() == 0)
		    keyword = "";
		else
		{
		    keyword = keyword.replace(" ", "_");
		    keyword = keyword + "/";
		}

		return URLShortener.SHORTENER_URL + keyword + domainKey + "-" + urlKey;
	}
    
    public static String getShortURL(String url, String keyword, String subscriberId, String trackingId, String campaignId, ShortenURLType type, String typeOfPush) throws Exception
    {
    	URLShortener urlShortener = new URLShortener(url, subscriberId, trackingId, campaignId);
    	urlShortener.setURLShortenerType(type);
    	
    	// Set push parameter only for Yes&Push options
    	if(StringUtils.containsIgnoreCase(typeOfPush, "yes_and_push"))
    		urlShortener.setPushParameter(typeOfPush);
    	
    	urlShortener.save();
    	
    	return buildShortURL(keyword, urlShortener);
    }

    /**
     * Gets domain from shortened urls
     * 
     * @param shortURL
     *            Short url
     * @return domain if exists , otherwise empty
     */
    public static String getDomainFromShortURL(String shortURL)
    {
	try
	{
	    if (shortURL == null)
		return null;

	    // Remove all /
	    while (shortURL.endsWith("/"))
	    {
		shortURL = shortURL.substring(0, shortURL.length() - 1);
	    }

	    // Split tokens
	    String[] tokens = shortURL.split("/");
	    String shortKey = tokens[tokens.length - 1];

	    String[] keys = shortKey.split("-");
	    String domain = "";

	    System.out.println("Keys obtained after spliting url: " + keys[0] + " " + keys[1]);

	    if (StringUtils.isEmpty(keys[0]))
		return domain;

	    domain = Rot13.convertStringUsingRot13(keys[0]);
	    return domain;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
}