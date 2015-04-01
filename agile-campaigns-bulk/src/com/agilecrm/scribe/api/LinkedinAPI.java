package com.agilecrm.scribe.api;

import org.scribe.builder.api.DefaultApi20;
import org.scribe.model.OAuthConfig;
import org.scribe.utils.OAuthEncoder;

public class LinkedinAPI extends DefaultApi20
{

    private static final String AUTHORIZE_URL = "https://www.linkedin.com/uas/oauth2/authorization?client_id=%s&scope=%s&state=%s&redirect_uri=%s&access_type=offline&response_type=code&approval_prompt=auto";

    private static final String ACCESS_TOKEN_URL = "https://www.linkedin.com/uas/oauth2/accessToken";

    private static final String REDIRECT_URL = "https://my.agilecrm.com/backend/googleservlet";

    @Override
    public String getAccessTokenEndpoint()
    {
	// TODO Auto-generated method stub
	return ACCESS_TOKEN_URL;
    }

    public static String getRedirectURL()
    {
	return REDIRECT_URL;
    }

    @Override
    public String getAuthorizationUrl(OAuthConfig config)
    {
	// TODO Auto-generated method stub
	return String.format(AUTHORIZE_URL, config.getApiKey(), OAuthEncoder.encode(config.getScope()),
		OAuthEncoder.encode(config.getCallback()), OAuthEncoder.encode(REDIRECT_URL));
    }

}
