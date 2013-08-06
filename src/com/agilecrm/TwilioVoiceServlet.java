package com.agilecrm;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.session.SessionManager;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
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
    public void service(HttpServletRequest request, HttpServletResponse response)
	    throws IOException
    {

	/*
	 * We get this record parameter, if the request is to make call. This
	 * responds with a TWIML response for call
	 */
	String record = request.getParameter("record");
	System.out.println("Record param in Twilio: " + record);

	if (record != null)
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
	     * Append to and from numbers to the Dial verb and append dial to
	     * TWIML
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
	    }

	    System.out.println("Twilio TWIML response: " + twiml.toXML());

	    // TWIML response is converted to XML and returned
	    response.setContentType("application/xml");
	    response.getWriter().print(twiml.toXML());
	    return;
	}

	/*
	 * We receive this parameter in the request, if the request is made to
	 * verify a number in Twilio to make calls from it
	 */
	String verificationStatus = request.getParameter("VerificationStatus");
	System.out.println("Verification status in Twilio: "
		+ verificationStatus);

	if (verificationStatus != null)
	{
	    /*
	     * Session is required to get the current Agile user and save
	     * verification status in the widget
	     */
	    try
	    {
		SessionManager.set((HttpServletRequest) request);
		System.out.println("Session set in Twilio");
	    }
	    catch (ServletException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }

	    Widget widget = WidgetUtil.getWidget("Twilio");

	    // if widget not found for Twilio, return
	    if (widget == null)
		return;

	    // save verification status in widget
	    widget.addProperty("verificaton_status", verificationStatus);
	    widget.save();
	    return;
	}

    }
}