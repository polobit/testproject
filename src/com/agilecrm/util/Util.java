package com.agilecrm.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.thirdparty.SendGridEmail;

/**
 * <code>Util</code> class includes utility methods to access from different
 * entities
 * 
 * @author
 */
public class Util
{

    /**
     * Makes the given set of string as a single string and then splits into
     * words, again into fragments, which are normalized to lower case.
     * 
     * @param strings
     * @return set of fragmented strings
     */
    public static Set<String> getSearchTokens(Set<String> strings)
    {
	StringBuilder sb = new StringBuilder();
	for (String s : strings)
	    sb.append(s + " ");

	String input = sb.toString();

	// Set<String> tokens = tokenize(input);
	return StringUtils2.breakdownFragments(input);
    }

    /**
     * Gets Calendar in Pacific. Returns date in specified format and time zone
     * for the give epoch time.
     * 
     * @param timeout
     * @return date string
     */
    public static String getCalendarString(long timeout)
    {
	// Defines output format and print
	SimpleDateFormat sdf = new SimpleDateFormat("d MMM yyyy hh:mm aaa");
	TimeZone pst = TimeZone.getTimeZone("PST");

	sdf.setTimeZone(pst);
	Calendar calendar = Calendar.getInstance();
	calendar.setTimeInMillis(timeout);

	String date = sdf.format(calendar.getTime());
	return date;
    }

    /**
     * Makes the number as starting with "+1", if it does not so.
     * 
     * @param number
     * @return number starts with +1
     */
    public static String changeNumber(String number)
    {

	// Add if it does not start with 1 or +
	if (number.startsWith("+"))
	    return number;

	if (number.startsWith("1"))
	    return "+" + number;

	return "+1" + number;
    }

    /**
     * Reads resource from file (war), if it is found at given path
     * 
     * @param path
     * @return resource in UTF-8
     */
    public static String readResource(String path)
    {
	try
	{
	    // System.out.println(path);
	    File f = new File(path);
	    if (!f.exists())
	    {
		System.out.println("File does not exist");
		return null;
	    }

	    InputStream is = new FileInputStream(f);

	    return IOUtils.toString(is, "UTF-8");
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Sends an email using to remote object <code>SendGridEmail</code>
     * 
     * @param fromEmail
     * @param fromName
     * @param to
     * @param subject
     * @param replyTo
     * @param html
     * @param text
     * @return response of the remote object
     */
    public static String sendMail(String fromEmail, String fromName, String to, String subject, String replyTo, String html, String text)
    {
	return SendGridEmail.sendMail(fromEmail, fromName, to, subject, replyTo, html, text, null, null);

    }

    /**
     * Adds the key and value pair to the Memcache.
     * 
     * @param key
     *            String to store as map key
     * @param value
     *            Object represents the value to map
     */
    public static void setCache(String key, Object value)
    {

	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	syncCache.put(key, value);

	NamespaceManager.set(oldNamespace);
    }

    /**
     * Gets the value from Cache. The Object holding the value is returned
     * 
     * @param key
     *            Memcache key to search
     * @return Object with value
     */
    public static Object getCache(String key)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	Object value = syncCache.get(key);

	NamespaceManager.set(oldNamespace);

	return value;
    }

    /**
     * Removes the data from Cache. Returns void
     * 
     * @param key
     *            Memcache key to search
     */
    public static void deleteCache(String key)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	if (syncCache.contains(key))
	    syncCache.delete(key);

	NamespaceManager.set(oldNamespace);
    }

    /**
     * Gets OAuth domain name and returns its associated url
     * 
     * @param provider
     * @return url of the given domain name
     */
    public static String getOauthURL(String provider)
    {
	Map<String, String> openIdProviders = new HashMap<String, String>();
	openIdProviders.put("google", "www.google.com/accounts/o8/id");
	openIdProviders.put("yahoo", "me.yahoo.com");
	openIdProviders.put("myspace", "myspace.com");
	openIdProviders.put("aol", "aol.com");
	openIdProviders.put("myopenid.com", "stats.agilecrm.com");

	return openIdProviders.get(provider.toLowerCase());
    }

    public static String toJSONString(Object obj)
    {
	ObjectMapper mapper = new ObjectMapper();
	String json;
	try
	{
	    json = mapper.writeValueAsString(obj);
	    return json;
	}
	catch (Exception e)
	{
	    System.out.println(e.getMessage());
	    return "";
	}
    }

    /**
     * Appends tracking image for html body
     * 
     * @param html
     *            - html body.
     * @param campaignId
     *            - CampaignId.
     * @param subsciberId
     *            - SubscriberId.
     * @return html string with appended image.
     **/
    public static String appendTrackingImage(String html, String campaignId, String subscriberId)
    {
	String namespace = NamespaceManager.get();

	if (StringUtils.isEmpty(campaignId))
	    campaignId = "";

	String trackingImage = "<div class=\"ag-img\"><img src=\"https://" + namespace + ".agilecrm.com/backend/open?n=" + namespace + "&c=" + campaignId
		+ "&s=" + subscriberId + "\" nosend=\"1\" width=\"1\" height=\"1\"></img></div>";

	return html + trackingImage;
    }

    /**
     * Parses html body of an email using jsoup.
     * 
     * @param emailBody
     *            - email body
     * @return String
     */
    public static String parseEmailData(String emailBody)
    {
	emailBody = emailBody.replace("&amp;amp;", "&").replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", "\"")
		.replace("&nbsp;", "").replace("\n", "<br>").replace("<br>", "<div></div>").replace("<br />", "<div></div>");

	try
	{
	    if (emailBody != null && emailBody.length() > 0)
	    {
		Document doc = Jsoup.parse(emailBody);

		// Remove agile tracking images, if exists
		Elements divs = doc.select("div.ag-img");

		if (!divs.isEmpty())
		    divs.first().remove();

		emailBody = doc.select("body").toString();
	    }

	    // Remove script tags.
	    String[] htmltags = new String[] { "(?)(<script.*?|<SCRIPT.*?)(.+?)(</script>|</SCRIPT>)" };

	    for (String str : htmltags)
	    {
		emailBody = emailBody.replaceAll(str, "");
	    }

	}
	catch (Exception e)
	{
	    emailBody = "";
	}

	return emailBody;
    }

}