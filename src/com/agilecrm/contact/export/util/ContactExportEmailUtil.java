package com.agilecrm.contact.export.util;

import java.util.HashMap;

import org.json.JSONObject;

import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;

public class ContactExportEmailUtil
{

    /**
     * Sends contact csv data as an attachment to current domain user email.
     * 
     * @param currentUserId
     *            - Current Domain User Id.
     * @param data
     *            - CSV data.
     */
    public static void exportContactCSVAsEmail(String currentUser, String data, String total)
    {
	// if fileData null, return
	if (data == null)
	{
	    System.out.println("Rejected to export csv. Data is null.");
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

	// Mandrill attachment should contain mime-type, file-name and
	// file-content.
	String[] strArr = { "text/csv", "LocalContacts.csv", data };

	System.out.println("Namespace in exportContactCSVAsEmail " + NamespaceManager.get());
	System.out.println("Domain is  " + domain);
	System.out.println("Data size is " + data.length());

	HashMap<String, String> map = new HashMap<String, String>();
	map.put("count", total);

	SendMail.sendMail(toEmail, SendMail.EXPORT_CONTACTS_CSV_SUBJECT, SendMail.EXPORT_CONTACTS_CSV, map, SendMail.AGILE_FROM_EMAIL,
		SendMail.AGILE_FROM_NAME, strArr);
    }

}
