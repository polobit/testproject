package com.agilecrm.workflows.util;

import java.util.List;

import org.json.JSONObject;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.Workflow;
import com.campaignio.tasklets.util.TaskletUtil;

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
	    campaignJSON.put("name", workflow.name);
	    return campaignJSON;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Unsubscribe a contact into a campaign.
     */
    public static void unsubscribe()
    {

    }

    /**
     * Returns campaignName with respect to campaign-id.
     * 
     * @param campaignId
     *            - Campaign Id.
     * @return String
     */
    public static String getCampaignName(String campaignId)
    {
	if (campaignId == null)
	    return null;

	Workflow workflow = getWorkflow(Long.parseLong(campaignId));

	if (workflow != null)
	    return workflow.name;

	return "?";
    }
}