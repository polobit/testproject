package com.formio.reports;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.SerializationUtils;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;

import com.agilecrm.AgileQueues;
import com.agilecrm.db.GoogleSQL;
import com.agilecrm.mandrill.util.deferred.LogDeferredTask;
import com.agilecrm.queues.backend.ModuleUtil;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.wrapper.LogWrapper;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTaskContext;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskHandle;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.utils.SystemProperty;
import com.formio.reports.FormlogDeferredTask;

/**
 * <code>FormLogUtil</code> class adds logs with respect to forms
 * 
 * @author Poulami
 * 
 */
public class FormLogUtil
{
    /**
     * Adds form-log to Google-SQL. It gets domain and logTime to add them to
     * table.
     * 
     * @param formId
     *            - form Id.
     * @param emailId
     *          - email Id 
     */
    public static void addLogToSQL(String formId, String emailId)
    {
	String domain = NamespaceManager.get();

	// For localhost
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
	    domain = "localhost";

	if (StringUtils.isEmpty(domain) || StringUtils.isEmpty(formId))
	    return;

	FormlogDeferredTask formTask = new FormlogDeferredTask(formId, emailId, domain);
	// Add to queue
	Queue queue = QueueFactory.getQueue(AgileQueues.CAMPAIGN_LOG_QUEUE);
	queue.add(TaskOptions.Builder.withPayload(formTask));
	System.out.println("task added to queue");

    }

    //
}