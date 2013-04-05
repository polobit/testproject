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

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.reports.Reports;
import com.agilecrm.reports.deferred.ReportsDeferredTaskInstantEmail;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

@Path("/api/reports")
public class ReportsApi
{
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Reports> getListOfReports()
    {
	return Reports.fetchAllReports();
    }

    // Save Filter contacts
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Reports createReport(Reports Report)
    {
	Report.save();
	return Report;
    }

    // Update filters
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Reports updateReport(Reports report)
    {
	report.save();
	return report;
    }

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

    @Path("/query/{report_id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Collection<Contact> getReportResults(
	    @PathParam("report_id") String id,
	    @QueryParam("page_size") String count,
	    @QueryParam("cursor") String cursor)
    {
	try
	{
	    Reports report = Reports.getReport(Long.parseLong(id));

	    Collection<Contact> contacts = report.generateReports(
		    Integer.parseInt(count), cursor);

	    return contacts;
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    @Path("/send/{report_id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void sendReportResults(@PathParam("report_id") String id)
    {
	try
	{
	    Reports report = Reports.getReport(Long.parseLong(id));

	    ReportsDeferredTaskInstantEmail reportsDeferredTask = new ReportsDeferredTaskInstantEmail(
		    Long.parseLong(id));

	    Queue queue = QueueFactory.getDefaultQueue();

	    // Add to queue
	    queue.add(TaskOptions.Builder.withPayload(reportsDeferredTask));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    // Bulk operations - delete
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteReports(@FormParam("ids") String model_ids)
	    throws JSONException
    {

	JSONArray reportsJSONArray = new JSONArray(model_ids);
	Reports.dao.deleteBulkByIds(reportsJSONArray);

    }

}
