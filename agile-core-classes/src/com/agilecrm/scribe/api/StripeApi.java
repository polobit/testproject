package com.agilecrm.scribe.api;

import org.scribe.builder.api.DefaultApi20;
import org.scribe.model.OAuthConfig;
import org.scribe.utils.OAuthEncoder;

import com.google.appengine.api.NamespaceManager;

/**
 * <code>StripeApi</code> class contains fields and methods required for OAuth
 * 2.0 specific authentication
 * 
 * @author Tejaswi
 * @since Jan 2013
 */
public class StripeApi extends DefaultApi20
{

    /**
     * Authorize URL of Stripe for OAuth 2.0
     */
    private static final String AUTHORIZE_URL = "https://connect.stripe.com/oauth/authorize?client_id=%s&state=%s&response_type=code";

    /**
     * Authorize URL of Stripe with scope for OAuth 2.0
     */
    private static final String SCOPED_AUTHORIZE_URL = AUTHORIZE_URL
	    + "&scope=%s";

    /**
     * URL of Stripe to request for access token
     */
    private static final String ACCESS_TOKEN_URL = "https://connect.stripe.com/oauth/token";

    /**
     * Returns access token URL of Stripe
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
	if (config.hasScope())
	{
	    return String.format(SCOPED_AUTHORIZE_URL, config.getApiKey(),
		    OAuthEncoder.encode(config.getCallback()),
		    OAuthEncoder.encode(config.getScope()));
	}
	else
	{
	    return String.format(AUTHORIZE_URL, config.getApiKey(),
		    NamespaceManager.get());
	}
    }

}
