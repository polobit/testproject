/**
 *  This servlet handles the request from the ring central softphone app to generate call notification 
 */
package com.call.notification;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.search.query.util.QueryDocumentUtil;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;
import com.agilecrm.util.VersioningUtil;
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

	if (StringUtils.isBlank(apiKey))
	{
	    res.sendError(HttpServletResponse.SC_BAD_REQUEST, "Bad Request: API Key is missing");
	    return;
	}
	if (!APIKey.isPresent(apiKey))
	{
	    res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Invalid API Key");
	    return;
	}
	Contact contact = QueryDocumentUtil.getContactsByPhoneNumber(phoneNumber);
	if (contact == null && !StringUtils.isBlank(firstName) && !StringUtils.isBlank(lastName))
	{
	    try
	    {
		JSONObject obj = new JSONObject();
		obj.put(Contact.FIRST_NAME, firstName);
		obj.put(Contact.LAST_NAME, lastName);
		obj.put(Contact.PHONE, phoneNumber);
		obj.put("type", "UNKNOWN_CALL");

		PubNub.pubNubPush(namespace, obj);
		String domain_url = VersioningUtil.getHostURLByApp(NamespaceManager.get());
		String redire_link = domain_url + "#contacts/call-lead/" + firstName + "/" + lastName + "/"
		        + phoneNumber;
		res.sendRedirect(redire_link);
		return;
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	try
	{
	    JSONObject obj = NotificationPrefsUtil.getNotificationJSON(contact);
	    obj.put("type", "CALL");
	    PubNub.pubNubPush(namespace, obj);

	    String domain_url = VersioningUtil.getHostURLByApp(NamespaceManager.get());
	    String redire_link = domain_url + "#contact/" + obj.getString("id");
	    res.sendRedirect(redire_link);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }
}