package com.agilecrm.alldomainstats.util;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.AllDomainStats;
import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.util.DateUtil;
import com.agilecrm.util.EmailUtil;
import com.google.appengine.api.blobstore.BlobKey;


/**
 * <code>AllDomainStatsServlet</code> handles sent an Email to Admin
 * every day at 08:00 AM with the list of stats report
 * @admin manohar@agilecrm.com
 * @admin rahul@agilecrm.com
 * @author Prashannjeet
 * 
 */

@SuppressWarnings("serial")
public class AllDomainStatsServlet extends HttpServlet {
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException
	    {
		   DateUtil dateUtil=new DateUtil();
		   
		 //yesterday mid night time in millisecond
		   long yesterdayTime = dateUtil.removeDays(1).toMidnight().getCalendar().getTimeInMillis();
		   
		  // Yesterday date in "EEEE, dd MMM yyyy" format
		   String current_date= com.campaignio.reports.DateUtil.getDateInGivenFormat(yesterdayTime,"EEEE, dd MMM yyyy", "IST");
		     
		    yesterdayTime = yesterdayTime / 1000L;
		   //getting stats from datastore
		   AllDomainStats allDomainStats=AllDomainStatsUtil.getAllDomainStats(yesterdayTime);
		   
		   if(allDomainStats != null)
		   {
			   String textMail="Hi..<br><br>                 Beta Branch Stats Report for "+current_date;
			   		  textMail+="<br>_______________________________________<br>";
			   		  textMail+="<br> ";
			   		  textMail+="<br>Campaign       :  "+allDomainStats.campaign_count;
			   		  textMail+="<br>Landing Page   :  "+allDomainStats.landingPage_count;
			   		  textMail+="<br>Web Rules      :  "+allDomainStats.webrule_count;
			   		  textMail+="<br>Triggers       :  "+allDomainStats.triggers_count;
			   		  textMail+="<br>Form           :  "+allDomainStats.form_count;	
			   		  textMail+="<br>Email Template :  "+allDomainStats.emailTemplate_count;
			   		  textMail+="<br><br> Thank You<br>";
			   try
			   	{
			   	    EmailSender emailSender = EmailSender.getEmailSender();
			   		    // Appends Agile label
		   		    textMail = StringUtils.replace(textMail, EmailUtil.getPoweredByAgileLink("campaign", "Powered by"),
			   			    "Sent using Agile");
		   		    textMail = EmailUtil.appendAgileToText(textMail, "Sent using", emailSender.isEmailWhiteLabelEnabled());

			   		   emailSender.sendEmail("care@agilecrm.com", "Admin", "rahul@agilecrm.com", "prashannjeet@agilecrm.com", null, "All Domain Stats Report for "+current_date, null, 
			   				textMail,"Hi", null, new ArrayList<Long>(),new ArrayList<BlobKey>());

			   		}
			   		catch (Exception e)
			   		{
			   		    System.err.println("Exception occured while sending stats report email..." + e.getMessage());
			   		    e.printStackTrace();
			   		}
			   
			   return;
		   }

		   System.out.println("Exception occured while getting stats report");
		   		   
		  
	    }
	
}
