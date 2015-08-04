package com.agilecrm.util;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.StringTokenizer;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import com.agilecrm.Globals;
import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.campaignio.tasklets.util.MergeFieldsUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.blobstore.BlobKey;
import com.thirdparty.sendgrid.SendGrid;

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
	    String replyTo, String html, String text, List<Long> documentIds, List<BlobKey> blobKeys) throws Exception
    {
	try
	{
	    EmailSender emailSender = EmailSender.getEmailSender();

	    // Agile label to outgoing emails
	    html = appendAgileToHTML(html, "email", "Sent using", emailSender.isEmailWhiteLabelEnabled());
	    text = appendAgileToText(text, "Sent using", emailSender.isEmailWhiteLabelEnabled());

	    emailSender.sendEmail(fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text, null, documentIds,
		    blobKeys);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}

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

	String trackingImage = "<div class=\"ag-img\"><img src="
	        + VersioningUtil.getHostURLByApp(NamespaceManager.get()) + "open?" + queryParams
	        + " nosend=\"1\" style=\"display:none!important;\" width=\"1\" height=\"1\"></img></div>";

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
    public static String appendAgileToHTML(String html, String medium, String labelText, boolean isWhiteLableEnabled)
    {

	// Returns only html if Agile label exits
	if (StringUtils.isBlank(html) || StringUtils.contains(html, "https://www.agilecrm.com?utm_source=powered-by")
	        || StringUtils.contains(html, "Sent using <a href=\"https://www.agilecrm.com") || isWhiteLableEnabled)
	    return html;

	// For Campaign HTML emails, Powered by should be right aligned
	if (StringUtils.equals(labelText, "Powered by") && StringUtils.equals(medium, "campaign"))
	    html = html + "<br><br><div style=\"float:right;\">" + getPoweredByAgileLink(medium, labelText) + "</div>";
	else
	    html = html + "<br><br>" + getPoweredByAgileLink(medium, labelText);

	return html;
    }

    /**
     * Appends Agile label to text email body
     * 
     * @param text
     *            - text content of email
     * @return String
     */
    public static String appendAgileToText(String text, String labelText, boolean isWhiteLabelEnabled)
    {
	// If already exists or null, return only text
	if (StringUtils.isBlank(text) || StringUtils.contains(text, "Sent using Agile"))
	    return text;

	return isWhiteLabelEnabled ? text : text + "\n" + labelText + " Agile";
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
     * Sends email using Email APIs
     * 
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @param to
     *            - to email
     * @param cc
     *            - cc email
     * @param bcc
     *            - bcc email
     * @param subject
     *            - email subject
     * @param replyTo
     *            - replyTo email
     * @param html
     *            - html body
     * @param text
     *            - text body
     */
    public static void sendEmailUsingAPI(String fromEmail, String fromName, String to, String cc, String bcc,
	    String subject, String replyTo, String html, String text, List<Long> documentIds, List<BlobKey> blobKeys)
    {

	String domain = NamespaceManager.get();

	// For domain "clickdeskengage" - use SendGrid API
	if (StringUtils.equals(domain, Globals.CLICKDESK_ENGAGE_DOMAIN))
	{
	    SendGrid.sendMail(fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text);
	    return;
	}

	// Send email
	EmailGatewayUtil.sendEmail(domain, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text, null,
	        documentIds, blobKeys);
    }

    /**
     * Checks if white label is enabled in current domain
     * 
     * @return
     */
    public static boolean isWhiteLabelEnabled()
    {
	return BillingRestrictionUtil.getBillingRestriction(null, null).isEmailWhiteLabelEnabled();
    }

    /**
     * Returns email from String e.g., Naresh <naresh@agilecrm.com>, returns
     * email-id
     * 
     * @param emailString
     *            - email
     * @return String
     */
    public static String getEmail(String emailString)
    {
	try
	{
	    if (StringUtils.isBlank(emailString))
		return emailString;

	    if (!emailString.contains("<") || !emailString.contains(">"))
		return emailString;

	    String email = (String) emailString.subSequence(emailString.indexOf("<") + 1, emailString.indexOf(">"));

	    return email == null ? null : email.trim();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while getting email from email String..." + e.getMessage());

	    return emailString;
	}

    }

    /**
     * Returns name from String e.g., Naresh <naresh@agilecrm.com>, returns name
     * 
     * @param emailString
     * @return String
     */
    public static String getEmailName(String emailString)
    {
	try
	{
	    if (StringUtils.isBlank(emailString))
		return emailString;

	    // Returns empty if no name
	    if (!emailString.contains("<") || !emailString.contains(">"))
		return "";

	    String name = emailString.substring(0, emailString.indexOf("<") - 1);

	    // If name and email equals, return empty
	    if (StringUtils.equals(name, getEmail(emailString)))
		return "";

	    return name == null ? null : MergeFieldsUtil.getFirstUpperCaseChar(name);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while getting name from email string..." + e.getMessage());

	    return emailString;

	}
    }

    /**
     * Appends name to email
     * 
     * @param to
     *            - single email-id or multiple emails separated by comma
     * @param subscriberJSON
     * 
     * @return String
     */
    public static String appendNameToEmail(String to, JSONObject subscriberJSON)
    {
	try
	{
	    JSONObject data = subscriberJSON.getJSONObject("data");

	    String toEmail = data.getString("email");

	    String toName = "";

	    // Company has name but not firstName and lastName. Returns name
	    // with first letter capital
	    if (data.has("name") && !data.has(Contact.FIRST_NAME) && !data.has(Contact.LAST_NAME))
		toName = data.getString("name");
	    else
	    {
		if (data.has(Contact.FIRST_NAME))
		    toName = data.getString(Contact.FIRST_NAME);

		if (data.has(Contact.LAST_NAME))
		{
		    // If first name exists
		    if (StringUtils.isNotBlank(toName))
			toName = toName + " ";

		    toName = toName + data.getString(Contact.LAST_NAME);
		}
	    }

	    // If name not blank
	    if (StringUtils.isNotBlank(toName) && StringUtils.isNotBlank(toEmail))
		to = to.replace(toEmail, toName + " <" + toEmail + ">");
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while appending name to email..." + e.getMessage());
	    e.printStackTrace();
	}

	return to;
    }

}