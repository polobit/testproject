package com.agilecrm.scribe.api;

import org.scribe.builder.api.DefaultApi10a;
import org.scribe.model.Token;
import org.scribe.model.Verb;

/**
 * Xero API for scribe.
 * 
 * @author Ashley Schroder
 * 
 */
public class XeroApi extends DefaultApi10a
{

	/**
	 * Authorize URL of Stripe for OAuth 1.0
	 */
	private static final String AUTHORIZATION_URL = "https://api.xero.com/oauth/Authorize?oauth_token=%s";

	/**
	 * URL of Xero to request for access token
	 */
	private static final String ACCESSTOKEN_ENDPOINT_URL = "https://api.xero.com/oauth/AccessToken";

	/**
	 * URL of Xero to request for request token
	 */
	private static final String REQUESTTOKEN_ENDPOINT_URL = "https://api.xero.com/oauth/RequestToken";

	@Override
	public String getAccessTokenEndpoint()
	{
		return ACCESSTOKEN_ENDPOINT_URL;
	}

	@Override
	public String getRequestTokenEndpoint()
	{
		return REQUESTTOKEN_ENDPOINT_URL;
	}

	@Override
	public Verb getAccessTokenVerb()
	{
		return Verb.GET;
	}

	@Override
	public Verb getRequestTokenVerb()
	{
		return Verb.GET;
	}

	@Override
	public String getAuthorizationUrl(Token requestToken)
	{
		return String.format(AUTHORIZATION_URL, requestToken.getToken());
	}

}
