package com.agilecrm;

import org.scribe.builder.api.DefaultApi20;
import org.scribe.model.OAuthConfig;
import org.scribe.utils.OAuthEncoder;

public class StripeApi extends DefaultApi20
{
    // https://connect.stripe.com
    // /oauth/authorize
    // /oauth/token

    private static final String AUTHORIZE_URL = "https://connect.stripe.com/oauth/authorize?client_id=%s&redirect_uri=%s&response_type=code";

    @Override
    public String getAccessTokenEndpoint()
    {
	// TODO Auto-generated method stub
	return "https://connect.stripe.com/oauth/token";
    }

    public String getRequestToken()
    {
	// TODO Auto-generated method stub
	return "https://connect.stripe.com/oauth/token";
    }

    @Override
    public String getAuthorizationUrl(OAuthConfig config)
    {
	// TODO Auto-generated method stub
	return String.format(AUTHORIZE_URL, config.getApiKey(),
		OAuthEncoder.encode(config.getCallback()));
    }

}
