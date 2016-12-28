package com.agilecrm.core.api.analytics;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
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

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;

import com.agilecrm.user.util.DomainUserUtil;
import com.analytics.VisitorFilter;
import com.analytics.util.AnalyticsUtil;
import com.analytics.util.VisitorsUtil;
import com.campaignio.reports.DateUtil;

/**
 * <code>VisitorFilterAPI</code> is the API class that handles segment filter requests.
 *It stores filters and also fetched data according to stored filters. 
 * @author Sonali
 */

@Path("/api/web-stats")
public class VisitorFilterAPI
{
    /**
     * 
     * @return List of filters
     */
    @GET
    @Path("/filters")
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<VisitorFilter> getFilters()
    {
	try
	{
	    return AnalyticsUtil.getAllSegmentFilters(DomainUserUtil.getCurentUserKey());
	}
	catch (Exception e)
	{
	    System.out.println(ExceptionUtils.getFullStackTrace(e));
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }
    
    @POST
    @Path("/filters")
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public VisitorFilter createFilter(VisitorFilter newFilter)
    {
	VisitorFilter filter=new VisitorFilter();
	try
	{   
	   if( newFilter.filter_id!=0l && newFilter.segmentConditions==null ){
	      	filter = VisitorFilter.getSegmentFilter(newFilter.filter_id);
	      	newFilter.segmentConditions=filter.segmentConditions;
	   }
	    if (newFilter.segmentConditions.length() == 0)
		throw new Exception("Atleast one condition is required.");
	  
	       
	    newFilter.setOwner_key(DomainUserUtil.getCurentUserKey());
	       
	    VisitorFilter.dao.put(newFilter);
	    
	    return newFilter;
	}
	catch (Exception e)
	{
	    System.out.println(ExceptionUtils.getFullStackTrace(e));
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }
    
    /**
     * Updates filter conditions success message if filter is updated
     * successfully
     */
    @PUT
    @Path("/filters")
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public VisitorFilter updateFilter(VisitorFilter updateFilter)
    {
	try
	{
	    updateFilter.setOwner_key(DomainUserUtil.getCurentUserKey());
	    
	    VisitorFilter.dao.put(updateFilter);
	    
	    return updateFilter;
	}
	catch (Exception e)
	{
	    System.out.println(ExceptionUtils.getFullStackTrace(e));
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }
    
    @Path("/query/list/{filter_id}")
    @POST
    @Produces({ MediaType.APPLICATION_JSON + ";charset=utf-8" , MediaType.APPLICATION_XML })
    public String getQueryResultsList(@PathParam("filter_id") String id, @FormParam("page_size") String countString,
	    @FormParam("cursor") String cursorString, @FormParam("start_time") Long startTime,
	    @FormParam("end_time") Long endTime, @FormParam("timeZone") String timeZone)
    {
	
	JSONArray contacts = new JSONArray();
	try
	{
		
	    int cursor = AnalyticsUtil.getIntegerValue(cursorString, 0);
	    int count = AnalyticsUtil.getIntegerValue(countString, 20);
	    if (StringUtils.isBlank(cursorString))
		cursorString = "0";
	    String startTimeString = DateUtil.getMySQLNowDateFormat(startTime, timeZone);
	    String endTimeString = DateUtil.getMySQLNowDateFormat(endTime, timeZone);
	    VisitorFilter filter = VisitorFilter.getSegmentFilter(Long.parseLong(id));
	    System.out.println(filter.segmentConditions);
	    List<String> contactEmails = AnalyticsUtil.getEmails(filter.segmentConditions.toString(), startTimeString,
		    endTimeString, countString, cursorString);
	    contacts = VisitorsUtil.getContactsFromDataStore(contactEmails);
	   
	}
	
	catch (Exception e)
	{
	    return contacts.toString();
	}
	return contacts.toString();
    }
    /**
     * 
     * @delete selected segment filter from saved segment filters
     */
    @DELETE
    @Path("/filters")
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteFilter(@QueryParam("Id") String filter_id)
    {
	try
	{
	    AnalyticsUtil.deleteSegmentFilter(Long.parseLong(filter_id));
	}
	catch (Exception e)
	{
	    System.out.println(ExceptionUtils.getFullStackTrace(e));
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }
}
