package com.agilecrm.contact.email.util;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.ContactEmail;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.email.wrappers.EmailWrapper;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.EmailPrefs;
import com.agilecrm.user.IMAPEmailPrefs;
import com.agilecrm.user.OfficeEmailPrefs;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.user.SocialPrefs.Type;
import com.agilecrm.user.util.IMAPEmailPrefsUtil;
import com.agilecrm.user.util.OfficeEmailPrefsUtil;
import com.agilecrm.user.util.SocialPrefsUtil;
import com.agilecrm.util.EmailLinksConversion;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.blobstore.BlobKey;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

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
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @param to
     *            - to email
     * @param subject
     *            - subject
     * @param body
     *            - body
     */
    public static void saveContactEmailAndSend(String fromEmail, String fromName, String to, String cc, String bcc,
	    String subject, String body, String signature, Contact contact, boolean trackClicks,
	    List<Long> documentIds, List<BlobKey> blobKeys) throws Exception
    {

	// Personal Email open tracking id
	long openTrackerId = System.currentTimeMillis();

	// ContactId
	String contactId = null;

	// Returns set of To Emails
	Set<String> toEmailSet = getToEmailSet(to);

	// Get signature without body
	signature = getParsedSignature(signature);

	try
	{
	    // If contact is available, no need of fetching contact from
	    // to-email again.
	    if (contact != null)
	    {
		contactId = contact.id.toString();
		saveContactEmail(fromEmail, fromName, to, cc, bcc, subject, body, signature, contact.id, openTrackerId,
		        documentIds);
	    }
	    else
	    {
		// When multiple emails separated by comma are given
		for (String toEmail : toEmailSet)
		{
		    // Returns email-id e.g., Naresh <naresh@agilecrm.com >
		    String email = EmailUtil.getEmail(toEmail);

		    // Get contact based on email.
		    contact = ContactUtil.searchContactByEmail(email);

		    // Saves email with contact-id
		    if (contact != null)
		    {
			contactId = contact.id.toString();
			saveContactEmail(fromEmail, fromName, to, cc, bcc, subject, body, signature, contact.id,
			        openTrackerId, documentIds);
		    }
		}
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Got Exception while sending email " + e.getMessage());
	}

	// combined body and signature. Inorder to avoid link tracking in
	// signature, it is appended after conversion.
	body = body.replace("</body>", "<div><br/>" + signature + "</div></body>");
	
	// Appends tracking image to body if only one email. It is not
	// possible to append image at the same time to show all given
	// emails to the recipient.
	if (toEmailSet.size() == 1)
	{
	    body = EmailUtil.appendTrackingImage(body, null, String.valueOf(openTrackerId));

	    if (trackClicks)
		body = EmailLinksConversion.convertLinksUsingJSOUP(body, contactId, null, false);
	}

	// Sends email
	EmailUtil.sendMail(fromEmail, fromName, to, cc, bcc, subject, null, body, null, documentIds, blobKeys);
    }

    /**
     * Returns set collection of To emails separated by commas
     * 
     * @param to
     *            - To email string which may consists emails separated by
     *            commas
     * @return Set
     */
    public static Set<String> getToEmailSet(String to)
    {
	// Set to avoid duplicate emails
	Set<String> toEmailSet = new HashSet<String>();

	// If only one email is given, add directly to set
	if (!to.contains(","))
	{
	    toEmailSet.add(StringUtils.trim(to));
	}
	else
	{
	    // Splits multiple emails and add each one to set
	    toEmailSet = EmailUtil.getStringTokenSet(to, ",");
	}

	return toEmailSet;
    }

    /**
     * Saves email sent through agilecrm.
     * 
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @param to
     *            - to email
     * @param cc
     *            - cc
     * @param bcc
     *            - bcc
     * @param subject
     *            - email subject
     * @param body
     *            - email body
     * @param contactId
     *            - contact id to save w.r.t contact
     * @param List
     *            <Long> documentIds - documentsIds as attachments to email
     */
    public static void saveContactEmail(String fromEmail, String fromName, String to, String cc, String bcc,
	    String subject, String body, String signature, Long contactId, long trackerId, List<Long> documentIds)
    {

	// combine body and signature.
	body = body + "<div><br/>" + signature + "</div>";

	// Remove trailing commas for to emails
	ContactEmail contactEmail = new ContactEmail(contactId, fromEmail, to, subject, body);

	contactEmail.from_name = fromName;

	contactEmail.cc = cc;
	contactEmail.bcc = bcc;

	contactEmail.trackerId = trackerId;

	contactEmail.attachment_ids = documentIds;

	contactEmail.save();
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
		// parse email body
		contactEmail.message = EmailUtil.parseEmailData(contactEmail.message);

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
     * Converts obtained folders string to json
     * 
     * @param jsonResult
     *            obtained folders
     * @return JSONObject
     */
    public static JSONObject convertFoldersToJSON(String jsonResult)
    {
	JSONObject folders = null;
	try
	{
	    folders = new JSONObject(jsonResult);
	    // If result is {}, convert it to {folders:[]}
	    if (folders.length() == 0)
		return folders.put("folders", new JSONArray());

	    // if obtained result has no emails key like {[]}, convert it to
	    // {folders:[]}
	    if (!folders.has("folders"))
	    {
		folders = new JSONObject().put("folders", new JSONArray());

		if (new JSONObject(jsonResult).length() > 0)
		    folders.getJSONArray("folders").put(new JSONObject(jsonResult));
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception while converting emails to JSON " + e.getMessage());
	}
	return folders;
    }

    /**
     * Returns gmails preferences url if it is not null, otherwise
     * imap/officeExchange url. First verifies the gmail preferences, if not set
     * then verifies imap/officeExchange preferences.
     * 
     * @param searchEmail
     *            - search email-id.
     * @param offset
     *            - offset.
     * @param count
     *            - count or limit to number of emails.
     * @return String
     */
    public static String getEmailsFetchURL(AgileUser agileUser, String searchEmail, String offset, String count)
    {
	String gmailURL = ContactGmailUtil.getGmailURL(agileUser, searchEmail, offset, count);

	// if not null return gmailURL
	if (gmailURL != null)
	    return gmailURL;

	// return imapURL.
	String imapURL = ContactImapUtil.getIMAPURL(agileUser, searchEmail, offset, count);
	if (imapURL != null)
	    return imapURL;

	// return officeURL.
	String officeURL = ContactOfficeUtil.getOfficeURL(agileUser, searchEmail, offset, count);
	return officeURL;
    }

    /**
     * Adds owner-email to each email and parse each email body.
     * 
     * @param emailsArray
     *            - Emails Array.
     * @return JSONArray
     */
    public static JSONArray addOwnerAndParseEmailBody(JSONArray emailsArray, String ownerEmail)
    {
	try
	{

	    // inserts owner email to each and parse each email body
	    for (int i = 0; i < emailsArray.length(); i++)
	    {
		if (StringUtils.isNotBlank(ownerEmail))
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
     * Returns parsed signature without body tags
     * 
     * @param signature
     *            - signature stored in user prefs
     * @return
     */
    public static String getParsedSignature(String signature)
    {
	if (StringUtils.isEmpty(signature))
	    return signature;

	if (signature.contains("<body>") && signature.contains("</body>"))
	{
	    Document doc = Jsoup.parse(signature);
	    signature = doc.select("body").toString();
	    signature = signature.replace("<body>", "").replace("</body>", "");
	    signature = StringUtils.trim(signature);
	}

	return signature;
    }

    /**
     * Fetches emails from server, server can be either IMAP,Microsoft Exchange
     * Fetches emails based on pageSize and cursor
     * 
     * @param url
     *            server url
     * @param pageSize
     *            number of items to fetch from server
     * @param cursor
     *            the offset
     * @return
     */
    public static List<EmailWrapper> getEmailsfromServer(String url, String pageSize, String cursor, String fromEmail)
    {
	List<EmailWrapper> emailsList = null;
	try
	{
	    // Returns imap emails, usually in form of {emails:[]}, if not build
	    // result like that.
	    String jsonResult = HTTPUtil.accessURL(url);

	    // Convert emails to json.
	    JSONObject emails = ContactEmailUtil.convertEmailsToJSON(jsonResult);

	    // Fetches JSONArray from {emails:[]}
	    JSONArray emailsArray = emails.getJSONArray("emails");

	    // Add owner email to each email and parse each email body.
	    emailsArray = ContactEmailUtil.addOwnerAndParseEmailBody(emailsArray, fromEmail);

	    if (emailsArray.length() < Integer.parseInt(pageSize))
		return new ObjectMapper().readValue(emailsArray.toString(), new TypeReference<List<EmailWrapper>>()
		{
		});

	    emailsList = new ObjectMapper().readValue(emailsArray.toString(), new TypeReference<List<EmailWrapper>>()
	    {
	    });

	    EmailWrapper lastEmail = emailsList.get(emailsList.size() - 1);
	    lastEmail.cursor = (Integer.parseInt(cursor) + Integer.parseInt(pageSize)) + "";
	}

	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    return null;
	}
	return emailsList;
    }

    /**
     * Gets the list of synced email account names of this Agile user
     * 
     * @return
     */
    public static EmailPrefs getEmailPrefs()
    {
	EmailPrefs emailPrefs = new EmailPrefs();
	AgileUser agileUser = AgileUser.getCurrentAgileUser();
	boolean hasEmailAccountsConfigured = false;
	boolean hasSharedEmailAccounts = false;
	int emailAccountsCount = 0;
	try
	{
	    DomainUser domainUser = agileUser.getDomainUser();
	    if (domainUser != null)
	    {
		if (StringUtils.isNotBlank(domainUser.email))
		    emailPrefs.setAgileUserName(domainUser.email);
	    }
	    // Get Gmail Social Prefs
	    Type socialPrefsTypeEnum = SocialPrefs.Type.GMAIL;
	    List<SocialPrefs> socialPrefsList = SocialPrefsUtil.getPrefsList(agileUser, socialPrefsTypeEnum);
	    if (socialPrefsList != null && socialPrefsList.size() > 0)
	    {
		emailAccountsCount = emailAccountsCount + socialPrefsList.size();
		List<String> socialUserNames = new ArrayList<String>();
		for (SocialPrefs socialPrefs : socialPrefsList)
		    socialUserNames.add(socialPrefs.email);
		emailPrefs.setGmailUserNames(socialUserNames);
		hasEmailAccountsConfigured = true;
	    }
	    // Get Imap prefs
	    List<IMAPEmailPrefs> imapPrefsList = IMAPEmailPrefsUtil.getIMAPPrefsList(agileUser);
	    if (imapPrefsList != null && imapPrefsList.size() > 0)
	    {
		emailAccountsCount = emailAccountsCount + imapPrefsList.size();
		List<String> imapUserNames = new ArrayList<String>();
		for (IMAPEmailPrefs imapPrefs : imapPrefsList)
		    imapUserNames.add(imapPrefs.user_name);
		emailPrefs.setImapUserNames(imapUserNames);
		hasEmailAccountsConfigured = true;
	    }
	    // Get Office365 prefs
	    List<OfficeEmailPrefs> officePrefsList = OfficeEmailPrefsUtil.getOfficePrefsList(agileUser);
	    if (officePrefsList != null && officePrefsList.size() > 0)
	    {
		emailAccountsCount = emailAccountsCount + officePrefsList.size();
		List<String> officeUserNames = new ArrayList<String>();
		for (OfficeEmailPrefs officePrefs : officePrefsList)
		    officeUserNames.add(officePrefs.user_name);
		emailPrefs.setExchangeUserNames(officeUserNames);
		hasEmailAccountsConfigured = true;
	    }
	    Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, agileUser.id);
	    List<String> sharedGmailPrefs = getSharedGmailPrefs(agileUserKey);
	    emailPrefs.setSharedGmailUserNames(sharedGmailPrefs);
	    List<String> sharedImapPrefs = getSharedIMAPPrefs(agileUserKey);
	    emailPrefs.setSharedImapUserNames(sharedImapPrefs);
	    List<String> sharedOfficePrefs = getSharedToOfficePrefs(agileUserKey);
	    emailPrefs.setSharedExchangeUserNames(sharedOfficePrefs);

	    if ((sharedGmailPrefs != null && sharedGmailPrefs.size() > 0)
		    || (sharedImapPrefs != null && sharedImapPrefs.size() > 0)
		    || (sharedOfficePrefs != null && sharedOfficePrefs.size() > 0))
		hasSharedEmailAccounts = true;
	    int emailAccountLimitCount = BillingRestrictionUtil.getBillingRestriction(null, null).getCurrentLimits()
		    .getEmailAccountLimit();
	    if (emailAccountsCount >= emailAccountLimitCount)
		emailPrefs.setEmailAccountsLimitReached(true);
	    else
		emailPrefs.setEmailAccountsLimitReached(false);
	    emailPrefs.setEmailAccountsLimit(emailAccountLimitCount);
	    emailPrefs.setHasEmailAccountsConfigured(hasEmailAccountsConfigured);
	    emailPrefs.setHasSharedEmailAccounts(hasSharedEmailAccounts);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return emailPrefs;
    }

    /**
     * Returns the total count of email prefs of the current user
     * 
     * @return
     */
    public static int getEmailPrefsCount()
    {
	int emailPrefsCount = 0;
	AgileUser agileUser = AgileUser.getCurrentAgileUser();
	// Get Gmail Social Prefs
	Type socialPrefsTypeEnum = SocialPrefs.Type.GMAIL;
	List<SocialPrefs> socialPrefsList = SocialPrefsUtil.getPrefsList(agileUser, socialPrefsTypeEnum);
	if (socialPrefsList != null)
	    emailPrefsCount = emailPrefsCount + socialPrefsList.size();
	// Get IMAP Pref
	List<IMAPEmailPrefs> imapPrefsList = IMAPEmailPrefsUtil.getIMAPPrefsList(agileUser);
	if (imapPrefsList != null)
	    emailPrefsCount = emailPrefsCount + imapPrefsList.size();
	// Get Office Prefs
	List<OfficeEmailPrefs> officePrefsList = OfficeEmailPrefsUtil.getOfficePrefsList(agileUser);
	if (officePrefsList != null)
	    emailPrefsCount = emailPrefsCount + officePrefsList.size();
	return emailPrefsCount;
    }

    /**
     * Returns emails opened in specific duration
     * 
     * @param {@Link Long} - minTime, {@Link Long} - maxTime
     * @return {@Link List<ContactEmail>}
     */
    public static List<ContactEmail> getEmailsOpened(Long minTime, Long maxTime, boolean opened)
    {
	List<ContactEmail> contactEmailsList = null;
	try
	{
	    if (opened)
		contactEmailsList = dao.ofy().query(ContactEmail.class).filter("email_opened_at >= ", minTime)
		        .filter("email_opened_at <= ", maxTime).filter("is_email_opened", true).list();
	    else
		contactEmailsList = dao.ofy().query(ContactEmail.class).filter("date_secs >= ", minTime * 1000)
		        .filter("date_secs <= ", maxTime * 1000).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return contactEmailsList;
    }

    /**
     * Gets emails list sent by each user in specific duration
     * 
     * @param {@Link String} - userEmail,{@Link Long} - minTime,
     *        {@Link Long} - maxTime
     * @return {@Link List<ContactEmail>}
     */
    public static List<ContactEmail> getEmailsSent(DomainUser domainUser, Long minTime, Long maxTime)
    {
	List<ContactEmail> contactEmailsList = null;
	try
	{
	    System.out.println("Start getEmailsSent(-,-,-)-------Name:---" + domainUser.name + "Email:----"
		    + domainUser.email);
	    System.out.println("Start try block");
	    contactEmailsList = dao.ofy().query(ContactEmail.class)
		    .filter("from", domainUser.name + " <" + domainUser.email + ">")
		    .filter("date_secs >= ", minTime * 1000).filter("date_secs <= ", maxTime * 1000).list();
	    if (contactEmailsList != null)
		System.out.println("contactEmailsList Size---" + contactEmailsList.size());
	    else
		System.out.println("contactEmailsList is null");
	    System.out.println("End try block----" + contactEmailsList);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	System.out.println("End getEmailsSent(-,-,-)");
	return contactEmailsList;
    }

    /**
     * Gets list of Shared Gmail prefs with this Current User
     * 
     * @return
     */
    private static List<String> getSharedGmailPrefs(Key<AgileUser> agileUserKey)
    {
	Objectify ofy = ObjectifyService.begin();
	// Fetching sharedSocialPrefs
	SocialPrefs.Type type = SocialPrefs.Type.GMAIL;
	List<SocialPrefs> sharedSocialPrefs = ofy.query(SocialPrefs.class).filter("sharedWithUsers", agileUserKey)
	        .filter("type", type).list();
	List<String> sharedSocialUsers = new ArrayList<String>();
	for (SocialPrefs socialPrefs : sharedSocialPrefs)
	{
	    sharedSocialUsers.add(socialPrefs.email);
	}
	return sharedSocialUsers;
    }

    /**
     * Gets list of Shared IMAP prefs with this current user
     * 
     * @param agileUserKey
     * @return
     */
    private static List<String> getSharedIMAPPrefs(Key<AgileUser> agileUserKey)
    {
	// Fetching sharedImapPrefs
	Objectify ofy = ObjectifyService.begin();
	List<IMAPEmailPrefs> sharedImapPrefs = ofy.query(IMAPEmailPrefs.class).filter("sharedWithUsers", agileUserKey)
	        .list();
	List<String> sharedImapUsers = new ArrayList<String>();
	for (IMAPEmailPrefs imapEmailPrefs : sharedImapPrefs)
	{
	    sharedImapUsers.add(imapEmailPrefs.user_name);
	}
	return sharedImapUsers;
    }

    /**
     * Gets list of Shared Office prefs with this current user
     * 
     * @param agileUserKey
     * @return
     */
    private static List<String> getSharedToOfficePrefs(Key<AgileUser> agileUserKey)
    {
	Objectify ofy = ObjectifyService.begin();
	List<OfficeEmailPrefs> sharedOfficePrefs = ofy.query(OfficeEmailPrefs.class)
	        .filter("sharedWithUsers", agileUserKey).list();
	List<String> sharedOfficeUsers = new ArrayList<String>();
	for (OfficeEmailPrefs officeEmailPrefs : sharedOfficePrefs)
	{
	    sharedOfficeUsers.add(officeEmailPrefs.user_name);
	}
	return sharedOfficeUsers;
    }

    /**
     * Returns emails opened by individual user in specific duration
     * 
     * @param {@Link Long} - minTime, {@Link Long} - maxTime
     * @return {@Link List<ContactEmail>}
     */
    public static List<ContactEmail> getEmailsOpenedByUser(DomainUser domainUser, Long minTime, Long maxTime)
    {
	List<ContactEmail> contactEmailsList = null;
	try
	{
	    contactEmailsList = dao.ofy().query(ContactEmail.class)
		    .filter("from", domainUser.name + " <" + domainUser.email + ">")
		    .filter("email_opened_at >= ", minTime).filter("email_opened_at <= ", maxTime)
		    .filter("is_email_opened", true).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return contactEmailsList;
    }

}
