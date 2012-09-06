package com.agilecrm.core.api.deals;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.deals.Milestone;

@Path("/api/milestone")
public class MilestoneAPI
{

    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Milestone updateMilestone(Milestone milestone)
    {
	milestone.save();
	return null;
    }

    @GET
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Milestone getMilestone()
    {
	Milestone milestone = Milestone.getMilestones();
	return milestone;
    }
}