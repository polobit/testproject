package com.campaignio.util;

import java.net.URLEncoder;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.db.ObjectifyGenericDao;
import com.campaignio.URLShortener;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>URLShortenerUtil</code> is the class to convert urls from long urls to
 * short urls or vice-versa. It appends purl keyword and random number to the
 * shorten url. It uses 62 base to convert decimal numbers inorder to get random
 * number.
 * 
 * @author Manohar
 * 
 */
public class URLShortenerUtil
{
    /**
     * Base 62 having 62 digits
     */
    private static final String baseDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    /**
     * Dao for URLShortener class
     */
    private static ObjectifyGenericDao<URLShortener> dao = new ObjectifyGenericDao<URLShortener>(
	    URLShortener.class);

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

	    long keyNumber = fromOtherBaseToDecimal(62, urlKey);

	    // Increment Emails clicked count based on campaign
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
    @SuppressWarnings("deprecation")
    public static String getShortURL(String url, String keyword,
	    String subscriberId, String trackingId, String campaignId)
	    throws Exception
    {
	URLShortener urlShortener = new URLShortener(url, subscriberId,
		trackingId, campaignId);
	urlShortener.save();

	// Get Key
	long keyNumber = urlShortener.id;

	// Let's convert into base62
	String urlKey = fromDecimalToOtherBase(62, keyNumber);

	// Gets current namespace to append url
	String domain = NamespaceManager.get();
	System.out.println("Namespace in URLShortenerUtil: " + domain);

	String domainKey = "";

	if (StringUtils.isEmpty(domain))
	{
	    return null;
	}

	// Converts domain using Rot13.
	domainKey = convertStringUsingRot13(domain);

	// When keyword is null initialize with space
	if (keyword == null || keyword.trim().length() == 0)
	    keyword = "";
	else
	{
	    keyword = keyword.replace(" ", "_");
	    keyword = URLEncoder.encode(keyword) + "/";
	}

	return URLShortener.SHORTENER_URL + keyword + domainKey + "-" + urlKey;
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

	    System.out.println("Keys obtained after spliting url: " + keys[0]
		    + " " + keys[1]);

	    if (StringUtils.isEmpty(keys[0]))
		return domain;

	    domain = convertStringUsingRot13(keys[0]);
	    return domain;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Returns converted number to required base from decimal. This method is
     * used to get random number
     * 
     * @param base
     *            Required base, number to be converted
     * @param decimalNumber
     *            Decimal number
     * @return string with converted decimal number to other base
     **/
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

    /**
     * Returns decimal number from number with other base
     * 
     * @param base
     *            Base of a number exists at present
     * @param number
     *            Number need to be converted to decimal
     * @return decimal number
     */
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

    /**
     * Converts string using Rot13 algorithm.Same method can be used to encrypt
     * and decrypt the string. E.g., A <-> N, B <-> O etc.
     * 
     * @param value
     *            - Required string to be converted.
     * @return - converted string.
     */
    private static String convertStringUsingRot13(String value)
    {
	// To append characters.
	StringBuffer temp = new StringBuffer();

	for (int i = 0; i < value.length(); i++)
	{
	    char c = value.charAt(i);
	    if (c >= 'a' && c <= 'm')
		c += 13;
	    else if (c >= 'A' && c <= 'M')
		c += 13;
	    else if (c >= 'n' && c <= 'z')
		c -= 13;
	    else if (c >= 'N' && c <= 'Z')
		c -= 13;

	    temp.append(c);
	}
	return temp.toString();
    }
}
