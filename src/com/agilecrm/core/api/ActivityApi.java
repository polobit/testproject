package com.agilecrm.core.api;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.agilecrm.activities.Activity;
import com.agilecrm.activities.util.ActivityUtil;

@Path("/api/activitylog")
public class ActivityApi
{

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

    @Path("/getActivitiesOnSelectedCondition")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Activity> getActivityBesedOnSelection(@QueryParam("entity_type") String entitytype,
	    @QueryParam("user_id") Long userid, @QueryParam("cursor") String cursor,
	    @QueryParam("page_size") String count)
    {

	return ActivityUtil.getActivitites(entitytype, userid, Integer.parseInt(count), cursor);
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

    @Path("{id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getActivity(@PathParam("id") Long id)
    {
	Activity activity = ActivityUtil.getActivity(id);
	System.out.println("task id " + activity);

	return activity.custom3;
    }
}
