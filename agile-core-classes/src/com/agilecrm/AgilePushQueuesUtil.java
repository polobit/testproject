package com.agilecrm;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * 
 * @author govindchunchula
 *
 */
public class AgilePushQueuesUtil {

	public static void addTask(String queueName, DeferredTask task) {

		try {
			// Set Retry Limit to zero
			TaskOptions options = TaskOptions.Builder.withPayload(task);

			System.out.println("queueName = " + queueName);
			Queue queue = null;
			if (StringUtils.isNotBlank(queueName))
				queue = QueueFactory.getQueue(queueName);
			else
				queue = QueueFactory.getDefaultQueue();

			queue.add(options);
		} catch (Exception e) {
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

	}
}