package com.agilecrm.knowledgebase.rest;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

import com.agilecrm.knowledgebase.entity.Categorie;
import com.agilecrm.knowledgebase.entity.Section;
import com.agilecrm.knowledgebase.util.CategorieUtil;
import com.agilecrm.knowledgebase.util.SectionUtil;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi
 * 
 */
@Path("/api/knowledgebase/section")
public class SectionAPI
{
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Section getSection(@QueryParam("id") Long id)
	{
		try
		{
			Section section = Section.dao.get(id);
			section.categorie = Categorie.dao.get(section.categorie_key);
			
			return section;
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	@GET
	@Path("/categorie/{id}")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Section> getSectionsByCategorie(@PathParam("id") Long categorieID)
	{
		try
		{
			return SectionUtil.getSectionByCategorie(categorieID);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Section createSection(Section section) throws WebApplicationException
	{
		try
		{
			if (StringUtils.isBlank(section.name) || StringUtils.isBlank(section.description)
					|| section.categorie_id == null)
				throw new Exception("Required params missing.");

			Key<Categorie> categorie_key = new Key<Categorie>(Categorie.class, section.categorie_id);

			section.categorie_key = categorie_key;
			section.save();
		}
		catch (Exception e)
		{
			System.out.println("exception occured while creating workflow creation activity");

			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return section;
	}
	
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Section updateSection(Section section) throws WebApplicationException
	{
		try
		{
			if (StringUtils.isBlank(section.name) || StringUtils.isBlank(section.description)
					|| section.categorie_id == null)
				throw new Exception("Required params missing.");

			Key<Categorie> categorie_key = new Key<Categorie>(Categorie.class, section.categorie_id);

			section.categorie_key = categorie_key;
			section.save();
		}
		catch (Exception e)
		{
			System.out.println("exception occured while creating workflow creation activity");

			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return section;
	}

	/**
	 * Deletes section by IDs
	 * 
	 */
	@DELETE 
	@Produces(MediaType.APPLICATION_JSON)
	public String deleteSection(@QueryParam("id") Long id)
	{
		try
		{
			if (id == null)
				throw new Exception("Required parameter missing.");

			SectionUtil.delete(id);

			return new JSONObject().put("status", "success").toString();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

	}
}
