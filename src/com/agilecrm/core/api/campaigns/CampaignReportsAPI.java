package com.agilecrm.core.api.campaigns;

import java.util.Calendar;
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

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.campaignio.reports.CampaignReportsSQLUtil;
import com.campaignio.reports.CampaignReportsUtil;
import com.campaignio.reports.DateUtil;

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
    @SuppressWarnings("unchecked")
    @Path("/stats")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getAllCampaignStats() throws Exception
    {
	String type[] = { "EMAIL_SENT", "EMAIL_OPENED", "EMAIL_CLICKED", "total" };

	LinkedHashMap<String, Integer> emailStats = CampaignReportsUtil.getDefaultCountTable(type);

	LinkedHashMap<String, LinkedHashMap> campaignStats = new LinkedHashMap<String, LinkedHashMap>();

	JSONArray campaignStatsArray = CampaignReportsSQLUtil.getAllEmailCampaignStats();

	if (campaignStatsArray == null)
	    return null;

	for (int index = 0; index < campaignStatsArray.length(); index++)
	{
	    JSONObject emailStatsJSON = campaignStatsArray.getJSONObject(index);

	    emailStats.put(emailStatsJSON.getString("log_type"), Integer.parseInt(emailStatsJSON.getString("count")));

	    // since sql null returned is in string.
	    if (!emailStatsJSON.getString("total").equals("null"))
		emailStats.put("total", Integer.parseInt(emailStatsJSON.getString("total")));

	    if (campaignStats.containsKey(emailStatsJSON.getString("campaign_name")))
	    {
		// Categorize w.r.t campaign-names
		campaignStats.get(emailStatsJSON.getString("campaign_name")).put(emailStatsJSON.getString("log_type"),
			Integer.parseInt(emailStatsJSON.getString("count")));

		if (!emailStatsJSON.getString("total").equals("null"))
		    campaignStats.get(emailStatsJSON.getString("campaign_name")).put("total", Integer.parseInt(emailStatsJSON.getString("total")));
	    }

	    else
	    {
		campaignStats.put(emailStatsJSON.getString("campaign_name"), emailStats);
		emailStats = CampaignReportsUtil.getDefaultCountTable(type);
	    }
	}

	String campaignStatsString = JSONSerializer.toJSON(campaignStats).toString().replace("EMAIL_SENT", "Email Sent")
		.replace("EMAIL_OPENED", "Email Opened").replace("EMAIL_CLICKED", "Unique Clicks").replace("total", "Total Clicks");

	return campaignStatsString;
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
	String reportsString = "";
	try
	{
	    // Weekly
	    if (StringUtils.equalsIgnoreCase(type, "day"))
	    {
		Calendar calendar = Calendar.getInstance();
		calendar.setTimeInMillis(Long.parseLong(endTime));
		calendar.add(Calendar.DAY_OF_MONTH, -6);
		startTime = calendar.getTimeInMillis() + "";
	    }

	    Calendar endCal = Calendar.getInstance();
	    endCal.setTimeInMillis(Long.parseLong(endTime));
	    endCal.add(Calendar.HOUR, 23);
	    endCal.add(Calendar.MINUTE, 59);
	    endCal.add(Calendar.SECOND, 59);
	    endTime = endCal.getTimeInMillis() + "";

	    // Converts epoch time to "yyyy-MM-dd HH:mm:ss" and set timezone.
	    String startDate = DateUtil.getMySQLNowDateFormat(Long.parseLong(startTime), timeZone);

	    String endDate = DateUtil.getMySQLNowDateFormat(Long.parseLong(endTime), timeZone);

	    JSONArray emailLogs = CampaignReportsSQLUtil.getEachEmailCampaignStats(campaignId, startDate, endDate, timeZone, type);

	    if (emailLogs == null)
		return null;

	    System.out.println("Email logs: " + emailLogs);

	    String[] emailType = { "EMAIL_SENT", "EMAIL_OPENED", "EMAIL_CLICKED", "total" };

	    // Populate graph's x-axis with given date-range.
	    LinkedHashMap<String, LinkedHashMap<String, Integer>> dateHashtable = CampaignReportsUtil.getDefaultDateTable(startTime, endTime, type, timeZone,
		    emailType);

	    // Initialize values with 0
	    LinkedHashMap<String, Integer> statusTable = CampaignReportsUtil.getDefaultCountTable(emailType);

	    for (int index = 0; index < emailLogs.length(); index++)
	    {
		JSONObject logJSON = emailLogs.getJSONObject(index);

		statusTable.put(logJSON.getString("log_type"), Integer.parseInt(logJSON.getString("count")));

		// Since SQL 'NULL' is string.
		if (!logJSON.getString("total").equals("null"))
		{
		    // Get Total clicks.
		    statusTable.put("total", Integer.parseInt(logJSON.getString("total")));
		}

		// Insert status based on logDate.
		if (dateHashtable.containsKey(logJSON.getString("logDate")))
		{
		    dateHashtable.get(logJSON.getString("logDate")).put(logJSON.getString("log_type"), Integer.parseInt(logJSON.getString("count")));

		    if (!logJSON.getString("total").equals("null"))
		    {
			dateHashtable.get(logJSON.getString("logDate")).put("total", Integer.parseInt(logJSON.getString("total")));
		    }
		}
		else
		{
		    dateHashtable.put(logJSON.getString("logDate"), statusTable);
		}
	    }

	    reportsString = JSONSerializer.toJSON(dateHashtable).toString().replace("EMAIL_SENT", "Email Sent").replace("EMAIL_OPENED", "Email Opened")
		    .replace("EMAIL_CLICKED", "Unique Clicks").replace("total", "Total Clicks");

	    System.out.println("Sorted reports: " + reportsString);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
	}
	return reportsString;
    }
}
