package com.agilecrm.core.api.analytics;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;

import com.analytics.Analytics;
import com.analytics.util.AnalyticsSQLUtil;
import com.analytics.util.AnalyticsUtil;
import com.campaignio.reports.CampaignReportsUtil;
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
public class AnalyticsAPI {
	/**
	 * Returns pageViews statistics
	 * 
	 * @param searchEmail
	 *            - required email-id.
	 * @return List
	 */
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	public List<Analytics> getAnalyticsGroupedBySessions(
			@QueryParam("e") String searchEmail) {
		JSONArray pageViewsList = AnalyticsSQLUtil.getPageViewsOfAllEmails(searchEmail);

		JSONArray mergedStats = AnalyticsUtil
				.mergePageViewsBasedOnSessions(pageViewsList);

		if (mergedStats == null)
			return null;

		try {
			// to attach parsed user-agent string
			return new ObjectMapper().readValue(mergedStats.toString(),
					new TypeReference<List<Analytics>>() {
					});
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Returns pageViews count based on domain.
	 * 
	 * @return - int
	 */
	@Path("JSAPI-status")
	@GET
	@Produces({ MediaType.TEXT_PLAIN })
	public int getJSAPIStatus() {
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
	    
	    JSONArray sessionsCount =  AnalyticsSQLUtil.getPageSessionsCountForDomain(startDate, endDate, timeZone);
	    
	    if(sessionsCount == null)
	    	return null;
	    
	    return sessionsCount.toString();
	    			
	}
	
}
