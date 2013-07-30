package com.agilecrm.workflows.util;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.workflows.Workflow;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.deferred.TaskletWorkflowDeferredTask;
import com.campaignio.tasklets.util.TaskletUtil;
import com.campaignio.twitter.util.TwitterQueueUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;

/**
 * <code>WorkflowUtil</code> provides various static methods to convert contact
 * and workflow objects into json objects. WorkflowUtil class uses
 * {@link TaskletUtil} to run campaign with contact.
 * <p>
 * <code>WorkflowUtil</code> is used whenever single contact or bulk contacts
 * are subscribed to campaign. It subscribes contacts to campaigns and runs
 * campaign with the contact details. WorkflowUtil class is used for triggers
 * too. Whenever trigger fires, trigger calls WorkflowUtil class to run the
 * campaign.
 * </p>
 * 
 * @author Manohar
 * 
 */
public class WorkflowUtil
{
    /**
     * Initialize DataAccessObject.
     */
    private static ObjectifyGenericDao<Workflow> dao = new ObjectifyGenericDao<Workflow>(Workflow.class);

    /**
     * Locates workflow based on id.
     * 
     * @param id
     *            Workflow id.
     * @return workflow object with that id if exists, otherwise null.
     */
    public static Workflow getWorkflow(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Returns all workflows as a collection list.
     * 
     * @return list of all workflows.
     */
    public static List<Workflow> getAllWorkflows()
    {
	return dao.fetchAll();
    }

    /**
     * Returns list of workflows based on page size.
     * 
     * @param max
     *            Maximum number of workflows list based on page size query
     *            param.
     * @param cursor
     *            Cursor string that points the list that exceeds page_size.
     * @return Returns list of workflows with respective to page size and
     *         cursor.
     */
    public static List<Workflow> getAllWorkflows(int max, String cursor)
    {
	return dao.fetchAll(max, cursor);
    }

    /**
     * Converts contact object into json object.
     * 
     * @param contact
     *            Contact object that subscribes to workflow.
     * @return JsonObject of contact.
     */
    public static JSONObject getSubscriberJSON(Contact contact)
    {
	if (contact == null)
	    return null;

	try
	{
	    JSONObject subscriberJSON = new JSONObject();

	    List<ContactField> properties = contact.getProperties();

	    for (ContactField field : properties)
	    {
		if (field.name != null && field.value != null)
		{
		    // Gets twitter-id from website property
		    if (field.name.equals("website") && field.subtype.equals("TWITTER"))
			field.name = "twitter_id";

		    subscriberJSON.put(field.name, field.value);
		}
	    }

	    // Get contact owner.
	    DomainUser domainUser = contact.getOwner();
	    JSONObject owner = new JSONObject();

	    if (domainUser != null)
	    {
		owner.put("name", contact.getOwner().name);
		owner.put("email", contact.getOwner().email);
	    }

	    // Inserts contact owner-name and owner-email.
	    subscriberJSON.put("owner", owner);

	    System.out.println("SubscriberJSON in WorkflowUtil: " + subscriberJSON);

	    // Add Id and data
	    return new JSONObject().put("data", subscriberJSON).put("id", contact.id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Converts list of contacts into JSONArray.
     * 
     * @param contacts
     *            List of Contact objects subscribed to campaign.
     * @return JSONArray of list of contacts.
     */
    static JSONArray convertContactIntoJSON(List<Contact> contacts)
    {
	JSONArray subscriberJSONArray = new JSONArray();

	for (Contact contact : contacts)
	{
	    subscriberJSONArray.put(getSubscriberJSON(contact));
	}

	return subscriberJSONArray;
    }

    /**
     * Converts workflow object into json object.
     * 
     * @param workflowId
     *            Id of a workflow.
     * @return JSONObject of campaign.
     */
    public static JSONObject getWorkflowJSON(Long workflowId)
    {
	try
	{
	    // Get Workflow JSON
	    Workflow workflow = getWorkflow(workflowId);

	    if (workflow == null)
		return null;

	    // Campaign JSON
	    JSONObject campaignJSON = new JSONObject();
	    JSONObject workflowJSON = new JSONObject(workflow.rules);

	    campaignJSON.put(TaskletUtil.CAMPAIGN_WORKFLOW_JSON, workflowJSON);
	    campaignJSON.put("id", workflow.id);
	    campaignJSON.put("domainUserId", workflow.getDomainUserId());

	    return campaignJSON;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Subscribe list of contacts into a campaign and runs workflow in
     * {@link TaskletUtil} executeCampaign method which runs using DeferredTask
     * to execute workflow.
     * 
     * @param contacts
     *            List of contact objects subscribe to campaign.
     * @param workflowId
     *            Id of a workflow.
     */
    public static void subscribeDeferred(List<Contact> contacts, Long workflowId)
    {
	// Convert Contacts into JSON Array
	JSONArray subscriberJSONArray = convertContactIntoJSON(contacts);

	// Get Campaign JSON
	JSONObject campaignJSON = getWorkflowJSON(workflowId);
	if (campaignJSON == null)
	    return;

	TaskletUtil.executeCampaign(campaignJSON, subscriberJSONArray);
    }

    /**
     * Subscribe a single contact into a campaign and runs deferred task to
     * execute workflow.
     * 
     * @param contact
     *            Contact object subscribed to workflow.
     * @param workflowId
     *            Id of a workflow.
     */
    public static void subscribe(Contact contact, Long workflowId)
    {
	try
	{
	    // Convert Contacts into JSON Array
	    JSONObject subscriberJSONObject = getSubscriberJSON(contact);

	    // TaskletUtil.executeWorkflow(campaignJSON, subscriberJSONObject);

	    TaskletWorkflowDeferredTask taskletWorkflowDeferredTask = new TaskletWorkflowDeferredTask(workflowId.toString(), subscriberJSONObject.toString());
	    Queue queue = QueueFactory.getQueue("campaign-queue");
	    queue.add(TaskOptions.Builder.withPayload(taskletWorkflowDeferredTask));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Deletes Campaign Stats, Cron Tasks related to campaigns that are selected
     * for delete.
     * 
     * @param campaignIds
     *            - Campaign Id of deleted campaign.
     */
    public static void deleteRelatedEntities(JSONArray campaignIds)
    {
	String campaignId = "";
	String namespace = NamespaceManager.get();

	for (int i = 0; i < campaignIds.length(); i++)
	{
	    try
	    {
		campaignId = campaignIds.getString(i);
		// System.out.println("CampaignId " + campaignId);
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }

	    // Deletes Related Crons.
	    CronUtil.removeTask(campaignId, null);

	    // Deletes logs of workflow
	    LogUtil.deleteSQLLogs(campaignId, null);

	    // Deletes twitter-jobs of campaign
	    TwitterQueueUtil.removeTwitterJobs(campaignId, null, namespace);
	}
    }

    /**
     * Unsubscribe a contact into a campaign.
     */
    public static void unsubscribe()
    {

    }

    public static List<Workflow> getWorkflowsRelatedToCurrentUser(String page_size)
    {
	System.out.println("owner id : " + SessionManager.get().getDomainId());
	return dao.ofy().query(Workflow.class).filter("creator_key", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
		.order("-created_time").limit(Integer.parseInt(page_size)).list();
    }
}