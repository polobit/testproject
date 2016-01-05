package com.agilecrm.util;

import java.net.URLEncoder;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.google.appengine.api.NamespaceManager;

public class EmailLinksConversion
{
    /**
     * Regex to find http urls in a string
     */
    public static final String HTTP_URL_REGEX = "\\b(https|http|HTTP|HTTPS)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;(){}\"\']*[-a-zA-Z0-9+&@#/%=~_|]";

    /**
     * Extensions to avoid url shortening
     * 
     * public static String extensions[] = { ".png", ".jpg", ".jpeg", ".jp2",
     * ".jpx", ".gif", ".tif", ".pbm", ".bmp", ".tiff", ".ppm", ".pgm", ".pnm",
     * ".dtd" }; public static List<String> extensionsList =
     * Arrays.asList(extensions);
     */

    /**
     * Flag whether to append contact data to clicked url or not
     */
    public static String AGILE_EMAIL_PUSH = "1";

    /**
     * Validates links present in the email body (either in text or html)
     * inorder which urls need to be shortened. It omits the links ended with
     * image extensions and links like http://agle.cc
     * 
     * @param str
     *            - String token obtained based on delimiters
     * @return Boolean
     */
    private static boolean isSpecialLink(String str)
    {

	if ((str.toLowerCase().startsWith("http") || str.toLowerCase().startsWith("https"))
	        && !str.toLowerCase().contains("unsubscribe")
	        && !StringUtils.equals(str, EmailUtil.getPoweredByAgileURL("campaign"))
	        && (StringUtils.startsWith(str, "https://www.agilecrm.com") || !str.toLowerCase().contains(
	                ".agilecrm.com")) && !str.toLowerCase().contains("www.w3.org")
	        && !str.toLowerCase().startsWith("http://agle.cc")
	        && !str.toLowerCase().startsWith("http://unscr.be"))
	    return true;

	return false;
    }

    public static String convertLinksUsingJSOUP(String input, String subscriberId, String campaignId, boolean doPush)
    {
    	return convertLinksUsingJSOUP(input, subscriberId, campaignId, null, doPush);
    }
    
    /**
     * Converts all links within href in HTML
     * 
     * @param input
     *            - HTML body of email
     * @param subscriberId
     *            - subscriber id
     * @param campaignId
     *            - campaign id
     * @param doPush
     *            - boolean value to push contact data
     * @return String
     */
    public static String convertLinksUsingJSOUP(String input, String subscriberId, String campaignId, String personalEmailTrackerId, boolean doPush)
    {
	// If empty return
	if (StringUtils.isBlank(input))
	    return input;

	try
	{
	    Document doc = Jsoup.parse(input);

	    // Get all anchor element href attributes
	    Elements links = doc.select("a[href]");

	    // Triggered main url
	    String domainURL = VersioningUtil.getHostURLByApp(NamespaceManager.get());

	    // Remove all /
	    while (domainURL.endsWith("/"))
	    {
		domainURL = domainURL.substring(0, domainURL.length() - 1);
	    }

	    String sid = "", cid = "", push = "", url = "", tid = "";

	    // Add contactId as param if not empty
	    if (!StringUtils.isBlank(subscriberId))
		sid = "&s=" + URLEncoder.encode(subscriberId, "UTF-8");

	    // Add campaign id as param if not empty
	    if (!StringUtils.isBlank(campaignId))
		cid = "&c=" + URLEncoder.encode(campaignId, "UTF-8");
	    
	    if(!StringUtils.isBlank(personalEmailTrackerId))
	    	tid = "&t=" + URLEncoder.encode(personalEmailTrackerId, "UTF-8");

	    if (doPush)
		push = "&p=" + URLEncoder.encode(AGILE_EMAIL_PUSH, "UTF-8");

	    // All href links
	    for (Element link : links)
	    {

		// Absolute urls
		url = link.attr("abs:href");

		// If href is '#'
		if (url.startsWith("#"))
		    continue;

		if (isSpecialLink(url))
		{
		    link.attr("href",
			    domainURL + "/click?u=" + URLEncoder.encode(StringEscapeUtils.unescapeXml(url), "UTF-8")
			            + cid + sid + tid + push);
		}
	    }

	    return doc.html();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Got Exception while parsing email body... " + e);
	}

	return input;
    }

    /**
     * Replaces http urls with agile tracking urls
     * 
     * @param input
     *            - text or html
     * @param subscriberId
     *            - subscriber id
     * @param campaignId
     *            - campaign id
     * @return String
     */
    public static String convertLinksUsingRegex(String input, String subscriberId, String campaignId, boolean doPush)
    {
	Pattern p = Pattern.compile(HTTP_URL_REGEX);
	Matcher m = p.matcher(input);

	StringBuffer stringBuffer = new StringBuffer();

	// Domain URL
	// String domainURL = VersioningUtil.getLoginURL(NamespaceManager.get(),
	// "sandbox");

	String domainURL = VersioningUtil.getHostURLByApp(NamespaceManager.get());

	// Remove all /
	while (domainURL.endsWith("/"))
	{
	    domainURL = domainURL.substring(0, domainURL.length() - 1);
	}

	String sid = "", cid = "", push = "";

	try
	{
	    // Add contactId as param if not empty
	    if (!StringUtils.isBlank(subscriberId))
		sid = "&s=" + URLEncoder.encode(subscriberId, "UTF-8");

	    // Add campaign id as param if not empty
	    if (!StringUtils.isBlank(campaignId))
		cid = "&c=" + URLEncoder.encode(campaignId, "UTF-8");

	    if (doPush)
		push = "&p=" + URLEncoder.encode(AGILE_EMAIL_PUSH, "UTF-8");

	    // Iterate over matches
	    while (m.find())
	    {
		String url = m.group();

		// Remove "/ or '/ that appends to url, if any
		if (url.endsWith("\"/") || url.endsWith("\'/"))
		    url = url.substring(0, url.length() - 2);

		// Replaces valid http urls with agile tracking links
		if (isSpecialLink(url))
		{

		    // Appends to StringBuffer
		    m.appendReplacement(stringBuffer,
			    domainURL + "/click?u=" + URLEncoder.encode(StringEscapeUtils.unescapeXml(url), "UTF-8")
			            + cid + sid + push);
		}
	    }

	    // append last characters to the stringbuffer too
	    m.appendTail(stringBuffer);

	    input = stringBuffer.toString();
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while converting links..." + e.getMessage());
	    e.printStackTrace();
	}

	return input;
    }
}
