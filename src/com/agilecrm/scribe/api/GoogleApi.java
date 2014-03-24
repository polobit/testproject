package com.agilecrm.scribe.api;

import org.scribe.builder.api.DefaultApi20;
import org.scribe.model.OAuthConfig;
import org.scribe.utils.OAuthEncoder;

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
    private static final String AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/auth?client_id=%s&scope=%s&state=%s&redirect_uri=%s&access_type=online&response_type=code&approval_prompt=auto";

    /**
     * URL of Google to request for access token
     */
    private static final String ACCESS_TOKEN_URL = "https://accounts.google.com/o/oauth2/token";

    /**
     * Redirect URL to which the code the returned after OAuth 2.0
     */
    private static final String REDIRECT_URL = "https://null-dot-sandbox-dot-agile-crm-cloud.appspot.com/backend/googleservlet";

    /**
     * Returns access token URL of Google
     */
    @Override
    public String getAccessTokenEndpoint()
    {

	return ACCESS_TOKEN_URL;
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
	return String.format(AUTHORIZE_URL, config.getApiKey(), OAuthEncoder.encode(config.getScope()), OAuthEncoder.encode(config.getCallback()),
		OAuthEncoder.encode(REDIRECT_URL));
    }
}
