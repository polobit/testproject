package com.agilecrm.core.api.analytics;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.util.EmailUtil;
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
