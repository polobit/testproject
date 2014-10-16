package com.thirdparty.twilio;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.NamespaceManager;
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

		System.out.println("namespaceManager.get(): " + NamespaceManager.get());

		/*
		 * String agileuserid = request.getParameter("agileuserid");
		 * System.out.println("Twilio agileuserid : " + agileuserid);
		 */
		/* Caller Id from which call is initiated */
		String callerId = request.getParameter("from");

		/*
		 * String clientName = "c"; clientName = clientName.concat(agileuserid);
		 */
		// System.out.println("clientName: " + clientName);

		TwiMLResponse twiml = new TwiMLResponse();
		Dial dial = new Dial();
		try
		{
			if (phoneNumber != null)
			{
				System.out.println("Outgoing call");
				dial.append(new Number(phoneNumber));
				dial.setCallerId(callerId);
			}
			else
			{
				System.out.println("Incoming call");
				// dial.append(new Client("jenny"));
				dial.append(new Client("agileclient"));
			}
			twiml.append(dial);

			System.out.println(twiml.toXML());
		}
		catch (TwiMLException e)
		{
			e.printStackTrace();
		}
		response.setContentType("application/xml");
		response.getWriter().print(twiml.toXML());
	}
}
