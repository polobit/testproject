package com.agilecrm.user.notification.util;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.user.push.AgileUserPushNotificationId.Platform;
import com.google.android.gcm.server.Message;
import com.google.android.gcm.server.Sender;

public class MobileNotificationUtil {
	// Server Key (GCM)
	private static final String serverAPIKey = "AIzaSyBjIGs-PFoP0OtUvJcqJm5x04b12ygxbn8";
	private static final String MESSAGE_KEY = "message";

	// IOS
	private static final String P12_CERTIFICATE_PATH = "misc/ios-push-certificate/privatekey.p12";
	private static final String P12_CERTIFICATE_PWD = "";

	/**
	 * 
	 * @param token
	 * @param message
	 * @param platform
	 */
	public static void sendNotification(String token, String message, Platform platform) {
		if (platform == null)
			platform = Platform.GCM;

		if (StringUtils.isBlank(token) || StringUtils.isBlank(message))
			return;

		switch (platform) {
		case GCM:
			sendMessageToAndriod(token, message);
			break;

		case APNS:
			//sendMessageToIOS(token, message);
			break;
		default:
			System.out.println("default platform = " + platform);
			break;
		}

	}

	/**
	 * Sends Message to Andriod device
	 * 
	 * @param regId
	 * @param data
	 */
	static void sendMessageToAndriod(String regId, String data) {
		try {
			Sender sender = new Sender(serverAPIKey);
			Message message = new Message.Builder().timeToLive(125).delayWhileIdle(false).addData(MESSAGE_KEY, data)
					.build();

			System.out.println("regId: " + regId);
			System.out.println(sender.send(message, regId, 1));
		} catch (Exception e) {
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

	}

	public static void main(String[] args) {
		//sendMessageToIOS("", "test message");
	}
}