package com.agilecrm.gmap;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;




public class GmapUtil{
	
	/**
     * Returns Latest visitors  between a requested date (stats_time, lat_long, email, browser_details)
     * 
     * 
     * @param domain
     *           
     * @param start and end dates
     * 
     * @param timezone
     * 
     * @return List<GmapLogs>
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
    
    /**
     * Returns page views per session (stats_time, lat_long, email, browser_details)
     * with contact name.
     * 
     * @param domain
     *           
     * @param start and end dates
     *           
     * @param limit
     *            
     * @param offeset
     * 
     * @param timezone
     * 
     * @return List<GmapLogs>
     */
    public static List<GmapLogs> getGmapVisitorsbySession(String userDomain, String startDate, String endDate, String timeZone,String offset,String pageSize)
    {
		if (StringUtils.isEmpty(userDomain))
		    return null;
	
		// get Gmap visitor's data
		JSONArray visitorsLogs = GmapQueryUtil.getVisitorsBySession(userDomain, startDate, endDate, timeZone,offset,pageSize);
	
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