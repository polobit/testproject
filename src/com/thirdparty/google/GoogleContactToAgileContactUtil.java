package com.thirdparty.google;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.scribe.api.GoogleApi;
import com.agilecrm.util.HTTPUtil;
import com.google.gdata.client.Query;
import com.google.gdata.client.authn.oauth.GoogleOAuthParameters;
import com.google.gdata.client.authn.oauth.OAuthHmacSha1Signer;
import com.google.gdata.client.authn.oauth.OAuthSigner;
import com.google.gdata.client.contacts.ContactsService;
import com.google.gdata.data.PlainTextConstruct;
import com.google.gdata.data.batch.BatchOperationType;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.ContactFeed;
import com.google.gdata.data.contacts.ContactGroupEntry;
import com.google.gdata.data.contacts.GroupMembershipInfo;
import com.google.gdata.data.extensions.Email;
import com.google.gdata.model.batch.BatchUtils;
import com.google.gdata.util.ServiceException;
import com.thirdparty.google.utl.ContactPrefsUtil;

/**
 * <code>GoogleContactToAgileContactUtil</code> class Contains methods to
 * retrieve contacts data from Google
 * 
 * @author Tejaswi
 * @since Aug 13
 */
public class GoogleContactToAgileContactUtil
{

	/**
	 * Base URL to retrieve Google contacts
	 */
	public final static String GOOGLE_CONTACTS_BASE_URL = "https://www.google.com/m8/feeds/";

	/**
	 * Builds contact service object with required parameters for authentication
	 * 
	 * @param token
	 *            {@link String} access token retrieved from OAuth
	 * @return {@link ContactsService}
	 * @throws Exception
	 */
	public static ContactsService getService(String token) throws Exception
	{
		GoogleOAuthParameters oauthParameters = new GoogleOAuthParameters();
		ContactsService contactService;
		OAuthSigner signer = new OAuthHmacSha1Signer();
		oauthParameters.setOAuthConsumerKey(Globals.GOOGLE_CLIENT_ID);
		oauthParameters.setOAuthConsumerSecret(Globals.GOOGLE_SECRET_KEY);
		oauthParameters.setScope(GOOGLE_CONTACTS_BASE_URL);
		oauthParameters.setOAuthToken(token);
		contactService = new ContactsService("Agile Contacts");
		contactService.setProtocolVersion(ContactsService.Versions.V3);
		contactService.setOAuthCredentials(oauthParameters, signer);
		return contactService;
	}

