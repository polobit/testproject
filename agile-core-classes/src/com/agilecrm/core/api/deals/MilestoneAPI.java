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
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.util.MilestoneUtil;

/**
 * <code>MilestoneAPI</code> includes REST calls to interact with
 * {@link Milestone} class. It is called to get milestone and update existing
 * milestone.
 * <p>
 * Milestones are given separately under admin-settings in client-side. The
 * domain user can assign required milestones.
 * </p>
 * 
 * @author Yaswanth
 * 
 */
@Path("/api/milestone")
public class MilestoneAPI
{
    /**
     * Updates milestone.
     * 
     * @param milestone
     *            - Milestone object to be updated.
     * @return null once milestone saved.
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Milestone updateMilestone(Milestone milestone)
    {
	return MilestoneUtil.saveMileston(milestone);
    }

    /**
     * Returns milestone saved in datastores.
     * 
     * @return milestone objects.
     */
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Milestone getMilestone()
    {
	Milestone milestone = MilestoneUtil.getMilestones();
	return milestone;
    }

    /**
     * Returns milestone saved in datastores.
     * 
     * @return milestone objects.
     */
    @Path("/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Milestone getMilestoneById(@PathParam("id") Long id)
    {
	Milestone milestone = MilestoneUtil.getMilestone(id);
	return milestone;
    }

    /**
     * Returns milestone saved in datastores.
     * 
     * @return milestone objects.
     */
    @Path("/pipelines")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Milestone> getPipelines()
    {
	List<Milestone> milestone = MilestoneUtil.getMilestonesList();
	return milestone;
    }

    /**
     * Returns milestone saved in datastores.
     * 
     * @return milestone objects.
     */
    @Path("/pipelines")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Milestone savePipeline(Milestone milestone)
    {
	return MilestoneUtil.saveMileston(milestone);
    }

    /**
     * Returns milestone saved in datastores.
     * 
     * @return milestone objects.
     */
    @Path("/pipelines")
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Milestone updatePipeline(Milestone milestone)
    {
	return MilestoneUtil.saveMileston(milestone);
    }

    /**
     * Delete milestone with the given id from datastores.
     * 
     * @return milestone objects.
     */
    @Path("/pipelines/{id}")
    @DELETE
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Milestone deletePipeline(@PathParam("id") Long id)
    {
	List<Milestone> milestones = MilestoneUtil.getMilestonesList();
	// If there is only one pipeline, throw the exception.
	if (milestones.size() == 1)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry, There should be atleast one track.").build());
	}
	Milestone milestone = null;
	for (int i = 0; i < milestones.size(); i++)
	{
	    milestone = milestones.get(i);
	    // If user is deleting the default pipeline, set the next once as
	    // the default pipeline.
	    if (id.equals(milestone.id) && milestone.isDefault)
	    {
		Milestone defaultMile = i == 0 ? milestones.get(1) : milestones.get(0);
		defaultMile.isDefault = true;
		defaultMile.save();
	    }

	    if (id.equals(milestone.id))
	    {
		milestone.delete();
	    }
	}
	return milestone;
    }

    /**
     * 
     * @return tracks count
     */
    @GET
    @Path("/tracks/count")
    @Produces(MediaType.TEXT_PLAIN)
    public int domainUserCount()
    {
	return MilestoneUtil.getCount();
    }

    @POST
    @Path("/won")
    public void setWonMilestone(@FormParam("pipeline_id") Long pipelineId, @FormParam("milestone") String milestone)
    {
	try
	{
	    MilestoneUtil.setWonMilestone(pipelineId, milestone);
	}
	catch (Exception e)
	{
	    System.out.println("Exception : " + e.getMessage());
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    @POST
    @Path("/lost")
    public void setLostMilestone(@FormParam("pipeline_id") Long pipelineId, @FormParam("milestone") String milestone)
    {

	try
	{
	    MilestoneUtil.setLostMilestone(pipelineId, milestone);
	}
	catch (Exception e)
	{
	    System.out.println("Exception : " + e.getMessage());
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }
}