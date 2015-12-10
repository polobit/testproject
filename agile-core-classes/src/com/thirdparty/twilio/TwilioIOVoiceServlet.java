package com.thirdparty.twilio;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.URLEncoder;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.NamespaceManager;
import com.twilio.sdk.verbs.Client;
import com.twilio.sdk.verbs.Dial;
import com.twilio.sdk.verbs.Number;
import com.twilio.sdk.verbs.Redirect;
import com.twilio.sdk.verbs.TwiMLException;
import com.twilio.sdk.verbs.TwiMLResponse;

@SuppressWarnings("serial")
public class TwilioIOVoiceServlet extends HttpServlet
{
	public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		System.out.println("In TwilioIOVoiceServlet for final test");

		// number to which call is made
		String phoneNumber = request.getParameter("PhoneNumber");
		System.out.println("Twilio phone number : " + phoneNumber);

		System.out.println("namespaceManager.get(): " + NamespaceManager.get());

		/* Caller Id from which call is initiated */
		String callerId = request.getParameter("from");

		/* Call Recording enable/disable */
		String record = request.getParameter("record");

		/* Call Redirect to twimletUrl */
		String twimletUrl = request.getParameter("twimleturl");
		System.out.println("twimletUrl: " + twimletUrl);

		/* User want to apply twimlet url */
		String isForward = request.getParameter("isforward");

		/* Client have unique name with the help of agileuserid */
		String agileuserid = request.getParameter("agileuserid");
		TwiMLResponse twiml = new TwiMLResponse();
		Dial dial = new Dial();
		try
		{
			// For redirect settings
			if (isForward != null && isForward.equalsIgnoreCase("true"))
			{
				// Get DialCallStatus
				String DialCallStatus = request.getParameter("DialCallStatus");
				System.out.println("DialCallStatus:" + DialCallStatus);

				// If call is not attended then only apply twimlet
				if (DialCallStatus.equalsIgnoreCase("busy") || DialCallStatus.equalsIgnoreCase("no-answer"))
				{
					// If twimlet url is given
					if (twimletUrl != null)
					{
						System.out.println("In redirect...");

						// Replace & with &amp;
						twimletUrl = twimletUrl.replace("&", "&amp;");
						System.out.println("twimletUrl replace &:" + twimletUrl);

						// Create redirect verb
						Redirect redirect = new Redirect(twimletUrl);

						// Append redirect to twiml
						twiml.append(redirect);
					}
				}
			}
			else
			// For dial settings
			{
				System.out.println("url: " + request.getRequestURI());

				// If user want to record call
				if (record != null)
					if (record.equals("true"))
						dial.set("record", record);

				// If outgoing call
				if (phoneNumber != null)
				{
					System.out.println("Outgoing call");

					// Append number
					dial.append(new Number(phoneNumber));

					// Set callerID
					dial.setCallerId(callerId);
				}
				else
				// For incoming call
				{
					System.out.println("Incoming call");

					// If user want to use twimlet url then set action on dial,
					// it
					// will be executed after call completion
					if (twimletUrl != null)
						if (!twimletUrl.equalsIgnoreCase("None"))
							dial.set(
									"action",
									request.getRequestURI() + "?isforward=true&amp;twimleturl="
											+ URLEncoder.encode(twimletUrl, "UTF-8"));

					// Append client
					dial.append(new Client("agileclient" + agileuserid));
					System.out.println("After dial append");
				}

				// Append dial
				twiml.append(dial);
			}
			System.out.println(twiml.toXML());
		}
		catch (TwiMLException e)
		{
			System.out.println("error in voice srvlet.");

			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			System.out.println(sw.toString());

			System.out.println(e.getMessage());
			System.out.println(e.getStackTrace().toString());
		}
		catch (Exception e)
		{
			System.out.println("error in voice Exception.");

			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			System.out.println(sw.toString());

			System.out.println(e.getMessage());
			System.out.println(e.getStackTrace().toString());

		}
		response.setContentType("application/xml");
		response.getWriter().print(twiml.toXML());
	}
}