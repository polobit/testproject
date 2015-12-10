package com.campaignio.tasklets;

import org.json.JSONObject;

/**
 * <code>Tasklet</code> is the interface that provides required methods for each
 * node in a workflow. Each node in the workflow is considered as one tasklet in
 * back end. The tasklet of a node executes when that node includes in a
 * workflow.
 * 
 * @author Manohar
 */
public interface Tasklet
{
    /**
     * Builds tasklet in a workflow.
     * 
     * @param campaignJSONData
     *            campaign that runs at that instance.
     * @param subscriberJSON
     *            contact with which campaign subscribes.
     * @param data
     *            data that is used within the workflow.
     * @param nodeJSON
     *            node at that instance in a workflow.
     * @throws Exception
     *             if any exception occurs.
     */
    public void run(JSONObject campaignJSONData, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception;

    /**
     * Interrupts when an event happens. Tasklets such as Clicked generates
     * interrupted events like clicked.
     * 
     * @param campaignJSONData
     *            campaign that runs at that instance.
     * @param subscriberJSON
     *            contact with which campaign subscribes.
     * @param data
     *            data that is used within the workflow.
     * @param nodeJSON
     *            node at that instance in a workflow.
     * @param interruptCustomData
     *            data when interrupt occurs.
     * @throws Exception
     *             if any exception occurs.
     */
    public void interrupted(JSONObject campaignJSONData,
	    JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON,
	    JSONObject interruptCustomData) throws Exception;

    /**
     * Executes when task completes without any interruption. Tasklets such as
     * wait generates timeout if wait duration completes.
     * 
     * @param campaignJSONData
     *            campaign that runs at that instance.
     * @param subscriberJSON
     *            contact with which campaign subscribes.
     * @param data
     *            data that is used within the workflow.
     * @param nodeJSON
     *            node at that instance in a workflow.
     * @throws Exception
     *             if any exception occurs.
     */
    public void timeOutComplete(JSONObject campaignJSONData,
	    JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception;
}
