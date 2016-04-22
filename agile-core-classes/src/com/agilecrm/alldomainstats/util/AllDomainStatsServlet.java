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
			   String textMail=getStatsTemplate(allDomainStats.campaign_count, allDomainStats.landingPage_count, allDomainStats.form_count, allDomainStats.triggers_count, allDomainStats.webrule_count, allDomainStats.emailTemplate_count, current_date);
			   
			   try
			   	{
			   	    EmailSender emailSender = EmailSender.getEmailSender();
			   		     emailSender.sendEmail("stats@agilecrm.com", "Agile CRM", "manohar@agilecrm.com", "rahul@agilecrm.com", "pavan@agilecrm.com", "All Domain Stats Report for "+current_date, null, 
			   				textMail,"Hi", null, new ArrayList<Long>(),new ArrayList<BlobKey>());

			   		}
			   		catch (Exception e)
			   		{
			   		    System.err.println("Exception occured while sending stats report email..." + e.getMessage());
			   		    e.printStackTrace();
			   		}
			   
			   return;
		   }
		   		   
		  
	    }
	
	/**
	 * Create Email Template for stats report
	 * @return Html code in string format
	 */
	public static String getStatsTemplate(long campaign, long landingPage, long form, long trigger, long webrule, long email, String report_date)
	{
		String template="<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'> <html xmlns='http://www.w3.org/1999/xhtml'> <head> "
				+ "<meta http-equiv='Content-Type' content='text/html; charset=utf-8' /> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <meta name='viewport' content='width=device-width, initial-scale=1'>"
				+ " <title>AgileCRM</title> <style type='text/css'> body{ margin:0; padding:0;} img { border: 0 !important; outline: none !important; max-width:100%; font-size:12px; } .container{ width:450px;} .wrapper{ padding:40px 110px; background-color:#fafafa; width:600px; margin:0 auto; } "
				+ "@media (max-width:640px) { .container{ width:90%;} h2 { font-size:18px !important; } .content td { font-size:12px !important; line-height: 18px !important; } .img-responsive{ max-width:100% !important; height:auto; display:block;} .img-shadow{ width:100% !important;} } "
				+ "</style> </head> <body style='margin: 0; padding: 0; background-color: #fff;'> <table style='width:100%;align:center;border-collapse: collapse;background-repeat: repeat;background-color: #fafafa;display:table'> <tr> <td style='padding:50px 130px 40px'> <table cellspacing='0' "
				+ "cellpadding='0' align='center'> <tbody> <tr> <td> <table cellspacing='0' cellpadding='0' align='center' style='background-color:#fff;border-radius:5px;' class='container'> <tbody> <tr> <td style='border: 1px solid #ccc; border-radius: 2px;' class='content'> <table cellspacing='0'"
				+ " cellpadding='0' style='text-align:center;width:100%;'> <tbody> <tr> <td style='padding-top:15px;padding-left:20px;padding-bottom:15px;padding-right:20px'> <table width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td width='170' valign='bottom'> <img width='150' "
				+ "class='img-responsive' alt='AgileCRM' src='https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1383722651000?id=upload-container'> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table width='100%' cellspacing='0' cellpadding='0' style='background-color:#ccc'> <tbody>"
				+ " <tr> <td height='1'></td> </tr> </tbody> </table> <table width='100%' cellspacing='0' cellpadding='5px'> <tbody> <tr> <td style='color:#1E90FF; font-weight:bold;font-size:16px; text-align:center;'>All Domain Stats Report</td> </tr> <tr> <td style='font-weight:bold;font-size:12px;"
				+ " text-align:center;'>Date</td> </tr> </tbody> </table> <table cellspacing='5px' cellpadding='5px'> <tbody> <tr> <td style='padding-left:40px; width:150px'>Landing Page(s) : </td> <td style='padding-left:40px; width:100px'>landingpage_count</td> </tr> <tr> <td style='padding-left:40px; width:150px'>Email Template(s) : </td>"
				+ " <td style='padding-left:40px; width:100px'>email_count</td> </tr> <tr> <td style='padding-left:40px; width:150px'>Campaign(s) : </td> <td style='padding-left:40px; width:100px'>campaign_count</td> </tr> <tr> <td style='padding-left:40px; width:150px'>Web Rules : </td> <td style='padding-left:40px; width:100px'>web_count</td> </tr> <tr>"
				+ " <td style='padding-left:40px; width:150px'>Trigger(s) : </td> <td style='padding-left:40px; width:100px'>trigger_count</td> </tr> <tr> <td style='padding-left:40px; width:150px'>Form(s) : </td> <td style='padding-left:40px; width:100px'>form_count</td> </tr> <br></tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td>"
				+ " <table cellspacing='0' cellpadding='0' align='center' class='container'> <tbody> <tr> <td align='center'> <img width='600' height='15' src='http://venkat2desk.site90.net/images/border-shadow.png' alt='' class='img-shadow'> </td> </tr> <tr> <td style='font-family:arial,sans-serif;"
				+ " font-size: 14px; text-align:center;padding-top:15px;opacity:0.6;'> Agile CRM, MS 35, 440 N Wolfe Road, Sunnyvale, CA 94085, USA. </td> </tr>  </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </table> "
				+ "</body> </html>";
		template=StringUtils.replaceOnce(template,"Date",report_date);
		template=StringUtils.replaceOnce(template,"landingpage_count",String.valueOf(landingPage));
		template=StringUtils.replaceOnce(template,"campaign_count",String.valueOf(campaign));
		template=StringUtils.replaceOnce(template,"web_count",String.valueOf(webrule));
		template=StringUtils.replaceOnce(template,"email_count",String.valueOf(email));
		template=StringUtils.replaceOnce(template,"trigger_count",String.valueOf(trigger));
		template=StringUtils.replaceOnce(template,"form_count",String.valueOf(form));
		return template;
	}
	
}