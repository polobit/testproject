package com.agilecrm.core.api.analytics;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Set;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import java.util.TimeZone;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.visitors.VisitorResponseBuilder;
import com.analytics.Analytics;
import com.analytics.util.AnalyticsSQLUtil;
import com.analytics.util.AnalyticsUtil;
import com.campaignio.reports.CampaignReportsUtil;
import com.campaignio.reports.DateUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>AnalyticsAPI</code> is the API class that handles web-stats requests.
 * It fetches the page-views based on email. It also verifies for stats count
 * based on domain to know whether that domain uses the analytics or not.
 * 
 * @author Naresh
 * 
 */
@Path("/api/web-stats")
public class AnalyticsAPI
{
    /**
     * Returns pageViews statistics
     * 
     * @param searchEmail
     *            - required email-id.
     * @return List
     */
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public List<Analytics> getAnalyticsGroupedBySessions(@QueryParam("e") String searchEmail)
    {
	
	String email = AnalyticsUtil.getCompositeString(EmailUtil.getStringTokenSet(searchEmail, ","));
	String domain = NamespaceManager.get();
	String url = AnalyticsUtil.getStatsUrlForPageViewsOfEmail(email, domain);
	return AnalyticsSQLUtil.getPageViewsFromStatsServer(url);
    }
    
    /**
     * Returns pageViews count based on domain.
     * 
     * @return - int
     */
    @Path("JSAPI-status")
    @GET
    @Produces({ MediaType.TEXT_PLAIN })
    public int getJSAPIStatus()
    {
	String domain = NamespaceManager.get();
	
	if (StringUtils.isEmpty(domain))
	    return 0;
	
	return AnalyticsUtil.hasJSAPIForDomain() ? 1 : 0;
    }
    
    @Path("sessions-count")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public String getSessionsCount(@QueryParam("start_time") String startTime, @QueryParam("end_time") String endTime,
	    @QueryParam("time_zone") String timeZone)
    {
	// start date in mysql date format.
	String startDate = CampaignReportsUtil.getStartDate(startTime, endTime, null, timeZone);
	
	// end date in mysql date format.
	String endDate = CampaignReportsUtil.getEndDateForReports(endTime, timeZone);
	
	JSONArray sessionsCount = AnalyticsSQLUtil.getPageSessionsCountForDomain(startDate, endDate, timeZone);
	
	if (sessionsCount == null)
	    return null;
	
	return sessionsCount.toString();
	
    }
    
    @POST
    @Path("/filter/dynamic-filter")
    @Consumes({ MediaType.WILDCARD })
    @Produces({ MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML })
    public String filterCustomers(@FormParam("filter_json") String filterJson,
	    @FormParam("page_size") String countString, @FormParam("cursor") String cursorString,
	    @FormParam("start_time") Long startTime, @FormParam("end_time") Long endTime,
	    @FormParam("scanned_upto") String scannedUpto, @FormParam("time_zone") String timeZone)
    {
	JSONArray contacts = new JSONArray();
	try
	{
	    int cursor = AnalyticsUtil.getIntegerValue(cursorString, 0);
	    int limit = AnalyticsUtil.getIntegerValue(countString, 20);
	    
	    //checking are dynamic filters having tag filter or not
	    JSONObject tagFilter = AnalyticsUtil.getTagFilter(filterJson);
	    Boolean hasContactFilter = tagFilter != null;
	    
	    if (StringUtils.isBlank(cursorString))
		cursorString = "0";
	    
	    String startTimeString = DateUtil.getMySQLNowDateFormat(startTime, timeZone);
	    String endTimeString = DateUtil.getMySQLNowDateFormat(endTime, timeZone);
	    
	    List<String> contactEmails = null;
	    //continue fetch from previous check point (last time we fetched till 'scannedUpto')
	    //Here scannedUpto is previous checkpoint
	    if (StringUtils.isBlank(scannedUpto))
		scannedUpto = endTimeString;
	    contactEmails = AnalyticsUtil.getEmails(filterJson, startTimeString, scannedUpto, countString,cursorString);
	    int totalEmailCount = 0;
	    String newScannedTime = null;
	    boolean hasEmails = (contactEmails != null && contactEmails.size() > 1);
	   
	    if (hasEmails)
	    {
			String emailCountString = contactEmails.get(contactEmails.size() - 1);
			newScannedTime = contactEmails.get(contactEmails.size() - 2);
			newScannedTime = DateUtil.addTime(newScannedTime, Calendar.SECOND, -1);
			contactEmails.remove(contactEmails.size() - 1);
			contactEmails.remove(contactEmails.size() - 1);
			totalEmailCount = AnalyticsUtil.getTotalEmailCount(emailCountString);	
			if(hasContactFilter)
				contacts = AnalyticsUtil.getContactsFromTextSearch(contactEmails, tagFilter, limit);
			else
				contacts = AnalyticsUtil.getContactsFromDataStore(contactEmails);				
	    }
	    
	    hasEmails = (contactEmails.size() > 0);
	    
	    if(hasEmails)
	    {
		//Building response to submit client. Response includes all necessary parameters to continue 
		//fetch next time.
		if(contactEmails.size() < 20)
		    hasEmails = false;
		VisitorResponseBuilder responseBuilder = new VisitorResponseBuilder(contacts, hasContactFilter,newScannedTime);						
		responseBuilder.setTotalContactCount(totalEmailCount);
		responseBuilder.setCursor(cursor);
		responseBuilder.setPageSize(limit);
		responseBuilder.setHasEmails(hasEmails);
		contacts = responseBuilder.getResponse();
	    }
	    
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while fetching visitors " + e.getMessage());
	}
	String response = null;
	//contacts = new JSONArray();
	if (contacts != null)
	    response = contacts.toString();
	return response;
	
    }
    /**
     * Returns webstats known contacts and anonymouscontacts visits count
     * 
     * @param startTime
     *               -epoch Time
     * @param endTime
     *               -epoch Time
     * @return
     *        -Visitors count as a String
     */
    @Path("/reports")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public String getVisitsCount(@QueryParam("start_time") String startTime, @QueryParam("end_time") 
    		String endTime)
    {
    	
    	String domain = NamespaceManager.get();
    	
    	String timeZone = AccountPrefsUtil.getTimeZone();
    	
    	String current_timezone = com.agilecrm.util.DateUtil.getCurrentUserTimezoneOffset();
		
    	if (current_timezone != null)
		{
			timeZone = ""+(Long.valueOf(current_timezone)*-1);
		}
    	
    	String url = AnalyticsUtil.getStatsUrlForVisitsCount(domain, startTime, endTime, timeZone);
    	
    	System.out.println("Visits Count url is........"+url);
    	
    	return AnalyticsSQLUtil.getVisitsCountFromStatServer(url);
    	
    }
    
    /*Get latest refferal url based on duration*/

    @Path("/refurl-stats")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getRefferalUrlCount(@QueryParam("start_time") String startTime, @QueryParam("end_time") 
            String endTime, @QueryParam("time_zone") String timeZone)
    {
        
        String domain = NamespaceManager.get();
        String startTimeString = DateUtil.getMySQLNowDateFormat(Long.parseLong(startTime), timeZone);
        String endTimeString = DateUtil.getMySQLNowDateFormat(Long.parseLong(endTime), timeZone);
        String url;
        String list = new String();
        try
        {
            url = AnalyticsUtil.getUrlForRefferalurlCount(domain, startTimeString, endTimeString);
            list= AnalyticsSQLUtil.getRefferalurls(url);
        }
        catch (Exception e)
        {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return null;
        }       
        return list.replace("count(sid)", "count");
    }
    
   
}
