package com.agilecrm.social;

import java.net.URL;
import java.util.List;

import com.agilecrm.Globals;
import com.google.gdata.client.Query;
import com.google.gdata.client.authn.oauth.GoogleOAuthParameters;
import com.google.gdata.client.authn.oauth.OAuthHmacSha1Signer;
import com.google.gdata.client.authn.oauth.OAuthSigner;
import com.google.gdata.client.contacts.ContactsService;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.ContactFeed;

public class GoogleContactToAgileContactUtil
{

    public final static String GOOGLE_CONTACTS_BASE_URL = "https://www.google.com/m8/feeds/";

    /**
     * Bulids contact service object with required parametes for authentication
     * 
     * @param token
     * @return
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
     * @return {@link List} of {@link ContactEntry}
     * @throws Exception
     */
    public static List<ContactEntry> retrieveContacts(String accessToken)
	    throws Exception
    {
	ContactsService contactService = getService(accessToken);

	ContactFeed resultFeed = getGroups(contactService, accessToken);

	String temp = "";

	for (int i = 0; i < resultFeed.getEntries().size(); i++)
	    if (resultFeed.getEntries().get(i).getTitle().getPlainText()
		    .contains("System Group: My Contacts"))
		temp = resultFeed.getEntries().get(i).getId();

	URL feedUrl = new URL(GOOGLE_CONTACTS_BASE_URL
		+ "contacts/default/full?" + "access_token=" + accessToken);

	Query myQuery = new Query(feedUrl);
	myQuery.setStartIndex(1);
	// sets my contacts group id
	myQuery.setStringCustomParameter("group", temp);
	myQuery.setMaxResults(2000);

	resultFeed = contactService.query(myQuery, ContactFeed.class);

	System.out.println(resultFeed.getTotalResults());
	System.out.println(resultFeed.getItemsPerPage());

	return resultFeed.getEntries();
    }

    /**
     * Retrieves available groups in google contacts
     * 
     * @param contactService
     * @param accessToken
     * @return
     * @throws Exception
     */
    public static ContactFeed getGroups(ContactsService contactService,
	    String accessToken) throws Exception
    {
	URL feedUrl = new URL(GOOGLE_CONTACTS_BASE_URL + "groups/default/full?"
		+ "access_token=" + accessToken);

	Query myQuery = new Query(feedUrl);

	ContactFeed resultFeed = contactService.query(myQuery,
		ContactFeed.class);
	return resultFeed;
    }

}
