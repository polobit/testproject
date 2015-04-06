package com.agilecrm.contact.export.util;

import java.util.HashMap;

import org.json.JSONObject;

import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;

public class ContactExportEmailUtil
{
	public static enum ContactExportType
	{
		CONTACT("Contact(s)", "Agile CRM Contacts CSV"), COMPANY("Companies", "Agile CRM Companies CSV");
		public String label;
		public String mailHeader;

		ContactExportType(String label, String mailHeader)
		{
			this.label = label;
			this.mailHeader = mailHeader;
		}
	};

    /**
     * Sends contact csv data as an attachment to current domain user email.
     * 
     * @param currentUserId
     *            - Current Domain User Id.
     * @param data
     *            - CSV data.
     */
    public static void exportContactCSVAsEmail(String currentUser, String downloadUrl, String total, ContactExportType contactExportType)
    {
	// if downloadUrl null, return
	if (downloadUrl == null)
	{
	    System.out.println("Rejected to export csv. downloadUrl is null.");
	    return;
	}

	System.out.println("Domain User email is " + currentUser);

	JSONObject currentUserJSON = null;
	String toEmail = null;
	String domain = null;
	try
	{
	    currentUserJSON = new JSONObject(currentUser);
	    toEmail = currentUserJSON.getString("email");
	    domain = currentUserJSON.getString("domain");
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in exportContactCSVAsEmail " + e.getMessage());
	}

	System.out.println("Namespace in exportContactCSVAsEmail " + NamespaceManager.get());
	System.out.println("Domain is  " + domain);
	System.out.println("url is" + downloadUrl);

	HashMap<String, String> map = new HashMap<String, String>();
	map.put("count", total);
	map.put("download_url", downloadUrl);
	map.put("contact_type", contactExportType.label);

	SendMail.sendMail(toEmail, contactExportType.mailHeader, SendMail.EXPORT_CONTACTS_CSV, map,
		SendMail.AGILE_FROM_EMAIL, SendMail.AGILE_FROM_NAME);
    }

}
