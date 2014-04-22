package com.agilecrm.util;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.StringTokenizer;

import org.apache.commons.lang.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import com.agilecrm.account.util.AccountEmailStatsUtil;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.google.appengine.api.NamespaceManager;
import com.thirdparty.Mailgun;
import com.thirdparty.mandrill.Mandrill;

public class EmailUtil
{

    // Agile emails - to avoid count when emails are sent to Agile support
    public static String[] agileEmails = { "care@agilecrm.com", "sales@agilecrm.com" };
    public static List<String> agileEmailsList = Arrays.asList(agileEmails);

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
	emailBody = emailBody.replaceAll("(<script|<SCRIPT)", "<!--<script").replaceAll("(</script>|</SCRIPT>)",
		"<script>-->");

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
	    tokenSet.add(StringUtils.trim(email));
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
    public static void sendMail(String fromEmail, String fromName, String to, String cc, String bcc, String subject,
	    String replyTo, String html, String text)
    {

	// Agile label to outgoing emails
	html = appendAgileToHTML(html, "email", "Sent using");
	text = appendAgileToText(text, "Sent using");

	// Record Email Stats. Avoids count for Contact Us emails
	if (!isToAgileEmail(to))
	    AccountEmailStatsUtil.recordAccountEmailStats(NamespaceManager.get(), 1);

	// if cc or bcc present, send by Mailgun
	if (!StringUtils.isEmpty(cc) || !StringUtils.isEmpty(bcc))
	{
	    System.out.println("Sending email using Mailgun.");

	    Mailgun.sendMail(fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text);
	    return;
	}

	// if no cc or bcc, send by Mandrill
	Mandrill.sendMail(true, fromEmail, fromName, to, subject, replyTo, html, text);

    }

    /**
     * Appends tracking image for html body
     * 
     * @param html
     *            - html body.
     * @param campaignId
     *            - CampaignId.
     * @param trackerId
     *            - TrackerId or SubscriberId.
     * @return html string with appended image.
     **/
    public static String appendTrackingImage(String html, String campaignId, String trackerId)
    {
	String queryParams = "";

	// Campaign-id
	if (!StringUtils.isEmpty(campaignId))
	    queryParams = "c=" + campaignId;

	// If not emtpy add '&'
	if (!StringUtils.isEmpty(queryParams))
	    queryParams += "&";

	// Contact id (for campaigns) or Tracker Id (for personal emails)
	if (!StringUtils.isEmpty(trackerId))
	    queryParams += "s=" + trackerId;

	String trackingImage = "<div class=\"ag-img\"><img src=\"https://" + NamespaceManager.get()
		+ ".agilecrm.com/backend/open?" + queryParams + "\" nosend=\"1\" width=\"1\" height=\"1\"></img></div>";

	return html + trackingImage;
    }

    /**
     * Returns AgileCRM website url with utm parameters
     * 
     * @param medium
     *            - utm medium type like campaign, personal
     * @return String
     */
    public static String getPoweredByAgileURL(String medium)
    {
	return "https://www.agilecrm.com?utm_source=powered-by&utm_medium=" + medium + "&utm_campaign="
		+ NamespaceManager.get();
    }

    /**
     * @param labelText
     * @param medium
     * @return
     */
    public static String getPoweredByAgileLink(String medium, String labelText)
    {

	if (isWhiteLabelEnabled())
	    return "";

	return labelText + " <a href=\"" + getPoweredByAgileURL(medium)
		+ "\" target=\"_blank\" style=\"text-decoration:none;\" rel=\"nofollow\"> Agile</a>";
    }

    /**
     * Appends agilecrm link to html
     * 
     * @param html
     *            - email html body
     * @param medium
     *            - utm medium type like campaign, personal
     * @return String
     */
    public static String appendAgileToHTML(String html, String medium, String labelText)
    {

	// Returns only html if Agile label exits
	if (StringUtils.isBlank(html) || StringUtils.contains(html, "https://www.agilecrm.com?utm_source=powered-by")
		|| StringUtils.contains(html, "Sent using <a href=\"https://www.agilecrm.com"))
	    return html;

	// If body tag exists, add link before body tag ends
	if (StringUtils.contains(html, "</body>"))
	{
	    // For Campaign HTML emails, Powered by should be right aligned
	    if (StringUtils.equals(labelText, "Powered by") && StringUtils.equals(medium, "campaign"))
		html = StringUtils.replace(html, "</body>",
			"<div style=\"float:right;\">" + getPoweredByAgileLink(medium, labelText) + "</div></body>");
	    else
		html = StringUtils.replace(html, "</body>", getPoweredByAgileLink(medium, labelText) + "</body>");

	}
	else
	{
	    // For Campaign HTML emails, Powered by should be right aligned
	    if (StringUtils.equals(labelText, "Powered by") && StringUtils.equals(medium, "campaign"))
		html = html + "<br><br><div style=\"float:right;\">" + getPoweredByAgileLink(medium, labelText)
			+ "</div>";
	    else
		html = html + "<br><br>" + getPoweredByAgileLink(medium, labelText);
	}

	return html;
    }

    /**
     * Appends Agile label to text email body
     * 
     * @param text
     *            - text content of email
     * @return String
     */
    public static String appendAgileToText(String text, String labelText)
    {
	// If already exists or null, return only text
	if (StringUtils.isBlank(text) || StringUtils.contains(text, "Sent using Agile"))
	    return text;

	return isWhiteLabelEnabled() ? text : text + "\n" + labelText + " Agile";
    }

    /**
     * Verifies whether To email is Agile support email
     * 
     * @param to
     *            - To email
     * @return boolean
     */
    public static boolean isToAgileEmail(String to)
    {
	return agileEmailsList.contains(to);
    }

    /**
     * Checks if white label is enabled in current domain
     * 
     * @return
     */
    public static boolean isWhiteLabelEnabled()
    {
	return BillingRestrictionUtil.getInstance(true).getCurrentLimits().isWhiteLabelEnabled();
    }
}