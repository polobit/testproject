package com.agilecrm.core.api.deals;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

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
	milestone.save();
	return null;
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
	milestone.save();
	return milestone;
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
	milestone.save();
	return milestone;
    }

    /**
     * Returns milestone saved in datastores.
     * 
     * @return milestone objects.
     */
    @Path("/pipelines/{id}")
    @DELETE
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Milestone deletePipeline(@PathParam("id") Long id)
    {
	Milestone milestone = MilestoneUtil.getMilestone(id);
	milestone.delete();
	return milestone;
    }
}