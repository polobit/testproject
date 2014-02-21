package com.thirdparty.google;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
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
import com.google.gdata.data.DateTime;
import com.google.gdata.data.batch.BatchOperationType;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.ContactFeed;
import com.google.gdata.data.contacts.ContactGroupFeed;
import com.google.gdata.data.extensions.Email;
import com.google.gdata.model.batch.BatchUtils;
import com.google.gdata.util.ServiceException;

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
		try
		{

			System.out.println(prefs.sync_from_group);
			feedUrl = new URL(prefs.sync_from_group + "?access_token=" + accessToken);
			// Build query with URL
			myQuery = new Query(feedUrl);

		}
		catch (MalformedURLException e)
		{
			// feedUrl = new
			// URL("https://www.google.com/m8/feeds/contacts/default/full" +
			// "?access_token=" + accessToken);
			feedUrl = new URL(GOOGLE_CONTACTS_BASE_URL + "groups/default/full/" + "?access_token=" + accessToken);
			// Build query with URL
			myQuery = new Query(feedUrl);
			myQuery.setStringCustomParameter("group", prefs.sync_from_group);
		}

		System.out.println(feedUrl);

		// myQuery.setStartIndex(1);
		// sets my contacts group id
		// myQuery.setMaxResults(30);
		DateTime dateTime = new DateTime(prefs.last_synched);
		myQuery.setUpdatedMin(dateTime);

		// Get all the available groups in gmail account

		// queries google for contacts
		ContactGroupFeed resultFeed = contactService.getFeed(myQuery, ContactGroupFeed.class);

		System.out.println("total results from google " + resultFeed.getTotalResults());
		return null;
	}

	public static void updateContacts(List<Contact> contacts, String token) throws Exception
	{
		// Feed that hold s all the batch request entries.
		ContactFeed requestFeed = new ContactFeed();

		ContactsService contactService = getService(token);

		for (Contact contact : contacts)
		{
			// Create a ContactGroupEntry for the create request.
			ContactEntry createContact = new ContactEntry();

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

			System.out.println(contact.id + ", " + contact.getContactFieldValue(Contact.EMAIL));
			BatchUtils.setBatchId(createContact, contact.id.toString());
			BatchUtils.setBatchOperationType(createContact, BatchOperationType.INSERT);
			requestFeed.getEntries().add(createContact);

		}

		// Submit the batch request to the server.
		ContactFeed responseFeed = contactService.batch(new URL(
				"https://www.google.com/m8/feeds/contacts/default/full/batch?" + "access_token=" + token), requestFeed);
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
	public static String refreshTokenInGoogle(String refreshToken) throws Exception
	{
		// Build data to post with all tokens
		String data = "client_id=" + Globals.GOOGLE_CLIENT_ID + "&client_secret=" + Globals.GOOGLE_SECRET_KEY
				+ "&grant_type=refresh_token&refresh_token=" + refreshToken;

		// send request and return response
		return HTTPUtil.accessURLUsingAuthentication(new GoogleApi().getAccessTokenEndpoint(), "", "", "POST", data,
				true, "", "");

	}
}
