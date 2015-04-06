package com.agilecrm.scribe.api;

import org.scribe.builder.api.DefaultApi20;
import org.scribe.model.OAuthConfig;
import org.scribe.utils.OAuthEncoder;
import org.scribe.utils.Preconditions;

public class FacebookApi extends DefaultApi20
{
    private static final String AUTHORIZE_URL = "https://www.facebook.com/dialog/oauth?client_id=%s&redirect_uri=%s&state=%s";
    private static final String SCOPED_AUTHORIZE_URL = AUTHORIZE_URL + "&scope=%s";

    /**
     * Redirect URL to which the code the returned after OAuth 2.0
     */
    private static final String REDIRECT_URL = "https://my.agilecrm.com/backend/googleservlet";

    @Override
    public String getAccessTokenEndpoint()
    {
	return "https://graph.facebook.com/oauth/access_token";
    }

    public static String getRedirectURL()
    {
	return REDIRECT_URL;
    }

    @Override
    public String getAuthorizationUrl(OAuthConfig config)
    {
	Preconditions.checkValidUrl(config.getCallback(),
	        "Must provide a valid url as callback. Facebook does not support OOB");

	// Append scope if present
	if (config.hasScope())
	{
	    return String.format(AUTHORIZE_URL, config.getApiKey(), OAuthEncoder.encode(getRedirectURL()),
		    OAuthEncoder.encode(config.getScope()));
	}
	else
	{
	    return String.format(AUTHORIZE_URL, config.getApiKey(), OAuthEncoder.encode(getRedirectURL()),
		    OAuthEncoder.encode(config.getCallback()));

	}
    }
}