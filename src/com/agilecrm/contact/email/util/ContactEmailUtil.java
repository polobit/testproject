package com.agilecrm.contact.email.util;

import java.net.URLEncoder;
import java.util.Calendar;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.ContactEmail;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.IMAPEmailPrefs;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.user.SocialPrefs.Type;
import com.agilecrm.user.util.IMAPEmailPrefsUtil;
import com.agilecrm.user.util.SocialPrefsUtil;
import com.agilecrm.util.EmailUtil;

/**
 * <code>ConactEmailUtil</code> is the utility class for {@link ContactEmail}.
 * It retrieves the {@link ContactEmail} based on contactId.
 * 
 * @author mantra
 * 
 */
public class ContactEmailUtil
{
    private static ObjectifyGenericDao<ContactEmail> dao = new ObjectifyGenericDao<ContactEmail>(ContactEmail.class);

    /**
     * Retrieves the ContactEmails based on contactId.
     * 
     * @param contactId
     *            - Contact Id.
     * @return List
     */
    public static List<ContactEmail> getContactEmails(Long contactId)
    {
	return dao.listByProperty("contact_id", contactId);
    }

    /**
     * Returns list of contact emails based on tracker id.
     * 
     * @param trackerId
     *            - Tracker Id for email open
     * @return List<ContactEmail>
     */
    public static List<ContactEmail> getContactEmailsBasedOnTrackerId(Long trackerId)
    {
	return dao.listByProperty("trackerId", trackerId);
    }

    /**
     * Saves email in datastore. It iterates over the given to emails and gets
     * the contact-id if exists for that email.
     * 
     * @param from
     *            - from email
     * @param to
     *            - to email
     * @param subject
     *            - subject
     * @param body
     *            - body
     */
    public static void saveContactEmailAndSend(String from, String to, String cc, String bcc, String subject, String body)
    {
	try
	{
	    // Appends common tracking id
	    long trackerId = Calendar.getInstance().getTimeInMillis();

	    // Gets emails Set Collection
	    Set<String> toEmailSet = EmailUtil.getStringTokenSet(to, ",");

	    // Iterate over to email inorder to fetch contact.
	    for (String toEmail : toEmailSet)
	    {
		if (StringUtils.isEmpty(toEmail))
		    continue;

		// Get contact based on email.
		Contact contact = ContactUtil.searchContactByEmail(toEmail);

		// Saves email with contact-id
		if (contact != null)
		{
		    // Remove trailing commas for to emails
		    ContactEmail contactEmail = new ContactEmail(contact.id, from, to.replaceAll(",$", ""), subject, body);

		    contactEmail.cc = cc;
		    contactEmail.bcc = bcc;

		    // Save email-open tracker-id
		    if (toEmailSet.size() == 1)
			contactEmail.trackerId = trackerId;

		    contactEmail.save();
		}

	    }

	    // Appends tracking image to body if only one email. It is not
	    // possible to append image at the same time to show all given
	    // emails to the recipient.
	    if (toEmailSet.size() == 1)
		body = EmailUtil.appendTrackingImage(body, null, null, trackerId);

	    // Sends email
	    EmailUtil.sendMail(from, from, to, cc, bcc, subject, from, body, null);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Got Exception while sending email " + e.getMessage());
	}

    }

