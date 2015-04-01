package com.agilecrm.export.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

import com.agilecrm.user.DomainUser;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;

public class DealExportEmailUtil
{

    /**
     * Sends deal csv data as an attachment to current domain user email.
     * 
     * @param currentUserId
     *            - Current Domain User Id.
     * @param data
     *            - CSV data.
     */
    public static void exportDealCSVAsEmail(DomainUser currentUser, String data, String total)
    {
	// if fileData null, return
	if (data == null)
	{
	    System.out.println("Rejected to export csv. Data is null.");
	    return;
	}

	System.out.println("Domain User email is " + currentUser);

	// Mandrill attachment should contain mime-type, file-name and
	// file-content.
	Date currentDate = new Date();
	SimpleDateFormat df = new SimpleDateFormat("MM-dd-yyyy_hh:mm");
	StringBuilder exportedFileName = new StringBuilder("Deals_").append(df.format(currentDate)).append(".csv");

	String[] strArr = { "text/csv", exportedFileName.toString(), data };

	System.out.println("Namespace in exportDealCSVAsEmail " + NamespaceManager.get());
	System.out.println("Domain is  " + currentUser.domain);
	System.out.println("Data size is " + data.length());

	HashMap<String, String> map = new HashMap<String, String>();
	map.put("count", total);

	SendMail.sendMail(currentUser.email, SendMail.EXPORT_DEALS_CSV_SUBJECT, SendMail.EXPORT_DEALS_CSV, map,
		SendMail.AGILE_FROM_EMAIL, SendMail.AGILE_FROM_NAME, strArr);
    }
}
