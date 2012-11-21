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
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.reports.Reports;

@Path("/api/reports")
public class ReportsApi
{
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Reports> getListOfReports()
    {
	return Reports.getCurrentNamespaceReports();
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
	    @PathParam("filter_id") String id)
    {
	try
	{
	    Reports report = Reports.getReport(Long.parseLong(id));

	    Collection<Contact> contacts = report.generateReports();

	    return contacts;
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    // Bulk operations - delete
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteReports(@FormParam("model_ids") String model_ids)
	    throws JSONException
    {

	JSONArray reportsJSONArray = new JSONArray(model_ids);

	Reports.dao.deleteBulkByIds(reportsJSONArray);
    }
}
