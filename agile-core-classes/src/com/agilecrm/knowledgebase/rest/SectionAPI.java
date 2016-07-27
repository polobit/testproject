package com.agilecrm.knowledgebase.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
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
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.knowledgebase.entity.Article;
import com.agilecrm.knowledgebase.entity.Categorie;
import com.agilecrm.knowledgebase.entity.Section;
import com.agilecrm.knowledgebase.util.SectionUtil;
import com.agilecrm.ticket.entitys.TicketStats;
import com.agilecrm.ticket.utils.TicketStatsUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;

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
	public Section getSection(@QueryParam("name") String name)
	{
		try
		{
			Section section = Section.dao.getByProperty("name", name);
			if (section == null)
			{
				return null;
			}
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
	@Path("/kb-admin")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Section getAdminSection(@QueryParam("id") long id)
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
		return SectionUtil.getSectionByCategorie(categorieID, false);
	}

	@GET
	@Path("/{id}")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Section> getSections(@PathParam("id") Long categorieID)
	{
		return SectionUtil.getSectionByCategorie(categorieID, true);
	}

	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Section createSection(Section section) throws WebApplicationException
	{
		try
		{
			if (StringUtils.isBlank(section.name) || section.categorie_id == null)
				throw new Exception("Required params missing.");

			Section existingsection = Section.dao.getByProperty("name", section.name);
			if (existingsection != null && !existingsection.equals(section.name))
			{
				throw new Exception("Section with name " + section.name + " already exists.");
			}
			Key<Categorie> categorie_key = new Key<Categorie>(Categorie.class, section.categorie_id);

			section.categorie_key = categorie_key;
			section.save();
			// Updating ticket count DB
			TicketStatsUtil.updateEntity(TicketStats.Section_Count);
		}
		catch (Exception e)
		{
			System.out.println("exception occured while creating workflow creation activity");

			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return section;
	}

	@POST
	@Path("/bulk")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public String deleteSections(@FormParam("ids") String model_ids) throws JSONException
	{
		try
		{
			JSONArray section_ids = new JSONArray(model_ids);
			
			for(int i=0;i<section_ids.length();i++){
				Long id = (long)section_ids.get(i);
				
				Key<Section> section_key = new Key<Section>(Section.class, id);
				
				Query<Article> q = Article.dao.ofy().query(Article.class).filter("section_key =", section_key);
				List <Article> sectionarticles = Article.dao.fetchAll(q);
				Article.dao.deleteAll(sectionarticles);
			}
			
			Section.dao.deleteBulkByIds(new JSONArray(model_ids));
			
		}
		catch (Exception e)
		{
			e.printStackTrace();
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return new JSONObject().put("status", "success").toString();
	}

	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Section updateSection(Section section) throws WebApplicationException, EntityNotFoundException
	{
		Section dbsection = Section.dao.get(section.id);
		try
		{
			if (StringUtils.isBlank(section.name) || section.categorie_id == null)
				throw new Exception("Required params missing.");

			Section existingsection = Section.dao.getByProperty("name", section.name);
			if (existingsection != null && (existingsection.name.equals(section.name))
					&& !(dbsection.name.equals(section.name)))
			{
				throw new Exception("Section with name " + section.name
						+ " already exists. Please choose a different name.");
			}

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

	/**
	 * Save the section order based on the order of the section id's sent.
	 * 
	 * @param ids
	 *            section ids.
	 * @return successes message after saving or else error message.
	 */
	@Path("position")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public String setSectionOrder(String ids)
	{
		System.out.println("-----------" + ids);
		JSONObject result = new JSONObject();
		try
		{
			JSONArray idsArray = null;
			if (StringUtils.isNotEmpty(ids))
			{
				idsArray = new JSONArray(ids);
				System.out.println("------------" + idsArray.length());
				List<Long> catIds = new ArrayList<Long>();
				for (int i = 0; i < idsArray.length(); i++)
				{
					catIds.add(Long.parseLong(idsArray.getString(i)));
				}
				SectionUtil.saveSectionOrder(catIds);
				result.put("message", "Order changes sucessfully.");
			}
			return result.toString();
		}
		catch (Exception je)
		{
			je.printStackTrace();
			try
			{
				result.put("error", "Unable to update the order. Please check the input.");
				throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(result).build());
			}
			catch (JSONException e)
			{
				e.printStackTrace();
			}
			return null;
		}
	}

}
