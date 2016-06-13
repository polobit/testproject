package com.campaignio.tasklets.agile;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.util.VoiceCallUtil;
import com.agilecrm.widgets.Widget;
import com.amazonaws.util.StringUtils;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;
import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber.PhoneNumber;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>VoiceCall</code> represents call node in workflow. It send a voice call
 * from an API which is configured in integrations.and also ask for option to talk with agent or end call.
 * 
 * @author Sonali
 * 
 */
public class CallNode extends TaskletAdapter
{
    /**
     * Call Gateway Account Subscriber ID
     */
    private static String CALL_ACCOUNT_ID = "account_id";
    
    /**
     * Call Gateway Account Authentication Token
     */
    private static String CALL_AUTH_TOKEN = "auth_token";
    
    /**
     * Call Gateway Registered From Number
     */
    private static String TWILIO_NUMBER   = "twilio_number";
    
    /**
     * From Number from node
     */
    public static String  FROM	    = "from";
    
    /**
     * Number to which 1st call is made
     */
    public static String  TO_NUMBER1      = "Contact Number";
    
    /**
     * Number to which call is going when use enter 1 option(agent number in
     * node)
     */
    public static String  TO_NUMBER2      = "phonenumber2";
    
    /**
     * Body of the message
     */
    public static String  VOICE_MESSAGE   = "message";
    
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {
	// Get From, To, Message
	String from = getStringValue(nodeJSON, subscriberJSON, data, FROM);
	String firstCall = getStringValue(nodeJSON, subscriberJSON, data, TO_NUMBER1);
	String secondCall = getStringValue(nodeJSON, subscriberJSON, data, TO_NUMBER2);
	String message = getStringValue(nodeJSON, subscriberJSON, data, VOICE_MESSAGE);
	
	try
	{
	    
	    if (StringUtils.isNullOrEmpty(firstCall) || StringUtils.isNullOrEmpty(from))
	    {
		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
			"Call failed", LogType.CALL_FAILED.toString());
		
		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
		return;
	    }
	    
	    if (!checkValidFromNumberForCall(from))
	    {
		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
			"Call failed due to " + from + " is not verified number", LogType.CALL_FAILED.toString());
		
		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
		return;
	    }
	    
	    if (!checkValidToNumberForCall(firstCall))
	    {
		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
			"Call failed due to  -  Invalid phone number", LogType.CALL_FAILED.toString());
		
		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
		return;
	    }
	    //for making call
	    VoiceCallUtil.makeVoiceCall(CALL_ACCOUNT_ID, CALL_AUTH_TOKEN, from, firstCall, secondCall, message);
	    
	    LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
		    "voice call done ", LogType.CALL_DONE.toString());
	}
	catch (Exception e)
	{
	    System.err.println("Exception forwarding call: " + e.getMessage());
	    LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
		    "Call failed ", LogType.CALL_FAILED.toString());
	}
	
	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
	
    }
    
    private boolean checkValidToNumberForCall(String to)
    {
	
	PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
	try
	{
	    PhoneNumber toPhoneNumber = phoneUtil.parse(to, null);
	    if (phoneUtil.isValidNumber(toPhoneNumber))
		return true;
	}
	catch (NumberParseException e)
	{
	    System.out.println("Inside Send Message check valid 'to' number");
	    System.err.println("NumberParseException was thrown: " + e.toString());
	}
	return false;
    }
    
    private boolean checkValidFromNumberForCall(String from) throws JSONException
    {
	Objectify ofy = ObjectifyService.begin();
	Widget widgetObj = ofy.query(Widget.class).filter("name", "TwilioIO").get();
	JSONObject prefsJSON = new JSONObject(widgetObj.prefs);
	
	if (prefsJSON.length() != 0 && prefsJSON.has("twilio_acc_sid"))
	    CALL_ACCOUNT_ID = prefsJSON.get("twilio_acc_sid").toString();
	if (prefsJSON.length() != 0 && prefsJSON.has("twilio_auth_token"))
	    CALL_AUTH_TOKEN = prefsJSON.get("twilio_auth_token").toString();
	if (prefsJSON.has("twilio_from_number") && prefsJSON.get("twilio_from_number") != null
		&& !prefsJSON.get("twilio_from_number").toString().isEmpty())
	    TWILIO_NUMBER = prefsJSON.get("twilio_from_number").toString();
	else if (prefsJSON.has("twilio_number") && prefsJSON.get("twilio_number") != null
		&& !prefsJSON.get("twilio_number").toString().isEmpty())
	    TWILIO_NUMBER = prefsJSON.get("twilio_number").toString();
	
	if (TWILIO_NUMBER.isEmpty() || TWILIO_NUMBER == null)
	    return false;
	
	if (TWILIO_NUMBER.equalsIgnoreCase(from))
	    return true;
	
	return false;
    }
    
}
