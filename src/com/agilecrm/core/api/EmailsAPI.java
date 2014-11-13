package com.agilecrm.core.api;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.account.EmailGateway;
import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.mandrill.util.MandrillUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.HTTPUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.google.appengine.api.NamespaceManager;
import com.thirdparty.mandrill.EmailContentLengthLimitExceededException;
import com.thirdparty.mandrill.subaccounts.MandrillSubAccounts;

/**
 * <code>EmailsAPI</code> is the API class for Emails. It handles sending email
 * from Contact, Contact Us and footer. It also handles request to fetch imap
 * emails.
 * 
 */
@Path("/api/emails")
public class EmailsAPI
{
    /**
     * Sends Emails based on the query parameters.
     * 
     * @param fromEmail
     *            - from email
     * @param to
     *            - to email
     * @param subject
     *            - subject
     * @param body
     *            - body
     */
    @Path("send-email")
    @POST
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void createEmail(@QueryParam("from") String fromEmail, @QueryParam("to") String to,
	    @QueryParam("subject") String subject, @QueryParam("body") String body) throws Exception
    {
	EmailUtil.sendMail(fromEmail, fromEmail, to, null, null, subject, fromEmail, body, null, null);
    }

    /**
     * Sends Email and saves the email sent from contact.
     * 
     * @param fromEmail
     *            - from email
     * @param to
     *            - to email
     * @param subject
     *            - subject
     * @param body
     *            - body
     */
    @Path("contact/send-email")
    @POST
    @Consumes({ MediaType.APPLICATION_FORM_URLENCODED })
    public void sendEmail(@Context HttpServletRequest request, @FormParam("from_name") String fromName,
	    @FormParam("from_email") String fromEmail, @FormParam("to") String to, @FormParam("email_cc") String cc,
	    @FormParam("email_bcc") String bcc, @FormParam("subject") String subject, @FormParam("body") String body,
	    @FormParam("signature") String signature, @FormParam("track_clicks") boolean trackClicks,
	    @FormParam("document_id") String document_id) throws Exception
    {
	try
	{
	    // Removes traling commas if any
	    to = AgileTaskletUtil.normalizeStringSeparatedByDelimiter(',', to);

	    if (!StringUtils.isBlank(cc))
		cc = AgileTaskletUtil.normalizeStringSeparatedByDelimiter(',', cc);

	    if (!StringUtils.isBlank(bcc))
		bcc = AgileTaskletUtil.normalizeStringSeparatedByDelimiter(',', bcc);

	    List<Long> documentIds = new ArrayList<Long>();
	    if (StringUtils.isNotBlank(document_id))
	    {
		Long documentId = Long.parseLong(document_id);
		documentIds.add(documentId);
	    }
	    if (MandrillUtil.isEmailContentSizeValid(body, document_id))
	    {
		// Saves Contact Email.
		ContactEmailUtil.saveContactEmailAndSend(fromEmail, fromName, to, cc, bcc, subject, body, signature,
		        null, trackClicks, documentIds);

		ActivitySave.createEmailSentActivityToContact(to, subject, body);
	    }

	}
	catch (EmailContentLengthLimitExceededException e)
	{
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}
    }

