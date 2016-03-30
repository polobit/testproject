package com.agilecrm.contact.email.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.ContactEmail;
import com.agilecrm.contact.email.util.ContactGmailUtil;
import com.agilecrm.contact.email.util.ContactImapUtil;
import com.agilecrm.contact.email.util.ContactOfficeUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.email.wrappers.ContactEmailWrapper;
import com.agilecrm.email.wrappers.ContactEmailWrapper.PushParams;
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
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
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
	 * Retrieves the ContactEmails based on contactId.
	 * 
	 * @param contactId
	 * @param count - the number of entries to retrieve
	 *  
	 * @return List
	 */
	public static List<ContactEmail> getContactEmails(Long contactId,int count)
	{
		Map<String, Object> conditionsMap = new HashMap<String, Object>();
		conditionsMap.put("contact_id", contactId);
		return dao.fetchAllByOrderWithoutCount(count,null,conditionsMap, false, false, "-date_secs");
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
	 * 
	 * @param contactEmailWrapper
	 * @param contact
	 * @throws Exception
	 */
	public static void saveContactEmailAndSend(ContactEmailWrapper contactEmailWrapper) throws Exception
	{
		String to = contactEmailWrapper.getTo(), cc = contactEmailWrapper.getCc(), bcc = contactEmailWrapper.getBcc();
		
		// Removes traling commas if any
	    to = AgileTaskletUtil.normalizeStringSeparatedByDelimiter(',', to);

	    if (!StringUtils.isBlank(cc))
	    	cc = AgileTaskletUtil.normalizeStringSeparatedByDelimiter(',', cc);

	    if (!StringUtils.isBlank(bcc))
	    	bcc = AgileTaskletUtil.normalizeStringSeparatedByDelimiter(',', bcc);

	    List<Long> documentIds = new ArrayList<Long>();
	    List<BlobKey> blobKeys = new ArrayList<BlobKey>();
	    
	    if (StringUtils.isNotBlank(contactEmailWrapper.getDocument_key()))
	    {
		Long documentId = Long.parseLong(contactEmailWrapper.getDocument_key());
		documentIds.add(documentId);
	    }
	    else if (StringUtils.isNotBlank(contactEmailWrapper.getBlob_key()))
	    {
		BlobKey blobKey = new BlobKey(contactEmailWrapper.getBlob_key());
		blobKeys.add(blobKey);
	    }

		String body = contactEmailWrapper.getMessage(), emailBody = body;
		
		// Get signature without body
		String signature = getParsedSignature(contactEmailWrapper.getSignature());
		
		Contact contact = null;
		
		// Returns set of To Emails
		Set<String> toEmailSet = getToEmailSet(to);

		// Personal Email open tracking id
		contactEmailWrapper.setTrackerId(String.valueOf(System.currentTimeMillis()));
		
		// Appends tracking image to body if only one email. It is not
		// possible to append image at the same time to show all given
		// emails to the recipient.
		if (toEmailSet.size() == 1  && contactEmailWrapper.isTrack_clicks())
		{
			body = EmailUtil.appendTrackingImage(body, null, contactEmailWrapper.getTrackerId());

			// Get contactId for link tracking
			for(String email: toEmailSet)
				contact = ContactUtil.searchContactByEmail(EmailUtil.getEmail(email));
			
			if (contact != null)
				body = EmailLinksConversion.convertLinksUsingJSOUP(body, contact.id.toString(), null, contactEmailWrapper.getTrackerId(), contactEmailWrapper.getPush_param().toString());

		}

		// combined body and signature. Inorder to avoid link tracking in
		// signature, it is appended after conversion.
		body = body.replace("</body>", "<div><br/>" + signature + "</div></body>");

		// Sends email
		EmailUtil.sendMail(contactEmailWrapper.getFrom(), contactEmailWrapper.getFrom_name(), to, cc, bcc, contactEmailWrapper.getSubject(), null, body, null, documentIds, blobKeys);

		// If contact is available, no need of fetching contact from
		// to-email again.
		if (contact != null)
		{
			saveContactEmail(contactEmailWrapper.getFrom(), contactEmailWrapper.getFrom_name(), to, cc, bcc, contactEmailWrapper.getSubject(), emailBody, signature, contact.id,
					Long.parseLong(contactEmailWrapper.getTrackerId()), documentIds, contactEmailWrapper.getAttachment_name(), contactEmailWrapper.getAttachment_url());
			
			contact.setLastEmailed(System.currentTimeMillis() / 1000);
			contact.update();
			
			for (String toEmail : toEmailSet)
			    ActivitySave.createEmailSentActivityToContact(EmailUtil.getEmail(toEmail), contactEmailWrapper.getSubject(), contactEmailWrapper.getMessage(), contact);
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
				contact = ContactUtil.searchCompanyByEmail(email);

				// Saves email with contact-id
				if (contact != null)
				{
					saveContactEmail(contactEmailWrapper.getFrom(), contactEmailWrapper.getFrom_name(), to, cc, bcc, contactEmailWrapper.getSubject(), emailBody, signature, contact.id,
							Long.parseLong(contactEmailWrapper.getTrackerId()), documentIds, contactEmailWrapper.getAttachment_name(), contactEmailWrapper.getAttachment_url());

					contact.setLastEmailed(System.currentTimeMillis() / 1000);
					contact.update();
					
					// Add activity
					ActivitySave.createEmailSentActivityToContact(email, contactEmailWrapper.getSubject(), contactEmailWrapper.getMessage(), contact);
				}
			}
		}
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

	public static void buildContactEmailAndSend(ContactEmailWrapper contactEmail) throws Exception
	{
		
	    saveContactEmailAndSend(contactEmail);
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
			String subject, String body, String signature, Long contactId, long trackerId, List<Long> documentIds, 
			String attachment_name, String attachment_url)
	{

		// combine body and signature.
		body = body + "<div><br/>" + signature + "</div>";
		
		// Adding attachment name to the content of email
		if (attachment_name !=null && !attachment_name.equals("") && attachment_url != null && !attachment_url.equals(""))
		{
			body = body + "<div><a href='"+attachment_url+"' style='color:#23b7e5;'><i class='fa fa-paperclip m-r-xs'></i>" + attachment_name + "</a></div>";
		}
		else if (attachment_name !=null && !attachment_name.equals(""))
		{
			body = body + "<div><i class='fa fa-paperclip m-r-xs'></i>" + attachment_name + "</div>";
		}

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
		Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, agileUser.id);
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
		    // Get Shared Gmail Prefs
		    List<SocialPrefs> sharedGmailPrefs = getSharedGmailPrefs(agileUserKey);
		    List<String> sharedGmailUsers = new ArrayList<String>();
		    for (SocialPrefs socialPrefs : sharedGmailPrefs)
			sharedGmailUsers.add(socialPrefs.email);
		    emailPrefs.setSharedGmailUserNames(sharedGmailUsers);
		    // Get Shared Imap Prefs
		    List<IMAPEmailPrefs> sharedImapPrefs = getSharedIMAPPrefs(agileUserKey);
		    List<String> sharedImapUsers = new ArrayList<String>();
		    for (IMAPEmailPrefs imapEmailPrefs : sharedImapPrefs)
			sharedImapUsers.add(imapEmailPrefs.user_name);
		    emailPrefs.setSharedImapUserNames(sharedImapUsers);
		    // Get Shared Office Prefs
		    List<OfficeEmailPrefs> sharedOfficePrefs = getSharedToOfficePrefs(agileUserKey);
		    List<String> sharedOfficeUsers = new ArrayList<String>();
		    for (OfficeEmailPrefs officeEmailPrefs : sharedOfficePrefs)
			sharedOfficeUsers.add(officeEmailPrefs.user_name);
		    emailPrefs.setSharedExchangeUserNames(sharedOfficeUsers);

		    if ((sharedGmailUsers != null && sharedGmailUsers.size() > 0)
			    || (sharedImapUsers != null && sharedImapUsers.size() > 0)
			    || (sharedOfficeUsers != null && sharedOfficeUsers.size() > 0))
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
		    emailPrefs.setFetchUrls(getAllEmailFetchUrls(null, "0", "20"));
		}
		catch(Exception e)
		{
		    System.out.println(e.getMessage());
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
	private static List<SocialPrefs> getSharedGmailPrefs(Key<AgileUser> agileUserKey)
	{
		Objectify ofy = ObjectifyService.begin();
		// Fetching sharedSocialPrefs
		SocialPrefs.Type type = SocialPrefs.Type.GMAIL;
		List<SocialPrefs> sharedSocialPrefs = ofy.query(SocialPrefs.class).filter("sharedWithUsers", agileUserKey)
				.filter("type", type).list();
		return sharedSocialPrefs;
	}

	/**
	 * Gets list of Shared IMAP prefs with this current user
	 * 
	 * @param agileUserKey
	 * @return
	 */
	private static List<IMAPEmailPrefs> getSharedIMAPPrefs(Key<AgileUser> agileUserKey)
	{
		// Fetching sharedImapPrefs
		Objectify ofy = ObjectifyService.begin();
		List<IMAPEmailPrefs> sharedImapPrefs = ofy.query(IMAPEmailPrefs.class).filter("sharedWithUsers", agileUserKey)
				.list();
		return sharedImapPrefs;
	}

	/**
	 * Gets list of Shared Office prefs with this current user
	 * 
	 * @param agileUserKey
	 * @return
	 */
	private static List<OfficeEmailPrefs> getSharedToOfficePrefs(Key<AgileUser> agileUserKey)
	{
		Objectify ofy = ObjectifyService.begin();
		List<OfficeEmailPrefs> sharedOfficePrefs = ofy.query(OfficeEmailPrefs.class)
				.filter("sharedWithUsers", agileUserKey).list();
		return sharedOfficePrefs;
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
	public static List<String> getAllEmailFetchUrls(String searchEmail, String offset, String pageSize)
	    {
		AgileUser agileUser = AgileUser.getCurrentAgileUser();
		Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, agileUser.id);

		// Getting Email Prefs
		Type socialPrefsTypeEnum = SocialPrefs.Type.GMAIL;
		List<SocialPrefs> socialPrefsList = SocialPrefsUtil.getPrefsList(agileUser, socialPrefsTypeEnum);
		List<IMAPEmailPrefs> imapPrefsList = IMAPEmailPrefsUtil.getIMAPPrefsList(agileUser);
		List<OfficeEmailPrefs> officePrefsList = OfficeEmailPrefsUtil.getOfficePrefsList(agileUser);

		// Getting Shared Email Prefs
		List<SocialPrefs> sharedSocialPrefsList = getSharedGmailPrefs(agileUserKey);
		List<IMAPEmailPrefs> sharedImapPrefsList = getSharedIMAPPrefs(agileUserKey);
		List<OfficeEmailPrefs> sharedOfficePrefsList = getSharedToOfficePrefs(agileUserKey);

		List<String> emailFetchUrls = new ArrayList<String>();
		//First Adding URL for fetching emails sent through agile.
		String agileEmailsUrl = "core/api/emails/agile-emails?count=20";
		if (socialPrefsList != null & socialPrefsList.size() > 0)
		{
		    for (SocialPrefs gmailPrefs : socialPrefsList)
		    {
			String gmailUrl = "core/api/social-prefs/google-emails?from_email=" + gmailPrefs.email + "&cursor="
				+ offset + "&page_size=" + pageSize;
			emailFetchUrls.add(gmailUrl);
		    }
		}
		if (imapPrefsList != null && imapPrefsList.size() > 0)
		{
		    for (IMAPEmailPrefs imapPrefs : imapPrefsList)
		    {
			String imapUrl = "core/api/imap/imap-emails?from_email=" + imapPrefs.user_name + "&cursor=" + offset
				+ "&page_size=" + pageSize;
			emailFetchUrls.add(imapUrl);
		    }
		}
		if (officePrefsList != null && officePrefsList.size() > 0)
		{
		    for (OfficeEmailPrefs officePrefs : officePrefsList)
		    {
			String officeUrl = "core/api/office/office365-emails?from_email=" + officePrefs.user_name + "&cursor="
				+ offset + "&page_size=" + pageSize;
			emailFetchUrls.add(officeUrl);
		    }
		}
		if (sharedSocialPrefsList != null & sharedSocialPrefsList.size() > 0)
		{
		    for (SocialPrefs gmailPrefs : sharedSocialPrefsList)
		    {
			String gmailUrl = "core/api/social-prefs/google-emails?from_email=" + gmailPrefs.email + "&cursor="
				+ offset + "&page_size=" + pageSize;
			emailFetchUrls.add(gmailUrl);
		    }
		}
		if (sharedImapPrefsList != null && sharedImapPrefsList.size() > 0)
		{
		    for (IMAPEmailPrefs imapPrefs : sharedImapPrefsList)
		    {
			String imapUrl = "core/api/imap/imap-emails?from_email=" + imapPrefs.user_name + "&cursor=" + offset
				+ "&page_size=" + pageSize;
			emailFetchUrls.add(imapUrl);
		    }
		}
		if (sharedOfficePrefsList != null && sharedOfficePrefsList.size() > 0)
		{
		    for (OfficeEmailPrefs officePrefs : sharedOfficePrefsList)
		    {
			String officeUrl = "core/api/office/office365-emails?from_email=" + officePrefs.user_name + "&cursor="
				+ offset + "&page_size=" + pageSize;
			emailFetchUrls.add(officeUrl);
		    }
		}
		emailFetchUrls.add(agileEmailsUrl);
		return emailFetchUrls;
	    }


}
