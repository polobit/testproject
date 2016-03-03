package com.agilecrm.core.api;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.activities.Activity;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.util.DateUtil;


/**
 * <code>ActivityApi</code> class is intracts with ActivitySave to get activities based on time and filter
 */

@Path("/api/activitylog")
public class ActivityApi
{

	/**
	 * fetchs all activities based on cursor.
	 * @param cursor 
	 * @param count
	 * @return List of actiities
	 */
    @Path("/getAllActivities")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Activity> getAllActivities(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count)
    {

	if (count != null)
	{
	    System.out.println("Fetching page by page");
	    return ActivityUtil.getActivities(Integer.parseInt(count), cursor);
	}

	return null;
    }

    
    /**
     * fetches activities based on filters
     * @param entitytype  "DEAL,CONTACT,DOCUMENT,CALL
     * @param userid  
     * @param cursor
     * @param count
     * @param starttime
     * @param endtime
     * @return
     */
    
    @Path("/getActivitiesOnSelectedCondition")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Activity> getActivityBesedOnSelection(@QueryParam("entity_type") String entitytype,
	    @QueryParam("user_id") Long userid, @QueryParam("cursor") String cursor,
	    @QueryParam("page_size") String count, @QueryParam("start_time") Long starttime,
	    @QueryParam("end_time") Long endtime,@QueryParam("campaign-id") String id)
    {
    
    //filter on campaign id
    	Long campignId=null;
    	if(StringUtils.isNumeric(id))
    		campignId=Long.parseLong(id);
    	
    	
    String time_zone = DateUtil.getCurrentUserTimezoneOffset();
	if (starttime != null && endtime != null)
	{
		if (time_zone !=null )
	    {
	    	starttime -= (Long.parseLong(time_zone)*60*1000);
	    	endtime -= (Long.parseLong(time_zone)*60*1000);
	    }
	    starttime = starttime / 1000;
	    endtime = endtime / 1000;
	}

	return ActivityUtil.getActivititesBasedOnSelectedConditon(entitytype, userid, Integer.parseInt(count), cursor,
	        starttime, endtime, campignId);
    }

    /**
     * fetches activities based on entityid
     * @param cursor
     * @param max
     * @return
     */

    @Path("/getActivityByEntityId")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Activity> getActivities(@QueryParam("entity_id") Long entity_id, @QueryParam("cursor") String cursor,
	    @QueryParam("page_size") String count)
    {

	return ActivityUtil.getActivitites(entity_id, Integer.parseInt(count), cursor);
    }

    // fetches current user activities

    @Path("/getActivitiesofcurrentdomainuser")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Activity> getCurrentUserActivities(@QueryParam("cursor") String cursor,
	    @QueryParam("page_size") String max)
    {
	if (max != null)
	{
	    System.out.println("Fetching page by page");
	    return ActivityUtil.getActivitiesOfCurrentUser(Integer.parseInt(max), cursor);
	}

	return null;
    }

    
    /**
     * gets single activity entity based on activity id;
     * @param id
     * @return
     */
    @Path("{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public Activity getActivity(@PathParam("id") Long id)
    {
	Activity activity = ActivityUtil.getActivity(id);
	System.out.println("activity id " + activity);

	return activity;
    }
}