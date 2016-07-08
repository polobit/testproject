package com.agilecrm.knowledgebase.rest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.knowledgebase.entity.LandingPageKnowledgebase;

@Path("/api/knowledgebase/KBlandingpage")
public class LandingPageKnowledgebaseAPI
{
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
	
	public  LandingPageKnowledgebase saveKbLandingpageid(LandingPageKnowledgebase lpKb ){		
		
		try{	
			if(lpKb.kbLandingpageid == null)
				return null;
			
			LandingPageKnowledgebase.dao.put(lpKb);
		    	return lpKb;
	
		}
	    	catch(Exception e){
				System.out.println(ExceptionUtils.getFullStackTrace(e));
				throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
						.build());
			}
	}
	
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
	
	public  LandingPageKnowledgebase updateKbLandingpageid(LandingPageKnowledgebase lpKb ){		
		
		try{
			if(lpKb.kbLandingpageid == null)
				return null;
			
			LandingPageKnowledgebase.dao.put(lpKb);
		    	return lpKb;
		}
		catch(Exception e){
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
		
		}
	
	@DELETE
	@Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)	
	public  String deleteKbLandingpageid(@PathParam("id") long id) throws JSONException{		
		
		try{
			LandingPageKnowledgebase lbkbobj = LandingPageKnowledgebase.dao.get(id);
			
			LandingPageKnowledgebase.dao.delete(lbkbobj);
			
		   	return new JSONObject().put("status", "success").toString();
		}
		catch(Exception e){
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	
}
