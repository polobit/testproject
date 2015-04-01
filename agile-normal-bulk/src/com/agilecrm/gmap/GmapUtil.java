package com.agilecrm.gmap;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;

import com.campaignio.logger.Log;
import com.campaignio.logger.util.CampaignLogsSQLUtil;
import com.google.appengine.api.NamespaceManager;




public class GmapUtil{
	
	/**
     * Returns recent visitor's details (stats_time, lat_long, email, browser_details)
     * with contact name.
     * 
     * @param campaignId
     *            - Campaign Id.
     * @param subscriberId
     *            - Subscriber Id.
     * @param limit
     *            - limit to get number of logs.
     * @return logs array string.
     */
    public static List<GmapLogs> getGmapVisitors(String userDomain, String startDate, String endDate, String timeZone)
    {
		if (StringUtils.isEmpty(userDomain))
		    return null;
	
		// get Gmap visitor's data
		JSONArray visitorsLogs = GmapQueryUtil.getVisitorsLatLong(userDomain, startDate, endDate, timeZone);
	
		if (visitorsLogs == null)
		    return null;
	
		try
		{
		    // to attach contact and visitor's data to each result.
		    return new ObjectMapper().readValue(visitorsLogs.toString(), new TypeReference<List<GmapLogs>>()
		    {
		    });
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		    return null;
		}
    }

} 