package com.thirdparty.google.deferred;

import org.apache.commons.lang.StringUtils;

import com.google.appengine.api.taskqueue.DeferredTask;
import com.thirdparty.google.ContactPrefs.Duration;
import com.thirdparty.google.GoogleContactToAgileContact;

public class GoogleContactsDeferredTask implements DeferredTask
{

	String namespace = null;
	Duration duration = null;

	public GoogleContactsDeferredTask(String namespace, Duration duration)
	{
		this.namespace = namespace;
		this.duration = duration;
	}

	@Override
	public void run()
	{
		// TODO Auto-generated method stub
		if (StringUtils.isEmpty(namespace))
			return;

		GoogleContactToAgileContact.importGoogleContacts(namespace, duration);
	}

}
