package com.agilecrm.core.api;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.email.ContactEmail;
import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.IMAPEmailPrefs;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.user.SocialPrefs.Type;
import com.agilecrm.user.util.IMAPEmailPrefsUtil;
import com.agilecrm.user.util.SocialPrefsUtil;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.util.Util;

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
	    Util.sendMail(fromEmail, fromEmail, to, subject, fromEmail, body, null);
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
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void sendEmail(@QueryParam("from") String fromEmail, @QueryParam("to") String to, @QueryParam("subject") String subject,
	    @QueryParam("body") String body)
    {
	// Saves Contact Email.
	ContactEmailUtil.saveContactEmailBasedOnTo(fromEmail, to, subject, body);

	try
	{
	    Util.sendMail(fromEmail, fromEmail, to, subject, fromEmail, body, null);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Returns imap emails merging with contact emails, when imap preferences
     * are set. Otherwise simply returns contact emails.
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
    public String getEmails(@QueryParam("e") String searchEmail, @QueryParam("c") String count, @QueryParam("o") String offset)
    {
	String url = null;

	String userName = "";

	// Get Imap Prefs
	IMAPEmailPrefs imapPrefs = IMAPEmailPrefsUtil.getIMAPPrefs(AgileUser.getCurrentAgileUser());
	if (imapPrefs != null)
	{
	    userName = imapPrefs.user_name;
	    String host = imapPrefs.server_name;
	    String password = imapPrefs.password;
	    String port = "993";

	    // URL Encode Params
	    userName = URLEncoder.encode(userName);
	    host = URLEncoder.encode(host);
	    password = URLEncoder.encode(password);
	    port = URLEncoder.encode(port);

	    url = "http://stats.agilecrm.com:8080/AgileCRMEmail/imap?user_name=" + userName + "&search_email=" + searchEmail + "&host=" + host + "&port="
		    + port + "&offset=" + offset + "&count=" + count + "&command=imap_email&password=" + password;
	}
	else
	{
	    // Get Gmail Social Prefs
	    Type socialPrefsTypeEnum = SocialPrefs.Type.GMAIL;
	    SocialPrefs gmailPrefs = SocialPrefsUtil.getPrefs(AgileUser.getCurrentAgileUser(), socialPrefsTypeEnum);

	    if (gmailPrefs != null)
	    {

		userName = gmailPrefs.email;
		String host = "imap.gmail.com";
		String port = "993";
		String consumerKey = "anonymous";
		String consumerSecret = "anonymous";

		String oauth_key = gmailPrefs.token;
		String oauth_secret = gmailPrefs.secret;

		// URL Encode Params
		userName = URLEncoder.encode(userName);
		host = URLEncoder.encode(host);
		port = URLEncoder.encode(port);
		consumerKey = URLEncoder.encode(consumerKey);
		consumerSecret = URLEncoder.encode(consumerSecret);
		oauth_key = URLEncoder.encode(oauth_key);
		oauth_secret = URLEncoder.encode(oauth_secret);

		url = "http://stats.agilecrm.com:8080/AgileCRMEmail/imap?command=oauth_email&user_name=" + userName + "&search_email=" + searchEmail + "&host="
			+ host + "&port=" + port + "&offset=" + offset + "&count=" + count + "&consumer_key=" + consumerKey + "&consumer_secret="
			+ consumerSecret + "&oauth_key=" + oauth_key + "&oauth_secret=" + oauth_secret;
	    }
	}

	try
	{
	    String jsonResult = "";

	    // Returns imap emails, usually in form of {emails:[]}
	    if (url != null)
		jsonResult = HTTPUtil.accessURL(url);

	    System.out.println("Obtained imap emails: " + jsonResult);

	    JSONObject emails = new JSONObject(jsonResult);

	    // if obtained result has no emails key.
	    if (!emails.has("emails"))
	    {
		emails = new JSONObject().put("emails", new JSONArray());

		if (new JSONObject(jsonResult).length() > 0)
		    emails.getJSONArray("emails").put(new JSONObject(jsonResult));
	    }

	    // Fetch Emails Array
	    JSONArray emailsArray = emails.getJSONArray("emails");

	    for (int i = 0; i < emailsArray.length(); i++)
	    {
		emailsArray.getJSONObject(i).put("owner_email", URLDecoder.decode(userName));

		JSONObject email = emailsArray.getJSONObject(i);

		if (email.has("message"))
		{
		    String parsedHTML = Util.parseEmailData(emailsArray.getJSONObject(i).getString("message"));
		    email.put("message", parsedHTML);
		}
	    }

	    // Fetches contact emails
	    List<ContactEmail> contactEmails = ContactEmailUtil.getContactEmails(ContactUtil.searchContactByEmail(searchEmail).id);

	    // Merge Contact Emails with obtained imap emails
	    for (ContactEmail contactEmail : contactEmails)
	    {
		ObjectMapper mapper = new ObjectMapper();
		String emailString = mapper.writeValueAsString(contactEmail);
		emailsArray.put(new JSONObject(emailString));
	    }

	    System.out.println("Emails obtained after merging and parsing are " + emails);

	    return emails.toString();
	}
	catch (Exception e)
	{
	    System.out.println("Got an exception in EmailsAPI: " + e);
	    e.printStackTrace();
	    return null;
	}
    }
}
