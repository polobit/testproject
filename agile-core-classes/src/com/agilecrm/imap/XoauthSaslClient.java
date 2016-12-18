package com.agilecrm.imap;

import java.io.IOException;

import javax.security.auth.callback.Callback;
import javax.security.auth.callback.CallbackHandler;
import javax.security.auth.callback.NameCallback;
import javax.security.auth.callback.UnsupportedCallbackException;
import javax.security.sasl.SaslClient;
import javax.security.sasl.SaslException;

import net.oauth.OAuthConsumer;

class XoauthSaslClient implements SaslClient
{
    private boolean isComplete = false;
    private final XoauthProtocol protocol;
    private final String oauthToken;
    private final String oauthTokenSecret;
    private final OAuthConsumer consumer;
    private final CallbackHandler callbackHandler;

    public XoauthSaslClient(XoauthProtocol protocol, String oauthToken, String oauthTokenSecret, String consumerKey, String consumerSecret,
	    CallbackHandler callbackHandler)
    {
	this.protocol = protocol;
	this.oauthToken = oauthToken;
	this.oauthTokenSecret = oauthTokenSecret;
	this.consumer = new OAuthConsumer(null, consumerKey, consumerSecret, null);
	this.callbackHandler = callbackHandler;
    }

    public String getMechanismName()
    {
	return "XOAUTH";
    }

    public boolean hasInitialResponse()
    {
	return true;
    }

    public byte[] evaluateChallenge(byte[] challenge) throws SaslException
    {
	if (challenge.length > 0)
	{
	    throw new SaslException("Unexpected server challenge");
	}

	NameCallback nameCallback = new NameCallback("Enter name");
	Callback[] callbacks = { nameCallback };
	try
	{
	    this.callbackHandler.handle(callbacks);
	}
	catch (UnsupportedCallbackException e)
	{
	    throw new SaslException("Unsupported callback: " + e);
	}
	catch (IOException e)
	{
	    throw new SaslException("Failed to execute callback: " + e);
	}
	String email = nameCallback.getName();

	XoauthSaslResponseBuilder responseBuilder = new XoauthSaslResponseBuilder();
	Exception caughtException = null;
	try
	{
	    byte[] rv = responseBuilder.buildResponse(email, this.protocol, this.oauthToken, this.oauthTokenSecret, this.consumer);
	    this.isComplete = true;
	    return rv;
	}
	catch (IOException e)
	{
	    caughtException = e;
	}
	catch (Exception e)
	{
	    caughtException = e;
	}
	throw new SaslException("Threw an exception building XOAUTH string: " + caughtException);
    }

    public boolean isComplete()
    {
	return this.isComplete;
    }

    public byte[] unwrap(byte[] incoming, int offset, int len) throws SaslException
    {
	throw new IllegalStateException();
    }

    public byte[] wrap(byte[] outgoing, int offset, int len) throws SaslException
    {
	throw new IllegalStateException();
    }

    public Object getNegotiatedProperty(String propName)
    {
	if (!this.isComplete)
	{
	    throw new IllegalStateException();
	}
	return null;
    }

    public void dispose() throws SaslException
    {
    }
}