    /**
     * Merges contact-emails with imap emails if exists, otherwise returns
     * contact-emails. Fetches contact emails of the contact with search email
     * and merge them with imap emails.
     * 
     * @param searchEmail
     *            - Contact EmailId.
     * @param imapEmails
     *            - array of imap emails obtained.
     * @return JSONArray
     */
    public static JSONArray mergeContactEmails(String searchEmail, JSONArray imapEmails)
    {
	// if email preferences are not set.
	if (imapEmails == null)
	    imapEmails = new JSONArray();

	try
	{
	    // Fetches contact emails
	    List<ContactEmail> contactEmails = getContactEmails(ContactUtil.searchContactByEmail(searchEmail).id);

	    // Merge Contact Emails with obtained imap emails
	    for (ContactEmail contactEmail : contactEmails)
	    {
		ObjectMapper mapper = new ObjectMapper();
		String emailString = mapper.writeValueAsString(contactEmail);
		imapEmails.put(new JSONObject(emailString));
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception while merging emails " + e.getMessage());
	}

	return imapEmails;
    }

    /**
     * Returns url to fetch emails from given imap account.
     * 
     * @param searchEmail
     *            - search email-id.
     * @param offset
     *            - offset.
     * @param count
     *            - count or limit to number of emails.
     * @return String
     */
    @SuppressWarnings("deprecation")
    public static String getIMAPURL(String searchEmail, String offset, String count)
    {
	// Get Imap Prefs
	IMAPEmailPrefs imapPrefs = IMAPEmailPrefsUtil.getIMAPPrefs(AgileUser.getCurrentAgileUser());

	if (imapPrefs == null)
	    return null;

	String userName = imapPrefs.user_name;
	String host = imapPrefs.server_name;
	String password = imapPrefs.password;
	String port = "993";

	String url = "http://stats.agilecrm.com:8080/AgileCRMEmail/imap?user_name=" + URLEncoder.encode(userName) + "&search_email=" + searchEmail + "&host="
		+ URLEncoder.encode(host) + "&port=" + URLEncoder.encode(port) + "&offset=" + offset + "&count=" + count + "&command=imap_email&password="
		+ URLEncoder.encode(password);

	return url;
    }

    /**
     * Returns GmailURL to fetch emails from given gmail user-account.
     * 
     * @param searchEmail
     *            - search email-id.
     * @param offset
     *            - offset.
     * @param count
     *            - count or limit to number of emails.
     * @return String
     */
    @SuppressWarnings("deprecation")
    public static String getGmailURL(String searchEmail, String offset, String count)
    {
	// Get Gmail Social Prefs
	Type socialPrefsTypeEnum = SocialPrefs.Type.GMAIL;
	SocialPrefs gmailPrefs = SocialPrefsUtil.getPrefs(AgileUser.getCurrentAgileUser(), socialPrefsTypeEnum);

	if (gmailPrefs == null)
	    return null;

	String userName = gmailPrefs.email;
	String host = "imap.gmail.com";
	String port = "993";
	String consumerKey = "anonymous";
	String consumerSecret = "anonymous";

	String oauth_key = gmailPrefs.token;
	String oauth_secret = gmailPrefs.secret;

	String url = "http://stats.agilecrm.com:8080/AgileCRMEmail/imap?command=oauth_email&user_name=" + URLEncoder.encode(userName) + "&search_email="
		+ searchEmail + "&host=" + URLEncoder.encode(host) + "&port=" + URLEncoder.encode(port) + "&offset=" + offset + "&count=" + count
		+ "&consumer_key=" + URLEncoder.encode(consumerKey) + "&consumer_secret=" + URLEncoder.encode(consumerSecret) + "&oauth_key="
		+ URLEncoder.encode(oauth_key) + "&oauth_secret=" + URLEncoder.encode(oauth_secret);

	return url;
    }

    /**
     * Converts obtained emails string to json.
     * 
     * @param jsonResult
     *            - obtained emails.
     * @return JSONObject
     */
    public static JSONObject convertEmailsToJSON(String jsonResult)
    {
	JSONObject emails = null;

	try
	{
	    emails = new JSONObject(jsonResult);

	    // If result is {}, convert it to {emails:[]}
	    if (emails.length() == 0)
		return emails.put("emails", new JSONArray());

	    // if obtained result has no emails key like {[]}, convert it to
	    // {emails:[]}
	    if (!emails.has("emails"))
	    {
		emails = new JSONObject().put("emails", new JSONArray());

		if (new JSONObject(jsonResult).length() > 0)
		    emails.getJSONArray("emails").put(new JSONObject(jsonResult));
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception while converting emails to JSON " + e.getMessage());
	}

	return emails;
    }

    /**
     * Returns gmails preferences url if it is not null, otherwise imap url.
     * First verifies the gmail preferences, if not set then verifies imap
     * preferences.
     * 
     * @param searchEmail
     *            - search email-id.
     * @param offset
     *            - offset.
     * @param count
     *            - count or limit to number of emails.
     * @return String
     */
    public static String getEmailsFetchURL(String searchEmail, String offset, String count)
    {
	String gmailURL = getGmailURL(searchEmail, offset, count);

	// if not null return gmailURL
	if (gmailURL != null)
	    return gmailURL;

	// return imapURL.
	String imapURL = getIMAPURL(searchEmail, offset, count);
	return imapURL;
    }

    /**
     * Adds owner-email to each email and parse each email body.
     * 
     * @param emailsArray
     *            - Emails Array.
     * @return JSONArray
     */
    public static JSONArray addOwnerAndParseEmailBody(JSONArray emailsArray)
    {
	try
	{
	    // Gets Owner email.
	    String ownerEmail = getOwnerEmail();

	    // inserts owner email to each and parse each email body
	    for (int i = 0; i < emailsArray.length(); i++)
	    {
		emailsArray.getJSONObject(i).put("owner_email", ownerEmail);

		// parse email body.
		JSONObject email = emailsArray.getJSONObject(i);

		if (email.has("message"))
		{
		    String parsedHTML = EmailUtil.parseEmailData(emailsArray.getJSONObject(i).getString("message"));
		    email.put("message", parsedHTML);
		}
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occurred " + e.getMessage());
	}
	return emailsArray;
    }

    /**
     * Returns owner email which is nothing but username set in email
     * preferences.
     * 
     * @return String
     */
    public static String getOwnerEmail()
    {
	String userName = null;

	// Gmail Preferences.
	Type socialPrefsTypeEnum = SocialPrefs.Type.GMAIL;
	SocialPrefs gmailPrefs = SocialPrefsUtil.getPrefs(AgileUser.getCurrentAgileUser(), socialPrefsTypeEnum);

	// return gmail prefs email.
	if (gmailPrefs != null)
	    return gmailPrefs.email;

	// Imap Prefs
	IMAPEmailPrefs imapPrefs = IMAPEmailPrefsUtil.getIMAPPrefs(AgileUser.getCurrentAgileUser());

	if (imapPrefs != null)
	    return imapPrefs.user_name;

	return userName;

    }
}
