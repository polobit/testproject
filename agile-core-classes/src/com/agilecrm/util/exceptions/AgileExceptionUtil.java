package com.agilecrm.util.exceptions;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.AgileQueues;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.thirdparty.sendgrid.SendGrid;

public class AgileExceptionUtil {

	// To Emails
	static final String CORE_TEAM_ERRORS_EMAILS = "mogulla@agilecrm.com,govind@agilecrm.com";
	static final String SALES_TEAM_ERRORS_EMAILS = "mogulla@agilecrm.com,govind@agilecrm.com";
	static final String MA_TEAM_ERRORS_EMAILS = "mogulla@agilecrm.com,govind@agilecrm.com";
	static final String TICKET_TEAM_ERRORS_EMAILS = "mogulla@agilecrm.com,govind@agilecrm.com";

	// From Email
	static final String ERRORS_EMAIL_FROM = "errors@agilecrm.com";
	static final String ERRORS_EMAIL_FROM_NAME = "Application Error";

	public static void handleException(Exception e) {
		System.out.println("Handle Exceptions");

		// Check to proceed with email
		if (!proceedToEmail(e))
			return;

		try {
			// Add email task to Queue
			Queue queue = QueueFactory.getQueue(AgileQueues.AGILE_APP_ERRORS_QUEUE);
			AgileExceptionEmail task = new AgileExceptionEmail(e.getMessage(), ExceptionUtils.getFullStackTrace(e),
					getToEmail(e));

			queue.add(TaskOptions.Builder.withPayload(task));
		} catch (Exception e2) {
		}
	}

	static boolean proceedToEmail(Exception e) {
		if (e instanceof PlanRestrictedException)
			return false;

		return true;
	}

	static String getToEmail(Exception e) {
		if (e instanceof NullPointerException)
			return SALES_TEAM_ERRORS_EMAILS;

		return CORE_TEAM_ERRORS_EMAILS;
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
		String fromName = AgileExceptionUtil.ERRORS_EMAIL_FROM_NAME;

		SendGrid.sendMail(fromEmail, fromName, toEmailIds, null, null, exceptionMessage, null, null, exceptionLog);
	}
}
