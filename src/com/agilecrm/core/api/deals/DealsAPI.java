package com.agilecrm.core.api.deals;

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
import javax.ws.rs.core.MediaType;

import net.sf.json.JSONObject;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.user.notification.util.DealNotificationPrefsUtil;
import com.agilecrm.workflows.triggers.util.DealTriggerUtil;

/**
 * <code>DealsAPI</code> includes REST calls to interact with
 * {@link Opportunity} class to initiate Opportunity/Deal CRUD operations.
 * <p>
 * It is called from client side to create, update, fetch and delete the
 * opportunities. It also interacts with {@link OpportunityUtil} class to fetch
 * the data of Opportunity class from database.
 * </p>
 * 
 * @author Yaswanth
 * 
 */
@Path("/api/opportunity")
public class DealsAPI
{
    /**
     * Returns list of opportunities. This method is called if TEXT_PLAIN is
     * request.
     * 
     * @return list of opportunities.
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Opportunity> getOpportunities()
    {
	return OpportunityUtil.getOpportunities();
    }

    /**
     * Return opportunity with respect to Id. This method is called if XML is
     * request.
     * 
     * @param id
     *            - Opportunity Id to be fetched.
     * @return Opportunity object.
     */
    @Path("{opportunity-id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public Opportunity getOpportunity(@PathParam("opportunity-id") Long id)
    {
	Opportunity opportunity = OpportunityUtil.getOpportunity(id);
	return opportunity;
    }

    /**
     * Return opportunity with respect to Id. This method is called if XML is
     * request.
     * 
     * @param id
     *            - Opportunity Id to be fetched.
     * @return Opportunity object.
     * @throws JSONException
     */
    @Path("/byMilestone")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public JSONObject getOpportunitiesByMilestone()
    {
	JSONObject opportunity = OpportunityUtil.getDealsByMilestone();
	return opportunity;
    }

    /**
     * Return opportunities with respect to Milestone.
     * 
     * @param milestone
     *            - Milestone for the deals.
     * @return Opportunities list having the given milestone.
     */
    @Path("/byMilestone/{milestone}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public JSONObject getOpportunitiesWithMilestone(@PathParam("milestone") String milestone)
    {
	ObjectMapper mapper = new ObjectMapper();
	JSONObject opportunity = new JSONObject();
	String opportunitiesList = "[]";
	try
	{
	    opportunitiesList = mapper.writeValueAsString(OpportunityUtil.getDealsWithMilestone(milestone));
	    opportunitiesList = opportunitiesList.replace("null", "\"\"");
	    opportunity.put(milestone, opportunitiesList);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return opportunity;
    }

    /**
     * Saves new Opportunity.
     * 
     * @param opportunity
     *            - Opportunity object that is newly created.
     * @return created opportunity.
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Opportunity createOpportunity(Opportunity opportunity)
    {
	opportunity.save();
	return opportunity;
    }

    /**
     * Updates opportunity.
     * 
     * @param opportunity
     *            - Opportunity object that is updated.
     * @return - updated opportunity.
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Opportunity updateOpportunity(Opportunity opportunity)
    {
	opportunity.save();
	return opportunity;
    }

    /**
     * Deletes single opportunity.
     * 
     * @param id
     *            - Opportunity id that should be deleted.
     */
    @Path("{opportunity-id}")
    @DELETE
    public void deleteOpportunity(@PathParam("opportunity-id") Long id)
    {
	Opportunity opportunity = OpportunityUtil.getOpportunity(id);
	if (opportunity != null)
	    opportunity.delete();
    }

    /**
     * Returns milestones with respect to given minimum time and maximum time.
     * Deals Stats - Milestones.
     * 
     * @param min
     *            - given time less than closed date of deal.
     * @param max
     *            - given time more than closed date of deal.
     * @return milestones.
     */
    @Path("stats/milestones")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getDealsStatsForMilestones(@QueryParam("min") Long min, @QueryParam("max") Long max)
    {
	return OpportunityUtil.getMilestones(min, max).toString();
    }

    /**
     * Returns percentage of opportunities won compared to total opportunities
     * exist with respect to closed date. Deals Stats - Conversions.
     * 
     * @param min
     *            - Given time less than closed date.
     * @param max
     *            - Given time more than closed date.
     * @return percentage of opportunities won in given time period.
     */
    @Path("stats/conversions")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getConversions(@QueryParam("min") Long min, @QueryParam("max") Long max)
    {
	return OpportunityUtil.getConversionDetails(min, max).toString();
    }

    /**
     * Gets sum of expected values and pipeline values of the deals having
     * closed date within the month of given time period. Deals Stats - Details.
     * 
     * @param min
     *            - Given time less than closed date.
     * @param max
     *            - Given time more than closed date.
     * @return string having sum of expected values and pipeline values of the
     *         deals of same month.
     */
    @Path("stats/details")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getDealsDetails(@QueryParam("min") Long min, @QueryParam("max") Long max)
    {
	return OpportunityUtil.getDealsDetails(min, max).toString();
    }

    /**
     * Deletes the bulk of deals and executes trigger to the related contacts of
     * each deal. Bulk operations - delete.
     * 
     * @param model_ids
     *            array of deal ids as String.
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteOpportunities(@FormParam("ids") String model_ids) throws JSONException
    {
	JSONArray opportunitiesJSONArray = new JSONArray(model_ids);

	// Executes trigger when deal is deleted
	DealTriggerUtil.executeTriggerForDeleteDeal(opportunitiesJSONArray);

	// Executes notification when deal is deleted
	DealNotificationPrefsUtil.executeNotificationForDeleteDeal(opportunitiesJSONArray);

	Opportunity.dao.deleteBulkByIds(opportunitiesJSONArray);
    }

    /**
     * Deals related to current user
     * 
     * @return list of opportunities.
     */
    @Path("/my/deals")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Opportunity> getDealsRelatedToCurrentUser()
    {
	return OpportunityUtil.getDealsRelatedToCurrentUser();
    }

    /**
     * To display upcoming deals on DashBoard.
     * 
     * @param page_size
     * @return list of opportunities.
     */
    @Path("/my/upcoming-deals")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Opportunity> getUpcomingDealsRelatedToCurrentUser(@QueryParam("page_size") String page_size)
    {
	if (page_size != null)
	    return OpportunityUtil.getUpcomingDealsRelatedToCurrentUser(page_size);

	return OpportunityUtil.getUpcomingDealsRelatedToCurrentUser("10");
    }
}