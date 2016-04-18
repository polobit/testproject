package com.agilecrm.knowledgebase.rest;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;

import com.agilecrm.knowledgebase.entity.Categorie;
import com.agilecrm.knowledgebase.util.CategorieUtil;

/**
 * 
 * @author Sasi
 * 
 */
@Path("/api/helpcenter/categorie")
public class CategorieAPI
{
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Categorie> getCategories()
	{
		return CategorieUtil.getCategories();
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
		}

		return categorie;
	}
}
