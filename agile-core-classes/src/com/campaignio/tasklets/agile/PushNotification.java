package com.campaignio.tasklets.agile;

import java.util.HashMap;
import java.util.Iterator;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.wrapper.ContactWrapper;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.email.wrappers.ContactEmailWrapper;
import com.agilecrm.notification.NotificationTemplate;
import com.agilecrm.notification.push.PushNotificationMessage;
import com.agilecrm.util.EmailLinksConversion;
import com.agilecrm.util.HTTPUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;
import com.thirdparty.push.notification.NotificationTemplateUtil;

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
	 * Given Push Notification Template id
	 */
	public static String PUSH_NOTIFICATION_TEMPLATE_NAME = "push_notification_template_name";

	/**
	 * Given  Push Notification Title
	 */
	public static String NOTIFICATION_TITLE_VALUE = "notification_title";
	
	/**
	 * Given URL Push Notification message
	 */
	public static String NOTIFICATION_MESSAGE_VALUE = "notification_message";

	/**
	 * Exact URL Push Notification icon url
	 */
	public static String NOTIFICATION_ICON_URL_VALUE = "notification_icon";

	/**
	 * Exact url Push Notification link
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
		 Long notificationTemplateId = Long.parseLong(getStringValue(nodeJSON, subscriberJSON, data, PUSH_NOTIFICATION_TEMPLATE_NAME));
		 
		 NotificationTemplate notificationTemplate = NotificationTemplateUtil.getNotificationTemplateById(notificationTemplateId);
		 
		 if(notificationTemplate == null){
			 TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
	    		return;
		 }
		 System.out.println("nnnnnnnnnnnnnnn"+notificationTemplateId);
		 		 
		String title = notificationTemplate.notificationTitle;
		String message = notificationTemplate.notificationMessage;
		String linkURL = notificationTemplate.notificationLink;
		String iconURL = notificationTemplate.notificationIcon;
		
		String pushParam = notificationTemplate.push_param;
		 
		 if(notificationTemplate.push_param.equals("YES_AND_PUSH")){
			 linkURL = EmailLinksConversion.convertLinksUsingRegex(linkURL, AgileTaskletUtil.getId(subscriberJSON), AgileTaskletUtil.getId(campaignJSON), pushParam);
		 }
		 else if(notificationTemplate.push_param.equals("YES_AND_PUSH_EMAIL_ONLY")){
			 linkURL = EmailLinksConversion.convertLinksUsingRegex(linkURL, AgileTaskletUtil.getId(subscriberJSON), AgileTaskletUtil.getId(campaignJSON), pushParam);
		 }
		

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
		String url=" https://api.sendgrid.com/v3/subusers";
		 
		 String response = HTTPUtil.accessURLUsingAuthentication(url, "agilecrm1", "send@agile1",
					"GET", null, false, "application/json", "application/json");
		 
		 JSONArray json=new JSONArray(response);
		 System.out.println("subuser: "+json.length());
		 
		 
	 }
}
