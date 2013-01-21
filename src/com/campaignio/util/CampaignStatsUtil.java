package com.campaignio.util;

import com.agilecrm.db.ObjectifyGenericDao;
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
     * Returns CampaignStats based on campaign-id. If campaign-id is null, then
     * it returns default CampaignStats.
     * 
     * @param campaignId
     *            - CampaignId
     * @return CampaignStats.
     */
    public static CampaignStats getCampaignStatsByCampaignId(Long campaignId)
    {
	CampaignStats campaignStats = dao.getByProperty("campaignId",
		campaignId);

	if (campaignStats == null)
	    return getDefaultCampaignStats(campaignId);

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
	campaignStats.save();
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
	campaignStats.emailsClicked++;
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
	campaignStats.emailsSent++;
	campaignStats.save();
    }
}
