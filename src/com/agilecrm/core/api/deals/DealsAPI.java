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

@Path("/api/opportunity")
public class DealsAPI
{

    // This method is called if TEXT_PLAIN is request
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Opportunity> getOpportunities()
    {
	return Opportunity.getOpportunities();
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
    public void deleteOpportunity(@PathParam("opportunity-id") String id)
    {
	Opportunity opportunity = Opportunity
		.getOpportunity(Long.parseLong(id));
	if (opportunity != null)
	    opportunity.delete();
    }

    // This method is called if XML is request
    @Path("{opportunity-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Opportunity getOpportunity(@PathParam("opportunity-id") String id)
    {
	Opportunity opportunity = Opportunity
		.getOpportunity(Long.parseLong(id));
	return opportunity;
    }

    // / Deals Stats - Milestons
    @Path("stats/milestones")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getDealsStatsForMilestones(@QueryParam("min") String min,
	    @QueryParam("max") String max)
    {
	return Opportunity.getMilestones(Long.parseLong(min),
		Long.parseLong(max)).toString();
    }

    // / Deals Stats - Conversions
    @Path("stats/conversions")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getConversions(@QueryParam("min") String min,
	    @QueryParam("max") String max)
    {
	return Opportunity.getConversionDetails(Long.parseLong(min),
		Long.parseLong(max)).toString();
    }

    // / Deals Stats - Conversions
    @Path("stats/details")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getDealsDetails(@QueryParam("min") String min,
	    @QueryParam("max") String max)
    {
	return Opportunity.getDealsDetails(Long.parseLong(min),
		Long.parseLong(max)).toString();
    }

    // Bulk operations - delete
    @Path("bulk")
    @DELETE
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteOpportunities(@FormParam("model_ids") String model_ids)
	    throws JSONException
    {
	JSONArray opportunitiesJSONArray = new JSONArray(model_ids);
	Opportunity.dao.deleteBulkByIds(opportunitiesJSONArray);
    }

}