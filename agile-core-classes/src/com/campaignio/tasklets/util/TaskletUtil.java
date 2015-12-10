package com.campaignio.tasklets.util;

import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.workflows.status.CampaignStatus.Status;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.Tasklet;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;

/**
 * <code>TaskletUtil</code> class is the base class for campaigns. It can
 * execute campaigns for single subscriber or even for a list of subscribers. It
 * takes responsibility to execute all the nodes that are connected in a
 * workflow. Each node is taken as one tasklet. TaskletUtil executes all the
 * tasklets in a workflow in Top-Down approach starting from Start node. It gets
 * next node id from current node if connected in the workflow.
 * <p>
 * TaskletUtil uses DeferredTask when there are list of subscribers. It executes
 * workflow in deferredtask for each subscriber in a list.
 * </p>
 * 
 * @author Manohar
 * 
 */
public class TaskletUtil
{
	/**
	 * Start Node Id.It is fixed and unique.
	 */
	public static final String START_NODE_ID = "PBXNODE1";

	/**
	 * Hang-up node Id is used to identify end of workflow that there is no
	 * further node to execute in a workflow.
	 */
	public static final String HANGUP_NODE_ID = "hangup";

	/**
	 * Default Branch value is Yes.
	 */
	static final String DEFAULT_NEXT_NODE_BRANCH_DATA = "yes";

	/**
	 * Workflow id.
	 */
	public static String CAMPAIGN_WORKFLOW_ID = "workflow_id";

	/**
	 * Workflow data.
	 */
	public static final String CAMPAIGN_WORKFLOW_JSON = "workflow_json";
	public static final String CAMPAIGN_LIST_ID = "list_id";
	public static final String CAMPAIGN_LIST_JSON = "list_json";

	/**
	 * Nodes that are included in a workflow.
	 */
	public static final String WORKFLOW_NODE_DEFINITION = "NodeDefinition";

	/**
	 * Class name of a tasklet.
	 */
	public static final String WORKFLOW_TASKLET_CLASS_NAME = "workflow_tasklet_class_name";

	/**
	 * Keeps track of nodes in a workflow. It maps each workflow with number of
	 * nodes which have been already processed.
	 */
	public static final String HOPS_COUNT = "hop_count";

	public static final String _AGILE_CUSTOM_TRIGGER_JSON = "_agile_custom_trigger_json";

	/**
	 * Executes Tasklet.
	 * 
	 * @param campaignJSON
	 *            nodes that are connected in a workflow.
	 * @param subscriberJSON
	 *            contact details.
	 * @param data
	 *            data within the workflow.
	 * @param currentNodeJSON
	 *            current node in a workflow.
	 * @param branch
	 *            branch of a node. For e.g. Clicked node consists Yes and No
	 *            branches.
	 * @throws Exception
	 */
	public static void executeTasklet(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data,
			JSONObject currentNodeJSON, String branch) throws Exception
	{
		if (subscriberJSON == null)
			return;

		// reached maximum limit
		if (data != null && data.has(HOPS_COUNT))
			if ((int) data.get(HOPS_COUNT) > 101)
			{

				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"Subscriber removed from campaign after reaching maximum limit of 100 actions",
						LogType.CAMPAIGN_STOPPED.toString());
				return;
			}

		if (data == null)
			data = new JSONObject();

		String nextNode = "";

		// Assign to Start
		if (currentNodeJSON == null)
		{
			if (campaignJSON.has("is_disabled"))
			{
				if (campaignJSON.getBoolean("is_disabled"))
				{
					// Set status to REMOVED for disabled workflows
					System.out.println("Disabled campaign assigned");
					CampaignStatusUtil.setStatusOfCampaignWithName(AgileTaskletUtil.getId(subscriberJSON),
							AgileTaskletUtil.getId(campaignJSON),
							AgileTaskletUtil.getCampaignNameFromJSON(campaignJSON), Status.REMOVED);
					return;
				}
			}
			nextNode = START_NODE_ID;

			data = new JSONObject();

			// Add to data json
			JSONObject customTriggerJSON = TriggerUtil.getTriggerCustomJSON(subscriberJSON);

			if (customTriggerJSON != null)
				data = customTriggerJSON;

			// initialize count
			data.put(HOPS_COUNT, 0);

		}
		else
		{
			// Default Branch is Yes
			if (branch == null)
				branch = DEFAULT_NEXT_NODE_BRANCH_DATA;

			// Get Next Node Id in workflow
			nextNode = getNextNodeId(campaignJSON, currentNodeJSON, branch);

			// Check if it is hangup node - we are done.
			if (nextNode == null || nextNode.equalsIgnoreCase(HANGUP_NODE_ID))
			{
				System.out.println("Job Complete");

				// Records end-time of campaign and change status to
				// campaignId-DONE.
				CampaignStatusUtil.setStatusOfCampaign(AgileTaskletUtil.getId(subscriberJSON),
						AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getCampaignNameFromJSON(campaignJSON),
						Status.DONE);
				data.remove(HOPS_COUNT);
				return;
			}
		}

