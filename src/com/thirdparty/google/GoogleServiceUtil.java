package com.thirdparty.google;

import java.io.IOException;
import java.util.HashMap;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Verb;

import com.agilecrm.Globals;
import com.agilecrm.scribe.api.GoogleApi;
import com.agilecrm.util.HTTPUtil;
import com.google.gdata.client.authn.oauth.GoogleOAuthParameters;
import com.google.gdata.client.authn.oauth.OAuthHmacSha1Signer;
import com.google.gdata.client.authn.oauth.OAuthSigner;
import com.google.gdata.client.contacts.ContactsService;

public class GoogleServiceUtil
{

	/**
	 * If access token is expired, calls method in
	 * {@link GoogleContactToAgileContactUtil} to refresh access token and
	 * updates it in db
	 * 
	 * @param contactPrefs
	 *            {@link ContactPrefs}
	 * @throws Exception
	 */
	public static void refreshGoogleContactPrefsandSave(ContactPrefs contactPrefs) throws Exception
	{
		System.out.println("in refresh token of google contact prefs");
		String response = GoogleServiceUtil.refreshTokenInGoogle(contactPrefs.refreshToken);

		// Creates HashMap from response JSON string
		HashMap<String, Object> properties = new ObjectMapper().readValue(response,
				new TypeReference<HashMap<String, Object>>()
				{
				});
		System.out.println(properties.toString());

		if (properties.containsKey("error"))
			throw new Exception(String.valueOf(properties.get("error")));
		else if (properties.containsKey("access_token"))
		{
			contactPrefs.token = String.valueOf(properties.get("access_token"));
			contactPrefs.expires = Long.parseLong(String.valueOf(properties.get("expires_in")));
			System.out.println("domiain user key in refresh token method: " + contactPrefs.getDomainUser());
			contactPrefs.setExpiryTime(contactPrefs.expires);
			contactPrefs.save();
		}

	}

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

	public static String refreshGoogleCalenderToken(String code)
	{
		// Build data to post with all tokens
		String data = "client_id=396214664382-slcp1d7laq2u7hfv4n9e5g8hdgmar4nr.apps.googleusercontent.com&client_secret=25dYhC_QhDFgX-rNuL4aZHkV"
				+ "&grant_type=authorization_code&code=" + code + "&redirect_uri=http://localhost:8888";

		// send request and return response
		try
		{
			System.out.println("((((((((((())))))))))))))))))))))))))))");
			System.out.println(new GoogleApi().getAccessTokenEndpoint());
			System.out.println(data);
			return HTTPUtil.accessURLUsingAuthentication(new GoogleApi().getAccessTokenEndpoint(), "", "", "POST",
					data, true, "application/x-www-form-urlencoded", "");

		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;

	}

	public static String refreshGoogleCalenderToken1(String code) throws JsonParseException, JsonMappingException,
			IOException
	{
		/*
		 * Make a post request and retrieve tokens
		 */

		OAuthRequest oAuthRequest = new OAuthRequest(Verb.POST, "https://accounts.google.com/o/oauth2/token");
		oAuthRequest.addHeader("Content-Type", "application/x-www-form-urlencoded");
		oAuthRequest.addBodyParameter("client_id",
				"396214664382-slcp1d7laq2u7hfv4n9e5g8hdgmar4nr.apps.googleusercontent.com");
		oAuthRequest.addBodyParameter("client_secret", "25dYhC_QhDFgX-rNuL4aZHkV");

		oAuthRequest.addBodyParameter("scope", "https://www.googleapis.com/auth/calendar");
		// oAuthRequest.addBodyParameter(key, value)("redirect_uri", "");
		oAuthRequest.addBodyParameter("code", code);
		oAuthRequest.addBodyParameter("grant_type", "authorization_code");
		System.out.println(oAuthRequest.getCompleteUrl());

		Response response = oAuthRequest.send();

		// Creates HashMap from response JSON string
		HashMap<String, Object> properties = new ObjectMapper().readValue(response.getBody(),
				new TypeReference<HashMap<String, Object>>()
				{
				});

		System.out.println(properties.toString());
		return properties.toString();
	}

	public static void main(String[] args)
	{
		System.out.println(refreshTokenInGoogle("1/f9fNxhp7ucxYDS94dQQU2jI-lkEYQ3qDNaTdyEpROUw"));

		System.out
				.println(refreshGoogleCalenderToken("4/3cNL6WjLeuhybeDZF4LxShSm5TqC.MjJhLm7MtwAZXE-sT2ZLcbQHCtzoiAI"));
	}
}
