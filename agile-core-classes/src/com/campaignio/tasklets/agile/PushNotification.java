package com.campaignio.tasklets.agile;

import java.util.HashMap;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.notification.push.PushNotificationMessage;
import com.agilecrm.util.HTTPUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>PushNotification</code> represents PushNotification node in the workflow. It push notification.
 *  to the contact who allow ur notification 
 * 
 * @author Prashanjeet
 * 
 * 
 */

public class PushNotification extends TaskletAdapter
{
	
	/**
	 * API url for send a push notification to chrome
	 */
	public static String NOTIFICATION_CHROME_URL = "https://android.googleapis.com/gcm/send";
	
	/**
	 * API url for send a push notification to mozilla
	 */
	public static String NOTIFICATION_MOZILLA_URL = "https://updates.push.services.mozilla.com/push/v1/";
	
	/**
	 * Push Notification Authorization Key
	 */
	public static String NOTIFICATION_AUTHORIZATION = "Authorization";
	
	/**
	 * Google Cloud Messaging API key
	 */
	public static String GCM_API_KEY = "key=AIzaSyCk-w152hepg2pmVWT7MEbEq64GNhnbfik";

	/**
	 * Given Push Notification Title
	 */
	public static String NOTIFICATION_TITLE_VALUE = "notification_title";

	/**
	 * Given URL type
	 */
	public static String NOTIFICATION_MESSAGE_VALUE = "notification_message";

	/**
	 * Exact URL type
	 */
	public static String NOTIFICATION_ICON_URL_VALUE = "notification_icon";

	/**
	 * Like URL type
	 */
	public static String NOTIFICATION_LINK_URL_VALUE = "notification_url";

	/**
	 * Browser field name for Chrome
	 */
	public static String CHROME_BROWSER = "chrome id";
	
	/**
	 * Browser field name for Mozilla
	 */
	public static String MOZILLA_BROWSER = "mozilla id";
	
	
	
	 public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
	    {
		// Get Score and Type
		String title = getStringValue(nodeJSON, subscriberJSON, data, NOTIFICATION_TITLE_VALUE);
		String message = getStringValue(nodeJSON, subscriberJSON, data, NOTIFICATION_MESSAGE_VALUE);
		String linkURL = getStringValue(nodeJSON, subscriberJSON, data, NOTIFICATION_LINK_URL_VALUE);
		String iconURL = getStringValue(nodeJSON, subscriberJSON, data, NOTIFICATION_ICON_URL_VALUE);

		try
		{
		    // Get Contact Id and Contact
		    String contactId = AgileTaskletUtil.getId(subscriberJSON);
		    Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

		    if (contact != null)
		    {
		    	//Getting browser id from contact 
		    	ContactField browser_id=contact.getContactField(CHROME_BROWSER);
		    	
		    	//if browser is not chrome then fetch mozilla id
		    	if(browser_id==null)
		    		  browser_id = contact.getContactField(MOZILLA_BROWSER);
		    	
		    	//If contact doesn't having any id then add a logs
		    	if(browser_id==null)
		    	{
		    		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Contact doesn't subscribe a push notification.",
		    				    LogType.PUSH_NOTIFICATION_SKIPPED.toString());
		    		
		    		// Execute Next One in Loop
		    		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
		    		
		    		return;
		    	}
		    	
		    	//Creating a push notification message object for stor in datastore
		    	
		    	JSONObject notification_message = new JSONObject();
		    	notification_message.put(NOTIFICATION_TITLE_VALUE, title);
		    	notification_message.put(NOTIFICATION_MESSAGE_VALUE, message);
		    	notification_message.put(NOTIFICATION_LINK_URL_VALUE, linkURL);
		    	notification_message.put(NOTIFICATION_ICON_URL_VALUE, iconURL);
		    	long created_time = System.currentTimeMillis()/1000l;
		    	
		    	PushNotificationMessage pushNotificationMessage = new PushNotificationMessage(created_time, browser_id.value, notification_message.toString(),AgileTaskletUtil.getId(campaignJSON), contactId );
		    	
		    	//Sending to chrome browser push notification
		    	if(browser_id.name.equalsIgnoreCase(CHROME_BROWSER))
		    	{
		    		if(sendPushNotificationToChrome(browser_id.value, title, message, iconURL, linkURL))
		    		{
		    			System.out.println("success");
		    			pushNotificationMessage.save();
		    			
		    			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Push Notification successfully sent to Chrome Browser.",
		    				    LogType.PUSH_NOTIFICATION_SENT.toString());
		    		}
		    			
		    		else
		    			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Subscriber block the push notification",
		    				    LogType.PUSH_NOTIFICATION_FAILED.toString());
		    	}
		    	else
		    	{
		    		if(sendPushNotificationToMozilla(browser_id.value, title, message, iconURL, linkURL))
		    		{
		    			System.out.println("success");
		    			pushNotificationMessage.save();
		    			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Push Notification successfully sent to Mozilla Browser.",
		    				    LogType.PUSH_NOTIFICATION_SENT.toString());
		    		}
		    			
