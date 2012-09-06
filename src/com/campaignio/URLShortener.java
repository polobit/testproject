package com.campaignio;

import java.net.URLEncoder;

import javax.persistence.Id;

import com.agilecrm.db.ObjectifyGenericDao;

@SuppressWarnings("serial")
public class URLShortener
{

    // Key
    @Id
    public Long id;

    // Url
    public String long_url;

    // Subscriber Id
    public String subscriber_id;

    // Tracker ID
    public String tracker_id;

    // Prefix
    // public static final String SHORTENER_URL =
    // "http://campaigntaskrunners.appspot.com/click/";
    public static final String SHORTENER_URL = "http://cspt.cc/";

    // Dao
    private static ObjectifyGenericDao<URLShortener> dao = new ObjectifyGenericDao<URLShortener>(
	    URLShortener.class);

    public URLShortener()
    {

    }

    public URLShortener(String longURL, String subscriberId, String trackerId)
    {
	this.long_url = longURL;
	this.subscriber_id = subscriberId;
	this.tracker_id = trackerId;
    }

    // URL
    public static URLShortener getLongURL(String shortURL)
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
	    long keyNumber = fromOtherBaseToDecimal(62, shortKey);

	    return dao.get(keyNumber);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // URL
    public static String getShortURL(String url, String keyword,
	    String subscriberId, String trackingId) throws Exception
    {

	URLShortener urlShortener = new URLShortener(url, subscriberId,
		trackingId);
	urlShortener.save();

	// Get Key
	long keyNumber = urlShortener.id;

	// Let's convert into base62
	String urlKey = fromDecimalToOtherBase(62, keyNumber);

	// Keyword
	if (keyword == null || keyword.trim().length() == 0)
	    keyword = "";
	else
	{
	    keyword = keyword.replace(" ", "_");
	    keyword = URLEncoder.encode(keyword) + "/";
	}

	return SHORTENER_URL + keyword + urlKey;
    }

    private static String fromDecimalToOtherBase(int base, long decimalNumber)
    {
	String tempVal = decimalNumber == 0 ? "0" : "";
	long mod = 0;

	while (decimalNumber != 0)
	{
	    mod = decimalNumber % base;
	    tempVal = baseDigits.substring((int) mod, (int) mod + 1) + tempVal;
	    decimalNumber = decimalNumber / base;
	}

	return tempVal;
    }

    private static long fromOtherBaseToDecimal(int base, String number)
    {
	int iterator = number.length();
	long returnValue = 0;
	long multiplier = 1;

	while (iterator > 0)
	{
	    returnValue = returnValue
		    + (baseDigits.indexOf(number.substring(iterator - 1,
			    iterator)) * multiplier);
	    multiplier = multiplier * base;
	    --iterator;
	}
	return returnValue;
    }

    private static final String baseDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    public void save()
    {
	dao.put(this);
    }

}
