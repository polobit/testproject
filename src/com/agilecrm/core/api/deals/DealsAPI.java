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

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.user.util.DealNotificationPrefsUtil;
import com.agilecrm.workflows.triggers.util.DealTriggerUtil;

@Path("/api/opportunity")
public class DealsAPI
{

    // This method is called if TEXT_PLAIN is request
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Opportunity> getOpportunities()
    {
	return OpportunityUtil.getOpportunities();
    }

    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Opportunity createOpportunity(Opportunity opportunity)
    {
	opportunity.save();
	return opportunity;
    }

    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Opportunity updateOpportunity(Opportunity opportunity)
    {
	opportunity.save();
	return opportunity;
    }

    @Path("{opportunity-id}")
    @DELETE
    public void deleteOpportunity(@PathParam("opportunity-id") Long id)
    {
	Opportunity opportunity = OpportunityUtil.getOpportunity(id);
	if (opportunity != null)
	    opportunity.delete();
    }

    // This method is called if XML is request
    @Path("{opportunity-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Opportunity getOpportunity(@PathParam("opportunity-id") Long id)
    {
	Opportunity opportunity = OpportunityUtil.getOpportunity(id);
	return opportunity;
    }

    // / Deals Stats - Milestons
    @Path("stats/milestones")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getDealsStatsForMilestones(@QueryParam("min") Long min,
	    @QueryParam("max") Long max)
    {
	return OpportunityUtil.getMilestones(min, max).toString();
    }

    // / Deals Stats - Conversions
    @Path("stats/conversions")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getConversions(@QueryParam("min") Long min,
	    @QueryParam("max") Long max)
    {
	return OpportunityUtil.getConversionDetails(min, max).toString();
    }

    // / Deals Stats - Conversions
    @Path("stats/details")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getDealsDetails(@QueryParam("min") Long min,
	    @QueryParam("max") Long max)
    {
	return OpportunityUtil.getDealsDetails(min, max).toString();
    }

    // Bulk operations - delete
    /**
     * Deletes the bulk of deals and executes trigger to the related contacts of
     * each deal
     * 
     * @param model_ids
     *            array of deal ids as String
     * @throws JSONException
     */
    @SuppressWarnings("unused")
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteOpportunities(@FormParam("model_ids") String model_ids)
	    throws JSONException
    {
	String id = null;

	JSONArray opportunitiesJSONArray = new JSONArray(model_ids);

	// Executes trigger when deal is deleted
	DealTriggerUtil.executeTriggerForDeleteDeal(opportunitiesJSONArray);

	// Executes notification when deal is deleted
	DealNotificationPrefsUtil
		.executeNotificationForDeleteDeal(opportunitiesJSONArray);

	Opportunity.dao.deleteBulkByIds(opportunitiesJSONArray);

    }
}