    /**
     * Returns imap emails merging with contact emails, when imap preferences
     * are set. Otherwise simply returns contact emails. Emails json string are
     * returned in the format {emails:[]}.
     * 
     * @param searchEmail
     *            - to get emails related to search email
     * @param count
     *            - required number of emails.
     * @param offset
     *            - offset.
     * @return String
     */
    @Path("imap-email")
    @GET
    @Produces({ MediaType.APPLICATION_JSON + " ;charset=utf-8" })
    public String getEmails(@QueryParam("e") String searchEmail, @QueryParam("o") String offset,
	    @QueryParam("c") String count)
    {
	try
	{

	    // Removes unwanted spaces in between commas
	    String normalisedEmail = AgileTaskletUtil.normalizeStringSeparatedByDelimiter(',', searchEmail);

	    // Gets gmailPrefs url if not null, otherwise imap url.
	    String url = ContactEmailUtil.getEmailsFetchURL(AgileUser.getCurrentAgileUser(), normalisedEmail, offset,
		    count);

	    // If both are not set, return Contact emails.
	    if (url == null)
	    {
		JSONArray contactEmails = ContactEmailUtil.mergeContactEmails(StringUtils.split(searchEmail, ",")[0],
		        null);

		// return in the same format {emails:[]}
		return new JSONObject().put("emails", contactEmails).toString();
	    }

	    // Returns imap emails, usually in form of {emails:[]}, if not build
	    // result like that.
	    String jsonResult = HTTPUtil.accessURL(url);

	    // Convert emails to json.
	    JSONObject emails = ContactEmailUtil.convertEmailsToJSON(jsonResult);

	    // Fetches JSONArray from {emails:[]}
	    JSONArray emailsArray = emails.getJSONArray("emails");

	    // Add owner email to each email and parse each email body.
	    emailsArray = ContactEmailUtil.addOwnerAndParseEmailBody(emailsArray);

	    // Merges imap emails and contact emails.
	    emailsArray = ContactEmailUtil.mergeContactEmails(StringUtils.split(searchEmail, ",")[0], emailsArray);

	    return emails.toString();
	}
	catch (Exception e)
	{
	    System.out.println("Got an exception in EmailsAPI: " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Returns mandrill subaccount information
     * 
     * @return String
     * @throws Exception
     */
    @Path("email-stats")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getEmailActivityFromMandrill() throws Exception
    {
	EmailGateway emailGateway = EmailGatewayUtil.getEmailGateway();

	String apiKey = null;

	// Get emailGateway api-key
	if (emailGateway != null)
	    apiKey = emailGateway.api_key;

	// Returns mandrill subaccount info if created, otherwise error json.
	String info = MandrillSubAccounts.getSubAccountInfo(NamespaceManager.get(), apiKey);

	// If subaccount did not exist, return null
	if (StringUtils.contains(info, "Unknown_Subaccount"))
	{
	    System.out.println("Mandrill sub-account is not yet created or can't get info. So return null");
	    return null;
	}

	return info;
    }

    /**
     * Sends Email and saves the email sent from contact.
     * 
     * @param fromEmail
     *            - from email
     * @param to
     *            - to email
     * @param subject
     *            - subject
     * @param body
     *            - body
     */
    @Path("send-test-email")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public String sendTestEmail(@FormParam("from_name") String fromName, @FormParam("from_email") String fromEmail,
	    @FormParam("to_email") String toEmail, @FormParam("subject") String subject,
	    @FormParam("text_email") String textEmail, @FormParam("html_email") String htmlEmail,
	    @FormParam("replyto_email") String replyToEmail)
    {

	try
	{

	    EmailSender emailSender = EmailSender.getEmailSender();

	    // Appends Agile label
	    textEmail = StringUtils.replace(textEmail, EmailUtil.getPoweredByAgileLink("campaign", "Powered by"),
		    "Sent using Agile");
	    textEmail = EmailUtil.appendAgileToText(textEmail, "Sent using", emailSender.isEmailWhiteLabelEnabled());

	    // If no powered by merge field, append Agile label to html
	    if (!StringUtils.contains(htmlEmail, EmailUtil.getPoweredByAgileLink("campaign", "Powered by")))
		htmlEmail = EmailUtil.appendAgileToHTML(htmlEmail, "campaign", "Powered by",
		        emailSender.isEmailWhiteLabelEnabled());

	    emailSender.sendEmail(fromEmail, fromName, fromEmail, null, null, subject, replyToEmail, htmlEmail,
		    textEmail, null, null);

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while sending test email..." + e.getMessage());
	    e.printStackTrace();
	}

	return fromEmail;
    }
}