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

@Path ("api/gmap")
public class GmapQueryAPI {
	
	@Path("daterange")
	@GET 
	@Produces({ MediaType.APPLICATION_JSON })
	public String getVisitorsByDomain(@QueryParam("user_domain") String userDomain, @QueryParam("start_date") String startDate, @QueryParam("end_date") String endDate, @QueryParam("time_zone") String timeZoneOffset)
    {
    	JSONArray visitorsLatLong = GmapQueryUtil.getVisitorsLatLong(userDomain, startDate, endDate, timeZoneOffset);

		try
		{
			return visitorsLatLong.toString();
			// to attach parsed user-agent string
			//return new ObjectMapper().readValue(visitorsLatLong.toString(), new TypeReference<List<Analytics>>()
			//		{
			//		});
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
    }
}