	/**
	 * Retrieves contacts from Google querying for my contacts
	 * 
	 * @param accessToken
	 *            {@link String} access token retrieved from oauth
	 * @return {@link List} of {@link ContactEntry}
	 * @throws Exception
	 */
	public static List<ContactEntry> retrieveContacts(ContactPrefs prefs) throws Exception
	{

		String accessToken = prefs.token;

		// build service with all the tokens
		ContactsService contactService = getService(accessToken);

		/*
		 * GoogleContactToAgileContact.printAllGroups(accessToken); int i1 = 1;
		 * if (1 + i1 == 2) return null;
		 */

		URL feedUrl = null;
		Query myQuery = null;

		System.out.println(prefs.sync_from_group);
		try
		{
			feedUrl = new URL("https://www.google.com/m8/feeds/contacts/default/full" + "?access_token=" + accessToken);
		}
		catch (MalformedURLException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// Build query with URL
		myQuery = new Query(feedUrl);

		System.out.println("******************************");

		prefs.sync_from_group = URLDecoder.decode(prefs.sync_from_group);
		System.out.println(prefs.sync_from_group);
		myQuery.setStringCustomParameter("group", prefs.sync_from_group);
		System.out.println("feed url" + myQuery.getFeedUrl());

		// myQuery.setStartIndex(1);
		// sets my contacts group id
		myQuery.setMaxResults(200);
		// DateTime dateTime = new DateTime(prefs.last_synched);
		// myQuery.setUpdatedMin(dateTime);

		// Get all the available groups in gmail account

		// ContactFeed feed = contactService.getFeed(myQuery,
		// ContactFeed.class);
		// System.out.println(feed.getEntries());
		// ContactGroupEntry entry = contactService.getEntry(feedUrl,
		// ContactGroupEntry.class);
		// System.out.println("________________________" + entry.getEdited() +
		// ", " + entry.getTitle().getPlainText());
		ContactFeed resultFeed = null;
		try
		{
			resultFeed = contactService.getFeed(myQuery, ContactFeed.class);
		}
		catch (IOException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		catch (ServiceException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		// Create a Group entry for the retrieve request.
		/*
		 * Group retrieveContactGroup = new Group(); retrieveContactGroup.Id =
		 * "https://www.google.com/m8/feeds/groups/default/private/full/retrieveContactGroupId"
		 * ; retrieveContactGroup.BatchData = new GDataBatchEntryDat("retrieve",
		 * GDataBatchOperationType.query);
		 */
		System.out.println(resultFeed.getEntries());

		System.out.println("total results from google " + resultFeed.getEntries().size());
		return resultFeed.getEntries();
	}

	public static List<ContactEntry> retrieveContactBasedOnQuery(Contact contact, ContactPrefs prefs)
	{
		List<ContactField> emails = contact.getContactPropertiesList(Contact.EMAIL);
		String query_text = "";
		for (ContactField email : emails)
		{
			query_text = " " + email.value;
		}

		query_text = query_text + " " + contact.getContactFieldValue(Contact.FIRST_NAME) + " "
				+ contact.getContactFieldValue(Contact.LAST_NAME);
		System.out.println("query " + query_text);
		try
		{

			System.out.println(contact.getContactFieldValue(Contact.EMAIL));
			return retrieveContactBasedOnQuery(query_text, prefs);
		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new ArrayList<ContactEntry>();
		}
	}

	public static List<ContactEntry> retrieveContactBasedOnQuery(String query_text, ContactPrefs prefs)
			throws Exception
	{
		ContactsService service = getService(prefs.token);
		URL feelURL = new URL(GOOGLE_CONTACTS_BASE_URL + "contacts/default/full?access_token=" + prefs.token);

		System.out.println(feelURL);
		Query query = new Query(feelURL);
		System.out.println(prefs.sync_to_group);
		query.setStringCustomParameter("group", prefs.sync_to_group);
		query.setStringCustomParameter("q", query_text);
		query.setMaxResults(1);

		ContactFeed feed = service.getFeed(query, ContactFeed.class);

		return feed.getEntries();

	}

	public static void updateContacts(List<Contact> contacts, ContactPrefs prefs) throws Exception
	{
		String token = prefs.token;

		// Feed that hold s all the batch request entries.
		ContactFeed requestFeed = new ContactFeed();

		// Feed that hold s all the batch request entries.
		ContactFeed updateFeed = new ContactFeed();

		ContactsService contactService = getService(token);

		GoogleGroupDetails group = createGroup(prefs, "Agile");
		// contacts = new ArrayList<Contact>();
		for (Contact contact : contacts)
		{
			List<ContactEntry> entries = retrieveContactBasedOnQuery(contact, prefs);

			ContactEntry createContact = null;
			if (entries.size() > 0)
			{
				// Create a ContactGroupEntry for the create request.
				createContact = entries.get(0);
			}
			else
				createContact = new ContactEntry();

			final String NO_YOMI = null;
			com.google.gdata.data.extensions.Name contactTwoName = new com.google.gdata.data.extensions.Name();

			String firstName = contact.getContactFieldValue(Contact.FIRST_NAME);
			String lastName = contact.getContactFieldValue(Contact.LAST_NAME);

			System.out.println(firstName + ", " + lastName);
			String fullName = "";
			if (!StringUtils.isEmpty(firstName))
			{
				fullName += firstName;
				contactTwoName.setGivenName(new com.google.gdata.data.extensions.GivenName(firstName, NO_YOMI));
			}

			if (!StringUtils.isEmpty(lastName))
			{
				fullName += " " + lastName;
				contactTwoName.setFamilyName(new com.google.gdata.data.extensions.FamilyName(lastName, NO_YOMI));
			}

			contactTwoName.setFullName(new com.google.gdata.data.extensions.FullName(fullName, NO_YOMI));

			System.out.println();
			if (contactTwoName.hasGivenName())
				createContact.setName(contactTwoName);

			List<ContactField> emailFields = contact.getContactPropertiesList(Contact.EMAIL);
			for (ContactField field : emailFields)
			{
				Email primaryMail = new Email();
				primaryMail.setAddress(field.value);
				if (!StringUtils.isEmpty(field.subtype))
					primaryMail.setRel("http://schemas.google.com/g/2005#"
							+ StringUtils.lowerCase(field.subtype.toLowerCase()));
				else
					primaryMail.setRel("http://schemas.google.com/g/2005#work");

				createContact.addEmailAddress(primaryMail);
			}

			if (group != null)
			{
				createContact.addGroupMembershipInfo(new GroupMembershipInfo(false, group.atomId));
			}

			System.out.println(contact.id + ", " + contact.getContactFieldValue(Contact.EMAIL));
			BatchUtils.setBatchId(createContact, contact.id.toString());
			if (createContact.getId() != null)
			{
				BatchUtils.setBatchOperationType(createContact, BatchOperationType.UPDATE);
				updateFeed.getEntries().add(createContact);
			}
			else
			{
				BatchUtils.setBatchOperationType(createContact, BatchOperationType.INSERT);
				requestFeed.getEntries().add(createContact);
			}

		}

		// Submit the batch request to the server.
		ContactFeed responseFeed = contactService.batch(new URL(
				"https://www.google.com/m8/feeds/contacts/default/full/batch?" + "access_token=" + token), requestFeed);

		ContactFeed responseFeed1 = contactService.batch(new URL(
				"https://www.google.com/m8/feeds/contacts/default/full/batch?" + "access_token=" + token), updateFeed);
		System.out.println(responseFeed.getEtag());
		System.out.println(responseFeed.getEntries());

		// Check the status of each operation.
		for (ContactEntry entry : responseFeed.getEntries())
		{
			String batchId = BatchUtils.getBatchId(entry);
			com.google.gdata.data.batch.BatchStatus status = com.google.gdata.data.batch.BatchUtils
					.getBatchStatus(entry);
			System.out.println(batchId + ": " + status.getCode() + " (" + status.getReason() + ")");
		}
	}

	public static GoogleGroupDetails createGroup(ContactPrefs prefs, String group) throws ServiceException, Exception
	{
		ContactsService service = getService(prefs.token);

		if (prefs.sync_to_group != null)
		{
			try
			{

				System.out.println("urllll" + prefs.sync_from_group);
				URL postUrl = new URL(prefs.sync_to_group + "?access_token=" + prefs.token);

				ContactGroupEntry entry = service.getEntry(postUrl, ContactGroupEntry.class);
				System.out.println("Group" + entry);
				if (entry != null)
					return new GoogleGroupDetails(entry);

			}
			catch (MalformedURLException e)
			{
				group = "Agile";
				GoogleGroupDetails googleGroup = ContactPrefsUtil.getGroup(group, prefs);
				if (googleGroup != null)
					return googleGroup;
			}
		}

		// Create the entry to insert
		ContactGroupEntry newGroup = new ContactGroupEntry();
		newGroup.setTitle(new PlainTextConstruct(group));

		/*
		 * ExtendedProperty additionalInfo = new ExtendedProperty();
		 * additionalInfo.setName("more info about the group");
		 * additionalInfo.setValue("Nice people.");
		 * newGroup.addExtendedProperty(additionalInfo);
		 */

		// Ask the service to insert the new entry
		URL postUrl = new URL("https://www.google.com/m8/feeds/groups/default/full?access_token=" + prefs.token);
		ContactGroupEntry createdGroup = service.insert(postUrl, newGroup);
		System.out.println(createdGroup.getId());

		System.out.println("Contact group's Atom Id: " + createdGroup.getId());
		prefs.sync_to_group = createdGroup.getId();
		prefs.save();
		return new GoogleGroupDetails(createdGroup);
	}

	/**
	 * Retrieves available groups in google contacts
	 * 
	 * @param contactService
	 *            {@link ContactsService}
	 * @param accessToken
	 *            {@link String} access token retrieved from OAuth
	 * @return {@link ContactFeed}
	 * @throws Exception
	 */
	public static ContactFeed getGroups(ContactsService contactService, String accessToken) throws Exception
	{
		return getGroups(contactService, GOOGLE_CONTACTS_BASE_URL + "groups/default/full", accessToken);
	}

	public static ContactFeed getGroups(ContactsService contactService, String url, String accessToken)
			throws IOException, ServiceException
	{

		URL feedUrl = new URL(GOOGLE_CONTACTS_BASE_URL + "groups/default/full?" + "access_token=" + accessToken);

		// Build query with URL
		Query myQuery = new Query(feedUrl);

		// queries google for groups
		return contactService.query(myQuery, ContactFeed.class);
	}

	/**
	 * Exchanges refresh token for an access token after the expire of access
	 * token
	 * 
	 * @param refreshToken
	 *            {@link String} refresh token retrieved from OAuth
	 * @return {@link String} JSON response
	 * @throws Exception
	 */
	public static String refreshTokenInGoogle(String refreshToken)
	{
		// Build data to post with all tokens
		String data = "client_id=" + Globals.GOOGLE_CLIENT_ID + "&client_secret=" + Globals.GOOGLE_SECRET_KEY
				+ "&grant_type=refresh_token&refresh_token=" + refreshToken;

		// send request and return response
		try
		{
			return HTTPUtil.accessURLUsingAuthentication(new GoogleApi().getAccessTokenEndpoint(), "", "", "POST",
					data, true, "", "");
		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;

	}
}
