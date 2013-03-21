package com.agilecrm;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.twilio.sdk.verbs.Dial;
import com.twilio.sdk.verbs.Number;
import com.twilio.sdk.verbs.TwiMLException;
import com.twilio.sdk.verbs.TwiMLResponse;

public class TwilioVoiceServlet extends HttpServlet
{
    public void service(HttpServletRequest request, HttpServletResponse response)
	    throws IOException
    {

	String phoneNumber = request.getParameter("PhoneNumber");

	System.out.println("phone number : " + phoneNumber);

	/* Use this as the caller ID when making calls from a browser. */
	String callerId = "+14105551234";

	TwiMLResponse twiml = new TwiMLResponse();
	Dial dial = new Dial();
	try
	{
	    dial.setCallerid(callerId);
	    dial.append(new Number(phoneNumber));

	    twiml.append(dial);
	}
	catch (TwiMLException e)
	{
	    e.printStackTrace();
	}

	System.out.println(twiml.toXML());

	response.setContentType("application/xml");
	response.getWriter().print(twiml.toXML());
    }
}