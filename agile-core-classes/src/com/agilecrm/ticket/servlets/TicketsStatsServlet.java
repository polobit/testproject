package com.agilecrm.ticket.servlets;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.ticket.entitys.TicketStats;
import com.agilecrm.ticket.utils.TicketStatsUtil;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.util.DateUtil;
import com.agilecrm.util.VersioningUtil;
import com.agilecrm.util.email.MustacheUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.blobstore.BlobKey;

/**
 * 
 * @author Sasi
 * 
 */
@SuppressWarnings("serial")
public class TicketsStatsServlet extends HttpServlet
{
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		System.out.println("Sending report initiated....");

		DateUtil dateUtil = new DateUtil();

		// yesterday mid night time in millisecond
		long yesterdayTime = dateUtil.removeDays(1).toMidnight().getCalendar().getTimeInMillis();

		System.out.println("yesterdayTime.." + yesterdayTime);

		// Yesterday date in "EEEE, dd MMM yyyy" format
		String current_date = com.campaignio.reports.DateUtil.getDateInGivenFormat(yesterdayTime, "EEEE, dd MMM yyyy",
				"IST");

		System.out.println("current_date.." + current_date);

		TicketStats stats = TicketStatsUtil.getTicketStats(yesterdayTime / 1000L);

		if (stats != null)
		{
			JSONObject dataJSON = new JSONObject();

			try
			{
				dataJSON = new JSONObject(stats.toString());
				dataJSON.put("data", current_date);

				System.out.println("dataJSON.." + dataJSON);

				// Read template - HTML
				String emailHTML = MustacheUtil
						.templatize(SendMail.TICKET_STATS + SendMail.TEMPLATE_HTML_EXT, dataJSON, UserPrefs.DEFAULT_LANGUAGE);

				EmailSender emailSender = EmailSender.getEmailSender();

				String toEmail = VersioningUtil.isProductionAPP() ? "manohar@agilecrm.com" : "sasi@clickdesk.com";

				emailSender.sendEmail("ticketstats@agilecrm.com", "Agile CRM", toEmail, "service@agilecrm.com", "",
						"Ticket stats report for " + current_date, null, emailHTML, "", null, new ArrayList<Long>(),
						null);

				System.out.println("Sent email report");
			}
			catch (Exception e)
			{
				System.err.println("Exception occured while sending ticket stats report email...");
				System.out.println(ExceptionUtils.getFullStackTrace(e));
			}

			return;
		}
		
		System.out.println("Object not found..");
	}
}