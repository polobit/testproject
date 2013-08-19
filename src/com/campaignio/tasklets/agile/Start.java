package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.workflows.status.CampaignStatus.Status;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
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
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Set campaign-status as campaignId-ACTIVE.
	CampaignStatusUtil.setStatusOfCampaign(AgileTaskletUtil.getId(subscriberJSON), AgileTaskletUtil.getId(campaignJSON),
		AgileTaskletUtil.getId(campaignJSON) + "-" + Status.ACTIVE);

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, "start");
    }
}