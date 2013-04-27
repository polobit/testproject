package com.agilecrm.core.api.campaigns;

import java.util.Calendar;
import java.util.LinkedHashMap;
import java.util.List;

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
import com.campaignio.CampaignStats;
import com.campaignio.stats.util.CampaignStatsReportsUtil;
import com.campaignio.stats.util.DateUtil;
import com.campaignio.stats.util.EmailReportsUtil;
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
    @Path("/stats")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getCampaignStatsForGraph() throws Exception
    {
	List<CampaignStats> CampaignStats = CampaignStatsUtil
		.getAllCampaignStats();

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

	    // Converts epoch time to "yyyy-MM-dd HH:mm:ss"
	    String startDate = DateUtil.getMySQLNowDateFormat(Long
		    .parseLong(startTime));

	    String endDate = DateUtil.getMySQLNowDateFormat(Long
		    .parseLong(endTime));

	    JSONArray emailLogs = EmailStatsUtil.getEmailLogs(campaignId,
		    startDate, endDate, timeZone, type);

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
