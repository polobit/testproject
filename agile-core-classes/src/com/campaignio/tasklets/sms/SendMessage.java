package com.campaignio.tasklets.sms;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;
import org.json.XML;

import com.agilecrm.account.util.SMSGatewayUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.social.PlivoUtil;
import com.agilecrm.social.TwilioUtil;
import com.agilecrm.widgets.Widget;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.SendEmail;
import com.campaignio.tasklets.agile.TwitterSendMessage;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;
import com.campaignio.urlshortener.URLShortener.ShortenURLType;
import com.campaignio.urlshortener.util.URLShortenerUtil;
import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber.PhoneNumber;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.thirdparty.twilio.sdk.TwilioRestClient;
import com.thirdparty.twilio.sdk.TwilioRestResponse;

/**
 * <code>SendMessage</code> represents Send Message node in workflow. It send
 * SMS from an API which is configured in integrations.
 * 
 * @author Bhasuri
 * 
 */
public class SendMessage extends TaskletAdapter
{

	/**
	 * SMS Gateway Account Subscriber ID
	 */
	public static String ACCOUNT_ID = "account_id";

	/**
	 * SMS Gateway Account Authentication Token
	 */
	public static String AUTH_TOKEN = "auth_token";

	/**
	 * SMS Gateway Account SMS API
	 */
	public static String SMS_API = "TWILIO";

	/**
	 * Registered From Number
	 */
	public static String FROM_NUMBER = "from";

	/**
	 * Number to which user sends SMS
	 */
	public static String TO_NUMBER = "to";

	/**
	 * Body of the message
	 */
	public static String MESSAGE = "message";
	
	 /**
     * Click event tracking id
     */
    public static String SMS_CLICK_TRACKING_ID = "sms_click_tracking_id";

	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{

		// Get From, To, Message
		String from = getStringValue(nodeJSON, subscriberJSON, data, FROM_NUMBER);
		String to = getStringValue(nodeJSON, subscriberJSON, data, TO_NUMBER);
		String message = getStringValue(nodeJSON, subscriberJSON, data, MESSAGE);
		String trackClicks = getStringValue(nodeJSON, subscriberJSON, data, SendEmail.TRACK_CLICKS);
		
		try
		{
	    	data.remove(TwitterSendMessage.TWEET_CLICK_TRACKING_ID);
			data.remove(SendEmail.CLICK_TRACKING_ID);
			
			if (StringUtils.isEmpty(to) || StringUtils.isEmpty(from))
			{
				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"SMS failed", LogType.SMS_FAILED.toString());

				// Execute Next One in Loop
				TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
				return;
			}

			if (!checkValidFromNumber(from))
			{
				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"SMS failed as " + from + " is not verified number", LogType.SMS_FAILED.toString());

				// Execute Next One in Loop
				TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
				return;
			}

			if (!checkValidToNumber(to))
			{
				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"SMS could not be sent -  Invalid phone number", LogType.SMS_FAILED.toString());

