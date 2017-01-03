package com.agilecrm.core.api.widgets;

import java.net.URLEncoder;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.activities.Call;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.notification.util.MobileNotificationUtil;
import com.agilecrm.user.push.AgileUserPushNotificationId;
import com.agilecrm.workflows.triggers.util.CallTriggerUtil;
import com.google.appengine.api.NamespaceManager;

@Path("/api/widgets/android")
public class AndroidAPI {

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

			System.out.println("domain received = " + domain);

			// Get all users
			List<AgileUserPushNotificationId> prefs = AgileUserPushNotificationId
					.getNotifiers(domain);

			System.out.println("prefs received = " + prefs);
			for (AgileUserPushNotificationId agileUserPushNotificationId : prefs) {

				// new JSONObject(message)
				AgileUser agileUser = AgileUser
						.getCurrentAgileUserFromDomainUser(agileUserPushNotificationId.domainUserId);

				System.out.println("agile user received = " + agileUser);
				if (agileUser == null)
					continue;

				token = agileUserPushNotificationId.registrationId;

				System.out.println("token received = " + token);
				long startTimeForCall = System.currentTimeMillis();

				message = "callToBeta:" + phone_number + ":" + domain + ":" + agileUserPushNotificationId.domainUserId + ":" + startTimeForCall + "";
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

	/**
	 * Saving call info and history.
	 * 
	 * @author Rajesh
	 * @created 14/11/2016
	 * @return String
	 */
	@Path("savecallactivity")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String saveCallActivity(@FormParam("direction") String direction,
			@FormParam("phone") String phone,
			@FormParam("status") String status,
			@FormParam("duration") String duration,
			@QueryParam("note_id") Long note_id) {

		if (!(StringUtils.isBlank(phone))) {
			Contact contact = ContactUtil.searchContactByPhoneNumber(phone);

			if (direction.equalsIgnoreCase("Outgoing")
					|| direction.equalsIgnoreCase("outbound-dial")) {
				ActivityUtil.createLogForCalls("Android", phone, Call.OUTBOUND,
						status.toLowerCase(), duration, note_id);

				// Trigger for outbound
				CallTriggerUtil.executeTriggerForCall(contact, "Android",
						Call.OUTBOUND, status.toLowerCase(), duration);
			}
		}
		return "";
	}

	/**
	 * Saving call info and history on the basis of id.
	 * 
	 * @author Rajesh
	 * @created 14/11/2016
	 * @return String
	 */
	@Path("savecallactivityById")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String saveCallActivityById(@FormParam("id") Long id,
			@FormParam("direction") String direction,
			@FormParam("phone") String phone,
			@FormParam("status") String status,
			@FormParam("duration") String duration,
			@QueryParam("note_id") Long note_id) {

		if (null != id && !(StringUtils.isBlank(phone))) {
			Contact contact = ContactUtil.getContact(id);
			if (null == contact) {
				return "";
			}
			if (direction.equalsIgnoreCase("Outgoing")
					|| direction.equalsIgnoreCase("outbound-dial")) {
				ActivityUtil.createLogForCalls("Android", phone, Call.OUTBOUND,
						status.toLowerCase(), duration, contact, note_id);

				// Trigger for outbound
				CallTriggerUtil.executeTriggerForCall(contact, "Android",
						Call.OUTBOUND, status.toLowerCase(), duration);
			}
		}
		return "";
	}
}
