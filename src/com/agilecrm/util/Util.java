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
    public static String sendMail(String fromEmail, String fromName, String to,
	    String subject, String replyTo, String html, String text)
    {
	return SendGridEmail.sendMail(fromEmail, fromName, to, subject,
		replyTo, html, text, null, null);

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
	openIdProviders.put("yahoo", "yahoo.com");
	openIdProviders.put("myspace", "myspace.com");
	openIdProviders.put("aol", "aol.com");
	openIdProviders.put("myopenid.com", "stats.agilecrm.com");

	return openIdProviders.get(provider.toLowerCase());
    }
}