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

import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.thirdparty.SendGridEmail;

public class Util
{

    public static Set<String> getSearchTokens(Set<String> strings)
    {
	StringBuilder sb = new StringBuilder();
	for (String s : strings)
	    sb.append(s + " ");

	String input = sb.toString();

	// Set<String> tokens = tokenize(input);
	return StringUtils2.breakdownFragments(input);
    }

    // Get Calendar in Pacific
    public static String getCalendarString(long timeout)
    {
	// define output format and print
	SimpleDateFormat sdf = new SimpleDateFormat("d MMM yyyy hh:mm aaa");
	TimeZone pst = TimeZone.getTimeZone("PST");

	sdf.setTimeZone(pst);
	Calendar calendar = Calendar.getInstance();
	calendar.setTimeInMillis(timeout);

	String date = sdf.format(calendar.getTime());
	return date;
    }

    // Change Number
    public static String changeNumber(String number)
    {

	// Add if it does not start with 1 or +
	if (number.startsWith("+"))
	    return number;

	if (number.startsWith("1"))
	    return "+" + number;

	return "+1" + number;
    }

    // Read Resource from File (war)
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

    // Send Email

    public static String sendMail(String fromEmail, String fromName, String to,
	    String subject, String replyTo, String html, String text)
    {
	return SendGridEmail.sendMail(fromEmail, fromName, to, subject,
		replyTo, html, text, null, null);

    }

    // Set Cache
    public static void setCache(String key, Object value)
    {

	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	syncCache.put(key, value);

	NamespaceManager.set(oldNamespace);
    }

    // Add Cache
    public static Object getCache(String key)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	Object value = syncCache.get(key);

	NamespaceManager.set(oldNamespace);

	return value;
    }

    // Delete Cache
    public static void deleteCache(String key)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	if (syncCache.contains(key))
	    syncCache.delete(key);

	NamespaceManager.set(oldNamespace);
    }

    // Get OAuth Domain Name
    public static String getOauthURL(String provider)
    {
	Map<String, String> openIdProviders = new HashMap<String, String>();
	openIdProviders.put("google", "www.google.com/accounts/o8/id");
	openIdProviders.put("yahoo", "yahoo.com");
	openIdProviders.put("myspace", "myspace.com");
	openIdProviders.put("aol", "aol.com");
	openIdProviders.put("myopenid.com", "stats.agilecrm.com");

	return openIdProviders.get(provider.toLowerCase());
    }
}