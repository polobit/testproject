package com.campaignio.tasklets.agile;

import java.util.HashMap;
import java.util.Iterator;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
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
	public static String NOTIFICATION_CHROME_URL = "https://fcm.googleapis.com/fcm/send";
	
	/**
	 * API url for send a push notification to mozilla
	 */
	public static String NOTIFICATION_MOZILLA_URL = "https://updates.push.services.mozilla.com/push/v1/";
	
	/**
	 * API url for send a push notification to mozilla
	 */
	public static String NOTIFICATION_REGISTRATION_IDS = "registration_ids";
	
	/**
	 * Push Notification Authorization Key
	 */
	public static String NOTIFICATION_AUTHORIZATION = "Authorization";
	
	/**
	 * Firebase Cloud Messaging API key
	 */
	public static String FCM_API_KEY = "key=AIzaSyBwft-pRREwaryzyVD1j9HLF4JUELrOoI4";
	
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
	public static String CHROME_BROWSER = "chrome";
	
	/**
	 * Browser field name for Mozilla
	 */
	public static String MOZILLA_BROWSER = "mozilla";
	
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
		    	Iterator<String> browser_ids = contact.browserId.iterator();
		    		    	
		    	//If contact doesn't having any id then add a logs
		    	if(!browser_ids.hasNext())
		    	{
		    		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Contact didn't subscribe for push notification. ",
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
		    	
		    	
		    	//Itreting each browser id and sending push notification
		    	while(browser_ids.hasNext())
		    	{
		    		//fetch id and check which browser id is there
		    		String browser_id = browser_ids.next();
		    		
		    	//Sending to chrome browser push notification
		    	if(browser_id.contains(CHROME_BROWSER))
		    	{
		    		//Subtracting actual browser id of Chrome browser
		    		browser_id = StringUtils.substringAfter(browser_id, CHROME_BROWSER);
		    		
		    		if(sendPushNotificationToChrome(browser_id))
		    		{
		    			System.out.println("Push Notifiacation sent to Chrome successfully : " + browser_id);
		    			
		    			PushNotificationMessage pushNotificationMessage = new PushNotificationMessage(created_time, browser_id, notification_message.toString(),AgileTaskletUtil.getId(campaignJSON), contactId );
		    			pushNotificationMessage.save();
		    			
		    			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Push notification sent successfully sent to the Chrome Browser.",
		    				    LogType.PUSH_NOTIFICATION_SENT.toString());
		    		}
		    			
		    		else
		    			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), " Reasons: contact has blocked the notifications.",
		    				    LogType.PUSH_NOTIFICATION_SENDING_FAILED.toString());
		    	}
		    	else
		    	{
		    		///Subtracting actual browser id of Mozilla browser
		    		browser_id = StringUtils.substringAfter(browser_id, MOZILLA_BROWSER);
		    		
		    		if(sendPushNotificationToMozilla(browser_id))
		    		{
		    			System.out.println("Push Notifiacation sent to Mozilla successfully : " + browser_id);
		    			
		    			PushNotificationMessage pushNotificationMessage = new PushNotificationMessage(created_time, browser_id, notification_message.toString(),AgileTaskletUtil.getId(campaignJSON), contactId );
		    			pushNotificationMessage.save();
		    			
		    			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Push notification sent successfully to the Mozilla Browser.",
		    				    LogType.PUSH_NOTIFICATION_SENT.toString());
		    		}
		    			
		    		else
		    		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),"The browser is not open or contact has blocked the notifications. ", LogType.PUSH_NOTIFICATION_SENDING_FAILED.toString());
		    	}
		    }//end of while loop
		    	
		    }
		    	
		}
		catch (Exception e)
		{
		    System.err.println("Exception occured while sending push notification" + e.getMessage());
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
	 public static boolean sendPushNotificationToChrome(String registration_id)
	 {
			 JSONObject data=new JSONObject();
			 String response=null;
			 try
			 {
				data.put(NOTIFICATION_REGISTRATION_IDS, new JSONArray().put(registration_id));
			 
				HashMap<String, String> headers=new HashMap<String, String>();
				
				headers.put(NOTIFICATION_AUTHORIZATION, FCM_API_KEY);
				
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
	 public static boolean sendPushNotificationToMozilla(String registration_id)
	  {
		
		 String response=null;
		 try
		 {		 
			HashMap<String, String> headers=new HashMap<String, String>();
		
			System.out.println("Time in Milisecond Before : "+ System.currentTimeMillis());
			
			response = HTTPUtil.accessURLWithHeaderUsingPost(NOTIFICATION_MOZILLA_URL + registration_id, null, headers);
			
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
		 sendPushNotificationToChrome("erqk5SmfYjw:APA91bGRRVfKrx3dn2I41J5qZ85pSZzl7FsZvNqVZ6CNLrkfrejVsn3pFx5QZjFSXbCJKmYsuS_r_g41C2G0BFSd4hzfFZ4kP28i-UFT8bMnFLYK-X1eAFTt37hAixRJhYrDPcyQuZW_");
		 i++;}
	 }
}
