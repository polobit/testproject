package com.webruleio.reports;


import org.apache.commons.lang.StringUtils;
import com.agilecrm.AgileQueues;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.utils.SystemProperty;


/**
 * <code>WebruleLogUtil</code> class adds logs with respect to webrules
 * 
 * @author Poulami
 * 
 */
public class WebruleLogUtil
{
    /**
     * Adds webrule-log to Google-SQL. It gets domain and logTime to add them to
     * table.
     * 
     * @param webruleId
     *            - form Id.
     * @param emailId
     *          - email Id 
     * @param webruleType
     *         -webrule Type
     *         
     */
    public static void addLogToSQL(String webruleId, String emailId,String webruleType)
    {
	String domain = NamespaceManager.get();

	// For localhost
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
	    domain = "localhost";

	if (StringUtils.isEmpty(domain) || StringUtils.isEmpty(webruleId))
	    return;

	WebrulelogDeferredTask webruleTask = new WebrulelogDeferredTask(webruleId, emailId, domain,webruleType);
	// Add to queue
	Queue queue = QueueFactory.getQueue(AgileQueues.CAMPAIGN_LOG_QUEUE);
	queue.add(TaskOptions.Builder.withPayload(webruleTask));
	System.out.println("task added to queue");

    }

    //
}