package com.agilecrm.core.api.campaigns;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.campaignio.CampaignStats;
import com.campaignio.util.CampaignStatsUtil;

/**
 * <code>CampaignStatsAPI</code> includes REST calls to interact with
 * {@link CampaignStats} class inorder to fetch CampaignStats with respect to
 * campaignId.
 * 
 * @author Naresh
 * 
 */
@Path("/api/campaign-stats")
public class CampaignStatsAPI
{
    /**
     * Returns all campaignstats.
     * 
     * @return CampaignStats list.
     */
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<CampaignStats> getCampaignStats()
    {
	return CampaignStatsUtil.getAllCampaignStats();
    }

    /**
     * Returns CampaignStats with respect to CampaignId.
     * 
     * @param campaignId
     *            - Campaign Id.
     * @return CampaignStats
     */
    @Path("details/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public CampaignStats getCampaignStat(@PathParam("id") Long campaignId)
    {
	return CampaignStatsUtil.getCampaignStatsByCampaignId(campaignId);
    }

    /**
     * Returns all available campaign-stats for generating bar graph.
     * 
     * @return campaign-stats json string.
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Path("/stats")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getCampaignStatsForGraph() throws Exception
    {
	List<CampaignStats> CampaignStats = CampaignStatsUtil.getAllCampaignStats();

	// Send a JSONArray with campaign name and values for each
	// Add campaign name, emails sent, emails opened and emails clicked
	JSONObject campaignStatsJSONArray = new JSONObject();

	for (CampaignStats campaignStats : CampaignStats)
	{
	    if (campaignStats == null)
		continue;

	    // Init the stats JSON
	    JSONObject statsJSON = new JSONObject();
	    statsJSON.put("Emails Opened", campaignStats.emails_opened);
	    statsJSON.put("Emails Sent", campaignStats.emails_sent);
	    statsJSON.put("Emails Clicked", campaignStats.emails_clicked);

	    // Put the campaign name and stats JSON
	    campaignStatsJSONArray.put(campaignStats.getCampaign(), statsJSON);

	}

	return campaignStatsJSONArray.toString();

    }
}
