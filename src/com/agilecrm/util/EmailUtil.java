package com.agilecrm.util;

import java.util.HashSet;
import java.util.Set;
import java.util.StringTokenizer;

import org.apache.commons.lang.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import com.google.appengine.api.NamespaceManager;
import com.thirdparty.Mailgun;
import com.thirdparty.Mandrill;

public class EmailUtil
{

    /**
     * Parses html body of an email using jsoup.
     * 
     * @param emailBody
     *            - email body
     * @return String
     */
    public static String parseEmailData(String emailBody)
    {
	// If null or empty return.
	if (StringUtils.isEmpty(emailBody))
	    return emailBody;

	// Comment script tags.
	emailBody = emailBody.replaceAll("(<script|<SCRIPT)", "<!--<script").replaceAll("(</script>|</SCRIPT>)", "<script>-->");

	// If emailBody is text, replace '\n' with <br> is enough
	if (!(emailBody.contains("</")))
	{
	    emailBody = emailBody.replaceAll("(\r\n|\n)", "<br />");
	    return emailBody;
	}

	try
	{
	    Document doc = Jsoup.parse(emailBody);

	    // Remove agile tracking images, if exists inorder to avoid
	    // downloading again in contact-detail page.
	    Elements divs = doc.select("div.ag-img");

	    if (!divs.isEmpty())
		divs.first().remove();

	    emailBody = doc.select("body").toString();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Got Exception while parsing email body " + e);
	}

	return emailBody;
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
    public static String appendTrackingImage(String html, String campaignId, String subscriberId, Long trackerId)
    {
	String namespace = NamespaceManager.get();
	String queryParams = "";

	// for campaign email
	if (!(StringUtils.isEmpty(campaignId) && StringUtils.isEmpty(subscriberId)))
	    queryParams = "c=" + campaignId + "&s=" + subscriberId;

	// for contact email append trackerId
	else
	    queryParams = "t=" + trackerId;

	String trackingImage = "<div class=\"ag-img\"><img src=\"https://" + namespace + ".agilecrm.com/backend/open?" + queryParams
		+ "\" nosend=\"1\" width=\"1\" height=\"1\"></img></div>";

	return html + trackingImage;
    }

    /**
     * Returns set collection with string tokens obtained from given string.
     * 
     * @param str
     *            - String to be tokenized having delimiter like comma
     * @param delimiter
     *            - Delimiter string like comma.
     * @return Set<String>
     */
    public static Set<String> getStringTokenSet(String str, String delimiter)
    {
	// Set to not allow duplicates
	Set<String> tokenSet = new HashSet<String>();

	// Generate tokens w.r.t delimiter
	StringTokenizer st = new StringTokenizer(str, delimiter);

	// add tokens to set
	while (st.hasMoreTokens())
	{
	    String email = st.nextToken();
	    tokenSet.add(email.trim());
	}

	return tokenSet;
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
    public static void sendMail(String fromEmail, String fromName, String to, String cc, String bcc, String subject, String replyTo, String html, String text)
    {
	// if cc or bcc present, send by Mailgun
	if (!StringUtils.isEmpty(cc) || !StringUtils.isEmpty(bcc))
	{
	    System.out.println("Sending email using Mailgun.");

	    Mailgun.sendMail(fromEmail, fromName, to, cc, bcc, subject, replyTo, EmailUtil.removeNonASCIICharacters(html),
		    EmailUtil.removeNonASCIICharacters(text));
	    return;
	}

	// if no cc or bcc, send by Mandrill
	Mandrill.sendMail(fromEmail, fromName, to, subject, replyTo, EmailUtil.removeNonASCIICharacters(html), EmailUtil.removeNonASCIICharacters(text));
    }

    /**
     * Removes all Non-ASCII characters of a string.
     * 
     * @param str
     *            - string that contains non-ascii characters.
     * @return String
     */
    public static String removeNonASCIICharacters(String str)
    {
	// if empty or null
	if (StringUtils.isEmpty(str))
	    return str;

	// Removes all of the non-ASCII characters
	str = str.replaceAll("[^\\x20-\\x7e]", "");

	// Removes all non-four-byte-UTF-8 characters like black diamond with
	// question mark
	str = str.replaceAll("[^\\u0000-\\uFFFF]", "");

	return str;
    }
}