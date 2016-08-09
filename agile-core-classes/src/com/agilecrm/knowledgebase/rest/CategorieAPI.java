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
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.util.CategoriesUtil;
import com.agilecrm.knowledgebase.entity.Article;
import com.agilecrm.knowledgebase.entity.Categorie;
import com.agilecrm.knowledgebase.entity.Section;
import com.agilecrm.knowledgebase.util.CategorieUtil;
import com.agilecrm.knowledgebase.util.SectionUtil;
import com.agilecrm.ticket.entitys.TicketCannedMessages;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;

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
			categorie.sections = SectionUtil.getSectionByCategorie(categorie.id, false);

		return categories;
	}

	@GET
	@Path("/kb-admin")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Categorie> getAdminCategories()
	{
		List<Categorie> categories = CategorieUtil.getCategories();

		if (categories == null)
			return null;

		for (Categorie categorie : categories)
			categorie.sections = SectionUtil.getSectionByCategorie(categorie.id, true);

		return categories;
	}

	@GET
	@Path("{id}")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Categorie getCategorie(@PathParam("id") Long id)
	{
		try
		{
			Categorie dbcategorie = Categorie.dao.get(id);
			
			
			return dbcategorie;
		}
		catch (Exception e)
		{
			System.out.println("exception occured while creating workflow creation activity");
			return new Categorie();
			
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

	@POST
	@Path("/bulk")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public String deleteCategories(@FormParam("ids") String model_ids) throws JSONException
	{
		try
		{
			JSONArray cat_ids = new JSONArray(model_ids);
			for (int i = 0; i < cat_ids.length(); i++)
			{

				Long id = (long) cat_ids.get(i);
				Key<Categorie> categorie_key = new Key<Categorie>(Categorie.class, id);
				Query<Section> q = Section.dao.ofy().query(Section.class).filter("categorie_key =", categorie_key);
				Query<Article> qa = Article.dao.ofy().query(Article.class).filter("categorie_key =", categorie_key);
				List<Section> sections = Section.dao.fetchAll(q);
				List<Article> articles = Article.dao.fetchAll(qa);
				Section.dao.deleteAll(sections);
				Article.dao.deleteAll(articles);
			}

			Categorie.dao.deleteBulkByIds(new JSONArray(model_ids));
		}
		catch (Exception e)
		{
			e.printStackTrace();
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return new JSONObject().put("status", "success").toString();
	}

	/**
	 * Save the category order based on the order of the category id's sent.
	 * 
	 * @param ids
	 *            category ids.
	 * @return successes message after saving or else error message.
	 */
	@Path("position")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public String setCategorieOrder(String ids)
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
				CategorieUtil.saveCategorieOrder(catIds);
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

	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Categorie updateCategorie(Categorie categorie) throws WebApplicationException
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

	/**
	 * Deletes category by IDs
	 * 
	 */
	@DELETE
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String deleteCategorie(@PathParam("id") Long id)
	{
		try
		{
			if (id == null)
				throw new Exception("Required parameter missing.");

			CategorieUtil.delete(id);

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
