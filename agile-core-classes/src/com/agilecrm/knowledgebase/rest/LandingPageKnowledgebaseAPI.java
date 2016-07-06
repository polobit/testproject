package com.agilecrm.knowledgebase.rest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.knowledgebase.entity.LandingPageKnowledgebase;

@Path("/api/knowledgebase/KBlandingpage")
public class LandingPageKnowledgebaseAPI
{
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
	
	public  LandingPageKnowledgebase saveKbLandingpageid(LandingPageKnowledgebase lpKb ){		
		
		
		if(lpKb.kbLandingpageid == null)
			return null;
		
		LandingPageKnowledgebase.dao.put(lpKb);
	    	return lpKb;
	
	}
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
	
	public  LandingPageKnowledgebase updateKbLandingpageid(LandingPageKnowledgebase lpKb ){		
		
		if(lpKb.kbLandingpageid == null)
			return null;
		
		LandingPageKnowledgebase.dao.put(lpKb);
	    	return lpKb;
	}
}
