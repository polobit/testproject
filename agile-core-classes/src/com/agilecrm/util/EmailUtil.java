package com.agilecrm.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.StringTokenizer;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import com.agilecrm.Globals;
import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.user.EmailPrefs;
import com.campaignio.tasklets.util.MergeFieldsUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.utils.SystemProperty;
import com.thirdparty.sendgrid.SendGrid;

public class EmailUtil
{

    // Agile emails - to avoid count when emails are sent to Agile support
    public static String[] agileEmails = { "care@agilecrm.com", "sales@agilecrm.com" };
    public static List<String> agileEmailsList = Arrays.asList(agileEmails);
    
    /**
     * Beta open email track url
     */
    public static final String BETA_OPEN_TRACKING_URL = "http://open-beta.agle.me";
    
    /**
     * Live open email track url
     */
    public static final String LIVE_OPEN_TRACKING_URL = "http://open.agle.me";
    
    /**
     * Live powered by url agilecrm.com
     */
    public static final String POWERED_BY_URL_AGILECRM = "https://www.agilecrm.com?utm_source=powered-by";
    
    /**
     * Live powered by url crm.io
     */
    public static final String POWERED_BY_URL_CRM = "http://www.crm.io?utm_source=powered-by";
    
    /**
     * Live powered by url agle.me
     */
    public static final String POWERED_BY_URL_AGLE_ME = "http://www.agle.me?utm_source=powered-by";
    
    /**
     * Live powered by url agle1.me
     */
    public static final String POWERED_BY_URL_AGLE2_ME = "http://www.agle2.me?utm_source=powered-by";
    
    
    
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
    
    public static String[] getStringTokenArray(String str, String delimiter)
    {
    	Set<String> tokenSet = getStringTokenSet(str, delimiter);
    	
    	return tokenSet.toArray(new String[tokenSet.size()]);
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
	    html = appendAgileToHTML(html, "email", "Sent using", emailSender.isEmailWhiteLabelEnabled(), true);
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
      // Adding domain name in query param
	String queryParams ="";
	
	String domain =  NamespaceManager.get() ;
	
	//domain name
	if(!StringUtils.isEmpty(domain))
	    queryParams = "ns=" + domain + "&";
	
	// Campaign-id
	if (!StringUtils.isEmpty(campaignId))
	    queryParams += "c=" + campaignId + "&";

	// Contact id (for campaigns) or Tracker Id (for personal emails)
	if (!StringUtils.isEmpty(trackerId))
	    queryParams += "s=" + trackerId;
	
	String trackURL = LIVE_OPEN_TRACKING_URL;
	
	//If environment is beta then use beta url
	if(SystemProperty.applicationId.get().equals("agilecrmbeta"))
		trackURL = BETA_OPEN_TRACKING_URL;
	
	String trackingImage = "<div class=\"ag-img\"><img src="
	        + trackURL + "?" + queryParams
	        + " nosend=\"1\" alt=\"\" style=\"display:block;width:1px!important;min-width:1px!important;max-width:1px!important;height:1px!important;border:0;overflow:hidden;\" border=\"0\" width=\"1\" height=\"1\"></img></div>";

	return replaceLastOccurence(html, "</body>", trackingImage);
    }

    /**
     * Returns AgileCRM website url with utm parameters
     * 
     * @param medium
     *            - utm medium type like campaign, personal
     * @return String
     */
    public static String getPoweredByAgileURL(String medium, boolean emailCategory)
    {
    	if(emailCategory)
	          return POWERED_BY_URL_AGLE_ME + "&utm_medium=" + medium + "&utm_campaign=" + NamespaceManager.get();
    
    	return POWERED_BY_URL_AGLE2_ME + "&utm_medium=" + medium + "&utm_campaign=" + NamespaceManager.get();
    
    }
    
    /**
     * This method is overloaded
     * @param medium
     * @return
     */
    public static String getPoweredByAgileURL(String medium)
    {
    	return getPoweredByAgileURL(medium, true);    
    }

