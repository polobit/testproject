package com.agilecrm;

import org.scribe.builder.api.DefaultApi20;
import org.scribe.model.OAuthConfig;
import org.scribe.utils.OAuthEncoder;

public class GoogleApi extends DefaultApi20
{

    private static final String AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/auth?client_id=%s&scope=%s&state=%s&redirect_uri=%s&access_type=offline&response_type=code&approval_prompt=auto";

    private static final String ACCESS_TOKEN_URL = "https://accounts.google.com/o/oauth2/token";

    private static final String REDIRECT_URL = "http://localhost:8888/backend/googleservlet";

    @Override
    public String getAccessTokenEndpoint()
    {

	return ACCESS_TOKEN_URL;
    }

    @Override
    public String getAuthorizationUrl(OAuthConfig config)
    {

	if (config.getCallback() != null)
	    System.out.println("called api "
		    + OAuthEncoder.encode(config.getCallback()));
	return String.format(AUTHORIZE_URL, config.getApiKey(),
		OAuthEncoder.encode(config.getScope()),
		OAuthEncoder.encode(config.getCallback()),
		OAuthEncoder.encode(REDIRECT_URL));
    }
}
