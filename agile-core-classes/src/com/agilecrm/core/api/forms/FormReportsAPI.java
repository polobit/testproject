package com.agilecrm.core.api.forms;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.util.DateUtil;
import com.formio.reports.FormReportsSQLUtil;
import com.formio.reports.FormReportsUtil;
import com.webruleio.reports.WebruleReportsSQLUtil;
import com.webruleio.reports.WebruleReportsUtil;


/**
 * <code>WebruleReportsAPI</code> includes REST calls to interact with SQL to
 * fetch data required for webrule reports. It handles to fetches data for each
 * Webrule to show webrule-reports. It also handles to fetch data inorder to
 * compare all available webrules.
 * 
 * @author Poulami
 * 
 */
@Path("/api/form-analytics")
public class FormReportsAPI
{
	
  
    @Path("/form/table-reports/{formid}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getEachWebruleStatsForTable(@PathParam("formid") String formId,
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
	    String startDate = FormReportsUtil.getStartDate(startTime, endTime, null, timeZone);

	    // end date in mysql date format.
	    String endDate = FormReportsUtil.getEndDateForReports(endTime, timeZone);

	    JSONArray stats = FormReportsSQLUtil.getEachWebruleStatsForTable(formId, startDate, endDate,timeZone, null);
	    
	    System.out.println("SQL Stats are..." + stats.toString());

	    //int statsLength = stats.length();

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
		
		
		statsJSON.put(stats.getJSONObject(i).getString("webrule_type"),stats.getJSONObject(i).getInt("total"));
	    }

	    System.out.println("stats JSON is " + statsJSON);

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
