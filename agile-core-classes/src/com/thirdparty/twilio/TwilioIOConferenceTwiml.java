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
public class TwilioIOConferenceTwiml extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TwilioIOConferenceTwiml() {
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
	
	public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		try
		{
		
		String conferenceName = request.getParameter("conference");
		String endConferenceOnExit = request.getParameter("endConferenceOnExit");
		String recordConference = request.getParameter("recordConference");
		String maxParticipants = request.getParameter("maxParticipants");
		System.out.println("----------------------------------");
		System.out.println("conference name in conference call is " + conferenceName);
		System.out.println("endConferenceOnExit is " + endConferenceOnExit);
		response.setContentType("application/xml");
		TwiMLResponse twiml = new TwiMLResponse();

			Say say = new Say("Please wait we are routing the call");
			say.setLanguage("en");
			twiml.append(say);
				Dial dial = new Dial();
				dial.setHangupOnStar(true);
				Conference c = new Conference(conferenceName);
				c.setStartConferenceOnEnter(true);	

				if(endConferenceOnExit!= null && endConferenceOnExit.equalsIgnoreCase("yes")){
					c.setEndConferenceOnExit(true);
				}
				if(recordConference!= null && recordConference.equalsIgnoreCase("true")){
					c.set("record", "record-from-start");
				}
				if(maxParticipants != null){
					c.setMaxParticipants(Integer.parseInt(maxParticipants));
					System.out.println("max paricipants is " + maxParticipants);
				}
				dial.append(c);
				twiml.append(dial);

		
		System.out.println(twiml.toXML());
	    response.getWriter().print(twiml.toXML());	
		}
		catch (TwiMLException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
