package com.thirdparty.twilio;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.DefaultWidgets;
import com.thirdparty.twilio.sdk.TwilioRestClient;
import com.thirdparty.twilio.sdk.TwilioRestResponse;

public class TwilioIOStatusCallBackServlet extends HttpServlet
{

	public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
	{

		System.out.println("in TwilioStatusCallBack Servlet");

		// number to which call is made
		String CallDuration = request.getParameter("CallDuration");
		System.out.println("Twilio CallDuration  : " + CallDuration);

		String CallStatus = request.getParameter("CallStatus");
		System.out.println("Twilio CallStatus  : " + CallStatus);

		String CallSid = request.getParameter("CallSid");
		System.out.println("Twilio CallSid  : " + CallSid);

		String sessionmngrid = request.getParameter("sessionmngrid");
		System.out.println("Twilio sessionmngrid  : " + sessionmngrid);

		Long sessionmngridlong = Long.valueOf(sessionmngrid);

		DomainUser domainUser = DomainUserUtil.getDomainUser(sessionmngridlong);

		if (domainUser == null)
			return;

		System.out.println("domainUser : " + domainUser.email);

		UserInfo userInfo = new UserInfo(domainUser);

		SessionManager.set(userInfo);

		System.out.println("Parent Call SID");
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();

		printRequestAttributes(request, out);

		printRequestParameters(request, out);

		try
		{

			System.out.println("Child Call SID");
			getCallDetails(CallSid, sessionmngrid);

		}
		catch (Exception e)
		{
			System.out.println("error in TwilioIOStatusCallBackServlet");
			e.printStackTrace();
		}

	}

	private void getCallDetails(String callSid, String sessionmngrid) throws Exception
	{
		System.out.println("In getCallDetails: " + callSid + " sessionmngrid: " + sessionmngrid);

		Widget widget = DefaultWidgets.getDefaultWidgetByName("TwilioIO");

		System.out.println("widget" + widget);
		System.out.println("widget.getProperty twilio_acc_sid: " + widget.getProperty("twilio_acc_sid"));
		System.out.println("widget.getProperty twilio_auth_token: " + widget.getProperty("twilio_auth_token"));

		// Get Twilio client configured with account SID and authToken
		TwilioRestClient client = new TwilioRestClient(widget.getProperty("twilio_acc_sid"),
				widget.getProperty("twilio_auth_token"), null);
		System.out.println(client.getAccountSid());

		// parameters required to create application
		Map<String, String> params = new HashMap<String, String>();
		params.put("ParentCallSid", callSid);

		// Make a POST request to create application
		TwilioRestResponse response = client.request("/2010-04-01/Accounts/" + client.getAccountSid() + "/Calls",
				"GET", params);

		System.out.println("Twilio call sid : " + response.getResponseText());

		/*
		 * If error occurs, throw exception based on its status else return
		 * application SID
		 */
		if (response.isError())
			throwProperException(response);

		JSONObject callStatus = XML.toJSONObject(response.getResponseText());
		System.out.println(callStatus);

		JSONObject call = callStatus.getJSONObject("TwilioResponse").getJSONObject("Calls").getJSONObject("Call");

		String Duration = call.getString("Duration");
		String To = call.getString("To");
		String From = call.getString("From");
		String Status = call.getString("Status");
		String Direction = call.getString("Direction");

		System.out.println("Duration: " + Duration);
		System.out.println("To: " + To);
		System.out.println("From: " + From);
		System.out.println("Status: " + Status);
		System.out.println("Direction: " + Direction);

		/*
		 * if (To.contentEquals("")) {} String callee = ""; String state = "";
		 * 
		 * Outgoing call state = "Outgoing call by "+
		 * AgileUser.getcurrentuser().name +"."; callee = To;
		 * 
		 * Incoming call state = "Incoming call answered by "+
		 * AgileUser.getcurrentuser().name +"."; callee = From;
		 * 
		 * String callDuration ="";
		 * 
		 * if (Duration != 0) callDuration = "Call connected for "+Duration;
		 * 
		 * find contact
		 */
		/*
		 * String contactId = ""; Note note = new Note("Call Status",
		 * "state.  "); note.addRelatedContacts(contactId); note.save();
		 */
	}

	/**
	 * Checks Twilio response and throws proper exception
	 * 
	 * @param response
	 *            {@link TwilioRestResponse}
	 * @throws Exception
	 */
	private static void throwProperException(TwilioRestResponse response) throws Exception
	{
		// If account doesn't have balance this error is shown
		if (response.getHttpStatus() == 401 && response.getResponseText().contains("20006"))
			throw new Exception("Your Twilio account needs a recharge. Please add credit and refresh.");

		// Proper message is formed out of the given error
		if (response.getResponseText().startsWith("<?xml "))
		{
			try
			{
				JSONObject json = XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse")
						.getJSONObject("RestException");
				System.out.println(json);

				throw new Exception(json.getString("Code") + " - " + json.getString("Message"));
			}
			catch (JSONException e)
			{
			}
		}

		throw new Exception("Error in Twilio : " + response.getHttpStatus() + "\n" + response.getResponseText());
	}

	/**
	 * This method prints all the request parameters that are available on the
	 * HttpServletRequest.
	 * 
	 * The result will be printed back to the browser
	 * 
	 */
	public static void printRequestParameters(HttpServletRequest req, PrintWriter out)
	{

		System.out.println("Printing All Request Parameters From HttpSerlvetRequest:");

		Enumeration<String> requestParameters = req.getParameterNames();
		while (requestParameters.hasMoreElements())
		{
			String paramName = (String) requestParameters.nextElement();
			System.out.println("Request Paramter Name: " + paramName + ", Value - " + req.getParameter(paramName));
		}
	}

	/**
	 * This method prints all the request attributes that are available on the
	 * HttpServletRequest.
	 * 
	 * The result will be printed back to the browser.
	 * 
	 */
	public static void printRequestAttributes(HttpServletRequest req, PrintWriter out)
	{

		System.out.println("Printing All Request Attributes From HttpSerlvetRequest:");

		Enumeration<String> requestAttributes = req.getAttributeNames();
		while (requestAttributes.hasMoreElements())
		{
			String attributeName = (String) requestAttributes.nextElement();
			System.out.println("Request Attribute Name: " + attributeName + ", Value - "
					+ (req.getAttribute(attributeName)).toString());
		}
	}
}