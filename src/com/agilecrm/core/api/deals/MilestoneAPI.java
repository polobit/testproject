package com.agilecrm.core.api.deals;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
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
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Milestone getMilestone()
    {
	Milestone milestone = MilestoneUtil.getMilestones();
	return milestone;
    }
}