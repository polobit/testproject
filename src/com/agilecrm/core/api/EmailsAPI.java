package com.agilecrm.core.api;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.HTTPUtil;

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
    public void createEmail(@QueryParam("from") String fromEmail, @QueryParam("to") String to, @QueryParam("subject") String subject,
	    @QueryParam("body") String body)
    {
	try
	{
	    EmailUtil.sendMail(fromEmail, fromEmail, to, subject, fromEmail, body, null);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
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
    public void sendEmail(@FormParam("from") String from, @FormParam("to") String to, @FormParam("email_cc") String cc, @FormParam("subject") String subject,
	    @FormParam("body") String body, @FormParam("signature") String signature)
    {
	// combine to and cc separated by commas
	to = to + "," + cc;

	// combine body and signature.
	body = body + "<br/><div><br/><br/>" + signature + "</div>";

	// Saves Contact Email.
	ContactEmailUtil.saveContactEmailAndSend(from, to, subject, body);

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
    @Produces({ MediaType.APPLICATION_JSON })
    public String getEmails(@QueryParam("e") String searchEmail, @QueryParam("o") String offset, @QueryParam("c") String count)
    {
	try
	{
	    // Gets gmailPrefs url if not null, otherwise imap url.
	    String url = ContactEmailUtil.getEmailsFetchURL(searchEmail, offset, count);

	    // If both are not set, return Contact emails.
	    if (url == null)
	    {
		JSONArray contactEmails = ContactEmailUtil.mergeContactEmails(searchEmail, null);

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
	    emailsArray = ContactEmailUtil.mergeContactEmails(searchEmail, emailsArray);

	    return emails.toString();
	}
	catch (Exception e)
	{
	    System.out.println("Got an exception in EmailsAPI: " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
    }

}
