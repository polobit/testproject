package com.agilecrm.core.api.reports;

import java.util.Calendar;
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

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.reports.Reports;
import com.agilecrm.reports.ReportsUtil;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.search.util.TagSearchUtil;

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
	return ReportsUtil.fetchAllReports();
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
	    return ReportsUtil.getReport(id);
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
    public Collection<Contact> getReportResults(@PathParam("report_id") String id, @QueryParam("page_size") String count, @QueryParam("cursor") String cursor)
    {
	try
	{

	    // Fetches report based on report id
	    Reports report = ReportsUtil.getReport(Long.parseLong(id));

	    // Search rule to specify type is person
	    SearchRule rule = new SearchRule();
	    rule.RHS = "PERSON";
	    rule.CONDITION = RuleCondition.EQUALS;
	    rule.LHS = "type";

	    report.rules.add(rule);

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

    /**
     * Funnel Reports based on tags. Returns json-array data required for
     * generating graphs.
     * 
     * @param tags
     *            - comma separated tags
     * @param startTime
     *            - Start Time.
     * @param endTime
     *            - EndTime.
     * @param timeZone
     *            - client timezone.
     * @return email-stats json string
     * 
     * */
    @Path("/funnel/{tags}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getFunnelStats(@PathParam("tags") String tagsString, @QueryParam("start_time") String startTime, @QueryParam("end_time") String endTime,
	    @QueryParam("time_zone") String timeZone, @QueryParam("filter") String filterId)
    {
	ReportsUtil.check(Long.parseLong(startTime), Long.parseLong(endTime));

	JSONArray tagsJSONArray = new JSONArray();
	try
	{
	    // Get tags with a comma or | tokenized
	    String[] tags = tagsString.split(",");

	    ContactFilter filter = null;
	    if (filterId != null)
		filter = ContactFilter.getContactFilter(Long.parseLong(filterId));

	    // For each tag, get the occurrences for this time frame
	    for (String tag : tags)
	    {
		int count = TagSearchUtil.getTagCount(filter, tag, startTime, endTime);
		tagsJSONArray.put(new JSONObject().put(tag, count));
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	// Create New Contact Filter
	return tagsJSONArray.toString();
    }

    /**
     * Growth Reports based on tags. Returns json-array data required for
     * generating graphs.
     * 
     * @param tags
     *            - comma separated tags
     * @param startTime
     *            - Start Time.
     * @param endTime
     *            - EndTime.
     * @param timeZone
     *            - client timezone.
     * @return email-stats json string
     * 
     * */
    @Path("/growth/{tags}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getGrowthStats(@PathParam("tags") String tagsString, @QueryParam("start_time") String startTime, @QueryParam("end_time") String endTime,
	    @QueryParam("time_zone") String timeZone, @QueryParam("frequency") String frequency, @QueryParam("filter") String filterId) throws Exception
    {
	ReportsUtil.check(Long.parseLong(startTime), Long.parseLong(endTime));

	// Get tags with a comma or | tokenized
	String[] tags = tagsString.split(",");
	int type = getType(frequency);

	ContactFilter filter = null;
	if (filterId != null)
	    filter = ContactFilter.getContactFilter(Long.parseLong(filterId));

	// Get Tags Daily
	return TagSearchUtil.getTagCount(filter, tags, startTime, endTime, type).toString();
    }

    /*
     * Utility function to return the calendar type based on the frequency in
     * the URL
     */
    private int getType(String frequency)
    {
	int type = Calendar.DAY_OF_MONTH;

	if (StringUtils.equalsIgnoreCase(frequency, "monthly"))
	    type = Calendar.MONTH;
	if (StringUtils.equalsIgnoreCase(frequency, "weekly"))
	    type = Calendar.WEEK_OF_YEAR;

	return type;
    }

    /**
     * Ratio Reports based on the two tags. Returns json-array data required for
     * generating graphs.
     * 
     * @param tag1
     *            - first tag
     * @param tag2
     *            - second tag
     * @param startTime
     *            - Start Time.
     * @param endTime
     *            - EndTime.
     * @param timeZone
     *            - client timezone.
     * @return email-stats json string
     * 
     * */
    @Path("/ratio/{tag1}/{tag2}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String getRatioStats(@PathParam("tag1") String tag1, @PathParam("tag2") String tag2, @QueryParam("start_time") String startTime,
	    @QueryParam("end_time") String endTime, @QueryParam("time_zone") String timeZone, @QueryParam("frequency") String frequency,
	    @QueryParam("filter") String filterId) throws Exception
    {
	ReportsUtil.check(Long.parseLong(startTime), Long.parseLong(endTime));

	int type = getType(frequency);

	ContactFilter filter = null;
	if (filterId != null)
	    filter = ContactFilter.getContactFilter(Long.parseLong(filterId));

	// Get Cohorts Monthly
	return TagSearchUtil.getRatioTagCount(filter, tag1, tag2, startTime, endTime, type).toString();
    }
}