package com.agilecrm.core.api.webrule;

import javax.ws.rs.GET;
import javax.ws.rs.core.Response;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import java.util.LinkedHashMap;
import net.sf.json.JSONSerializer;
import javax.ws.rs.core.MediaType;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import com.agilecrm.util.DateUtil;
import com.webruleio.reports.WebruleReportsSQLUtil;
import com.webruleio.reports.WebruleReportsUtil;
import com.campaignio.reports.CampaignReportsUtil;
import com.formio.reports.FormReportsUtil;

/**
 * <code>WebruleReportsAPI</code> includes REST calls to interact with SQL to
 * fetch data required for webrule reports. It handles to fetches data for each
 * Webrule to show webrule-reports. It also handles to fetch data inorder to
 * compare all available webrules.
 * 
 * @author Poulami
 * 
 */

@Path("/api/webrule-analytics")
public class WebruleReportsAPI
{

    /**
     * WebruleReports based on each webrule. Returns json-array data required
     * for generating graphs.
     * 
     * @param webrule
     *            -id - Webrule Id.
     * @param startTime
     *            - Start Time.
     * @param endTime
     *            - EndTime.
     * @param type
     *            - day, hour or date
     * @param timeZone
     *            - client timezone.
     * */
    @Path("/web/graphreports/{webrule-id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getEachWebruleStats(@PathParam("webrule-id") String webruleId,
	    @QueryParam("start_time") String startTime, @QueryParam("end_time") String endTime,
	    @QueryParam("type") String type, @QueryParam("time_zone") String timeZone)
    {
	try
	{
	    String current_timezone = DateUtil.getCurrentUserTimezoneOffset();
	    if (current_timezone != null)
	    {
		timeZone = "" + (Long.valueOf(current_timezone) * -1);
	    }
	    // start date in mysql date format.
	    //String startDate = FormReportsUtil.getStartDate(startTime, endTime, type, timeZone);
             String startDate = CampaignReportsUtil.getStartDate(startTime, endTime, type, timeZone);
		
	    // end date in mysql date format.
	    String endDate = CampaignReportsUtil.getEndDateForReports(endTime, timeZone);

	    // SQL data for webrule stats for given duration.
	    JSONArray logs = WebruleReportsSQLUtil.getWebruleStats4Graph(webruleId, startDate, endDate, timeZone, type);

	    //System.out.println("SQL Stats for graphs are..." + logs.toString());

	    if (logs == null)
		return null;

	    // Modified data required for graph of each webrule-stats.
	    LinkedHashMap<String, LinkedHashMap<String, Integer>> webruleStatsData = WebruleReportsUtil
		    .getEachWebruleStatsData(startTime, endTime, type, timeZone, logs);

	    String replacedWebruleStats = JSONSerializer.toJSON(webruleStatsData).toString()
		    .replace("TOTAL_VIEWS", "TOTAL VIEWS").replace("TOTAL_SUBMISSIONS", "TOTAL SUBMISSIONS");

	   // System.out.println("stats JSON is " + replacedWebruleStats);

	    return replacedWebruleStats;
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in each WebruleStats " + e.getMessage());
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}

    }

    @Path("/web/table-reports/{webrule-id}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getEachWebruleStatsForTable(@PathParam("webrule-id") String webruleId,
	    @QueryParam("start_time") String startTime, @QueryParam("end_time") String endTime,
	    @QueryParam("time_zone") String timeZone)
    {
	try
	{
	    String current_timezone = DateUtil.getCurrentUserTimezoneOffset();
	    if (StringUtils.isNotBlank(current_timezone))
	    {
		timeZone = "" + (Long.valueOf(current_timezone) * -1);
	    }
	    // start date in mysql date format.
	    String startDate = CampaignReportsUtil.getStartDate(startTime, endTime, null, timeZone);
	    //String startDate = FormReportsUtil.getStartDate(startTime, endTime, null, timeZone);

	    // end date in mysql date format.
	    String endDate = CampaignReportsUtil.getEndDateForReports(endTime, timeZone);

	    JSONArray stats = WebruleReportsSQLUtil.getWebruleStats4Table(webruleId, startDate, endDate, timeZone, null);

	    // System.out.println("SQL Stats are..." + stats.toString());

	    // int statsLength = stats.length();

	    JSONObject statsJSON = new JSONObject();
	    int views = 0;
	    int subs = 0;
	    // Add log_type as key and its count as value
	    for (int i = 0, len = stats.length(); i < len; i++)
	    {
		JSONObject json = stats.getJSONObject(i);
		views = views + Integer.parseInt(json.getString("TOTAL_VIEWS"));
		subs = subs + Integer.parseInt(json.getString("TOTAL_SUBMISSIONS"));

	    }
	    statsJSON.put("views", views);
	    statsJSON.put("submissions", subs);
	   // System.out.println("stats JSON is " + statsJSON);

	    return statsJSON.toString();
	}
	catch (Exception e)
	{
	    System.err.println("Exception occurred while getting Webrule stats... " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
    }

}
