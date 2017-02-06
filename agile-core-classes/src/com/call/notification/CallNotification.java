/**
 *  This servlet handles the request from the ring central softphone app to generate call notification 
 */
package com.call.notification;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.account.util.APIKeyUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.search.query.util.QueryDocumentUtil;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;
import com.agilecrm.user.util.AliasDomainUtil;
import com.agilecrm.util.VersioningUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.gdata.util.common.base.StringUtil;
import com.thirdparty.PubNub;

@SuppressWarnings("serial")
public class CallNotification extends HttpServlet {

	public static String EVENT_INBOUND = "inbound";
	public static String EVENT_OUTBOUND = "outbound";

	public static String EVENTTYPE_RINGING = "ringing";
	public static String EVENTTYPE_HANGUP = "hangup";

	protected void service(HttpServletRequest req, HttpServletResponse res)
			throws IOException, ServletException {
		 PrintWriter pw = res.getWriter();
		// Gets the Api key to validate the agile user.
		String apiKey = req.getParameter("api-key");
		// Gets the service like asterisk.
		String serviceType = req.getParameter("s");

		pw.println("apikey : "+apiKey);
		pw.println("serviceType : "+serviceType);
		String namespace = AliasDomainUtil
				.getCachedAliasDomainName(NamespaceManager.get());

		if (StringUtils.isBlank(apiKey)) {
			res.sendError(HttpServletResponse.SC_BAD_REQUEST,
					"Bad Request: API Key is missing");
			return;
		}

		// pw.println("API KEY STATUS : "+APIKeyUtil.isPresent(apiKey));

		if (!APIKeyUtil.isPresent(apiKey)) {
			res.sendError(HttpServletResponse.SC_UNAUTHORIZED,
					"Unauthorized: Invalid API Key");
			return;
		}

		if (serviceType != null && serviceType.equals("asterisk")) {
			pw.println("In asterisk block");

			// Gets the event like inbound or outbound.
			String event = req.getParameter("e");
			// Get the event type like ringing, hangup.
			String eventType = req.getParameter("t");
			// Gets the call duration for both inbound or outbound.
			String durationStr = req.getParameter("d");
			int duration = 0;
			if (durationStr != null) {
				try {
					duration = Integer.parseInt(durationStr);
				} catch (Exception e) {
					res.sendError(HttpServletResponse.SC_BAD_REQUEST,
							"Bad Request: Duration(d) should be numeric");
					return;
				}
			}
			String extensionNumber = req.getParameter("exten");
			// String callType = req.getParameter("call_type");
			String fromNumber = req.getParameter("number");

			if (null == extensionNumber) {
				res.sendError(HttpServletResponse.SC_BAD_REQUEST,
						"Bad Request: Extension Number is missing");
				return;
			}

			if (null == fromNumber) {
				res.sendError(HttpServletResponse.SC_BAD_REQUEST,
						"Bad Request: From Number is missing");
				return;
			}

			try {
				JSONObject obj = new JSONObject();
				obj.put("check", true);
				obj.put("extension", extensionNumber);
				obj.put("number", fromNumber);
				obj.put("type", "CALL");				
				obj.put("callType", "Asterisk");
				
				if (eventType == null) {
					eventType = EVENTTYPE_RINGING;
				}
				pw.print(event+" : "+eventType+" : "+duration);
				
				if (StringUtil.equals(EVENT_INBOUND, event)) {
					if (StringUtil.equals(EVENTTYPE_RINGING, eventType)) {
						obj.put("direction", "Inbound");
						obj.put("state", "ringing");
					} else {
						obj.put("direction", "Inbound");
						obj.put("duration", duration);
						obj.put("state", "lastCallDetail");
					}
				} else {
					if (StringUtil.equals(EVENTTYPE_RINGING, eventType)) {
						obj.put("direction", "Outbound");
						obj.put("state", "ringing");						
					} else {		
						obj.put("direction", "Outbound");
						obj.put("duration", duration);
						obj.put("state", "lastCallDetail");									
					}
				}
				System.out.println("Call notification data "+obj.toString());
				PubNub.pubNubPush(namespace, obj);
			} catch (Exception e) {
				e.printStackTrace();
			}

		} else {
			String phoneNumber = req.getParameter("number");
			String firstName = req.getParameter("fname") == null ? "" : req
					.getParameter("fname");
			String lastName = req.getParameter("lname") == null ? "" : req
					.getParameter("lname");

			if (null == phoneNumber) {
				res.sendError(HttpServletResponse.SC_BAD_REQUEST,
						"Bad Request: Phone Number is missing");
				return;
			} else {
				if (StringUtils.isBlank(phoneNumber)) {
					res.sendError(HttpServletResponse.SC_BAD_REQUEST,
							"Bad Request: Phone Number is missing");
					return;
				}
			}

			Contact contact = null;
			try {
				phoneNumber = phoneNumber.trim();
				contact = QueryDocumentUtil
						.getContactsByPhoneNumber(phoneNumber);
			} catch (Exception e) {
			}

			if (contact == null) {
				try {
					JSONObject obj = new JSONObject();
					obj.put(Contact.FIRST_NAME, firstName);
					obj.put(Contact.LAST_NAME, lastName);
					obj.put(Contact.PHONE, phoneNumber);
					obj.put("type", "UNKNOWN_CALL");
					PubNub.pubNubPush(namespace, obj);
					String redire_link = "";
					String domain_url = VersioningUtil
							.getHostURLByApp(namespace);
					if (!StringUtils.isBlank(firstName)
							&& !StringUtils.isBlank(lastName)) {
						redire_link = domain_url + "#contacts/call-lead/"
								+ firstName + "/" + lastName + "/"
								+ phoneNumber;
					} else if (!StringUtils.isBlank(firstName)) {
						redire_link = domain_url + "#contacts/call-lead/"
								+ firstName + "/ " + "/" + phoneNumber;
					} else {
						redire_link = domain_url + "#contacts/call-lead/"
								+ phoneNumber;
					}

					res.sendRedirect(redire_link);
					return;
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			try {
				JSONObject obj = NotificationPrefsUtil
						.getNotificationJSON(contact);
				obj.put("type", "CALL");
				PubNub.pubNubPush(namespace, obj);

				String domain_url = VersioningUtil.getHostURLByApp(namespace);
				String redire_link = domain_url + "#contact/"
						+ obj.getString("id");
				res.sendRedirect(redire_link);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

	}
}