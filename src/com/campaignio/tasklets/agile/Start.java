package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.util.DBUtil;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>Start</code> represents Start node in a workflow. It is the starting
 * node in any workflow. Start class inherits the properties of
 * {@link TaskletAdapter} class. It makes use of {@link TaskletUtil} to execute
 * next one in a loop.
 * 
 * @author Manohar
 * 
 */
public class Start extends TaskletAdapter
{
    /*
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Set campaign-status as campaignId-ACTIVE.
	CampaignStatusUtil.setStatusOfCampaign(DBUtil.getId(subscriberJSON),
		DBUtil.getId(campaignJSON), DBUtil.getId(campaignJSON)
			+ "-ACTIVE");

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, "start");
    }
}
