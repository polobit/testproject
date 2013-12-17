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

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;
import com.google.appengine.api.NamespaceManager;
import com.thirdparty.PubNub;

@SuppressWarnings("serial")
public class CallNotification extends HttpServlet
{
	protected void service(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException
	{
		String apiKey = req.getParameter("api-key");
		String phoneNumber = req.getParameter("number");
		String firstName = req.getParameter("fname");
		String lastName = req.getParameter("lname");
		String namespace = NamespaceManager.get();

		PrintWriter out = res.getWriter();
		if (StringUtils.isBlank(apiKey))
		{
			out.println("API KEY MISSING");
			return;
		}
		if (!APIKey.isPresent(apiKey))
		{
			out.println("INVALID API KEY");
			return;
		}
		Contact contact = ContactUtil.searchContactByPhoneNumber(phoneNumber);
		if (contact == null)
		{
			res.sendRedirect("https://" + namespace + "agilecrm.com/#contacts/call-lead/" + firstName + "/" + lastName);
		}
		try
		{
			JSONObject obj = NotificationPrefsUtil.getNotificationJSON(contact);
			obj.put("type", "CALL");
			PubNub.pubNubPush(namespace, obj);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}