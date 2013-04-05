package com.agilecrm.core.api.campaigns;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.campaignio.CampaignStats;
import com.campaignio.util.CampaignStatsUtil;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

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

    /**
     * Returns all available campaign-stats for generating bar graph.
     * 
     * @return campaign-stats json string.
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Path("/stats")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getCampaignStatsForGraph()
    {
	List<CampaignStats> CampaignStats = CampaignStatsUtil
		.getAllCampaignStats();

	ArrayList<String> campaignNames = new ArrayList<String>();
	ArrayList emailsSent = new ArrayList();
	ArrayList emailsOpened = new ArrayList();
	ArrayList emailsClicked = new ArrayList();

	// Add campaign name, emails sent, emails opened and emails clicked
	for (CampaignStats campaignStats : CampaignStats)
	{
	    if (campaignStats == null)
		continue;

	    campaignNames.add(campaignStats.getCampaign());
	    emailsSent.add(campaignStats.emails_sent);
	    emailsOpened.add(campaignStats.emails_opened);
	    emailsClicked.add(campaignStats.emails_clicked);
	}

	JSONObject json = new JSONObject();

	try
	{
	    json.put("Campaign Names", campaignNames);
	    json.put("Emails Sent", emailsSent);
	    json.put("Emails Opened", emailsOpened);
	    json.put("Emails Clicked", emailsClicked);
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}

	System.out.println("campaign stats json string " + json.toString());

	return json.toString();

    }
}
