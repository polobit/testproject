package com.agilecrm.core.api.reports;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.TimeZone;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import net.sf.json.JSONException;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.portlets.util.PortletUtil;
import com.agilecrm.reports.Reports;
import com.agilecrm.reports.ReportsUtil;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.search.util.TagSearchUtil;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.util.DateUtil;
import com.campaignio.reports.CampaignReportsSQLUtil;
//import org.json.JSONObject;

/**
 * <code>ReportsAPI</code> lass includes REST calls to interact with
 * {@link Reports} class to save, update, delete, generate reports.
 * 
 * @author Dharmateja
 * 
 */
@Path("/api/campaignReports")
public class CampaignReportsAPI
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
    List<Reports> reports =ReportsUtil.fetchAllReports();
    List<Reports> newReports = new ArrayList<Reports>();
    Iterator<Reports> iterator = reports.iterator();
    while(iterator.hasNext()){
    	Reports report = iterator.next();
    	if(report.report_type == Reports.ReportType.Campaign){
    		newReports.add(report);
    	}
    }   
    System.out.println("Reports size:"+newReports.size());
    return newReports;
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
    Report.report_type = Report.report_type.Campaign;
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
    report.report_type = report.report_type.Campaign;
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
    public String getReportResults(@PathParam("report_id") String id,
	    @QueryParam("page_size") String count, @QueryParam("cursor") String cursor)
    {
	try
	{

	    // Fetches report based on report id
	    Reports report = ReportsUtil.getReport(Long.parseLong(id));
	    Date dt = new Date();
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	    String endDate = sdf.format(dt);
	    TimeZone timeZone = TimeZone.getTimeZone(report.report_timezone);
	    JSONArray jsonArray = new JSONArray();
	    
	    if(report.duration == Reports.Duration.DAILY){
	    	Calendar cal = Calendar.getInstance();
	    	cal.setTime(dt);
	    	cal.add(Calendar.DATE, -1);
	    	Date startDateTime = cal.getTime();
	    	String startDate = sdf.format(startDateTime);
	    	//jsonArray = CampaignReportsSQLUtil.getEachCampaignStatsForTable(report.campaignId, startDate, endDate, timeZone.getRawOffset()+"", null);
	    }else if(report.duration == Reports.Duration.WEEKLY){
	    	Calendar cal = Calendar.getInstance();
	    	cal.setTime(dt);
	    	cal.add(Calendar.DATE, -7);
	    	Date startDateTime = cal.getTime();
	    	String startDate = sdf.format(startDateTime);
		    //jsonArray = CampaignReportsSQLUtil.getEachCampaignStatsForTable(report.campaignId, startDate, endDate,timeZone.getRawOffset()+"", null);
		}else if(report.duration == Reports.Duration.MONTHLY){
			Calendar cal = Calendar.getInstance();
	    	cal.setTime(dt);
	    	cal.add(Calendar.DATE, -30);
	    	Date startDateTime = cal.getTime();
	    	String startDate = sdf.format(startDateTime);
		    //jsonArray = CampaignReportsSQLUtil.getEachCampaignStatsForTable(report.campaignId, startDate, endDate,timeZone.getRawOffset()+"", null);
		}
	    
	    JSONObject emails_opened = new JSONObject();
	    emails_opened.put("log_type", "EMAIL_OPENED");
	    emails_opened.put("count", 5);
	    emails_opened.put("total", 10);
	    jsonArray.put(emails_opened);
	    
	    JSONObject emails_sent = new JSONObject();
	    emails_sent.put("log_type", "EMAIL_SENT");
	    emails_sent.put("count", 3);
	    emails_sent.put("total", 8);
	    jsonArray.put(emails_sent);
	    
	    JSONObject emails_clicked = new JSONObject();
	    emails_clicked.put("log_type", "EMAIL_CLICKED");
	    emails_clicked.put("count", 4);
	    emails_clicked.put("total", 6);
	    jsonArray.put(emails_clicked);
	    
	    JSONObject emails_unsubscribed = new JSONObject();
	    emails_unsubscribed.put("log_type", "UNSUBSCRIBED");
	    emails_unsubscribed.put("count", 2);
	    emails_unsubscribed.put("total", 5);
	    jsonArray.put(emails_unsubscribed);

	    // Search rule to specify type is person
	    SearchRule rule = new SearchRule();
	    rule.RHS = "PERSON";
	    rule.CONDITION = RuleCondition.EQUALS;
	    rule.LHS = "type";

	    report.rules.add(rule);

	    UserAccessControlUtil.checkReadAccessAndModifyTextSearchQuery(Contact.class.getSimpleName(), report.rules,
		    null);

	    // Generates report results
	    Collection<Contact> contacts = report.generateReports(Integer.parseInt(count), cursor);

	    return jsonArray.toString();
	}
	catch (Exception e)
	{
		System.out.println("Exception occured in getting report results:"+e.getMessage());
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

	Long reportId = Long.valueOf(id);
	Long available_count = ReportsUtil.getAvailableEntitiesCountInReport(reportId);

	if (available_count > 0)
	{
	    try
	    {
		ReportsUtil.sendCampaignReport(Long.valueOf(reportId));
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	    return;
	}

	throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		.entity("Report not sent as there are no records matching the report criteria.").build());

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
}
