package com.thirdparty.twilio;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.user.AgileUser;
import com.twilio.sdk.verbs.Client;
import com.twilio.sdk.verbs.Dial;
import com.twilio.sdk.verbs.Number;
import com.twilio.sdk.verbs.TwiMLException;
import com.twilio.sdk.verbs.TwiMLResponse;

public class TwilioIOVoiceServlet extends HttpServlet
{
	public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
	{

		System.out.println("in voice servlet");

		// number to which call is made
		String phoneNumber = request.getParameter("PhoneNumber");
		System.out.println("Twilio phone number : " + phoneNumber);

		/* Caller Id from which call is initiated */
		String callerId = request.getParameter("from");

		String clientName = "C";
		clientName = clientName.concat((AgileUser.getCurrentAgileUser().id).toString());

		System.out.println("clientName: " + clientName);

		TwiMLResponse twiml = new TwiMLResponse();
		Dial dial = new Dial();
		try
		{
			if (phoneNumber != null)
			{
				dial.append(new Number(phoneNumber));
				dial.setCallerId(callerId);
			}
			else
			{
				// dial.append(new Client("jenny"));
				dial.append(new Client(clientName));
			}
			twiml.append(dial);
		}
		catch (TwiMLException e)
		{
			e.printStackTrace();
		}
		response.setContentType("application/xml");
		response.getWriter().print(twiml.toXML());
	}
}
