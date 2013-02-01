package com.agilecrm.social;

import com.twilio.sdk.client.TwilioCapability;
import com.twilio.sdk.client.TwilioCapability.DomainException;

public class TwilioUtil
{

    public static String generateTwilioToken(String accountSid)
    {
	// String authToken = "b6420aa8715bad58ad2cff61036b4640";
	String authToken = "5e7085bb019e378fb18822f319a3ec46";

	TwilioCapability capability = new TwilioCapability(accountSid,
		authToken);

	capability.allowClientOutgoing("CNf63bca035414be121d517a116066a5f8");

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
