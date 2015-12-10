package com.agilecrm.core.api.deals;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.agilecrm.deals.Goals;
import com.agilecrm.deals.util.GoalsUtil;
import com.agilecrm.portlets.Portlet;
import com.agilecrm.portlets.util.PortletUtil;
import com.agilecrm.reports.Reports;
import com.agilecrm.reports.ReportsUtil;


/**
 * <code>GoalsAPI</code> includes REST calls to interact with
 * {@link Goals class to initiate Goals CRUD operations.
 * <p>
 * It is called from client side to create, update, fetch the
 * portlets. It also interacts with {@link GoalsUtil} class
 * </p>
 * 
 * @author Nidhi
 * 
 */

@Path("/api/goals")
public class GoalsAPI
{

	 /**
     * Lists all the reports available in current domain
     * 
     * @return {@link List} of {@link Reports}
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Goals> getListOfGoals(@QueryParam("start_time") Long start_time)
    {
	return GoalsUtil.fetchAllGoals(start_time);
    }
    
    /**
     * Saves repots
     * 
     * @param Report
     * @return
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Goals> createGoal(List<Goals> goals)
    {
    	List<Goals> goal_new=new ArrayList<Goals>();
    	for(Goals goal:goals){
    		if(goal.id!=null)
    			goal_new.add(goal);
	    if(goal.amount!=null || goal.count!=null)
	    		goal_new.add(goal);
    		//System.out.println("goal");
    	}
    	return GoalsUtil.saveGoal(goal_new);
    	
    }
    @Path("{owner-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Goals> getGoalsForUser(@PathParam("owner-id") Long owner_id,@QueryParam("start_time") Long start_time,@QueryParam("end_time") Long end_time)
    {
    	return GoalsUtil.getAllGoalsForUser(owner_id, start_time, end_time);
    }
}
