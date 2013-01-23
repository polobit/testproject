package com.agilecrm.core.api.campaigns;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

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
    @Path("{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public CampaignStats getCampaignStat(@PathParam("id") Long campaignId)
    {
	return CampaignStatsUtil.getCampaignStatsByCampaignId(campaignId);
    }
}
