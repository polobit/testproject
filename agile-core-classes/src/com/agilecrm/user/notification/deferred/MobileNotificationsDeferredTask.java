package com.agilecrm.user.notification.deferred;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.user.notification.util.NotificationPrefsUtil;
import com.agilecrm.user.push.AgileUserPushNotificationId;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.util.VersioningUtil;
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
	 * Constructs a new {@link MobileNotificationsDeferredTask}.
	 * 
	 * @param channel
	 *            channel
	 * @param message
	 *            Object like Contact, Deals etc.
	 * 
	 */
	public MobileNotificationsDeferredTask(String channel_type, String message, String domain) {
		this.channel_type = channel_type;
		this.message = message;
		this.domain = domain;
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
			
			// Get all users
			List<AgileUserPushNotificationId> prefs = AgileUserPushNotificationId.getNotifiers(domain);
			for (AgileUserPushNotificationId agileUserPushNotificationId : prefs) {
				if(!NotificationPrefsUtil.isNotificationEnabledToSend(agileUserPushNotificationId, new JSONObject(message)))
					return;
				
				System.out.println("Success");
				
				HTTPUtil.accessURL(getURL(agileUserPushNotificationId.registrationId));
			}

		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Got exception in NotificationDeferredTask " + e);
		}
	}

	private String getURL(String regId) {

		// URL params
		String urlParams = "/AgileNotifications/agile-push?regId=$regId&message=$message&platform=$platform";

		// Get Server URL
		String serverURL = "http://localhost:8181" + urlParams;
		if (!VersioningUtil.isDevelopmentEnv()) {
			serverURL = "http://env-2813083.mycloud.by/" + urlParams;
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

}