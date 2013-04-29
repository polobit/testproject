package com.campaignio.util;

import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;

/**
 * <code>CampaignStatsUtil</code> is the utility class for CampaignStats. It
 * fetches campaign-name based on campaign-id.
 * 
 * @author Naresh
 * 
 */
public class CampaignStatsUtil
{
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

	Workflow workflow = WorkflowUtil
		.getWorkflow(Long.parseLong(campaignId));

	if (workflow != null)
	    return workflow.name;

	return "?";
    }
}
