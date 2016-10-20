package com.agilecrm.core.api.forms;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.util.LinkedHashMap;
import net.sf.json.JSONSerializer;
import javax.ws.rs.core.MediaType;
import org.json.JSONArray;
import org.json.JSONObject;
import com.agilecrm.util.DateUtil;
import com.formio.reports.FormReportsSQLUtil;
import com.formio.reports.FormReportsUtil;
import com.campaignio.reports.CampaignReportsUtil;

/**
 * <code>FormReportsAPI</code> includes REST calls to interact with SQL to fetch
 * data required for form reports. It handles to fetches data for each Form to
 * show form-reports. It also handles to fetch data inorder to compare all
 * available form.
 * 
 * @author Poulami
 * 
 */
@Path("/api/form-analytics")
public class FormReportsAPI
{

    /**
     * FormReports based on each form. Returns json-array data required for
     * generating graphs.
     * 
     * @param form
     *            -id - Form Id.
     * @param startTime
     *            - Start Time.
     * @param endTime
     *            - EndTime.
     * @param type
     *            - day, hour or date
     * @param timeZone
     *            - client timezone.
     * */
    @Path("/form/graphreports/{form-id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getEachFormStats(@PathParam("form-id") String webruleId, @QueryParam("start_time") String startTime,
	    @QueryParam("end_time") String endTime, @QueryParam("type") String type,
	    @QueryParam("time_zone") String timeZone)
    {
	try
	{
	    String current_timezone = DateUtil.getCurrentUserTimezoneOffset();
	    if (current_timezone != null)
	    {
		timeZone = "" + (Long.valueOf(current_timezone) * -1);
	    }
	    // start date in mysql date format.
	    String startDate = CampaignReportsUtil.getStartDate(startTime, endTime, type, timeZone);

	    // end date in mysql date format.
	    String endDate = CampaignReportsUtil.getEndDateForReports(endTime, timeZone);

	    // SQL data for form stats for given duration.
	    JSONArray logs = FormReportsSQLUtil.getFormStats4Graph(webruleId, startDate, endDate, timeZone, type);

	    System.out.println("SQL Stats for graphs are..." + logs.toString());

	    if (logs == null)
		return null;

	    // Modified data required for graph of each form-stats.
	    LinkedHashMap<String, LinkedHashMap<String, Integer>> formStatsData = FormReportsUtil.getEachFormStatsData(
		    startTime, endTime, type, timeZone, logs);

	    String replacedWebruleStats = JSONSerializer.toJSON(formStatsData).toString()
		    .replace("TOTAL_SUBMISSIONS", "TOTAL SUBMISSIONS");

	    System.out.println("stats JSON is " + replacedWebruleStats);

	    return replacedWebruleStats;
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in each form graph stats " + e.getMessage());
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}

    }

    @Path("/form/reports/{form-id}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getEachFormStats(@PathParam("form-id") String formId, @QueryParam("start_time") String startTime,
	    @QueryParam("end_time") String endTime, @QueryParam("time_zone") String timeZone)
    {
	try
	{
	    String current_timezone = DateUtil.getCurrentUserTimezoneOffset();
	    if (current_timezone != null)
	    {
		timeZone = "" + (Long.valueOf(current_timezone) * -1);
	    }
	    // start date in mysql date format.
	    String startDate = CampaignReportsUtil.getStartDate(startTime, endTime, null, timeZone);

	    // end date in mysql date format.
	    String endDate = CampaignReportsUtil.getEndDateForReports(endTime, timeZone);

	    JSONArray stats = FormReportsSQLUtil.getFormStats4Table(formId, startDate, endDate, timeZone);

	    System.out.println("SQL Stats are..." + stats.toString());

	    // int statsLength = stats.length();

	    JSONObject statsJSON = new JSONObject();

	    // Add log_type as key and its count as value
	    for (int i = 0, len = stats.length(); i < len; i++)
	    {
		JSONObject json = stats.getJSONObject(i);
		statsJSON.put("totalcount", json.getString("total"));
	    }

	    System.out.println("stats JSON is " + statsJSON);

	    return statsJSON.toString();
	}
	catch (Exception e)
	{
	    System.err.println("Exception occurred while getting form table stats... " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
    }

}
