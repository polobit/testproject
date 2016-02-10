package com.agilecrm.core.api;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

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
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.account.EmailGateway;
import com.agilecrm.account.EmailGateway.EMAIL_API;
import com.agilecrm.account.VerifiedEmails;
import com.agilecrm.account.VerifiedEmails.Verified;
import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.account.util.VerifiedEmailsUtil;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.ContactEmail;
import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.email.wrappers.ContactEmailWrapper;
import com.agilecrm.mandrill.util.MandrillUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.EmailPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.DateUtil;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.util.NamespaceUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.blobstore.BlobKey;
import com.thirdparty.mandrill.EmailContentLengthLimitExceededException;
import com.thirdparty.mandrill.Mandrill;
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
	EmailUtil.sendMail(fromEmail, fromEmail, to, null, null, subject, fromEmail, body, null, null,null);
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
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void sendEmail(ContactEmailWrapper contactEmail)
	    throws Exception
    {
	try
	{
	    
	    if (MandrillUtil.isEmailContentSizeValid(contactEmail.getMessage(), contactEmail.getDocument_key()))
	    {
		// Saves Contact Email.
//		ContactEmailUtil.saveContactEmailAndSend(fromEmail, fromName, to, cc, bcc, subject, body, signature,
//			null, trackClicks, documentIds, blobKeys, attachment_name, attachment_url);
		
		ContactEmailUtil.buildContactEmailAndSend(contactEmail);

	    }

	}
	catch (EmailContentLengthLimitExceededException e)
	{
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}
    }

    /**
     * Agile Support emails to be sent through Mandrill without any subaccount.
     * 
     * @param fromEmail
     *            - from email
     * @param to
     *            - to email
     * @param subject
     *            - email subject
     * @param body
     *            - Email body
     * @throws Exception
     */
    @Path("contact-us")
    @POST
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Consumes({ MediaType.APPLICATION_FORM_URLENCODED })
    public void sendEmail(@FormParam("from") String fromEmail, @FormParam("to") String to,
	    @FormParam("subject") String subject, @FormParam("body") String body) throws Exception
    {
	String oldNamespace = NamespaceManager.get();

	try
	{
	    // To avoid sending through subaccount
	    NamespaceManager.set("");
	    Mandrill.sendMail(false, fromEmail, fromEmail, to, null, null, subject, fromEmail, body, null, null, null,null);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while sending Agile help email..." + e.getMessage());
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
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
	    emailsArray = ContactEmailUtil.addOwnerAndParseEmailBody(emailsArray, "");

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
	
	// If not Mandrill, return 
	if(emailGateway != null && !(emailGateway.email_api.equals(EMAIL_API.MANDRILL)))
		return new JSONObject().put("_agile_email_gateway", emailGateway.email_api.toString()).toString();

	String apiKey = null;

	// Get emailGateway api-key
	if (emailGateway != null)
	    apiKey = emailGateway.api_key;
	
	String domain = NamespaceManager.get();

	// Returns mandrill subaccount info if created, otherwise error json.
	String info = MandrillSubAccounts.getSubAccountInfo(domain, apiKey);

	// If subaccount did not exist, return null
	if (StringUtils.contains(info, "Unknown_Subaccount"))
	{
	    System.out.println("Mandrill sub-account is not yet created or can't get info. So return null");

	    JSONObject subAccountJSON = new JSONObject();

	    JSONObject last30Days = new JSONObject();
	    last30Days.put("rejects", 0);
	    last30Days.put("soft_bounces", 0);
	    last30Days.put("unique_clicks", 0);
	    last30Days.put("sent", 0);
	    last30Days.put("unique_opens", 0);
	    last30Days.put("hard_bounces", 0);
	    last30Days.put("clicks", 0);
	    last30Days.put("opens", 0);
	    last30Days.put("complaints", 0);
	    last30Days.put("unsubs", 0);

	    subAccountJSON.put("id", domain);
	    subAccountJSON.put("hourly_quota", 250);
	    subAccountJSON.put("sent_monthly", 0);
	    subAccountJSON.put("sent_hourly", 0);
	    subAccountJSON.put("sent_weekly", 0);
	    subAccountJSON.put("last_30_days", last30Days);
	    subAccountJSON.put("status", "active");
	    subAccountJSON.put("reputation", 60);
	    subAccountJSON.put("name", domain);
	    subAccountJSON.put("sent_total", 0);
	    subAccountJSON.put("created_at", "");
	    subAccountJSON.put("notes", "");
	    subAccountJSON.put("first_sent_at", "");
	    
	    subAccountJSON.put("_agile_email_gateway", "MANDRILL");

	    return subAccountJSON.toString();
	}

	// Add email gateway to check on client side
	JSONObject infoJSON = new JSONObject(info);

	if (emailGateway != null)
	    infoJSON.put("_agile_email_gateway", emailGateway.email_api);

	return infoJSON.toString();
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
		    textEmail, null, new ArrayList<Long>(),new ArrayList<BlobKey>());

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while sending test email..." + e.getMessage());
	    e.printStackTrace();
	}

	return fromEmail;
    }

    /**
     * Gets the list of synced email account names of this Agile user
     * 
     * @return
     */
    @Path("synced-accounts")
    @GET
    // @Produces({ MediaType.APPLICATION_JSON + " ;charset=utf-8" })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public EmailPrefs getEmailAccounts()
    {
	EmailPrefs emailPrefs = null;
	try
	{
	    emailPrefs = ContactEmailUtil.getEmailPrefs();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return emailPrefs;
    }

    /**
     * Returns emails sent through Agile. Emails json string are returned in the
     * format {emails:[]}.
     * 
     * @param searchEmail
     *            - to get emails related to search email
     * @param count
     *            - required number of emails.
     * @param offset
     *            - offset.
     * @return String
     */
    @Path("agile-emails")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<ContactEmailWrapper> getAgileEmails(@QueryParam("search_email") String searchEmail,@QueryParam("count") String countString)
    {
	List<ContactEmailWrapper> emailsList = null;
	try
	{
	    // Removes unwanted spaces in between commas
	    String normalisedEmail = AgileTaskletUtil.normalizeStringSeparatedByDelimiter(',', searchEmail);

	    searchEmail = StringUtils.split(normalisedEmail, ",")[0];

	    Contact contact = ContactUtil.searchContactByEmail(searchEmail);
	    
	    List<ContactEmail> contactEmails = null;
	    
	    if(StringUtils.isNotBlank(countString))
	    {
	    	try
	    	{
	    		Integer count = Integer.parseInt(countString);
	    		// Fetches latest contact emails
	    		contactEmails = ContactEmailUtil.getContactEmails(contact.id,count);
	    	}
	    	catch(NumberFormatException e)
	    	{
	    		e.printStackTrace();
	    		contactEmails = ContactEmailUtil.getContactEmails(contact.id,20);
	    	}
	    }
	    else
	    {
	    	contactEmails = ContactEmailUtil.getContactEmails(contact.id);
	    }
	    
        if(contactEmails!= null)
        {
		    JSONArray agileEmails = new JSONArray();
		    // Merge Contact Emails with obtained imap emails
		    for (ContactEmail contactEmail : contactEmails)
		    {
			// parse email body
			contactEmail.message = EmailUtil.parseEmailData(contactEmail.message);
	
			ObjectMapper mapper = new ObjectMapper();
			String emailString = mapper.writeValueAsString(contactEmail);
			agileEmails.put(new JSONObject(emailString));
		    }
	
		    emailsList = new ObjectMapper().readValue(agileEmails.toString(),
			    new TypeReference<List<ContactEmailWrapper>>()
			    {
			    });
        }
	    return emailsList;
	}
	catch (Exception e)
	{
	    System.out.println("Got an exception in EmailsAPI: " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
    }
    
    @Path("verify-from-email")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void sendVerificationEmail(@FormParam("email") String email)
    {
    	
    	VerifiedEmails verifiedEmails = VerifiedEmailsUtil.getVerifiedEmailsByEmail(email);
    	
    	// Email verified already
    	if(verifiedEmails != null && verifiedEmails.verified.equals(Verified.YES))
    		throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
    			    .entity("Email verified already.").build());
    	
    	boolean exists = false;
    	
    	if(verifiedEmails != null && verifiedEmails.verified.equals(Verified.NO))
    		exists = true;
    	
    	// If null, create new object
    	if(verifiedEmails == null)
    		verifiedEmails = new VerifiedEmails(email, String.valueOf(System.currentTimeMillis()));
    	
    	verifiedEmails.save();
    	
    	// Send Verification email
    	verifiedEmails.sendEmail();
    	
    	// If email exists already and not verified yet, send email again and throw exception
    	if(exists)
        		throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
        			    .entity("Email not verified yet.").build());
    	
    }


    /**
     * Check Spam Score and show the output.
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
    @Path("check-spam-score")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public String checkSpamScore(@FormParam("from_name") String fromName, @FormParam("from_email") String fromEmail,
	    @FormParam("to_email") String toEmail, @FormParam("subject") String subject,
	    @FormParam("text_email") String textEmail, @FormParam("html_email") String htmlEmail,
	    @FormParam("replyto_email") String replyToEmail)
    {
    	//Getting  Domain name and user name for unique file name
    	 String domainName=NamespaceManager.get()+ "_"+SessionManager.get().getName();
    	 
    	 String scoreJson=null;
		 String date=DateUtil.getCalendarString(System.currentTimeMillis(), "E, dd MMM yyyy HH:mm:ss Z", "");
    	
		 EmailSender emailSender = EmailSender.getEmailSender();

		    // Appends Agile label
		    textEmail = StringUtils.replace(textEmail, EmailUtil.getPoweredByAgileLink("campaign", "Powered by"),
			    "Sent using Agile");
		    textEmail = EmailUtil.appendAgileToText(textEmail, "Sent using", emailSender.isEmailWhiteLabelEnabled());

		    // If no powered by merge field, append Agile label to html
		    if (!StringUtils.contains(htmlEmail, EmailUtil.getPoweredByAgileLink("campaign", "Powered by")))
		    		htmlEmail = EmailUtil.appendAgileToHTML(htmlEmail, "campaign", "Powered by",
				emailSender.isEmailWhiteLabelEnabled());
		 
    	String  data =domainName;												data +="\n";
    			data +="Mime-Version: 1.0";										data +="\n";
		    	data +="Content-Type: multipart/alternative; boundary=\"_av-0sAAoRRXZN7YLBFWvl0DvA\"";		data +="\n";
    		    data +="Message-Id: <v0421010eb70653b14e06@[208.192.102.193]>";	data +="\n";
    		    data +="Date: "+date;											data +="\n";
		    	data +="To: " + toEmail;										data +="\n";
		    	data +="From: " + fromEmail;									data +="\n";
		    	data +="Subject: " + subject;									data +="\n";
		    	data +="Sender: " + "contact@agilecrm.com";						data +="\n";
		    	data +="Reply-To: " + replyToEmail;								data +="\n";
		    	data +="--_av-0sAAoRRXZN7YLBFWvl0DvA\nContent-Type: text/plain; charset=utf-8 \n Content-Transfer-Encoding: 7bit\n";
		    	data +=textEmail;												data +="\n";
		    	data +="--_av-0sAAoRRXZN7YLBFWvl0DvA";							data +="\n";
		    	data +="--_av-0sAAoRRXZN7YLBFWvl0DvA\nContent-Type: text/html; charset=utf-8 \n Content-Transfer-Encoding: 7bit\n";
		    	data +=htmlEmail;												data +="\n";
		    	data +="--_av-0sAAoRRXZN7YLBFWvl0DvA--";						data +="\n";
    	
	try
	{
		scoreJson=HTTPUtil.accessURLUsingPost("http://54.84.112.13/spamassassin/spam",data);
	  /* 

	   // emailSender.sendEmail(fromEmail, fromName, fromEmail, null, null, subject, replyToEmail, htmlEmail,
		//    textEmail, null, new ArrayList<Long>(),new ArrayList<BlobKey>());
*/
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while sending test email..." + e.getMessage());
	    e.printStackTrace();
	}
	
	return scoreJson;
    }
}