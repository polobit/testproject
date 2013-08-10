package com.agilecrm.core.api.campaigns;

import java.util.LinkedHashMap;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;

import com.campaignio.reports.CampaignReportsSQLUtil;
import com.campaignio.reports.CampaignReportsUtil;

/**
 * <code>CampaignReportsAPI</code> includes REST calls to interact with SQL to
 * fetch data required for campaign reports. It handles to fetches data for each
 * campaign to show campaign-reports. It also handles to fetch data inorder to
 * compare all available campaigns.
 * 
 * @author Naresh
 * 
 */
@Path("/api/campaign-stats")
public class CampaignReportsAPI
{
    /**
     * Returns all available campaign-stats for generating bar graph. It fetches
     * the data of all campaigns for comparison.
     * 
     * @return String.
     */
    @Path("/stats")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getAllCampaignStats() throws Exception
    {
	try
	{
	    // SQL data for Campaigns Comparison
	    JSONArray campaignStatsArray = CampaignReportsSQLUtil.getAllEmailCampaignStats();

	    if (campaignStatsArray == null)
		return null;

	    // Modified data required for graph of Campaigns Comparison
	    LinkedHashMap<String, LinkedHashMap<String, Integer>> campaignStatsData = CampaignReportsUtil.getCampaignStatsData(null, null, null, null,
		    campaignStatsArray);

	    return CampaignReportsUtil.replaceNamesInStats(campaignStatsData);
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in campaigns comparison " + e.getMessage());
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
	}
    }

    /**
     * CampaignReports based on each campaign. Returns json-array data required
     * for generating graphs.
     * 
     * @param campaignId
     *            - Campaign Id.
     * @param startTime
     *            - Start Time.
     * @param endTime
     *            - EndTime.
     * @param type
     *            - day, hour or date
     * @param timeZone
     *            - client timezone.
     * @return email-stats json string
     * */
    @Path("/email/reports/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getEachCampaignStats(@PathParam("id") String campaignId, @QueryParam("start_time") String startTime, @QueryParam("end_time") String endTime,
	    @QueryParam("type") String type, @QueryParam("time_zone") String timeZone)
    {
	try
	{
	    // start date in mysql date format.
	    String startDate = CampaignReportsUtil.getStartDate(startTime, endTime, type, timeZone);

	    // end date in mysql date format.
	    String endDate = CampaignReportsUtil.getEndDate(endTime, timeZone);

	    // SQL data for campaign stats for given duration.
	    JSONArray emailLogs = CampaignReportsSQLUtil.getEachEmailCampaignStats(campaignId, startDate, endDate, timeZone, type);

	    if (emailLogs == null)
		return null;

	    // Modified data required for graph of each campaign-stats.
	    LinkedHashMap<String, LinkedHashMap<String, Integer>> campaignStatsData = CampaignReportsUtil.getCampaignStatsData(startTime, endTime, type,
		    timeZone, emailLogs);

	    return CampaignReportsUtil.replaceNamesInStats(campaignStatsData);
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in each CampaignStats " + e.getMessage());
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
	}

    }
}
