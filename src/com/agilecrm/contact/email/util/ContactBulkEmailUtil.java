package com.agilecrm.contact.email.util;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.util.email.MustacheUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;

public class ContactBulkEmailUtil
{

    /**
     * Returns number of contacts without email. Sends email to each contact of
     * the list
     * 
     * @param emailData
     *            - JSON object with email fields
     * @param contactList
     *            - Contact list
     * @return int
     */
    public static int sendBulkContactEmails(JSONObject emailData, List<Contact> contactList)
    {
	int noEmailsCount = 0;

	try
	{
	    // Fetches values from email json with form field names
	    String fromEmail = emailData.getString("from_email");
	    String fromName = emailData.getString("from_name");
	    String subject = emailData.getString("subject");
	    String body = emailData.getString("body");
	    String signature = emailData.getString("signature");
	    boolean trackClicks = emailData.getBoolean("track_clicks");

	    if (contactList == null)
		return 0;

	    for (Contact contact : contactList)
	    {

		if (contact == null)
		    continue;

		// if contact has no email
		if (StringUtils.isBlank(contact.getContactFieldValue(Contact.EMAIL)))
		{
		    noEmailsCount++;
		    continue;
		}

		// Converts contact to JSON
		JSONObject subscriberJSON = (contact.type.equals(Contact.Type.COMPANY)) ? AgileTaskletUtil
		        .getCompanyJSON(contact) : AgileTaskletUtil.getSubscriberJSON(contact);

		if (subscriberJSON != null)
		{
		    // Compiles subject and body mustache templates
		    String replacedSubject = MustacheUtil.compile(subject, subscriberJSON.getJSONObject("data"));
		    String replacedBody = MustacheUtil.compile(body, subscriberJSON.getJSONObject("data"));

		    ContactEmailUtil.saveContactEmailAndSend(fromEmail, fromName,
			    contact.getContactFieldValue(Contact.EMAIL), null, null, replacedSubject, replacedBody,
			    signature, contact, trackClicks);
		}
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in sendBulkContactEmails " + e.getMessage());

	}
	return noEmailsCount;
    }
}
