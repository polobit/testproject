package com.agilecrm.core.api.reports;

import java.util.Collection;
import java.util.List;

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

import com.agilecrm.contact.Contact;
import com.agilecrm.reports.Reports;
import com.agilecrm.reports.ReportsUtil;

/**
 * <code>ReportsAPI</code> lass includes REST calls to interact with
 * {@link Reports} class to save, update, delete, generate reports.
 * 
 * @author Yaswanth
 * 
 */
@Path("/api/reports")
public class ReportsAPI
{
    /**
     * Lists all the reports available in current domain
     * 
     * @return {@link List} of {@link Reports}
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Reports> getListOfReports()
    {
	return Reports.fetchAllReports();
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
    public Reports createReport(Reports Report)
    {
	Report.save();
	return Report;
    }

    /**
     * Updates a report
     * 
     * @param report
     * @return
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Reports updateReport(Reports report)
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
    public Reports getReport(@PathParam("report_id") Long id)
    {
	try
	{
	    return Reports.getReport(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
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
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Collection<Contact> getReportResults(@PathParam("report_id") String id,
	    @QueryParam("page_size") String count, @QueryParam("cursor") String cursor)
    {
	try
	{
	    // Fetches report based on report id
	    Reports report = Reports.getReport(Long.parseLong(id));

	    // Generates report results
	    Collection<Contact> contacts = report.generateReports(Integer.parseInt(count), cursor);

	    return contacts;
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    /**
     * Sends an instant request. Reads report based on its id, generates report
     * and sends it. Report generation in initialized in a deferred task
     * 
     * @param id
     */
    @Path("/send/{report_id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void sendReportResults(@PathParam("report_id") String id)
    {
	try
	{
	    ReportsUtil.sendReport(Long.valueOf(id));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
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
	    Reports.dao.deleteBulkByIds(reportsJSONArray);

	}
	catch (org.json.JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }

}
