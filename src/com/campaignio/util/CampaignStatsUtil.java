package com.campaignio.util;

import java.util.List;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.CampaignStats;

/**
 * <code>CampaignStatsUtil</code> is the utility class for CampaignStats. It
 * fetches CampaignStats based on campaign id. Sets default values of emails
 * sent, clicked and opened to zero. Increment emails sent, clicked and opened.
 * 
 * @author Naresh
 * 
 */
public class CampaignStatsUtil
{
    /**
     * CampaignStats Dao.
     */
    private static ObjectifyGenericDao<CampaignStats> dao = new ObjectifyGenericDao<CampaignStats>(
	    CampaignStats.class);

    /**
     * Returns list of all CampaignStats
     * 
     * @return CampaignStats List
     */
    public static List<CampaignStats> getAllCampaignStats()
    {
	return dao.fetchAll();
    }

    /**
     * Returns CampaignStats based on campaign-id. If campaign-id is null, then
     * it returns default CampaignStats.
     * 
     * @param campaignId
     *            - CampaignId
     * @return CampaignStats.
     */
    public static CampaignStats getCampaignStatsByCampaignId(Long campaignId)
    {
	// Verify whether campaign exists
	Workflow workflow = WorkflowUtil.getWorkflow(campaignId);

	if (workflow == null)
	    return null;

	CampaignStats campaignStats = dao.getByProperty("campaign_id",
		campaignId);

	if (campaignStats == null)
	    return null;

	return campaignStats;
    }

    /**
     * Returns CampaignStats with default values.
     * 
     * @param campaignId
     *            - CampaignId.
     * @return Default CampaignStats
     */
    private static CampaignStats getDefaultCampaignStats(Long campaignId)
    {
	CampaignStats campaignStats = new CampaignStats(campaignId, 0, 0, 0);
	return campaignStats;
    }

    /**
     * Increment Emails clicked based on campaign id.
     * 
     * @param campaignId
     *            - Campaign Id.
     */
    public static void incrementEmailsClicked(String campaignId)
    {
	CampaignStats campaignStats = getCampaignStatsByCampaignId(Long
		.parseLong(campaignId));

	if (campaignStats == null)
	    return;

	campaignStats.emails_clicked++;
	campaignStats.save();
    }

    /**
     * Increment Emails sent based on campaign Id.
     * 
     * @param campaignId
     *            - Campaign Id.
     */
    public static void incrementEmailsSent(String campaignId)
    {
	CampaignStats campaignStats = getCampaignStatsByCampaignId(Long
		.parseLong(campaignId));

	if (campaignStats == null)
	    return;

	campaignStats.emails_sent++;
	campaignStats.save();
    }

    /**
     * Increment Emails opened based on campaign Id.
     * 
     * @param campaignId
     *            - CampaignId.
     */
    public static void incrementEmailsOpened(String campaignId)
    {
	CampaignStats campaignStats = getCampaignStatsByCampaignId(Long
		.parseLong(campaignId));

	if (campaignStats == null)
	    return;

	campaignStats.emails_opened++;
	campaignStats.save();
    }

    /**
     * Delete Campaign Stats based on campaignId.
     * 
     * @param campaignId
     *            - Campaign Id.
     */
    public static void deleteCampaignStatsByCampaignId(String campaignId)
    {
	CampaignStats stats = CampaignStatsUtil
		.getCampaignStatsByCampaignId(Long.parseLong(campaignId));

	if (stats == null)
	    return;

	dao.delete(stats);
    }
}
