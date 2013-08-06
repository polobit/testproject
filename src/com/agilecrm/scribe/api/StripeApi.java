package com.agilecrm.scribe.api;

import org.scribe.builder.api.DefaultApi20;
import org.scribe.model.OAuthConfig;
import org.scribe.utils.OAuthEncoder;

import com.google.appengine.api.NamespaceManager;

public class StripeApi extends DefaultApi20
{

    private static final String AUTHORIZE_URL = "https://connect.stripe.com/oauth/authorize?client_id=%s&state=%s&response_type=code";;
    private static final String SCOPED_AUTHORIZE_URL = AUTHORIZE_URL
	    + "&scope=%s";
    private static final String ACCESS_TOKEN_URL = "https://connect.stripe.com/oauth/token";

    @Override
    public String getAccessTokenEndpoint()
    {

	return ACCESS_TOKEN_URL;
    }

    @Override
    public String getAuthorizationUrl(OAuthConfig config)
    {
	if (config.hasScope())
	{
	    return String.format(SCOPED_AUTHORIZE_URL, config.getApiKey(),
		    NamespaceManager.get(),
		    OAuthEncoder.encode(config.getScope()));
	}
	else
	{
	    return String.format(AUTHORIZE_URL, config.getApiKey(),
		    NamespaceManager.get());
	}
    }

}
