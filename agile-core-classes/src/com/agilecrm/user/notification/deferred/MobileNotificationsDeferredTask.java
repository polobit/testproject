package com.agilecrm.user.notification.deferred;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.notification.NotificationPrefs;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;
import com.agilecrm.user.push.AgileUserPushNotificationId;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.util.VersioningUtil;
import com.google.android.gcm.server.Message;
import com.google.android.gcm.server.Sender;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>NotificationsDeferredTask</code> implements google appengine's
 * DeferredTask interface. Access pubnub url to publish notification in deferred
 * task.
 * 
 * @author Govind
 * 
 */

public class MobileNotificationsDeferredTask implements DeferredTask {
	/**
	 * Serial id
	 */
	private static final long serialVersionUID = 3267669025920944585L;

	/**
	 * Object data
	 */
	String message = null;

	/**
	 * Channel for pubnub
	 */
	String channel_type = null;

	/**
	 * Domain Name
	 */
	String domain = null;
	
	/**
	 * Raw message
	 */
	String raw_message = null;
	
	// Server Key
	// private static final String serverAPIKey = "AIzaSyAVanImbijvXcUAr6iZNVZLgSG1EeCBMzk";
	// private static final String serverAPIKey = "AIzaSyBjjUcXDE1NXVofpAaMXKHLlheAs0enVMI";
	private static final String serverAPIKey = "AIzaSyBjIGs-PFoP0OtUvJcqJm5x04b12ygxbn8";
	public static final String MESSAGE_KEY = "message";

	public MobileNotificationsDeferredTask(){
	}
	
	/**
	 * Constructs a new {@link MobileNotificationsDeferredTask}.
	 * 
	 * @param channel
	 *            channel
	 * @param message
	 *            Object like Contact, Deals etc.
	 * 
	 */
	public MobileNotificationsDeferredTask(String channel_type, String message, String domain, String raw_message) {
		this.channel_type = channel_type;
		this.message = message;
		this.domain = domain;
		this.raw_message = raw_message;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Runnable#run()
	 */
	public void run() {
		try {
			System.out.println("In run");
			if(StringUtils.isBlank(new JSONObject(message).getString("message")))
				return;
			
			System.out.println("domain = " + domain);
			// Set Namespace
			NamespaceManager.set(domain);
			
			// Get all users
			List<AgileUserPushNotificationId> prefs = AgileUserPushNotificationId.getNotifiers(domain);
			for (AgileUserPushNotificationId agileUserPushNotificationId : prefs) {
				
				// new JSONObject(message)
				AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(agileUserPushNotificationId.domainUserId);
				if(agileUser == null)
					continue;
				
				// Set Namespace
				NamespaceManager.set(domain);
				
		    	NotificationPrefs notificationPrefs =  NotificationPrefsUtil.getNotificationPrefs(agileUser);
		    	if(notificationPrefs == null)
		    		continue;
		    	
		    	// Add Sound Name
		    	addSound(notificationPrefs);
		    	
				if(!NotificationPrefsUtil.isNotificationEnabledToSend(notificationPrefs, new JSONObject(message), raw_message, agileUser))
					return;
				
				System.out.println("Success");
				
				sendMessageToAndriod(agileUserPushNotificationId.registrationId, URLEncoder.encode(message, "UTF-8"));
				// HTTPUtil.accessURL(getURL(agileUserPushNotificationId.registrationId));
			}

		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Got exception in NotificationDeferredTask " + e);
		}
	}
	
	private void addSound(NotificationPrefs notificationPrefs){
		try {
			
			JSONObject messageJSON = new JSONObject(message);
			String soundType = notificationPrefs.notification_sound;

			System.out.println("control_notifications = " + notificationPrefs.control_notifications);
			System.out.println("push_mobile_notification = " + notificationPrefs.push_mobile_notification);
			System.out.println("soundType = " + soundType);
			
			if(StringUtils.isBlank(soundType) || "no_sound".equals(soundType))
				 return;
			
			messageJSON.put("sound_type", soundType);
			
			// Reset message
			this.message = messageJSON.toString();
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
		
	}

	private String getURL(String regId) {
		
		// URL params
		String urlParams = "/AgileNotifications/agile-push?regId=$regId&message=$message&platform=$platform";

		// Get Server URL
		String serverURL = "http://localhost:8181" + urlParams;
		if (!VersioningUtil.isDevelopmentEnv()) {
			serverURL = "http://env-6106674.mycloud.by/" + urlParams;
		}

		try {
			serverURL = serverURL.replace("$message", URLEncoder.encode(message, "UTF-8"));
		} catch (UnsupportedEncodingException e) {
		}

		serverURL = serverURL.replace("$regId", regId);
		serverURL = serverURL.replace("$platform", channel_type);

		System.out.println("serverURL = " + serverURL);
		return serverURL;
	}
	
	public void sendMessageToAndriod(String regId, String data)
	{
		try
		{
			Sender sender = new Sender(serverAPIKey);
			Message message = new Message.Builder().timeToLive(125).delayWhileIdle(false)
					.addData(MESSAGE_KEY, data).build();
			
			System.out.println("regId: " + regId);
			System.out.println(sender.send(message, regId, 1));
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

	}
}