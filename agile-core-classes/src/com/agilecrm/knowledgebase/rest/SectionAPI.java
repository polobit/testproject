package com.agilecrm.knowledgebase.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.knowledgebase.entity.Categorie;
import com.agilecrm.knowledgebase.entity.Section;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi
 * 
 */
@Path("/api/knowledgebase/section")
public class SectionAPI
{
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

}
