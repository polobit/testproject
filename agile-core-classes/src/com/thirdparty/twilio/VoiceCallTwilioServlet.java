package com.thirdparty.twilio;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.NamespaceManager;
import com.thirdparty.twilio.sdk.TwilioRestClient;
import com.twilio.sdk.verbs.Dial;
import com.twilio.sdk.verbs.Gather;
import com.twilio.sdk.verbs.Number;
import com.twilio.sdk.verbs.Pause;
import com.twilio.sdk.verbs.Say;
import com.twilio.sdk.verbs.TwiMLException;
import com.twilio.sdk.verbs.TwiMLResponse;

@SuppressWarnings("serial")
public class VoiceCallTwilioServlet extends HttpServlet
{
    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
	
	try
	{
	    
	    TwiMLResponse twiml = new TwiMLResponse();
	    if (request.getParameter("Digits") != null)
	    {
		
		if (request.getParameter("Digits").equalsIgnoreCase("1"))
		{
		    Dial dial = new Dial(request.getParameter("Number2"));
		    twiml.append(dial);
		    response.setContentType("application/xml");
		    response.getWriter().print(twiml.toXML());
		}
		else if (request.getParameter("Digits").equalsIgnoreCase("2"))
		{
		    
		    Say say = new Say("Thanks.Have a nice day!.GoodBYE");
		    say.setVoice("woman");
		    say.setLanguage("en");
		    twiml.append(say);
		    response.setContentType("application/xml");
		    response.getWriter().print(twiml.toXML());
		}
		else
		{
		    Say say = new Say("You are entering invalid option.");
		    say.setVoice("woman");
		    say.setLanguage("en");
		    twiml.append(say);
		    response.setContentType("application/xml");
		    response.getWriter().print(twiml.toXML());
		}
		
	    }
	    
	    else
	    {
		Pause pause = new Pause();
		pause.setLength(1);
		twiml.append(pause);
		Gather gather = new Gather();
		String namespace = NamespaceManager.get();
		gather.setAction("https://" + namespace
			+ "-dot-sandbox-dot-agilecrmbeta.appspot.com/Twiliovoicecall?Number2="
			+ URLEncoder.encode(request.getParameter("number2"), "UTF-8"));
		gather.setTimeout(20);
		gather.setMethod("POST");
		gather.setNumDigits(1);
		Say say = new Say(request.getParameter("message"));
		say.setVoice("woman");
		say.setLanguage("en");
		Say say1 = new Say("Please enter 1 for speaking with our agent . enter 2 for end the call.");
		say1.setVoice("woman");
		say1.setLanguage("en");
		gather.append(say);
		gather.append(say1);
		Say finalmsg = new Say("Sorry We didn't receive any input from you .Goodbye!");
		finalmsg.setVoice("woman");
		finalmsg.setLanguage("en");
		twiml.append(gather);
		twiml.append(finalmsg);
		System.out.println(twiml.toXML());
		response.setContentType("application/xml");
		response.getWriter().print(twiml.toXML());
	    }
	    
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return;
	}
    }
    
}
