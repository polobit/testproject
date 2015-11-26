package com.agilecrm.core.api.deals;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import net.sf.json.JSONObject;

import com.agilecrm.deals.Goals;
import com.agilecrm.deals.util.GoalsUtil;
import com.agilecrm.reports.Reports;
import com.agilecrm.reports.ReportsUtil;


@Path("/api/goals")
public class GoalsApi
{

	 /**
     * Lists all the reports available in current domain
     * 
     * @return {@link List} of {@link Reports}
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Goals> getListOfReports()
    {
	return GoalsUtil.fetchAllGoals();
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
    public List<Goals> createGoal(JSONObject jsonObject)
    {
    	return GoalsUtil.saveGoal(jsonObject);
    	
    }
}
