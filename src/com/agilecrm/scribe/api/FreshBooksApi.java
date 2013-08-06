package com.agilecrm.scribe.api;

import org.scribe.builder.api.DefaultApi10a;
import org.scribe.model.Token;

public class FreshBooksApi extends DefaultApi10a
{
    public static final String AUTHORIZE_URL = "https://agilecrm.freshbooks.com/oauth/oauth_authorize.php";
    public static final String REQUEST_TOKEN_URL = "https://agilecrm.freshbooks.com/oauth/oauth_request.php";
    public static final String ACCESS_TOKEN_URL = "https://agilecrm.freshbooks.com/oauth/oauth_access.php";

    @Override
    public String getAccessTokenEndpoint()
    {
	return ACCESS_TOKEN_URL;
    }

    @Override
    public String getAuthorizationUrl(Token token)
    {
	return String.format(AUTHORIZE_URL);
    }

    @Override
    public String getRequestTokenEndpoint()
    {
	return REQUEST_TOKEN_URL;
    }

}
