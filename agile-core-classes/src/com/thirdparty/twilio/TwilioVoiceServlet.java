package com.thirdparty.twilio;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.user.AgileUser;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.googlecode.objectify.Key;
import com.twilio.sdk.verbs.Dial;
import com.twilio.sdk.verbs.Number;
import com.twilio.sdk.verbs.TwiMLException;
import com.twilio.sdk.verbs.TwiMLResponse;

/**
 * <code>TwilioVoiceServlet</code> handles call request and number verification
 * request from Twilio server
 * 
 * @author Tejaswi
 * @since Jan 2013
 */
@SuppressWarnings("serial")
public class TwilioVoiceServlet extends HttpServlet
{
	/**
	 * This method is executed when someone makes a call from Agile or verifies
	 * a number for Agile Twilio application
	 */
	public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
	{

		/*
		 * We get this record parameter, if the request is to make call. This
		 * responds with a TWIML response for call
		 */
		String record = request.getParameter("record");
		System.out.println("Record param in Twilio: " + record);

		if (record != null)
		{
			// returns TWIML response required to make call
			sendTWIMLResponseToTwilio(request, response, record);
			return;
		}

		/*
		 * We receive this parameter in the request, if the request is made to
		 * verify a number in Twilio to make calls from it
		 */
		String verificationStatus = request.getParameter("VerificationStatus");
		System.out.println("Verification status in Twilio: " + verificationStatus);

		if (verificationStatus != null)
		{
			// retrieves verification status and saves it in widget
			verifyNumberInTwilio(request, response, verificationStatus);
			return;
		}

	}

	/**
	 * Retrieves the parameters required for call and builds a TWIML response
	 * which is converted into XML and returned
	 * 
	 * @param request
	 *            {@link HttpServletRequest}
	 * @param response
	 *            {@link HttpServletResponse}
	 * @param record
	 *            {@link String} contains information about the call whether it
	 *            is to be recorded
	 * @throws IOException
	 */
	public static void sendTWIMLResponseToTwilio(HttpServletRequest request, HttpServletResponse response, String record)
			throws IOException
	{
		// number to which call is made
		String phoneNumber = request.getParameter("PhoneNumber");
		System.out.println("Twilio phone number : " + phoneNumber);

		/* Caller Id from which call is initiated */
		String callerId = request.getParameter("from");

		// build a TWIML response, to initiate a call from Twilio
		TwiMLResponse twiml = new TwiMLResponse();
		Dial dial = new Dial();

		/*
		 * Append to and from numbers to the Dial verb and append dial to TWIML
		 */
		try
		{
			dial.setCallerId(callerId);
			dial.set("record", record);
			dial.append(new Number(phoneNumber));
			twiml.append(dial);
		}
		catch (TwiMLException e)
		{
			e.printStackTrace();
			response.setContentType("text/plain");
			response.getWriter().print(e.getMessage());
		}
		catch (Exception e)
		{
			e.printStackTrace();
			response.setContentType("text/plain");
			response.getWriter().print(e.getMessage());

		}

		System.out.println("Twilio TWIML response: " + twiml.toXML());

		// TWIML response is converted to XML and returned
		response.setContentType("application/xml");
		response.getWriter().print(twiml.toXML());
	}

	/**
	 * Retrieves the verification status returned from Twilio and saves it in
	 * widget
	 * 
	 * @param request
	 *            {@link HttpServletRequest}
	 * @param response
	 *            {@link HttpServletResponse}
	 * @param verificationStatus
	 *            {@link String} contains information about the number whether
	 *            it is verified
	 */
	public static void verifyNumberInTwilio(HttpServletRequest request, HttpServletResponse response,
			String verificationStatus)
	{
		// Retrieve domain user id from request
		String userId = request.getParameter("user_id");
		String fromNumber = request.getParameter("verified_number");

		System.out.println("User Id in Twilio verifying number : " + userId);

		if (userId != null)
		{
			// Get current agile user from domain user id
			AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(Long.parseLong(userId));

			// retrieve widget based on agile user id
			Widget widget = WidgetUtil.getWidget("Twilio", agileUser.id);

			// if widget not found for Twilio, return
			if (widget == null)
				return;

			System.out.println("Widget retrieved: " + widget.toString());

			// save verification status in widget
			widget.addProperty("verificaton_status", verificationStatus);
			widget.addProperty("verified_number", fromNumber);
			
			widget.setOwner(new Key<AgileUser>(AgileUser.class, agileUser.id));
			widget.save();
			System.out.println("widget saved");
		}

		return;
	}
}