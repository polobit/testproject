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

import com.agilecrm.db.util.EmailStatsUtil;
import com.campaignio.stats.util.CampaignStatsReportsUtil;
import com.campaignio.stats.util.DateUtil;
import com.campaignio.stats.util.EmailReportsUtil;

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
     * Returns all available campaign-stats for generating bar graph.
     * 
     * @return campaign-stats json string.
     */
    @SuppressWarnings("unchecked")
    @Path("/stats")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getCampaignStatsForGraph() throws Exception
    {
	String type[] = { "Send E-mail", "Email Opened", "Email Clicked",
		"total" };

	LinkedHashMap<String, Integer> emailStats = CampaignStatsReportsUtil
		.getDefaultCountTable(type);

	LinkedHashMap<String, LinkedHashMap> campaignStats = new LinkedHashMap<String, LinkedHashMap>();

	JSONArray campaignStatsArray = EmailStatsUtil
		.getAllEmailCampaignStats();

	if (campaignStatsArray == null)
	    return null;

	for (int index = 0; index < campaignStatsArray.length(); index++)
	{
	    JSONObject emailStatsJSON = campaignStatsArray.getJSONObject(index);

	    emailStats.put(emailStatsJSON.getString("log_type"),
		    Integer.parseInt(emailStatsJSON.getString("count")));

	    // since sql null returned is in string.
	    if (!emailStatsJSON.getString("total").equals("null"))
		emailStats.put("total",
			Integer.parseInt(emailStatsJSON.getString("total")));

	    if (campaignStats.containsKey(emailStatsJSON
		    .getString("campaign_name")))
	    {
		// Categorize w.r.t campaign-names
		campaignStats.get(emailStatsJSON.getString("campaign_name"))
			.put(emailStatsJSON.getString("log_type"),
				Integer.parseInt(emailStatsJSON
					.getString("count")));

		if (!emailStatsJSON.getString("total").equals("null"))
		    campaignStats
			    .get(emailStatsJSON.getString("campaign_name"))
			    .put("total",
				    Integer.parseInt(emailStatsJSON
					    .getString("total")));
	    }

	    else
	    {
		campaignStats.put(emailStatsJSON.getString("campaign_name"),
			emailStats);
		emailStats = CampaignStatsReportsUtil
			.getDefaultCountTable(type);
	    }
	}

	String campaignStatsString = JSONSerializer.toJSON(campaignStats)
		.toString().replace("Send E-mail", "Email Sent")
		.replace("Email Opened", "Email Opened")
		.replace("Email Clicked", "Unique Clicks")
		.replace("total", "Total Clicks");

	return campaignStatsString;
    }

    /**
     * Returns JSON String of data required for graphs.
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
    @SuppressWarnings("unchecked")
    @Path("/email/reports/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getEmailReports(@PathParam("id") String campaignId,
	    @QueryParam("start_time") String startTime,
	    @QueryParam("end_time") String endTime,
	    @QueryParam("type") String type,
	    @QueryParam("time_zone") String timeZone)
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
	    // Hourly
	    else if (StringUtils.equalsIgnoreCase(type, "hour"))
	    {
		Calendar calendar = Calendar.getInstance();
		calendar.setTimeInMillis(Long.parseLong(endTime));
		startTime = calendar.getTimeInMillis() + "";
	    }

	    Calendar endCal = Calendar.getInstance();
	    endCal.setTimeInMillis(Long.parseLong(endTime));
	    endCal.add(Calendar.HOUR, 23);
	    endCal.add(Calendar.MINUTE, 59);
	    endCal.add(Calendar.SECOND, 59);
	    endTime = endCal.getTimeInMillis() + "";

	    // Converts epoch time to "yyyy-MM-dd HH:mm:ss" and set timezone.
	    String startDate = DateUtil.getMySQLNowDateFormat(
		    Long.parseLong(startTime), timeZone);

	    String endDate = DateUtil.getMySQLNowDateFormat(
		    Long.parseLong(endTime), timeZone);

	    JSONArray emailLogs = EmailStatsUtil.getEmailCampaignStats(
		    campaignId, startDate, endDate, timeZone, type);

	    if (emailLogs == null)
		return null;

	    System.out.println("Email logs: " + emailLogs);

	    String[] emailType = { "Send E-mail", "Email Opened",
		    "Email Clicked", "total" };

	    // Populate graph's x-axis with given date-range.
	    LinkedHashMap<String, LinkedHashMap> dateHashtable = EmailReportsUtil
		    .getDefaultDateTable(startTime, endTime, type, timeZone,
			    emailType);

	    // Initialize values with 0
	    LinkedHashMap<String, Integer> statusTable = CampaignStatsReportsUtil
		    .getDefaultCountTable(emailType);

	    for (int index = 0; index < emailLogs.length(); index++)
	    {
		JSONObject logJSON = emailLogs.getJSONObject(index);

		statusTable.put(logJSON.getString("log_type"),
			Integer.parseInt(logJSON.getString("count")));

		// Since SQL 'NULL' is string.
		if (!logJSON.getString("total").equals("null"))
		{
		    // Get Total clicks.
		    statusTable.put("total",
			    Integer.parseInt(logJSON.getString("total")));
		}

		// Insert status based on logDate.
		if (dateHashtable.containsKey(logJSON.getString("logDate")))
		{
		    dateHashtable.get(logJSON.getString("logDate")).put(
			    logJSON.getString("log_type"),
			    Integer.parseInt(logJSON.getString("count")));

		    if (!logJSON.getString("total").equals("null"))
		    {
			dateHashtable.get(logJSON.getString("logDate")).put(
				"total",
				Integer.parseInt(logJSON.getString("total")));
		    }
		}
		else
		{
		    dateHashtable
			    .put(logJSON.getString("logDate"), statusTable);
		}
	    }

	    reportsString = JSONSerializer.toJSON(dateHashtable).toString()
		    .replace("Send E-mail", "Email Sent")
		    .replace("Email Opened", "Email Opened")
		    .replace("Email Clicked", "Unique Clicks")
		    .replace("total", "Total Clicks");

	    System.out.println("Sorted reports: " + reportsString);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}
	return reportsString;
    }
}
