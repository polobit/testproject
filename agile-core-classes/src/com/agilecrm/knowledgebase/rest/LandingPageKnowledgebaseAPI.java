package com.agilecrm.knowledgebase.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.knowledgebase.entity.LandingPageKnowledgebase;
import com.agilecrm.knowledgebase.util.KbLandingPageUtil;

@Path("/api/knowledgebase/KBlandingpage")
public class LandingPageKnowledgebaseAPI
{

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public LandingPageKnowledgebase get()
	{
		return KbLandingPageUtil.get();
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public void save(LandingPageKnowledgebase lpKb)
	{
		try
		{
			upsert(lpKb);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public void update(LandingPageKnowledgebase lpKb)
	{
		try
		{
			upsert(lpKb);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	private void upsert(LandingPageKnowledgebase lpKb) throws Exception
	{
		if (lpKb.kb_landing_page_id.equals(0))
			lpKb.kb_landing_page_id = null;

		lpKb.save();

	}
}
