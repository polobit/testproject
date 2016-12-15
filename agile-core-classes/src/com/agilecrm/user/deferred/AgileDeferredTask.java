package com.agilecrm.user.deferred;

import com.agilecrm.util.exceptions.AgileExceptionUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

public abstract class AgileDeferredTask implements DeferredTask {

	Exception exception;

	private void sendMail() {
		if (exception == null)
			return;
		
		// Send email to Devs
		AgileExceptionUtil.handleException(exception, null);
	}
	
	public void handleException(Exception exception){
		this.exception = exception;
		sendMail();
	}
}
