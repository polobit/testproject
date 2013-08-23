package com.thirdparty;

import java.net.URL;
import java.util.List;

import com.agilecrm.Globals;
import com.agilecrm.scribe.api.GoogleApi;
import com.agilecrm.util.HTTPUtil;
import com.google.gdata.client.Query;
import com.google.gdata.client.authn.oauth.GoogleOAuthParameters;
import com.google.gdata.client.authn.oauth.OAuthHmacSha1Signer;
import com.google.gdata.client.authn.oauth.OAuthSigner;
import com.google.gdata.client.contacts.ContactsService;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.ContactFeed;

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
	 * Bulids contact service object with required parametes for authentication
	 * 
	 * @param token
	 *            {@link String} access token retrieved from oauth
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
		contactService = new ContactsService("agile");
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
	public static List<ContactEntry> retrieveContacts(String accessToken) throws Exception
	{
		// build service with all the tokens
		ContactsService contactService = getService(accessToken);

		// Get all the avialable groups in gmail account
		ContactFeed resultFeed = getGroups(contactService, accessToken);

		String temp = "";

		for (int i = 0; i < resultFeed.getEntries().size(); i++)
			if (resultFeed.getEntries().get(i).getTitle().getPlainText().contains("System Group: My Contacts"))
				temp = resultFeed.getEntries().get(i).getId();

		URL feedUrl = new URL(GOOGLE_CONTACTS_BASE_URL + "contacts/default/full?" + "access_token=" + accessToken);

		// Build query with URL
		Query myQuery = new Query(feedUrl);
		myQuery.setStartIndex(1);
		// sets my contacts group id
		myQuery.setStringCustomParameter("group", temp);
		myQuery.setMaxResults(2000);

		// queries google for contacts
		resultFeed = contactService.query(myQuery, ContactFeed.class);

		System.out.println("total results from google " + resultFeed.getTotalResults());

		return resultFeed.getEntries();
	}

	/**
	 * Retrieves available groups in google contacts
	 * 
	 * @param contactService
	 *            {@link ContactsService}
	 * @param accessToken
	 *            {@link String} access token retrieved from oauth
	 * @return {@link ContactFeed}
	 * @throws Exception
	 */
	public static ContactFeed getGroups(ContactsService contactService, String accessToken) throws Exception
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
