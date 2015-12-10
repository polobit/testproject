package com.thirdparty.twilio;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.search.query.util.QueryDocumentUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.thirdparty.twilio.sdk.TwilioRestClient;
import com.thirdparty.twilio.sdk.TwilioRestResponse;

@SuppressWarnings("serial")
public class TwilioIOStatusCallBackServlet extends HttpServlet
{
    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
// adding notes from client side
//	System.out.println("In TwilioStatusCallBack Servlet for final test");
//
//	System.out.println("Parent Call SID");
//
//	// number to which call is made
//	String CallDuration = request.getParameter("CallDuration");
//	System.out.println("Twilio CallDuration  : " + CallDuration);
//
//	String CallStatus = request.getParameter("CallStatus");
//	System.out.println("Twilio CallStatus  : " + CallStatus);
//
//	String CallSid = request.getParameter("CallSid");
//	System.out.println("Twilio CallSid  : " + CallSid);
//
//	String sessionmngrid = request.getParameter("sessionmngrid");
//	System.out.println("Twilio sessionmngrid  : " + sessionmngrid);
//
//	Long sessionmngridlong = Long.valueOf(sessionmngrid);
//
//	DomainUser domainUser = DomainUserUtil.getDomainUser(sessionmngridlong);
//
//	if (domainUser == null)
//	    return;
//
//	System.out.println("domainUser : " + domainUser.email);
//
//	UserInfo userInfo = new UserInfo(domainUser);
//
//	SessionManager.set(userInfo);
//
//	/*
//	 * response.setContentType("text/html"); PrintWriter out =
//	 * response.getWriter();
//	 * 
//	 * printRequestAttributes(request, out);
//	 * 
//	 * printRequestParameters(request, out);
//	 */
//	try
//	{
//	    System.out.println("Child Call SID");
//	    getCallDetails(CallSid, sessionmngrid);
//	}
//	catch (Exception e)
//	{
//	    System.out.println("error in TwilioIOStatusCallBackServlet");
//
//	    StringWriter sw = new StringWriter();
//	    PrintWriter pw = new PrintWriter(sw);
//	    e.printStackTrace(pw);
//	    System.out.println(sw.toString());
//
//	    System.out.println(e.getMessage());
//	    System.out.println(e.getStackTrace().toString());
//	}
    }

    private void getCallDetails(String callSid, String sessionmngrid) throws Exception
    {
	System.out.println("In getCallDetails: " + callSid + " sessionmngrid: " + sessionmngrid);

	Widget widget = WidgetUtil.getWidget("TwilioIO");

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

	if (!callStatus.getJSONObject("TwilioResponse").getJSONObject("Calls").has("Call"))
	{
	    System.out.println("No call status.");
	    return;
	}

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

	String newDuration = formatSecToTime(Duration);
	System.out.println("new duration format: " + newDuration);

	String newStatus = formatStatus(Status);
	System.out.println("new newStatus: " + newStatus);

	String state = "";
	String callDuration = "";
	DomainUser user = DomainUserUtil.getCurrentDomainUser();

	System.out.println("user: " + user);
	System.out.println("user: " + user.name);

	if (Duration.equalsIgnoreCase("0"))
	    callDuration = newStatus;
	else
	    callDuration = "Call connected for " + newDuration + ".";

	System.out.println("callDuration: " + callDuration);

	String twilioNumber = widget.getProperty("twilio_number");
	String twilioVerifiedNumber = widget.getProperty("twilio_from_number");
	System.out.println("twilioNumber: " + twilioNumber + " twilioVerifiedNumber: " + twilioVerifiedNumber);

	System.out.println("farah : "
		+ (To.equalsIgnoreCase("client:agileclient") || To.equalsIgnoreCase(twilioNumber) || To
			.equalsIgnoreCase(twilioVerifiedNumber)));

	// Outgoing call
	if (From.equalsIgnoreCase("client:agileclient") || From.equalsIgnoreCase(twilioNumber)
		|| From.equalsIgnoreCase(twilioVerifiedNumber))
	{
	    System.out.println("In Outgoing call");
	    state = "Outbound call by " + user.name + ". ";
	    searchContactFor(To, state, callDuration);
	}
	else if (To.equalsIgnoreCase("client:agileclient") || To.equalsIgnoreCase(twilioNumber)
		|| To.equalsIgnoreCase(twilioVerifiedNumber)) // Incoming call
	{
	    System.out.println("In Incoming call");
	    if (Duration.equalsIgnoreCase("0"))
		state = "Incoming call for " + user.name + ". ";
	    else
		state = "Incoming call answered by " + user.name + ". ";
	    searchContactFor(From, state, callDuration);
	}
    }

    private String formatStatus(String status)
    {
	System.out.println("in formatStatus");
	if (status.equalsIgnoreCase("completed"))
	    return "Completed.";
	if (status.equalsIgnoreCase("busy"))
	    return "Busy.";
	if (status.equalsIgnoreCase("no-answer"))
	    return "No Answer.";
	if (status.equalsIgnoreCase("failed"))
	    return "Failed.";
	if (status.equalsIgnoreCase("canceled"))
	    return "Canceled.";

	return status;
    }

    private String formatSecToTime(String duration)
    {
	System.out.println("in formatSecToTime");

	if (duration.equalsIgnoreCase("0"))
	    return duration;

	long longVal = Long.parseLong(duration);
	int hours = (int) longVal / 3600;
	int remainder = (int) longVal - hours * 3600;
	int mins = remainder / 60;
	remainder = remainder - mins * 60;
	int secs = remainder;

	System.out.println(hours);
	System.out.println(mins);
	System.out.println(secs);

	String result = "";
	if (hours == 1)
	    result = result + hours + " hr ";
	if (hours > 1)
	    result = result + hours + " hrs ";
	if (mins == 1)
	    result = result + mins + " min ";
	if (mins > 1)
	    result = result + mins + " mins ";
	if (secs == 1)
	    result = result + secs + " sec";
	if (secs > 1)
	    result = result + secs + " secs";

	System.out.println("result: " + result);

	return result;
    }

    private void searchContactFor(String searchContactFor, String state, String callDuration)
    {
	System.out.println("In searchContactFor");
	System.out.println("searchContactFor: " + searchContactFor);
	System.out.println("state + call duraton: " + state + callDuration);

	// Search contact
	if (searchContactFor != null)
	{
	    System.out.println("Search contact");
	    Contact contact = QueryDocumentUtil.getContactsByPhoneNumber(searchContactFor);

	    System.out.println("contact: " + contact.FIRST_NAME);
	    if (contact != null)
	    {
		System.out.println("In save note");
		Long contactId = contact.id;
		Note note = new Note("Call Status", state + callDuration);
		note.addRelatedContacts(contactId.toString());
		note.save();

		System.out.println("Note: " + note.description);
		System.out.println("Note: " + note.subject);
		System.out.println("Note: " + note.id);
	    }
	}
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