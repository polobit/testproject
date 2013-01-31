package com.agilecrm.social;

import com.twilio.sdk.client.TwilioCapability;
import com.twilio.sdk.client.TwilioCapability.DomainException;

public class TwilioUtil
{

    public static String generateTwilioToken(String accountSid)
    {
	String authToken = "b6420aa8715bad58ad2cff61036b4640";
	TwilioCapability capability = new TwilioCapability(accountSid,
		authToken);

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
