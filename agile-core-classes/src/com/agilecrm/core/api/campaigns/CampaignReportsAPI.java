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

import net.sf.json.JSONSerializer;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.email.bounce.EmailBounceStatus.EmailBounceType;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.util.DateUtil;
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
	    LinkedHashMap<String, LinkedHashMap<String, Integer>> campaignStatsData = CampaignReportsUtil
		    .getCampaignStatsData(null, null, null, null, campaignStatsArray);

	    return CampaignReportsUtil.replaceNamesInStats(campaignStatsData);
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in campaigns comparison " + e.getMessage());
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
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
    public String getEachCampaignStats(@PathParam("id") String campaignId, @QueryParam("start_time") String startTime,
	    @QueryParam("end_time") String endTime, @QueryParam("type") String type,
	    @QueryParam("time_zone") String timeZone)
    {
	try
	{
		String current_timezone = DateUtil.getCurrentUserTimezoneOffset();
		if (current_timezone != null)
		{
			timeZone = ""+(Long.valueOf(current_timezone)*-1);
		}
	    // start date in mysql date format.
	    String startDate = CampaignReportsUtil.getStartDate(startTime, endTime, type, timeZone);

	    // end date in mysql date format.
	    String endDate = CampaignReportsUtil.getEndDateForReports(endTime, timeZone);

	    // SQL data for campaign stats for given duration.
	    JSONArray emailLogs = CampaignReportsSQLUtil.getEachEmailCampaignStats(campaignId, startDate, endDate,
		    timeZone, type);

	    if (emailLogs == null)
		return null;

	    // Modified data required for graph of each campaign-stats.
	    LinkedHashMap<String, LinkedHashMap<String, Integer>> campaignStatsData = CampaignReportsUtil
		    .getEachCampaignStatsData(startTime, endTime, type, timeZone, emailLogs);
	    
	    String replacedCampaignStats = JSONSerializer.toJSON(campaignStatsData).toString().replace("EMAIL_SENT", "Email Sent")
			.replace("EMAIL_OPENED", "Unique Opens").replace("count", "Unique Clicks").replace("EMAIL_CLICKED", "Total Clicks");

	    return replacedCampaignStats;
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in each CampaignStats " + e.getMessage());
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}

    }

    @Path("/email/table-reports/{campaign-id}")
    @GET
    public String getEachCampaignStatsForTable(@PathParam("campaign-id") String campaignId,
	    @QueryParam("start_time") String startTime, @QueryParam("end_time") String endTime,
	    @QueryParam("time_zone") String timeZone)
    {
	try
	{
		String current_timezone = DateUtil.getCurrentUserTimezoneOffset();
		if (current_timezone != null)
		{
			timeZone = ""+(Long.valueOf(current_timezone)*-1);
		}
	    // start date in mysql date format.
	    String startDate = CampaignReportsUtil.getStartDate(startTime, endTime, null, timeZone);

	    // end date in mysql date format.
	    String endDate = CampaignReportsUtil.getEndDateForReports(endTime, timeZone);

	    JSONArray stats = CampaignReportsSQLUtil.getEachCampaignStatsForTable(campaignId, startDate, endDate,
		    timeZone, null);
	    
	    System.out.println("SQL Stats are..." + stats.toString());

	    // To show hardbounce and softbounce only for email sent campaigns
	    int statsLength = stats.length();

	    try
	    {
		// Hard Bounce data
		stats.put(new JSONObject().put("log_type", "HARD_BOUNCE").put(
			"total",
			statsLength != 0 ? ContactUtil.getEmailBouncedContactsCount(campaignId,
				EmailBounceType.HARD_BOUNCE, Long.parseLong(startTime) / 1000,
				Long.parseLong(endTime) / 1000) : 0));

		// Soft Bounce Data
		stats.put(new JSONObject().put("log_type", "SOFT_BOUNCE").put(
			"total",
			statsLength != 0 ? ContactUtil.getEmailBouncedContactsCount(campaignId,
				EmailBounceType.SOFT_BOUNCE, Long.parseLong(startTime) / 1000,
				Long.parseLong(endTime) / 1000) : 0));

		// Soft Bounce Data
		stats.put(new JSONObject().put("log_type", "SPAM").put(
			"total",
			statsLength != 0 ? ContactUtil.getEmailBouncedContactsCount(campaignId, EmailBounceType.SPAM,
				Long.parseLong(startTime) / 1000, Long.parseLong(endTime) / 1000) : 0));
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
		System.err.println("Exception occured while retrieving bounced stats from datastore..."
			+ e.getMessage());
	    }

	    JSONObject statsJSON = new JSONObject();

	    // Add log_type as key and its count as value
	    for (int i = 0, len = stats.length(); i < len; i++)
	    {
		JSONObject json = stats.getJSONObject(i);

		if (json.getString("log_type").equals("EMAIL_CLICKED"))
		    statsJSON.put("unique_clicks", json.getString("count"));
		
		if (json.getString("log_type").equals("EMAIL_OPENED"))
		    statsJSON.put("unique_opened", json.getString("count"));
		
		if (json.getString("log_type").equals("EMAIL_SENDING_SKIPPED"))
		    statsJSON.put("skipped", json.getString("count"));

		statsJSON.put(stats.getJSONObject(i).getString("log_type"), stats.getJSONObject(i).getInt("total"));
	    }

	    System.out.println("stats JSON is " + statsJSON);

	    return statsJSON.toString().replace("EMAIL_SENT", "sent").replace("EMAIL_OPENED", "opened")
		    .replace("EMAIL_CLICKED", "clicks").replace("UNSUBSCRIBED", "unsubscribed")
		    .replace("HARD_BOUNCE", "hard_bounce").replace("SOFT_BOUNCE", "soft_bounce")
		    .replace("EMAIL_SENDING_SKIPPED", "skipped").replace("SPAM", "spam");
	}
	catch (Exception e)
	{
	    System.err.println("Exception occurred while getting campaign stats... " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
    }
    
    @Path("/log-type/count")
    @GET
    public String getCountByLogType(@QueryParam("start_time") String startTime, @QueryParam("end_time") String endTime,
	    @QueryParam("time_zone") String timeZone)
    {
    	 // start date in mysql date format.
	    String startDate = CampaignReportsUtil.getStartDate(startTime, endTime, null, timeZone);

	    // end date in mysql date format.
	    String endDate = CampaignReportsUtil.getEndDateForReports(endTime, timeZone);

	    String [] array = {"EMAIL_SENT", "EMAIL_OPENED", "EMAIL_CLICKED"};
	    
	    JSONArray countJSON = CampaignReportsSQLUtil.getCountByLogTypes(startDate, endDate, timeZone, array);
	    
	    if(countJSON == null)
	    	return null;
	    
	    return countJSON.toString();
	    			
    }
}
