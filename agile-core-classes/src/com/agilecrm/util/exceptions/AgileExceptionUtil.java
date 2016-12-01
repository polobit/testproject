package com.agilecrm.util.exceptions;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.AgileQueues;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.util.VersioningUtil;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.thirdparty.sendgrid.SendGrid;

public class AgileExceptionUtil {

	// To Emails
	static final String CORE_TEAM_ERRORS_EMAILS = "mogulla@invox.com,govind@invox.com,venkat@agilecrm.com";
	static final String SALES_TEAM_ERRORS_EMAILS = "subrahmanyam@invox.com,sankar@agilecrm.com";
	static final String MA_TEAM_ERRORS_EMAILS = "naresh@agilecrm.com,ramesh@agilecrm.com";
	static final String TICKET_TEAM_ERRORS_EMAILS = "rohit@agilecrm.com,sreedevi@agilecrm.com";
	static final String INTEGRATIONS_TEAM_ERRORS_EMAILS = "sri@agilecrm.com,prem@agilecrm.com";
	
	static final String COMMON_TEAM_ERRORS_EMAILS = CORE_TEAM_ERRORS_EMAILS + "," + SALES_TEAM_ERRORS_EMAILS + "," + MA_TEAM_ERRORS_EMAILS + 
			"," + TICKET_TEAM_ERRORS_EMAILS + "," + INTEGRATIONS_TEAM_ERRORS_EMAILS;

	// From Email
	static final String ERRORS_EMAIL_FROM = "noreply@agilecrm.com";
	static final String ERRORS_EMAIL_FROM_NAME = "Application Error";

	public static void handleException(Exception e, ServletRequest request) {
		System.out.println("Handle Exceptions");

		// Check to proceed with email
		if (!proceedToEmail(e))
			return;

		try {
			// Add email task to Queue
			Queue queue = QueueFactory.getQueue(AgileQueues.AGILE_APP_ERRORS_QUEUE);
			String exceptionMessage = e.getMessage();
			if(request != null){
				HttpServletRequest req = (HttpServletRequest) request;
				if(req != null && req.getRequestURI() != null)
					exceptionMessage += "("+req.getRequestURI()+")";
			}
			
			AgileExceptionEmail task = new AgileExceptionEmail(exceptionMessage, ExceptionUtils.getFullStackTrace(e),
					getToEmail(e));
			queue.add(TaskOptions.Builder.withPayload(task));
		} catch (Exception e2) {
		}
	}

	static boolean proceedToEmail(Exception e) {
		if (VersioningUtil.isDevelopmentEnv() || "agilecrmbeta".equals(VersioningUtil.getApplicationAPPId()) || e instanceof IllegalStateException)
			return false;

		return true;
	}

	static String getToEmail(Exception e) {
		if (e instanceof NullPointerException)
			return COMMON_TEAM_ERRORS_EMAILS;

		return COMMON_TEAM_ERRORS_EMAILS;
	}
}

class AgileExceptionEmail implements DeferredTask {
	private String exceptionMessage;
	private String exceptionLog;
	private String toEmailIds;

	public AgileExceptionEmail(String exceptionMessage, String exceptionLog, String toEmailIds) {
		this.exceptionMessage = exceptionMessage;
		this.exceptionLog = exceptionLog;
		this.toEmailIds = toEmailIds;
	}

	@Override
	public void run() {
		String fromEmail = AgileExceptionUtil.ERRORS_EMAIL_FROM;
		String fromName = AgileExceptionUtil.ERRORS_EMAIL_FROM_NAME+"("+VersioningUtil.getApplicationAPPId()+")";
		SendGrid.sendMail(fromEmail, fromName, toEmailIds, null, null, exceptionMessage, null, null, exceptionLog);
	}
}
