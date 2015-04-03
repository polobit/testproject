package com.agilecrm.scribe.api;

import org.scribe.builder.api.DefaultApi20;
import org.scribe.model.OAuthConfig;
import org.scribe.model.Verb;
import org.scribe.utils.OAuthEncoder;

import com.agilecrm.scribe.ScribeServlet;

/**
 * <code>GoogleApi</code> class contains fields and methods required for OAuth
 * 2.0 specific authentication
 * 
 * @author Tejaswi
 * @since July 2013
 */
public class GoogleApi extends DefaultApi20
{
	/**
	 * Scoped authorize URL of Google for OAuth 2.0
	 */
	private static final String AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/auth?client_id=%s&scope=%s&state=%s&redirect_uri=%s&access_type=offline&response_type=code&approval_prompt=auto";

	private static final String AUTHORIZE_URL_GOOGLE_APPS = "https://accounts.google.com/o/oauth2/auth?client_id=%s&scope=%s&state=%s&redirect_uri=%s&access_type=offline&response_type=code&approval_prompt=force";

	/**
	 * Scoped authorize URL of Google for OAuth 2.0 with prompt set to auto
	 */
	private static final String AUTHORIZE_URL_AUTO_PROMPT_TYPE = "https://accounts.google.com/o/oauth2/auth?client_id=%s&scope=%s&state=%s&redirect_uri=%s&response_type=code";

	/**
	 * URL of Google to request for access token
	 */
	private static final String ACCESS_TOKEN_URL = "https://accounts.google.com/o/oauth2/token";

	/**
	 * Redirect URL to which the code the returned after OAuth 2.0
	 */
	private static final String REDIRECT_URL = "https://my.agilecrm.com/backend/googleservlet";

	/**
	 * Returns access token URL of Google
	 */
	@Override
	public String getAccessTokenEndpoint()
	{

		return ACCESS_TOKEN_URL;
	}

	public static String getRedirectURL()
	{
		return REDIRECT_URL;
	}

	public Verb getAccessTokenVerb()
	{
		return Verb.POST;
	}

	/**
	 * Forms an authorize URL with the required parameters from
	 * {@link OAuthConfig} after building a service in scribe and returns the
	 * authorization URL
	 * 
	 * This is internally called from scribe
	 */
	@Override
	public String getAuthorizationUrl(OAuthConfig config)
	{

		if (config.getCallback() != null)
			System.out.println("called api " + OAuthEncoder.encode(config.getCallback()));

		// For OAuth2 Authorization for profile, we do not have offline every
		// time
		String url = AUTHORIZE_URL;
		if (config.getScope().equalsIgnoreCase(ScribeServlet.GOOGLE_OAUTH2_SCOPE)
				|| config.getScope().equalsIgnoreCase(ScribeServlet.GOOGLE_OAUTH2_SCOPE))
			url = AUTHORIZE_URL_AUTO_PROMPT_TYPE;

		else if (config.getScope().equalsIgnoreCase(ScribeServlet.GOOGLE_CONTACTS_SCOPE)
				|| config.getScope().equalsIgnoreCase(ScribeServlet.GOOGLE_CALENDAR_SCOPE)
				|| config.getScope().equalsIgnoreCase(ScribeServlet.GMAIL_SCOPE)
				|| config.getScope().equalsIgnoreCase(ScribeServlet.GOOGLE_PLUS_OAUTH2_SCOPE))
			url = AUTHORIZE_URL_GOOGLE_APPS;

		return String.format(url, config.getApiKey(), OAuthEncoder.encode(config.getScope()),
				OAuthEncoder.encode(config.getCallback()), OAuthEncoder.encode(REDIRECT_URL));
	}
}
