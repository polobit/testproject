package com.agilecrm.signpost;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import javax.servlet.http.HttpServletRequest;

import oauth.signpost.OAuthConsumer;
import oauth.signpost.basic.DefaultOAuthConsumer;
import oauth.signpost.exception.OAuthCommunicationException;
import oauth.signpost.exception.OAuthExpectationFailedException;
import oauth.signpost.exception.OAuthMessageSignerException;

import org.scribe.oauth.OAuthService;

import com.agilecrm.Globals;

public class SignPostService
{

	public static OAuthService getService(HttpServletRequest req)
	{
		
		// create a consumer object and configure it with the access
        // token and token secret obtained from the service provider
        OAuthConsumer consumer = new DefaultOAuthConsumer(Globals.QUICKBOOKS_CONSUMER_KEY,
                                             Globals.QUICKBOOKS_CONSUMER_SECRET);
        //consumer.setTokenWithSecret(ACCESS_TOKEN, TOKEN_SECRET);

        // create an HTTP request to a protected resource
        URL url=null;
		try
		{
			url = new URL("https://appcenter.intuit.com/Connect/Begin");
		}
		catch (MalformedURLException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        HttpURLConnection request = null;
		try
		{
			request = (HttpURLConnection) url.openConnection();
		}
		catch (IOException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

        // sign the request
        try
		{
			consumer.sign(request);
		}
		catch (OAuthMessageSignerException | OAuthExpectationFailedException | OAuthCommunicationException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

        // send the request
        try
		{
			request.connect();
		}
		catch (IOException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        
		return null;
	}
}
