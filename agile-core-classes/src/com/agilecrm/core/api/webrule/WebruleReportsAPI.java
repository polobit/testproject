package com.agilecrm.core.api.webrule;

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

//import com.agilecrm.contact.email.bounce.EmailBounceStatus.EmailBounceType;
import com.agilecrm.webrules.WebRule;
import com.agilecrm.util.DateUtil;
import com.webruleio.reports.WebruleReportsSQLUtil;
import com.webruleio.reports.WebruleReportsUtil;
import com.agilecrm.core.api.webrule.WebruleConstants;

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
     * Returns all available wberule-stats for generating bar graph. It fetches
     * the data of all webrules for comparison.
     * 
     * @return String.
     */
   /* @Path("/stats")
    @GET
    @Produces({ MediaType.APPLICATION_JSON + ";charset=utf-8" , MediaType.APPLICATION_XML })
    public String getAllWebruleStats() throws Exception
    {
	try
	{
	    // SQL data for Webrules Comparison
	    JSONArray WebruleStatsArray = WebruleReportsSQLUtil.getAllEmailWebruleStats();

	    if (WebruleStatsArray == null)
		return null;

	    // Modified data required for graph of Webrules Comparison
	    LinkedHashMap<String, LinkedHashMap<String, Integer>> WebruleStatsData = WebruleReportsUtil
		    .getWebruleStatsData(null, null, null, null, WebruleStatsArray);

	    return WebruleReportsUtil.replaceNamesInStats(WebruleStatsData);
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in Webrules comparison " + e.getMessage());
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}
    }*/

    /**
     * WebruleReports based on each webrule. Returns json-array data required
     * for generating graphs.
     * 
     * @param WebruleId
     *            - Webrule Id.
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
  /*  @Path("/email/reports/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getEachWebruleStats(@PathParam("id") String WebruleId, @QueryParam("start_time") String startTime,
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
	    String startDate = WebruleReportsUtil.getStartDate(startTime, endTime, type, timeZone);

	    // end date in mysql date format.
	    String endDate = WebruleReportsUtil.getEndDateForReports(endTime, timeZone);

	    // SQL data for Webrule stats for given duration.
	    JSONArray emailLogs = WebruleReportsSQLUtil.getEachEmailWebruleStats(WebruleId, startDate, endDate,
		    timeZone, type);

	    if (emailLogs == null)
		return null;

	    // Modified data required for graph of each Webrule-stats.
	    LinkedHashMap<String, LinkedHashMap<String, Integer>> WebruleStatsData = WebruleReportsUtil
		    .getEachWebruleStatsData(startTime, endTime, type, timeZone, emailLogs);
	    
	    String replacedWebruleStats = JSONSerializer.toJSON(WebruleStatsData).toString().replace("EMAIL_SENT", "Email Sent")
			.replace("EMAIL_OPENED", "Unique Opens").replace("count", "Unique Clicks").replace("EMAIL_CLICKED", "Total Clicks");

	    return replacedWebruleStats;
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in each WebruleStats " + e.getMessage());
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}

    }*/

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
		if (current_timezone != null)
		{
			timeZone = ""+(Long.valueOf(current_timezone)*-1);
		}
	    // start date in mysql date format.
	    String startDate = WebruleReportsUtil.getStartDate(startTime, endTime, null, timeZone);

	    // end date in mysql date format.
	    String endDate = WebruleReportsUtil.getEndDateForReports(endTime, timeZone);

	    JSONArray stats = WebruleReportsSQLUtil.getEachWebruleStatsForTable(webruleId, startDate, endDate,timeZone, null);
	    
	    System.out.println("SQL Stats are..." + stats.toString());

	    int statsLength = stats.length();

	    JSONObject statsJSON = new JSONObject();

	    // Add log_type as key and its count as value
	    for (int i = 0, len = stats.length(); i < len; i++)
	    {
		JSONObject json = stats.getJSONObject(i);

		if (json.getString("webrule_type").equals("MODAL_POPUP"))
		    statsJSON.put("popup", json.getString("total"));
		
		if (json.getString("webrule_type").equals("FORM_SUBMITTED"))
		    statsJSON.put("submit", json.getString("total"));
		
		if (json.getString("webrule_type").equals("CORNER_NOTY"))
		    statsJSON.put("noty", json.getString("total"));
		
		if (json.getString("webrule_type").equals("ADD_TAG"))
		    statsJSON.put("addtag", json.getString("total"));
		if (json.getString("webrule_type").equals("REMOVE_TAG"))
		    statsJSON.put("addtag", json.getString("total"));
		if (json.getString("webrule_type").equals("ASSIGN_CAMPAIGN"))
		    statsJSON.put("addtocampaign", json.getString("total"));
		if (json.getString("webrule_type").equals("UNSUBSCRIBE_CAMPAIGN"))
		    statsJSON.put("unsubscribecampaign", json.getString("total"));
		if (json.getString("webrule_type").equals("ADD_SCORE"))
		    statsJSON.put("addscore", json.getString("total"));
		if (json.getString("webrule_type").equals("SUBTRACT_SCORE"))
		    statsJSON.put("substractcampaign", json.getString("total"));
		if (json.getString("webrule_type").equals("SITE_BAR"))
		    statsJSON.put("sitebar", json.getString("total"));
		
		if (json.getString("webrule_type").equals("CALL_POPUP"))
		    statsJSON.put("callpopup", json.getString("total"));
		


		//statsJSON.put("webtype",json.getString("webrule_type"));
		//statsJSON.put("number",json.getString("count"));
		//statsJSON.put("totalnumber",json.getString("total"));
		
		statsJSON.put(stats.getJSONObject(i).getString("webrule_type"),stats.getJSONObject(i).getInt("total"));
	    }

	    System.out.println("stats JSON is " + statsJSON);

	    return statsJSON.toString();
	    /*replace("MODAL_POPUP","modalpopup")
	    		.replace("FORM_SUBMITTED", "formsubmit").replace("NOTY_MESSAGE", "message")
			    .replace("CALL_POPUP", "callpopup").replace("SITE_BAR", "sitebar")
			    .replace("REQUEST_PUSH_POPUP", "pushpopup").replace("ADD_TO_CAMPAIGN", "addtocampaign");*/
	}
	catch (Exception e)
	{
	    System.err.println("Exception occurred while getting Webrule stats... " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
    }
    
 /*  @Path("/execution/count")
    @GET
    public String getCountByexecutiontimes(@QueryParam("start_time") String startTime, @QueryParam("end_time") String endTime,
	    @QueryParam("time_zone") String timeZone)
    {
    	 // start date in mysql date format.
	    String startDate = WebruleReportsUtil.getStartDate(startTime, endTime, null, timeZone);

	    // end date in mysql date format.
	    String endDate = WebruleReportsUtil.getEndDateForReports(endTime, timeZone);

	    String [] array = {"MODAL_POPUP", "EMAIL_OPENED", "EMAIL_CLICKED"};
	    
	    JSONArray countJSON = WebruleReportsSQLUtil.getCountByexecutiontimes(startDate, endDate, timeZone, array);
	    
	    if(countJSON == null)
	    	return null;
	    
	    return countJSON.toString();
	    			
    }*/
}
