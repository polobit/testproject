package com.agilecrm.mandrill.util;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang.SerializationUtils;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.mandrill.util.deferred.MandrillDeferredTask;
import com.agilecrm.util.HttpClientUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.backends.BackendServiceFactory;
import com.google.appengine.api.taskqueue.LeaseOptions;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskHandle;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;
import com.thirdparty.mandrill.Mandrill;
import com.thirdparty.mandrill.subaccounts.MandrillSubAccounts;

/**
 * <code>MandrillUtil</code> is the utility class for fetching tasks from pull
 * queue and process them. It constructs mail json to send bulk emails with
 * mandrill merge variables
 * 
 * @author Naresh
 * 
 */
public class MandrillUtil
{

    /**
     * Lease period of pull-queue tasks
     */
    public static final int LEASE_PERIOD = 500;

    /**
     * Limit to fetch pull-queue tasks. Max limit to fetch is 1000
     */
    public static final int COUNT_LIMIT = 500;

    /**
     * Mandrill merge vars surrounded by *| |*. Merge vars are case-insensitive.
     * 
     */
    public static enum MandrillMergeVars
    {
	SUBJECT, HTML_CONTENT, TEXT_CONTENT;

	public String getMergeVar()
	{
	    return "*|" + this.name() + "|*";
	}
    }

    /**
     * Adds tasks to pull queue
     * 
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @param to
     *            - to email
     * @param subject
     *            - email subject
     * @param replyTo
     *            - reply to
     * @param html
     *            - html content
     * @param text
     *            - text content
     */
    public static void sendMail(String fromEmail, String fromName, String to, String subject, String replyTo, String html, String text)
    {
	String subaccount = NamespaceManager.get();

	MandrillDeferredTask mandrillDeferredTask = new MandrillDeferredTask(subaccount, fromEmail, fromName, to, subject, replyTo, html, text);
	Queue queue = QueueFactory.getQueue("email-pull-queue");
	queue.addAsync(TaskOptions.Builder.withMethod(TaskOptions.Method.PULL).payload(mandrillDeferredTask).tag(fromEmail));
    }

    /**
     * Process all lease tasks of pull queue
     */
    public static void processAllTasks()
    {
	while (true)
	{
	    if (!MandrillUtil.processTasks())
		break;

	    System.out.println("Getting next " + COUNT_LIMIT + " tasks...");

	    continue;
	}

	return;

    }

    /**
     * Lease tasks from pull queue and execute them.
     * 
     * @return
     */
    public static boolean processTasks()
    {
	// Get tasks
	Queue q = QueueFactory.getQueue("email-pull-queue");

	List<TaskHandle> taskhandles = null;

	try
	{
	    taskhandles = q.leaseTasks(LeaseOptions.Builder.withLeasePeriod(LEASE_PERIOD, TimeUnit.SECONDS).countLimit(COUNT_LIMIT).groupByTag());
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while leasing tasks " + e.getMessage());
	}

	if (taskhandles == null || taskhandles.size() == 0)
	    return false;

	long start_time = System.currentTimeMillis();

	sendMandrillMails(taskhandles);

	long process_time = System.currentTimeMillis() - start_time;
	System.out.println("Processed time for all taskhandles is " + process_time);

	return true;

    }

    /**
     * Sends mails through mandrill. It constructs mail json with merge
     * variables and their content
     * 
     * @param tasks
     *            - pull queue leased tasks
     */
    public static void sendMandrillMails(List<TaskHandle> tasks)
    {
	TaskHandle firstTaskHandle = tasks.get(0);

	MandrillDeferredTask firstMandrillDefferedTask = (MandrillDeferredTask) SerializationUtils.deserialize(firstTaskHandle.getPayload());

	JSONObject mailJSON = getMandrillMailJSON(firstMandrillDefferedTask.subaccount, firstMandrillDefferedTask.fromEmail,
		firstMandrillDefferedTask.fromName, firstMandrillDefferedTask.replyTo);

	JSONArray mergeVarsArray = new JSONArray();
	JSONArray toArray = new JSONArray();

	try
	{
	    //
	    for (TaskHandle task : tasks)
	    {
		MandrillDeferredTask mandrillDeferredTask = (MandrillDeferredTask) SerializationUtils.deserialize(task.getPayload());

		// MergeVars
		mergeVarsArray
			.put(getEachMergeJSON(mandrillDeferredTask.to, mandrillDeferredTask.subject, mandrillDeferredTask.html, mandrillDeferredTask.text));

		// To array
		toArray.put(new JSONObject().put(Mandrill.MANDRILL_RECIPIENT_EMAIL, mandrillDeferredTask.to));
	    }

	    mailJSON.getJSONObject(Mandrill.MANDRILL_MESSAGE).put(Mandrill.MANDRILL_TO, toArray).put(Mandrill.MANDRILL_MERGE_VARS, mergeVarsArray)
		    .put(Mandrill.MANDRILL_MERGE, true).put(Mandrill.MANDRILL_PRESERVE_RECIPIENTS, false);
	}
	catch (Exception e)
	{
	    System.err.println("Got exception in createJSONandSend " + e.getMessage());
	    e.printStackTrace();
	}

	HttpClientUtil.accessPostURLUsingHttpClient(Mandrill.MANDRILL_API_POST_URL + Mandrill.MANDRILL_API_MESSAGE_CALL, mailJSON.toString());

	// Deletes pull queue tasks
	deleteTasks("email-pull-queue", tasks);
    }

