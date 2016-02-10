package com.agilecrm.core.api.dashboards;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.dashboards.Dashboard;
import com.agilecrm.dashboards.util.DashboardUtil;
import com.agilecrm.deals.filter.DealFilter;

/**
 * <code>DashboardsAPI</code> includes REST calls to interact with
 * {@link Dashboard} class to initiate Dashboards CRUD operations.
 * <p>
 * It is called from client side to create, update, fetch and delete the
 * dashboards. It also interacts with {@link DashboardUtil} class to fetch
 * the data of Dashboard class from database.
 * </p>
 * 
 * @author Subrahmanyam
 * 
 */
@Path("/api/dashboards")
public class DashboardsAPI {
	/**
	 * Gets List of dashboards added for current user
	 * 
	 * @return {@link List} of {@link Dashboard}
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Dashboard> getPortlets()throws Exception{
		
		// Returns list of dashboards saved by current user
		return DashboardUtil.getAddedDashboardsForCurrentUser();
	}
	/**
	 * Adding of new dashboard
	 * 
	 * @param portlets
	 * 
	 * @return {@link List} of {@link Dashboard}
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Dashboard createDashboard(Dashboard dashboard) throws Exception{
		
		if(dashboard != null && DashboardUtil.isDuplicateDashboard(dashboard)) {
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Dashboard with this name already exists.").build());
		}
		
		if(dashboard != null) {
			dashboard.save();
		}
		return dashboard;
	}
	
	/**
	 * Updating existed dashboard
	 * 
	 * @param portlets
	 * 
	 * @return {@link List} of {@link Dashboard}
	 */
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Dashboard updateDashboard(Dashboard dashboard) {
		try {
			if(dashboard!=null){	
				dashboard.save();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return dashboard;
	}
	
	/**
     * Deletes List of dashboards, based on the ids sent
     * 
     * @param model_ids
     *            Stringified representation of list of ids
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteDashboards(@FormParam("ids") String model_ids) throws JSONException {

		JSONArray dashboardsJSONArray = new JSONArray(model_ids);
	
		// Deletes all dashboards with ids specified in the list
		Dashboard.dao.deleteBulkByIds(dashboardsJSONArray);
    }

}
