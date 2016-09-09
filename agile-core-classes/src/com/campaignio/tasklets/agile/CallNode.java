package com.campaignio.tasklets.agile;

import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import com.agilecrm.account.util.SMSGatewayUtil;
import com.agilecrm.account.util.VoiceCallUtil;
import com.agilecrm.social.TwilioUtil;
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
import com.thirdparty.twilio.sdk.TwilioRestClient;
import com.thirdparty.twilio.sdk.TwilioRestException;
import com.thirdparty.twilio.sdk.TwilioRestResponse;

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
    private static List<String> TWILIO_NUMBER   = null;
    
    /**
     * From Number from node
     */
    public static String  FROM	    = "from";
    
    /**
     * Number to which 1st call is made
     */
    public static String  TO_NUMBER1      = "Recipient Number";
    
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
			"Call failed due to - Invalid phone number", LogType.CALL_FAILED.toString());
		
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
		    "Voice call done ", LogType.CALL_DONE.toString());
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
    
    private boolean checkValidFromNumberForCall(String from) throws JSONException, TwilioRestException
    {
	Objectify ofy = ObjectifyService.begin();
	//for calling only admin can set credential that's why here sms-gateway is used
	 Widget twilioObj = SMSGatewayUtil.getSMSGatewayWidget();
	 if(twilioObj==null)
		return false;
	JSONObject prefsJSON = new JSONObject(twilioObj.prefs);
	if(!prefsJSON.getString("sms_api").equalsIgnoreCase("TWILIO"))
		return false;
	
	if (prefsJSON.length() != 0 && prefsJSON.has("account_sid"))
	    CALL_ACCOUNT_ID = prefsJSON.get("account_sid").toString();
	if (prefsJSON.length() != 0 && prefsJSON.has("auth_token"))
	    CALL_AUTH_TOKEN = prefsJSON.get("auth_token").toString();

	//getting twilio from number    
	TWILIO_NUMBER=SMSGatewayUtil.incomingNumbers(twilioObj);
	
	if (TWILIO_NUMBER.isEmpty() || TWILIO_NUMBER == null)
	    return false;
	
	if (TWILIO_NUMBER.contains(from))
	    return true;
	
	return false;
    }
    
}