		    		else
		    			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Subscriber block the push notification.",
		    				    LogType.PUSH_NOTIFICATION_FAILED.toString());
		    	}
		    	
		    }
		    	
		}
		catch (Exception e)
		{
		    System.err.println("Exception occured in Score tasklet..." + e.getMessage());
		    e.printStackTrace();
		}

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
		}
	 
	 /**
	  * This method is used to send a push notification to chrome browser
	  * @param registration_id
	  * @param data
	 * @throws Exception 
	  */
	 public static boolean sendPushNotificationToChrome(String registration_id, String title, String message, String iconURL, String linkURL)
	 {
			 JSONObject data=new JSONObject();
			 String response=null;
			 try
			 {
				data.put("registration_ids", new JSONArray().put(registration_id));
			 
				HashMap<String, String> headers=new HashMap<String, String>();
				headers.put(NOTIFICATION_AUTHORIZATION, GCM_API_KEY);
				headers.put("Content-Type", "application/json");
			
				System.out.println("Time in Milisecond Before : "+ System.currentTimeMillis());
				
				response = HTTPUtil.accessURLWithHeaderUsingPost(NOTIFICATION_CHROME_URL, data.toString(), headers);
				
				System.out.println("Time in Milisecond After : "+ System.currentTimeMillis()+response);
				
				data=new JSONObject(response);
				
			    System.out.println(data.getInt("success"));
			    
			    if(data.getInt("success")!=0)
			    	return true;
			 
			 } 
			 catch (Exception e)
			 {
					System.out.println("Error occured while sending push notification to Chrome browser : "+e.getMessage());
					return false;
			}
		 return false;
	 }
	
	 
	 /**
	  * This method is used to send a push notification to Mozilla browser
	  * @param registration_id
	  * @param data
	 * @throws Exception 
	  */
	 public static boolean sendPushNotificationToMozilla(String registration_id, String title, String message, String iconURL, String linkURL)
	  {
		
		 String response=null;
		 try
		 {		 
			HashMap<String, String> headers=new HashMap<String, String>();
		
			System.out.println("Time in Milisecond Before : "+ System.currentTimeMillis());
			
			response = HTTPUtil.accessURLWithHeaderUsingPost(NOTIFICATION_MOZILLA_URL+registration_id, null, headers);
			
			System.out.println("Time in Milisecond After : "+ System.currentTimeMillis());
		    
		    if(StringUtils.isEmpty(response))
		    	return true;
		 
		 } 
		 catch (Exception e)
		 {
				System.out.println("Error occured while sending push notification to Mozilla browser : "+e.getMessage());
				return false;
		}
	 return false;
		 
	 }
	 
	 public static void main(String asd[]) throws Exception{
		 int i=0;
		 //String str="https://android.googleapis.com/gcm/send/zW1vgKGlds/:APA91bHrg6ULcPskmV58IkYsveZwjH97UYXGSNfoNb_k-q5N9rg4ELS_NR";
		 //System.out.println(StringUtils.substringAfterLast(str, "/"));
		 while(i<1){
		 sendPushNotificationToChrome("fkuvrfohmoo:APA91bH03B7yrlXsrTeulEpIErpULAHvjUhTlwEX5QZpnOIVuniBXDtQ0KvLHWe7Ba1xiWomLuRPfqIn1plbDGHynRJAggR9xiGgavldx-NxqFFNUMmvjQTn6pSe81AhJNnA_neNe5kQ", null, null, null, null);
		 i++;}
	 }
}
