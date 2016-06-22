package com.agilecrm.queues.cron;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.AgileQueues;
import com.agilecrm.util.DateUtil;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.QueueStatistics;
import com.thirdparty.sendgrid.SendGrid;

/**
 * <code>TaskletCounterServlet</code> is the cron servlet to count the tasks in 
 * the queues (Bulk-campaign-pull-queue, Bulk-email-pull-queue, 
 * Normal-campaign-pull-queue, Normal-email-pull-queue and campaign-log-queue) 
 * that are running in the appengine.
 * 
 * The purpose is to find whether the tasks are running in the queue properly.
 * In case the tasks count increases beyond 10,000 and leased count shows 0, 
 * that means there is some issue with the queue and it is not processing tasks.
 * We need to alert the support team with an email. 
 * 
 * @author ravitheja
 * 
 */
@SuppressWarnings("serial")
public class TaskletCounterServlet extends HttpServlet {

    /**
     * Running Tasks safe limit
     */
    public static final int SAFE_COUNT = 10000;

    public void doGet(HttpServletRequest req, HttpServletResponse res) {
    	doPost(req, res);
    }
    
    public void doPost(HttpServletRequest req, HttpServletResponse res) {

    	String[] queueNames = {AgileQueues.BULK_CAMPAIGN_PULL_QUEUE, AgileQueues.BULK_EMAIL_PULL_QUEUE, 
    			AgileQueues.NORMAL_CAMPAIGN_PULL_QUEUE, AgileQueues.NORMAL_EMAIL_PULL_QUEUE, 
    			AgileQueues.CAMPAIGN_LOG_QUEUE}; 

    	long tasksCount;
    	long leasedCount;
    	Long oldestEta = 0l;
    	
    	StringBuilder alertQueues = new StringBuilder();
    	int alertCount = 0;
    	
    	for (String queueName : queueNames) {
    	    Queue queue = QueueFactory.getQueue(queueName);				
    		if(null != queue) {
    			QueueStatistics queueStats = queue.fetchStatistics();
	    		if(null != queueStats) {
		    		tasksCount = queueStats.getNumTasks();
		    		leasedCount = queueStats.getExecutedLastMinute();
		    		oldestEta = queueStats.getOldestEtaUsec();
	    			
		    		System.out.println(queueName + " -+- " + tasksCount + " -+- " + leasedCount + " -+- " + oldestEta);
		    		
	    			if(tasksCount > SAFE_COUNT && leasedCount == 0) {
	    				if(alertCount > 1) {
	    					alertQueues.insert(0, queueName + ", ");
	    				} else {
	    					if(alertCount == 1) alertQueues.append(" and ");
	    					alertQueues.append(queueName);
	    				} 
	    				alertCount++;
	    			}
	    		}
    		}
    	}
    	
		if(alertCount > 0) {
			System.out.println("alertQueues --> " + alertQueues);
			
	        StringBuilder html = new StringBuilder();
	        html.append(templateHeader());
	        html.append("<p>This is an AUTO-GENERATED ALERT MAIL.</p> <br> The Task count in the Queue(s) (");
	        html.append(alertQueues.toString());
	        html.append(") has exceeded the safe limit (10,000), while the leased count is 0 for more than a minute. ");
	        html.append(templateFooter());

			SendGrid.sendMail("stats@agilecrm.com", "Agile CRM", "naresh@agilecrm.com, pavan@agilecrm.com", 
					"ravitheja@agilecrm.com, rahul@agilecrm.com", null, 
					"Tasklets count limit exceeded - Autogenerated mail.", null, html.toString(), null);
		}
    }

    
    public String templateHeader() {
		StringBuilder content = new StringBuilder();
		content.append("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"> ");
		content.append("<html xmlns=\"http://www.w3.org/1999/xhtml\"> <head> <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />");
		content.append(" <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
		content.append(" <title>AgileCRM</title> ");
		content.append("<style type=\"text/css\">body{margin:0;padding:0}img{border:0!important;outline:none!important;max-width:100%;font-size:12px}");
		content.append(".container{width:400px}.wrapper{padding:40px 110px;background-color:#fafafa;width:600px;margin:0 auto}@media(max-width:640px)");
		content.append("{.container{width:90%}h2{font-size:18px!important}.content td{font-size:12px!important;line-height:18px!important}");
		content.append(".img-responsive{max-width:100%!important;height:auto;display:block}.img-shadow{width:100%!important}}</style> </head> ");
		content.append("<body style=\"margin:0;padding:0;background-color:#fff\"> ");
		content.append("<table style=\"width:100%;align:center;border-collapse:collapse;background-repeat:repeat;background-color:#fafafa;display:table\"> ");
		content.append("<tr> <td style=\"padding:50px 130px 40px\"> <table cellspacing=\"0\" cellpadding=\"0\" align=\"center\"> <tbody> <tr> <td> ");
		content.append("<table cellspacing=\"0\" cellpadding=\"0\" align=\"center\" style=\"background-color:#fff;border-radius:5px\" class=\"container\"> ");
		content.append("<tbody> <tr> <td style=\"border:1px solid #ccc;border-radius:2px\" class=\"content\"> <table cellspacing=\"0\" cellpadding=\"0\" ");
		content.append("style=\"text-align:center;width:100%\"> <tbody> <tr> <td style=\"padding-top:15px;padding-left:20px;padding-bottom:15px;padding-right:20px\"> ");
		content.append("<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"> <tbody> <tr> <td width=\"170\" valign=\"bottom\"> ");
		content.append("<img width=\"150\" class=\"img-responsive\" alt=\"AgileCRM\" ");
		content.append("src=\"https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1383722651000?id=upload-container\"> </td> </tr> </tbody> </table>");
		content.append(" </td> </tr> </tbody> </table> <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"background-color:#ccc\"> <tbody>");
		content.append(" <tr> <td height=\"1\"></td> </tr> </tbody> </table> <table width='100%' cellspacing='0' cellpadding='5px'> <tbody> ");
		content.append("<tr> <td style='color:#1E90FF; font-weight:bold;font-size:16px; text-align:center;'> _title </td> </tr> ");
		content.append("<tr> <td style='font-weight:bold;font-size:12px; text-align:center;'> _date</td> </tr> </tbody> </table> ");
		content.append("<table cellspacing=\"0\" cellpadding=\"0\"> <tbody> <tr> ");
		content.append("<td style=\"padding-right:20px;padding-left:20px;line-height:20px;font-size:14px;font-family:arial,sans-serif;color:#4B4848\"> ");

		String header = StringUtils.replaceOnce(content.toString(), "_title", "Tasks count in queue is high.");
		return StringUtils.replaceOnce(header, "_date", DateUtil.getCalendarString(System.currentTimeMillis(), DateUtil.EMAIL_TEMPLATE_DATE_FORMAT, "GMT"));
    }
    
    public String templateFooter() {
    	StringBuilder content = new StringBuilder();
    	content.append("<br> <br> <br> The Crew at AgileCRM<br> <a target=\"_blank\" href=\"https://www.agilecrm.com\">https://www.agilecrm.com</a><br> ");
		content.append("<br> <br> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td> ");
		content.append("<table cellspacing=\"0\" cellpadding=\"0\" align=\"center\" class=\"container\"> <tbody> <tr> <td align=\"center\"> ");
		content.append("<img width=\"600\" height=\"15\" src=\"http://venkat2desk.site90.net/images/border-shadow.png\" alt=\"\" class=\"img-shadow\"> </td> </tr> ");
		content.append("<tr> <td style=\"font-family:arial,sans-serif;font-size:14px;text-align:center;padding-top:15px;opacity:.6\"> ");
		content.append("Agile CRM, MS 35, 440 N Wolfe Road, Sunnyvale, CA 94085, USA. </td> </tr> <tr> ");
		content.append("<td style=\"font-family:arial,sans-serif;font-size:9px;text-align:center;padding-top:15px;padding-left:15px;padding-right:15px;opacity:.6\"> ");
		content.append("This email sent to {{email}} because with this email an account with Agile CRM has been created and subscribed to our mailing list. ");
		content.append("If you would no longer get email updates from Agile CRM, you can unsubscribe <a href=\"\">here.</a> </td> </tr> </tbody> </table> ");
		content.append("</td> </tr> </tbody> </table> </td> </tr> </table> </body> </html>");
		
		return content.toString();
    }

}
