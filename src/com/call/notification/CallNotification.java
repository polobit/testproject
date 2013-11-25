/**
 *  This servlet handles the request from the ring central softphone app to generate call notification 
 */
package com.call.notification;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.google.appengine.api.NamespaceManager;
import com.thirdparty.PubNub;

@SuppressWarnings("serial")
public class CallNotification extends HttpServlet
{
	protected void service(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException
	{
		String apiKey = req.getParameter("api-key");
		String phoneNumber = req.getParameter("number");
		if (!APIKey.isPresent(apiKey))
			return;
		Contact contact = ContactUtil.searchContactByPhoneNumber(phoneNumber);
		if (contact == null)
			return;
		try
		{
			JSONObject obj = new JSONObject();
			obj.put("type", "CALL");
			obj.put("message",
					"<a href=#contact/" + contact.id + ">" + contact.getContactFieldValue(Contact.FIRST_NAME)
							+ "</a> is calling");
			PubNub.pubNubPush(NamespaceManager.get(), obj);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}