    /**
     * @param labelText
     * @param medium
     * @return
     */
    public static String getPoweredByAgileLink(String medium, String labelText, boolean emailCategory)
    {
	return labelText + " <a href=\"" + getPoweredByAgileURL(medium, emailCategory)
	        + "\" target=\"_blank\" style=\"text-decoration:none;\" rel=\"nofollow\"> Agile</a>";
    }
    
    /**
     * This method is overloaded
     * 
     * @param medium
     * @param labelText
     * @return
     */
    public static String getPoweredByAgileLink(String medium, String labelText)
    {
	return getPoweredByAgileLink(medium, labelText, true);
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
    public static String appendAgileToHTML(String html, String medium, String labelText, boolean isWhiteLableEnabled, boolean emailCategory)
    {

	// Returns only html if Agile label exits
	if (isWhiteLableEnabled || StringUtils.isBlank(html) || StringUtils.contains(html, POWERED_BY_URL_AGLE_ME) || StringUtils.contains(html, POWERED_BY_URL_AGLE2_ME) || StringUtils.contains(html, POWERED_BY_URL_AGILECRM) || StringUtils.contains(html, POWERED_BY_URL_CRM)
	        || StringUtils.contains(html, "Sent using <a href=\"https://www.agilecrm.com"))
	    return html;

	// For Campaign HTML emails, Powered by should be right aligned
	if (StringUtils.equals(labelText, "Powered by") && StringUtils.equals(medium, "campaign"))
	    html = replaceLastOccurence(html, "</body>", "<div style=\"float:right;margin-top:5px\">" + getPoweredByAgileLink(medium, labelText, emailCategory) + "</div>");
	else
	    html = replaceLastOccurence(html, "</body>", "<div style=\"margin-top:5px\">" + getPoweredByAgileLink(medium, labelText, emailCategory) + "</div>");

	return html;
    }
    
    /**
     * This method is overloaded
     * @param html
     * @param medium
     * @param labelText
     * @param isWhiteLableEnabled
     * @return
     */
    public static String appendAgileToHTML(String html, String medium, String labelText, boolean isWhiteLableEnabled){
    	return appendAgileToHTML(html, medium, labelText, isWhiteLableEnabled, true);
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
	    
	    //Removing Double Quotes and single quotes
	     name=name.replaceAll("[\"']", "");

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
    
    /**
     * creating an method for the count the cc and bcc 
     * */
    public static int getCountForEmails(String emails)
    { 	
	int count = StringUtils.countMatches(emails, ",");
    	if(!StringUtils.isBlank(emails))
    		count = count + 1;
    	
       return	count;   		
		
    } 

	/**
     * This method along with footer, can be used as a template for sending mail reports.  
     * 
     * @param title
     * @return
     */
    public static String templateHeader(String title) {
		StringBuilder content = new StringBuilder();
		content.append("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"> ");
		content.append("<html xmlns=\"http://www.w3.org/1999/xhtml\"> <head> <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />");
		content.append(" <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
		content.append(" <title>AgileCRM</title> ");
		content.append("<style type=\"text/css\">body{margin:0;padding:0}img{border:0!important;outline:none!important;max-width:100%;font-size:12px}");
		content.append(".container{width:400px}.wrapper{padding:40px 110px;background-color:#fafafa;width:600px;margin:0 auto}@media(max-width:640px)");
		content.append("{.container{width:90%}h2{font-size:18px!important}.content td{font-size:12px!important;line-height:18px!important}");
		content.append(".img-responsive{max-width:100%!important;height:auto;display:block}.img-shadow{width:100%!important}}</style> </head> ");
		content.append("<body style=\"margin:0;padding:0;background-color:#fff\"> ");
		content.append("<table style=\"width:100%;align:center;border-collapse:collapse;background-repeat:repeat;background-color:#fafafa;display:table\"> ");
		content.append("<tr> <td style=\"padding:50px 130px 40px\"> <table cellspacing=\"0\" cellpadding=\"0\" align=\"center\"> <tbody> <tr> <td> ");
		content.append("<table cellspacing=\"0\" cellpadding=\"0\" align=\"center\" style=\"background-color:#fff;border-radius:5px\" class=\"container\"> ");
		content.append("<tbody> <tr> <td style=\"border:1px solid #ccc;border-radius:2px\" class=\"content\"> <table cellspacing=\"0\" cellpadding=\"0\" ");
		content.append("style=\"text-align:center;width:100%\"> <tbody> <tr> <td style=\"padding-top:15px;padding-left:20px;padding-bottom:15px;padding-right:20px\"> ");
		content.append("<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"> <tbody> <tr> <td width=\"170\" valign=\"bottom\"> ");
		content.append("<img width=\"150\" class=\"img-responsive\" alt=\"AgileCRM\" ");
		content.append("src=\"https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1383722651000?id=upload-container\"> </td> </tr> </tbody> </table>");
		content.append(" </td> </tr> </tbody> </table> <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"background-color:#ccc\"> <tbody>");
		content.append(" <tr> <td height=\"1\"></td> </tr> </tbody> </table> <table width='100%' cellspacing='0' cellpadding='5px'> <tbody> ");
		content.append("<tr> <td style='color:#1E90FF; font-weight:bold;font-size:16px; text-align:center;'> _title </td> </tr> ");
		content.append("<tr> <td style='font-weight:bold;font-size:12px; text-align:center;'> _date</td> </tr> </tbody> </table> ");
		content.append("<table cellspacing=\"0\" cellpadding=\"0\"> <tbody> <tr> ");
		content.append("<td style=\"padding-right:20px;padding-left:20px;line-height:20px;font-size:14px;font-family:arial,sans-serif;color:#4B4848\"> <p>");

		String header = StringUtils.replaceOnce(content.toString(), "_title", title);
		return StringUtils.replaceOnce(header, "_date", DateUtil.getCalendarString(System.currentTimeMillis(), DateUtil.EMAIL_TEMPLATE_DATE_FORMAT, "GMT"));
    }
    
    /**
     * This method along with header, can be used as a template for sending mail reports.  
     * 
     * @param title
     * @return
     */
    public static String templateFooter() {
    	StringBuilder content = new StringBuilder();
    	content.append("<br> <br> <br> The Crew at AgileCRM<br> <a target=\"_blank\" href=\"http://www.crm.io\">https://www.agilecrm.com</a><br> ");
		content.append("<br> <br> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td> ");
		content.append("<table cellspacing=\"0\" cellpadding=\"0\" align=\"center\" class=\"container\"> <tbody> <tr> <td align=\"center\"> ");
		content.append("<img width=\"600\" height=\"15\" src=\"http://venkat2desk.site90.net/images/border-shadow.png\" alt=\"\" class=\"img-shadow\"> </td> </tr> ");
		content.append("<tr> <td style=\"font-family:arial,sans-serif;font-size:14px;text-align:center;padding-top:15px;opacity:.6\"> ");
		content.append("Agile CRM, MS 35, 440 N Wolfe Road, Sunnyvale, CA 94085, USA. </td> </tr> <tr> ");
		content.append("<td style=\"font-family:arial,sans-serif;font-size:9px;text-align:center;padding-top:15px;padding-left:15px;padding-right:15px;opacity:.6\"> ");
		content.append("This email sent to {{email}} because with this email an account with Agile CRM has been created and subscribed to our mailing list. ");
		content.append("If you would no longer get email updates from Agile CRM, you can unsubscribe <a href=\"\">here.</a> </td> </tr> </tbody> </table> ");
		content.append("</td> </tr> </tbody> </table> </td> </tr> </table> </body> </html>");
		
		return content.toString();
    }
    
    /**
     * Common email template.
     * 
     * @param mail_content
     * @return
     */
    public static String emailTemplate(String mail_content) {
    	
    	String template = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">	" +
    	            "<html>\n" +
    	            "  <head>\n" +
    	            "    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>\n" +
    	            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>\n" +
    	            "    <title>AgileCRM</title>\n" +
    	            "    \n" +
    	            "  </head>\n" +
    	            "  <body>\n" +
    	            "    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color:#edf1f2;padding:6% 10%\">\n" +
    	            "      <tr>\n" +
    	            "        <td align=\"center\">\n" +
    	            "          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" bgcolor=\"#FFFFFF\" style=\"border:1px solid #ccc;border-radius:2px\">\n" +
    	            "            <tr>\n" +
    	            "              <td style=\"font-size: 0; line-height: 0; padding: 0 10px; border-bottom:1px solid #ccc\" height=\"70\" align=\"center\" class=\"responsive-image\">\n" +
    	            "                <img width=\"150\" alt=\"AgileCRM\" src=\"https://doxhze3l6s7v9.cloudfront.net/img/agile-crm-logo-1.png\">\n" +
    	            "              </td>\n" +
    	            "            </tr>\n" +
    	            "            <tr>\n" +
    	            "              <td style=\"padding: 15px 25px 5px\">\n" +
    	            "                <div style=\"font-size:14px;font-family:sans-serif;\">\n" +
    	            "\t\t\t" + mail_content + "\n" +
    	            "                </div>\n" +
    	            "              </td>\n" +
    	            "            </tr>\n" +
    	            "\t\t\t\n" +
    	            "\t\t\t<tr>\n" +
    	            "              <td style=\"padding: 10px 25px 25px\">\n" +
    	            "                \t\t<div style=\"font-weight: bold; font-size: 12px;\">\n" +
    	            "\t\t\t\t\t\tThe Crew at Agile CRM  <br />\n" +
    	            "\t\t\t\t\t  </div>\n" +
    	            "\t\t\t\t\t  <div><a target=\"_blank\" href=\"http://www.crm.io\" style=\"color:blue\">https://www.agilecrm.com</a></div>\n" +
    	            "              </td>\n" +
    	            "            </tr>\n" +
    	            "          </table>\n" +
    	            "        </td>\n" +
    	            "      </tr>\n" +
    	            "    </table>\n" +
    	            "  </body>\n" +
    	            "</html>";
    	
    	return template;
    }
    
	/**
     * It gives mails data as String based on mails passing
     * 
     * @param contactEmails
     *            - JSONArray contains mails
     * 
     * @return String
     */
    public static String getEmails(JSONArray contactEmails) throws JSONException
    {
    	JSONObject res = new JSONObject();
		
		EmailPrefs emailPrefs = null;
		List<String> mailUrls = new ArrayList<>();
		
		try
		{
		    emailPrefs = ContactEmailUtil.getEmailPrefs();
		    mailUrls = emailPrefs.getFetchUrls();
		    String agileEmailsUrl = "core/api/emails/agile-emails?count=20";
		    for(int i=0; i< mailUrls.size();i++){
		    	if(mailUrls.get(i).equals(agileEmailsUrl)){
		    		mailUrls.remove(i);
		    	}
		    }
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		}
		res.put("emails", contactEmails);
		res.put("emailPrefs", mailUrls);
		return res.toString();
    }
    
    /**
     * Replaces last occurence in a String
     * 
     * @param text
     * @param searchString
     * @param replacement
     * @return
     */
    public static String replaceLastOccurence(String text, String searchString, String replacement)
	{
    	try
		{
			if(StringUtils.isBlank(text) || StringUtils.isBlank(searchString) || StringUtils.isBlank(replacement))
				return text;
			
			int index = text.lastIndexOf(searchString);
			
			return text.substring(0, index) + replacement + text.substring(index);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			return text;
		}
	}
    
   }
