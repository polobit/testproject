package com.agilecrm.gmap;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

@Path ("api/gmap")
public class GmapQueryAPI {
	
	@Path("daterange")
	@GET 
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<GmapLogs> getVisitorsByDomain(@QueryParam("user_domain") String userDomain, @QueryParam("start_date") String startDate, @QueryParam("end_date") String endDate, @QueryParam("time_zone") String timeZoneOffset)
    {
		try
		{
			List<GmapLogs> visitorsLatLong = GmapUtil.getGmapVisitors(userDomain, startDate, endDate, timeZoneOffset);
			return visitorsLatLong;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
    }
	
	/** API handles visitors page listview request to find the page views per session*/
	@Path("daterangebysession")
	@GET 
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<GmapLogs> getVisitorsBySession(@QueryParam("user_domain") String userDomain, @QueryParam("start_date") String startDate, @QueryParam("end_date") String endDate, @QueryParam("time_zone") String timeZoneOffset,@QueryParam("cursor") String offset,@QueryParam("page_size") String pageSize)
    {
		List<GmapLogs> visitorsLatLong = GmapUtil.getGmapVisitorsbySession(userDomain, startDate, endDate, timeZoneOffset,offset,pageSize);

		try
		{
			if(visitorsLatLong.isEmpty())
				return visitorsLatLong;
			GmapLogs visitor=visitorsLatLong.get(visitorsLatLong.size()-1);
			visitor.cursor=((offset == null) ? Integer.valueOf(0) : (Integer.parseInt(offset)) + Integer.parseInt(pageSize)) + "";
			return visitorsLatLong;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
    }
	
	
}