    /**
     * Delete tasks of a queue
     * 
     * @param queue
     *            - queue name
     * @param tasks
     *            - tasks to delete
     */
    public static void deleteTasks(String queue, List<TaskHandle> tasks)
    {
	// Delete Tasks
	Queue q = QueueFactory.getQueue(queue);
	q.deleteTask(tasks);
    }

    /**
     * Process tasks in backend
     */
    public static void processTasksInBackend()
    {
	String url = BackendServiceFactory.getBackendService().getBackendAddress(Globals.BULK_ACTION_BACKENDS_URL);

	// Create Task and push it into Task Queue
	Queue queue = QueueFactory.getQueue("bulk-actions-queue");
	TaskOptions taskOptions = TaskOptions.Builder.withUrl("/backend-email-pull").header("Host", url).method(Method.POST);
	queue.addAsync(taskOptions);
    }

    /**
     * Returns constructed mail json to send through mandrill
     * 
     * @param subaccount
     *            - subaccount
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @return JSONObject
     */
    public static JSONObject getMandrillMailJSON(String subaccount, String fromEmail, String fromName, String replyTo)
    {
	try
	{
	    // Complete mail json to be sent
	    JSONObject mailJSON = Mandrill.setMandrillAPIKey(subaccount);

	    JSONObject messageJSON = getMessageJSON(subaccount, fromEmail, fromName, replyTo);
	    mailJSON.put(Mandrill.MANDRILL_MESSAGE, messageJSON);
	    mailJSON.put(Mandrill.MANDRILL_ASYNC, true);

	    return mailJSON;
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    /**
     * Returns message json with email fields
     * 
     * @param subaccount
     *            - subaccount
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @return messageJSON
     */
    public static JSONObject getMessageJSON(String subaccount, String fromEmail, String fromName, String replyTo)
    {
	JSONObject messageJSON = new JSONObject();

	try
	{
	    if (!StringUtils.isBlank(subaccount))
		messageJSON.put(MandrillSubAccounts.MANDRILL_SUBACCOUNT, subaccount);

	    messageJSON.put(Mandrill.MANDRILL_HTML, MandrillMergeVars.HTML_CONTENT.getMergeVar());

	    messageJSON.put(Mandrill.MANDRILL_TEXT, MandrillMergeVars.TEXT_CONTENT.getMergeVar());

	    messageJSON.put(Mandrill.MANDRILL_SUBJECT, MandrillMergeVars.SUBJECT.getMergeVar());

	    messageJSON.put(Mandrill.MANDRILL_HEADERS, new JSONObject().put(Mandrill.MANDRILL_REPLY_TO, replyTo));

	    messageJSON.put(Mandrill.MANDRILL_FROM_EMAIL, fromEmail);

	    messageJSON.put(Mandrill.MANDRILL_FROM_NAME, fromName);

	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}

	return messageJSON;

    }

    /**
     * Returns merge json having content for respective merge variable with
     * respect to recipient
     * 
     * @param to
     *            - recipient email
     * @param replyTo
     *            - replyTo email
     * @param subject
     *            - subject content
     * @param html
     *            - html content
     * @param text
     *            - text content
     * @return JSONObject
     */
    public static JSONObject getEachMergeJSON(String to, String subject, String html, String text)
    {
	JSONObject mergeJSON = new JSONObject();
	try
	{
	    mergeJSON.put(Mandrill.MANDRILL_MERGE_RCPT, to);
	    mergeJSON.put(Mandrill.MANDRILL_MERGE_RCPT_VARS, getVars(subject, html, text));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return mergeJSON;
    }

    /**
     * Returns merge vars array
     * 
     * @param replyTo
     * @param subject
     *            - subject content to replace subject merge variable
     * @param html
     *            - html content to replace
     * @param text
     *            - text content to replace
     * @return JSONArray of vars
     */
    public static JSONArray getVars(String subject, String html, String text)
    {
	JSONArray vars = new JSONArray();

	vars.put(getVarJSON(MandrillMergeVars.SUBJECT.toString(), subject));
	vars.put(getVarJSON(MandrillMergeVars.HTML_CONTENT.toString(), getHTML(html, text)));
	vars.put(getVarJSON(MandrillMergeVars.TEXT_CONTENT.toString(), text));

	return vars;
    }

    /**
     * Returns var json with merge variable and content
     * 
     * @param name
     *            - merge variable
     * @param value
     *            - content to replace
     * @return VarJSON
     */
    public static JSONObject getVarJSON(String name, String value)
    {
	JSONObject var = new JSONObject();

	try
	{
	    var.put(Mandrill.MANDRILL_MERGE_RCPT_VAR_NAME, name);
	    var.put(Mandrill.MANDRILL_MERGE_RCPT_VAR_CONTENT, value);
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}

	return var;
    }

    /**
     * Returns HTML if not empty, otherwise text
     * 
     * @param html
     *            - html body
     * @param text
     *            - text body
     * @return String
     * 
     */
    public static String getHTML(String html, String text)
    {
	// return html if not empty
	if (!StringUtils.isBlank(html))
	    return html;

	return convertTextIntoHtml(text);
    }

    /**
     * Returns text body replacing with br tags where necessary
     * 
     * @param text
     *            - text body
     * @return String
     */
    public static String convertTextIntoHtml(String text)
    {
	if (StringUtils.isBlank(text))
	    return text;

	return text.replaceAll("(\r\n|\n)", "<br>").replaceAll("((?<= ) | (?= ))", "&nbsp;");

    }

}