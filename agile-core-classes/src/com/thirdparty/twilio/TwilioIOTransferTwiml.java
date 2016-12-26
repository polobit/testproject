package com.thirdparty.twilio;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.social.TwilioUtil;
import com.twilio.sdk.verbs.Conference;
import com.twilio.sdk.verbs.Dial;
import com.twilio.sdk.verbs.Number;
import com.twilio.sdk.verbs.Say;
import com.twilio.sdk.verbs.TwiMLException;
import com.twilio.sdk.verbs.TwiMLResponse;

/**
 * Servlet implementation class TwilioIOTwiml
 * url pattern : twiml
 */
public class TwilioIOTransferTwiml extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TwilioIOTransferTwiml() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		service(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		service(request, response);
		

	}
	
	public void service(HttpServletRequest request, HttpServletResponse response) throws IOException{
		// number to which call is made
		String phoneNumber = request.getParameter("to");
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
			//dial.setCallerId(callerId);
			//dial.set("record", record);
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
}