		// Get Node JSON
		JSONObject nodeJSON = getNodeJSON(campaignJSON, nextNode);

		// Get Tasklet
		Tasklet tasklet = getTasklet(nodeJSON);

		System.out.println("Executing Tasklet " + getNodeDefinitionValue(nodeJSON, "name"));

		// Execute tasklet
		if (tasklet != null)
		{
			// increment the current node count
			data.put(HOPS_COUNT, (int) data.get(HOPS_COUNT) + 1);

			tasklet.run(campaignJSON, subscriberJSON, data, nodeJSON);
		}
	}

	/**
	 * Gets tasklet object.
	 * 
	 * @param nodeJSON
	 *            current node in a workflow.
	 * @return Tasklet object.
	 * @throws Exception
	 */
	@SuppressWarnings("rawtypes")
	public static Tasklet getTasklet(JSONObject nodeJSON) throws Exception
	{
		// Get Name from nodeJSON
		String className = getNodeDefinitionValue(nodeJSON, WORKFLOW_TASKLET_CLASS_NAME);
		if (className == null)
			throw new Exception("Cannot find tasklet class name " + nodeJSON);

		// get the Class object for the classname.
		Class taskletClass = Class.forName(className);

		return (Tasklet) taskletClass.newInstance();
	}

	/**
	 * Returns associated value with the key in current node.
	 * 
	 * @param nodeJSON
	 *            current node in a workflow.
	 * @param key
	 *            key to get associated value in Nodedefinition json.
	 * @return the value associated with the key.
	 * @throws Exception
	 */
	public static String getNodeDefinitionValue(JSONObject nodeJSON, String key) throws Exception
	{
		// Get Name
		if (!nodeJSON.has(WORKFLOW_NODE_DEFINITION))
			throw new Exception("Node Definition Missing" + nodeJSON);

		JSONObject nodeDefinitionJSON = nodeJSON.getJSONObject(WORKFLOW_NODE_DEFINITION);

		if (!nodeDefinitionJSON.has(key))
			return null;

		return nodeDefinitionJSON.getString(key);
	}

	/**
	 * Gets next node id using branch key.
	 * 
	 * @param campaignJSON
	 *            The nodes that are connected in a workflow.
	 * @param currentNodeJSON
	 *            The current node in a workflow.
	 * @param branch
	 *            The branch of a current node.
	 * @return next node id of current node in a workflow.
	 * @throws Exception
	 */
	@SuppressWarnings("rawtypes")
	public static String getNextNodeId(JSONObject campaignJSON, JSONObject currentNodeJSON, String branch)
			throws Exception
	{
		// Get the States
		JSONArray states = currentNodeJSON.getJSONArray("States");

		// Read the JSON for states
		for (int i = 0; i < states.length(); i++)
		{
			JSONObject eachStateJSON = states.getJSONObject(i);

			Iterator it = eachStateJSON.keys();
			while (it.hasNext())
			{

				String key = (String) it.next();
				if (key.equalsIgnoreCase(branch))
					return (String) eachStateJSON.getString(key);
			}
		}

		return null;
	}

	/**
	 * Gets current node in a workflow.
	 * 
	 * @param campaignJSON
	 *            Nodes that are connected in a workflow.
	 * @param nodeId
	 *            Id of a particular node.
	 * @return json object with that nodeId in a workflow.
	 * @throws Exception
	 */
	public static JSONObject getNodeJSON(JSONObject campaignJSON, String nodeId) throws Exception
	{
		// Get Workflow Json

		if (!campaignJSON.has(CAMPAIGN_WORKFLOW_JSON))
			return null;

		JSONObject workflowJSON = campaignJSON.getJSONObject(CAMPAIGN_WORKFLOW_JSON);

		// Iterate through all keys and find if it matches currentNodeId

		// Get the total Arrays (Nodes) present in that object
		JSONArray nodes = workflowJSON.getJSONArray("nodes");

		// Read the workflow
		for (int i = 0; i < nodes.length(); i++)
		{

			// Get the each node data
			JSONObject nodedata = nodes.getJSONObject(i);

			// Get the NodeId
			String formId = nodedata.getString("id");

			// check whether the currentNodeID is same as the formId
			if (nodeId.equalsIgnoreCase(formId))
				return nodedata;
		}

		return null;
	}
}