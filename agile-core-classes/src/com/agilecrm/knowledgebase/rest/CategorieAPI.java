package com.agilecrm.knowledgebase.rest;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.knowledgebase.entity.Categorie;
import com.agilecrm.knowledgebase.util.CategorieUtil;
import com.agilecrm.knowledgebase.util.SectionUtil;

/**
 * 
 * @author Sasi
 * 
 */
@Path("/api/knowledgebase/categorie")
public class CategorieAPI
{
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Categorie> getCategories()
	{
		List<Categorie> categories = CategorieUtil.getCategories();

		for (Categorie categorie : categories)
			categorie.sections = SectionUtil.getSectionByCategorie(categorie.id);

		return categories;
	}

	@GET
	@Path("/{id}")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Categorie getCategorie(@PathParam("id") Long id)
	{
		try
		{
			return Categorie.dao.get(id);
		}
		catch (Exception e)
		{
			System.out.println("exception occured while creating workflow creation activity");

			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Categorie createCategorie(Categorie categorie) throws WebApplicationException
	{
		try
		{
			categorie.save();
		}
		catch (Exception e)
		{
			System.out.println("exception occured while creating workflow creation activity");

			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return categorie;
	}
}
