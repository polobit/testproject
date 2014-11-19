package com.agilecrm.core.api.reports;

import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import net.sf.json.JSONException;

import org.json.JSONArray;

import com.agilecrm.reports.ActivityReports;
import com.agilecrm.reports.ActivityReportsUtil;
import com.agilecrm.reports.Reports;

/**
 * <code>ReportsAPI</code> lass includes REST calls to interact with
 * {@link Reports} class to save, update, delete, generate reports.
 * 
 * @author Yaswanth
 * 
 */
@Path("/api/activity-reports")
public class ActivityReportsAPI
{

    /**
     * Lists all the reports available in current domain
     * 
     * @return {@link List} of {@link Reports}
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<ActivityReports> getListOfActivityReports()
    {
	return ActivityReportsUtil.fetchAllReports();
    }

    /**
     * Saves repots
     * 
     * @param Report
     * @return
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ActivityReports createAcivityReport(ActivityReports report)
    {
	report.save();
	return report;
    }

    /**
     * Saves repots
     * 
     * @param Report
     * @return
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ActivityReports updateAcivityReport(ActivityReports report)
    {
	report.save();
	return report;
    }

    /**
     * Fetches a report in domain based on reports id.
     * 
     * @param id
     * @return {@link Reports}
     */
    @Path("{report_id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public ActivityReports getReport(@PathParam("report_id") Long id)
    {
	try
	{
	    return ActivityReportsUtil.getActivityReport(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Reports delete functionality
     * 
     * @param model_ids
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteReports(@FormParam("ids") String model_ids) throws JSONException
    {

	try
	{
	    JSONArray reportsJSONArray = new JSONArray(model_ids);

	    // Deletes reports associated with the ids sent in request
	    ActivityReports.dao.deleteBulkByIds(reportsJSONArray);

	}
	catch (org.json.JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }

    /**
     * Generates reports results based on report id. It takes page size and
     * cursor parameters to limit fetching of results.
     * 
     * @param id
     * @param count
     * @param cursor
     * @return
     */
    @Path("/show-results/{report_id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> getReportResults(@PathParam("report_id") String id,
	    @QueryParam("page_size") String count, @QueryParam("cursor") String cursor)
    {
	try
	{

	    return ActivityReportsUtil.generateActivityReports(Long.parseLong(id), null);
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    /**
     * Send activity reports as a mail to the user specified email addresses in
     * the activity report object.
     * 
     * @param id
     *            id of the activity report.
     * @param endTime
     *            end time of the activities to be taken in to
     *            consideration.(optional)
     */
    @Path("/email/{report_id}")
    @GET
    public static void sendActivityReport(@PathParam("report_id") String id, @QueryParam("end_time") Long endTime)
    {
	ActivityReportsUtil.sendActivityReport(Long.parseLong(id), endTime);
    }

}
