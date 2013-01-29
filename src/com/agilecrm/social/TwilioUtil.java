package com.agilecrm.social;

import com.twilio.sdk.client.TwilioCapability;
import com.twilio.sdk.client.TwilioCapability.DomainException;

public class TwilioUtil
{

    public static String generateTwilioToken(String accountSid, String authToken)
    {
	TwilioCapability capability = new TwilioCapability(accountSid,
		authToken);

	capability.allowClientOutgoing("APdda81c58897889bee9497fef24056bb8");
	capability.allowClientIncoming("APdda81c58897889bee9497fef24056bb8");

	String token = null;
	try
	{
	    token = capability.generateToken();
	    System.out.println(token);
	    return token;
	}
	catch (DomainException e)
	{
	    System.out.println(e.getMessage());
	    return "";
	}
    }

}
