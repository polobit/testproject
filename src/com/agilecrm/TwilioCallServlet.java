package com.agilecrm;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.util.Util;
import com.campaignio.cron.util.CronUtil;

public class TwilioCallServlet extends HttpServlet
{

    public static final String TWILIO_COMMAND = "command";

    public static final String TWILIO_RECEIVE_SMS_FROM = "From";
    public static final String TWILIO_COMMAND_RECEIVE_SMS_TO = "To";
    public static final String TWILIO_COMMAND_RECEIVE_SMS_MESSAGE = "Body";

    public void doPost(HttpServletRequest request, HttpServletResponse response)
	    throws IOException
    {
	doGet(request, response);
    }

    public void doGet(HttpServletRequest req, HttpServletResponse resp)
	    throws IOException
    {
	resp.setContentType("text/xml");

	String from = req.getParameter(TWILIO_RECEIVE_SMS_FROM);
	String to = req.getParameter(TWILIO_COMMAND_RECEIVE_SMS_TO);
	String message = req.getParameter(TWILIO_COMMAND_RECEIVE_SMS_MESSAGE);

	System.out.println("From: " + from + " to: " + to + " Message: "
		+ message);

	// Interrupt
	if (from != null && to != null && message != null)
	{
	    try
	    {
		CronUtil.interrupt(Util.changeNumber(to),
			Util.changeNumber(from), null,
			new JSONObject().put("message", message));
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }
	}

	String xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
	xml += "<Response>";
	// xml += "<Sms>Hello World!</Sms>";
	// xml += "<Redirect>http://api.twilio.com/sms/welcome</Redirect>";
	xml += "<Dial callerId=\"" + from + "\">";
	xml += "<Number>" + to + "</Number>";
	xml += "</Dial>";
	xml += "</Response>";

	resp.getWriter().println(xml);

    }
}