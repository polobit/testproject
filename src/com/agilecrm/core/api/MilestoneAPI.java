package com.agilecrm.core.api;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.account.Milestone;

@Path("/api/milestone")
public class MilestoneAPI {

	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Milestone updateMilestone(Milestone milestone) {
		milestone.save();
		return null;
	}
	
	@GET
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Milestone getMilestone() {
		Milestone milestone = Milestone.getMilestones();
		String str = milestone.milestones;
		String noSpacestr = str.replaceAll("\\s+", "");
		milestone.milestones = noSpacestr;
		// return noSpacestr;
		 return milestone;
	}
	
}