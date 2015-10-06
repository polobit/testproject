package com.agilecrm.ticket.macros;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class TicketMacroTaskCore
{

	/**
	 * Start Node Id.It is fixed and unique.
	 */
	public static final String START_NODE_ID = "PBXNODE1";

	/**
	 * Hang-up node Id is used to identify end of macro task flow that there is
	 * no further node to execute in a macro task flow.
	 */
	public static final String HANGUP_NODE_ID = "hangup";

	/**
	 * Default Branch value is Yes.
	 */
	static final String DEFAULT_NEXT_NODE_BRANCH_DATA = "yes";

	/**
	 * Default Branch value is Yes.
	 */
	static final String ACTION_NODES = "actions";

	/**
	 * Tasklet class name
	 */
	public static final String MACRO_TASKLET_CLASS_NAME = "macro_tasklet_class_name";

	/**
	 * Nodes that are included in a macro.
	 */
	public static final String MACRO_NODE_DEFINITION = "NodeDefinition";

	/**
	 * Executes task for single ticket starting with Start node.
	 * 
	 * @throws Exception
	 */

	public static void executeMacroTasks(JSONObject macroJSON, JSONObject ticketJSON) throws Exception
	{
		executeMacroTasklet(macroJSON, ticketJSON, null, null);
	}

	/**
	 * Execute task by fetching next node from current node id and branch
	 * 
	 * @param macroJSON
	 * @param ticketJSON
	 * @param currentNodeJSON
	 * @param branch
	 * @throws Exception
	 */
	public static void executeMacroTasklet(JSONObject macroJSON, JSONObject ticketJSON, JSONObject currentNodeJSON,
			String branch) throws Exception
	{
		if (macroJSON == null || ticketJSON == null)
			return;

		// Get next node
		String nextNodeId = getNextNodeId(currentNodeJSON, branch);

		if (nextNodeId == null || nextNodeId.equalsIgnoreCase(HANGUP_NODE_ID))
			return;

		// Get Node JSON
		JSONObject nextNodeJSON = getNodeJSON(macroJSON, nextNodeId);
		if (nextNodeJSON == null)
			return;

		// Get Tasklet
		MacroTasklet macroTasklet = getMacroTasklet(nextNodeJSON);
		if (macroTasklet == null)
			return;

		System.out.println("Executing current macro task - " + getMacroNodeDefinitionValue(nextNodeJSON, "name"));

		// Run task
		macroTasklet.run(macroJSON, ticketJSON, nextNodeJSON);

	}

	/**
	 * Get node json from node id
	 * 
	 * @param macroJSON
	 * @param nodeId
	 * @return
	 * @throws JSONException
	 */
	private static JSONObject getNodeJSON(JSONObject macroJSON, String nodeId) throws JSONException
	{

		// Get action JSON
		if (!macroJSON.has(ACTION_NODES))
			return null;

		JSONObject workflowJSON = macroJSON.getJSONObject(ACTION_NODES);

		// Iterate through all keys and find if it matches currentNodeId

		// Get the total Arrays (Nodes) present in that object
		JSONArray nodes = workflowJSON.getJSONArray("nodes");

		// Read the actions
		for (int i = 0; i < nodes.length(); i++)
		{

			// Get the each node data
			JSONObject eachNodeData = nodes.getJSONObject(i);

			// Get the NodeId
			String formId = eachNodeData.getString("id");

			// check whether the currentNodeID is same as the formId
			if (nodeId.equalsIgnoreCase(formId))
				return eachNodeData;
		}

		return null;

	}

	/**
	 * Get next node from current node and branch, If currentnode is empty treat
	 * as first node(Start)
	 * 
	 * @param currentNodeJSON
	 * @param branch
	 * @return
	 * @throws JSONException
	 */
	private static String getNextNodeId(JSONObject currentNodeJSON, String branch) throws JSONException
	{

		// Assign to Start
		if (currentNodeJSON == null)
			return START_NODE_ID;

		// Default Branch is Yes
		if (branch == null)
			branch = DEFAULT_NEXT_NODE_BRANCH_DATA;

		/**
		 * Get next node id
		 */
		// Get the States
		JSONArray states = currentNodeJSON.getJSONArray("States");

		// Read the JSON for states
		for (int i = 0; i < states.length(); i++)
		{
			JSONObject eachStateJSON = states.getJSONObject(i);

			if (eachStateJSON.has(branch))
				return (String) eachStateJSON.getString(branch);

		}

		return null;

	}

	/**
	 * Gets tasklet object.
	 * 
	 * @param nodeJSON
	 * @return MacroTasklet
	 * @throws Exception
	 */
	public static MacroTasklet getMacroTasklet(JSONObject nodeJSON) throws Exception
	{
		// Get Name from nodeJSON
		String className = getMacroNodeDefinitionValue(nodeJSON, MACRO_TASKLET_CLASS_NAME);

		if (className == null)
			throw new Exception("Cannot find tasklet class name " + nodeJSON);

		className = "agilecrm.ticket.macros.tasklet." + className;

		// get the Class object for the classname.
		Class taskletClass = Class.forName(className);

		return (MacroTasklet) taskletClass.newInstance();
	}

	/**
	 * Returns associated value with the key in current node.
	 * 
	 * @param nodeJSON
	 *            current node in a macro.
	 * @param key
	 *            key to get associated value in Nodedefinition json.
	 * @return the value associated with the key.
	 * @throws Exception
	 */
	public static String getMacroNodeDefinitionValue(JSONObject nodeJSON, String key) throws Exception
	{
		// Get Name
		if (!nodeJSON.has(MACRO_NODE_DEFINITION))
			throw new Exception("Node Definition Missing" + nodeJSON);

		JSONObject nodeDefinitionJSON = nodeJSON.getJSONObject(MACRO_NODE_DEFINITION);

		if (!nodeDefinitionJSON.has(key))
			return null;

		return nodeDefinitionJSON.getString(key);
	}
}
