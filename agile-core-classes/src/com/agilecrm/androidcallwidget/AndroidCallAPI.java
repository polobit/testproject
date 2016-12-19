package com.agilecrm.androidcallwidget;

import java.net.URLEncoder;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.notification.util.MobileNotificationUtil;
import com.agilecrm.user.push.AgileUserPushNotificationId;
import com.google.appengine.api.NamespaceManager;

@Path("/api/android")
public class AndroidCallAPI {

    /**
     * 
     * @param id
     *            Testing purpose Webhook only return webhook
     */
    @Path("/call")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public void initateAnroidCall(
	    @QueryParam("phone_number") String phone_number) {

	System.out.println("Phone number received = " + phone_number);

	String token = null;
	String message = "";
	String domain = NamespaceManager.get();

	try {
	    
	    System.out.println("domain received = "+domain);

	    // Get all users
	    List<AgileUserPushNotificationId> prefs = AgileUserPushNotificationId
		    .getNotifiers(domain);
	    
	    System.out.println("prefs received = "+prefs);
	    for (AgileUserPushNotificationId agileUserPushNotificationId : prefs) {

		// new JSONObject(message)
		AgileUser agileUser = AgileUser
			.getCurrentAgileUserFromDomainUser(agileUserPushNotificationId.domainUserId);
		
		System.out.println("agile user received = "+agileUser);
		if (agileUser == null)
		    continue;


		token = agileUserPushNotificationId.registrationId;
		
		System.out.println("token received = "+token);
		
		message = "callToBeta:" + phone_number + ":" + domain + ":"
			+ agileUserPushNotificationId.domainUserId + "";
		System.out.println("Message = " + message);
		if (token != null) {
		    System.out.println("Sending...");
		    System.out.println("Register ID" + token);
		    MobileNotificationUtil.sendNotification(
			    agileUserPushNotificationId.registrationId,
			    URLEncoder.encode(message, "UTF-8"),
			    agileUserPushNotificationId.type);
		}

		// sendMessageToAndriod(agileUserPushNotificationId.registrationId,
		// URLEncoder.encode(message, "UTF-8"));
		// HTTPUtil.accessURL(getURL(agileUserPushNotificationId.registrationId));
	    }

	} catch (Exception e) {
	    System.out.println("Exception" + e);
	    e.printStackTrace();
	} finally {
	    NamespaceManager.set(domain);
	}

    }

}