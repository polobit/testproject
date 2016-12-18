package com.agilecrm.imap;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

import net.oauth.OAuth;
import net.oauth.OAuthAccessor;
import net.oauth.OAuthConsumer;
import net.oauth.OAuthMessage;

import com.google.appengine.tools.admin.OAuth2ServerConnection.OAuthException;

public class XoauthSaslResponseBuilder
{
    public byte[] buildResponse(String userEmail, XoauthProtocol protocol, String oauthToken, String oauthTokenSecret, OAuthConsumer consumer)
	    throws IOException, OAuthException, URISyntaxException, Exception
    {
	OAuthAccessor accessor = new OAuthAccessor(consumer);
	accessor.tokenSecret = oauthTokenSecret;

	Map parameters = new HashMap();
	parameters.put("oauth_signature_method", "HMAC-SHA1");
	parameters.put("oauth_token", oauthToken);

	String url = String.format("https://mail.google.com/mail/b/%s/%s/", new Object[] { userEmail, protocol.getName() });

	OAuthMessage message = new OAuthMessage("GET", url, parameters.entrySet());
	message.addRequiredParameters(accessor);

	StringBuilder authString = new StringBuilder();
	authString.append("GET ");
	authString.append(url);
	authString.append(" ");
	int i = 0;
	for (Map.Entry entry : message.getParameters())
	{
	    if (i++ > 0)
	    {
		authString.append(",");
	    }
	    authString.append(OAuth.percentEncode((String) entry.getKey()));
	    authString.append("=\"");
	    authString.append(OAuth.percentEncode((String) entry.getValue()));
	    authString.append("\"");
	}
	return authString.toString().getBytes();
    }
}