				// Execute Next One in Loop
				TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
				return;
			}

			data.put(SMS_CLICK_TRACKING_ID, System.currentTimeMillis());
			
			if(trackClicks != null
			        && (!trackClicks.equalsIgnoreCase(SendEmail.TRACK_CLICKS_NO)))
			{	
				message = shortenLongURLs(message, AgileTaskletUtil.getId(subscriberJSON), 
						AgileTaskletUtil.getId(campaignJSON), data.getString(SMS_CLICK_TRACKING_ID), "sms", ShortenURLType.SMS, trackClicks);
			}
			
			System.out.println("Message is...." + message);

			SMSGatewayUtil.sendSMS(SMS_API, from, to, message, ACCOUNT_ID, AUTH_TOKEN);

			// Creates log for sending sms
			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
					"SMS Sent ", LogType.SMS_SENT.toString());
		}
		catch (Exception e)
		{
			System.err.println("Exception ins SendMessage: " + e.getMessage());
		}

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);

	}

	private boolean checkValidFromNumber(String from)
	{

		List<String> verifiedNumbers = getVerifiedNumbers(from);

		if (verifiedNumbers.isEmpty())
			return false;

		if (verifiedNumbers.contains(from))
			return true;

		return false;
	}

	private List<String> getVerifiedNumbers(String from)
	{
		Widget widget = SMSGatewayUtil.getSMSGatewayWidget();

		if (widget == null)
			return new ArrayList<String>();

		SMS_API = SMSGatewayUtil.getSMSType(widget);

		if (SMS_API.equals("TWILIO"))
		{
			ACCOUNT_ID = TwilioUtil.getAccountSID(widget);
			AUTH_TOKEN = TwilioUtil.getAuthToken(widget);
			checkSidAndFromNumber(widget,from);
		}
		else if (SMS_API.equals("PLIVO"))
		{
			ACCOUNT_ID = PlivoUtil.getAccountID(widget);
			AUTH_TOKEN = PlivoUtil.getAuthToken(widget);
		}

		return SMSGatewayUtil.incomingNumbers(widget);
	}

	private boolean checkValidToNumber(String to)
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
	
	public static String shortenLongURLs(String message, String subscriberId, String campaignId, String trackingId, String keyword, ShortenURLType type, String trackClicks)
	{
		String regex = "\\(?\\b(http://|https://|HTTP://|HTTPS://)[-A-Za-z0-9+&amp;@#/%?=~_()|!:,.;]*[-A-Za-z0-9+&amp;@#/%=~_()|]";
		Pattern p = Pattern.compile(regex);
		Matcher m  = p.matcher(message);
		
		boolean result = m.find();
		
		while(result){
			
			for(int i=0; i < m.groupCount(); i++)
			{
				try
				{
					String shortURL = URLShortenerUtil.getShortURL(m.group(i), keyword, 
							subscriberId, trackingId, campaignId, type, trackClicks);
					
					if(shortURL != null)
						message = message.replace(m.group(i), shortURL);
				}
				catch (Exception e)
				{
					System.out.println("Exception occured while replacing long urls..." + e.getMessage());
					e.printStackTrace();
				}
			}
			
			result = m.find();
		}
		
		return message;
	}
	//checking smsapppsid and from number present in integration or not 
 	public void checkSidAndFromNumber(Widget twilioObj,String from)
	{
 	    try{
 		JSONObject jsonObj=new JSONObject(twilioObj.prefs);
             	if(!jsonObj.has("fromnumber") && !jsonObj.has("smsappSid"))              		
              		setSmsSidAndFromNUmber(twilioObj,from);
             	else if(jsonObj.get("fromnumber")!=null || !jsonObj.get("fromnumber").toString().isEmpty()){
             	    if(!from.equalsIgnoreCase(jsonObj.get("fromnumber").toString()))
             		setSmsSidAndFromNUmber(twilioObj,from);
             	}    	    	
             	    
 	    }
 	   catch (Exception e)
 	    {
 		e.printStackTrace();
 		System.out.println(ExceptionUtils.getFullStackTrace(e));
 		
 	    }
	}
 	//set smsappsid and from number if not present
 	public void setSmsSidAndFromNUmber(Widget twilioObj,String from)
	{
 	  try
 	    {
         	    String numberSid=null;
              	    String applicationSid=null;             	    
              	    JSONObject jsonObj=new JSONObject(twilioObj.prefs);
         	    TwilioRestClient client = new TwilioRestClient(ACCOUNT_ID, AUTH_TOKEN, null);
         	    TwilioRestResponse response = client.request(
        				"/" + TwilioUtil.APIVERSION + "/Accounts/" + client.getAccountSid() + "/IncomingPhoneNumbers.xml?PhoneNumber="+URLEncoder.encode(from, "UTF-8"), "GET",
        				null);	
         	    JSONObject result = XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse").getJSONObject("IncomingPhoneNumbers"); 
         	    numberSid=result.getJSONObject("IncomingPhoneNumber").get("Sid").toString();             		
        	   
         	    applicationSid= TwilioUtil.createSMSAppSidTwilioIO(ACCOUNT_ID, AUTH_TOKEN,numberSid);
         	    jsonObj.put("smsappSid", applicationSid);
         	    jsonObj.put("fromnumber", from);
         	    twilioObj.prefs=jsonObj.toString();
         	    ObjectifyGenericDao<Widget> dao = new ObjectifyGenericDao<Widget>(Widget.class);
         	    dao.put(twilioObj);
 	    }
 	  catch (Exception e)
 	    {
 		e.printStackTrace();
 		System.out.println(ExceptionUtils.getFullStackTrace(e));
 		
 	    }
	}    
 }