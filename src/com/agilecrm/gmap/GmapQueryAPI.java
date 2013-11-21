package com.agilecrm.gmap;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;

import com.analytics.Analytics;
import com.analytics.util.AnalyticsSQLUtil;
import com.campaignio.logger.Log;

@Path ("api/gmap")
public class GmapQueryAPI {
	
	@Path("daterange")
	@GET 
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<GmapLogs> getVisitorsByDomain(@QueryParam("user_domain") String userDomain, @QueryParam("start_date") String startDate, @QueryParam("end_date") String endDate, @QueryParam("time_zone") String timeZoneOffset)
    {
		List<GmapLogs> visitorsLatLong = GmapUtil.getGmapVisitors(userDomain, startDate, endDate, timeZoneOffset);

		try
		{
			return visitorsLatLong;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
    }
}
