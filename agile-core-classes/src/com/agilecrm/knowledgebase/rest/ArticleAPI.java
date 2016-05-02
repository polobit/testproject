package com.agilecrm.knowledgebase.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
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

import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.knowledgebase.entity.Article;
import com.agilecrm.knowledgebase.entity.Categorie;
import com.agilecrm.knowledgebase.entity.Section;
import com.agilecrm.knowledgebase.util.ArticleUtil;
import com.agilecrm.search.document.HelpcenterArticleDocument;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi
 * 
 */
@Path("/api/knowledgebase/article")
public class ArticleAPI
{
	/**
	 * 
	 * @param id
	 * @return
	 * @throws Exception
	 */
	@GET
	@Path("/{id}")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Article getArticle(@PathParam("id") Long id) throws Exception
	{
		try
		{
			Article article = Article.dao.get(id);
			article.categorie = Categorie.dao.get(article.categorie_key);
			article.section = Section.dao.get(article.section_key);

			return article;
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * 
	 * @param categorie_id
	 * @param section_id
	 * @return
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Article> getArticles(@QueryParam("categorie_id") Long categorie_id,
			@QueryParam("section_id") Long section_id)
	{
		return ArticleUtil.getArticles(categorie_id, section_id);
	}
	
	/**
	 * 
	 * @param search_term
	 * @return
	 * @throws Exception
	 */
	@GET
	@Path("/search/{search_term}")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Article> searchArticles(@PathParam("search_term") String search_term) throws Exception
	{
		try
		{
			System.out.println("query: " + search_term);

			JSONObject resultJSON = new HelpcenterArticleDocument().searchDocuments(search_term);

			JSONArray keysArray = resultJSON.getJSONArray("keys");

			List<Key<Article>> keys = new ArrayList<Key<Article>>();

			for (int i = 0; i < keysArray.length(); i++)
				keys.add((Key<Article>) keysArray.get(i));

			System.out.println("keys: " + keys);

			return Article.dao.fetchAllByKeys(keys);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * 
	 * @param article
	 * @return
	 * @throws WebApplicationException
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Article createArticle(Article article) throws WebApplicationException
	{
		try
		{
			Key<Section> section_key = new Key<Section>(Section.class, article.section_id);
			article.section_key = section_key;

			Key<Categorie> categorie_key = new Key<Categorie>(Categorie.class, article.categorie_id);
			article.categorie_key = categorie_key;

			article.save();
		}
		catch (Exception e)
		{
			System.out.println("exception occured while creating workflow creation activity");

			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return article;
	}
	/**
	 * 
	 * @param article,id
	 * @return
	 * @throws WebApplicationException
	 */
	@PUT
	@Path("/{id}")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Article updateArticle(Article article) throws WebApplicationException
	{
		try
		{
			Key<Section> section_key = new Key<Section>(Section.class, article.section_id);
			article.section_key = section_key;

			Key<Categorie> categorie_key = new Key<Categorie>(Categorie.class, article.categorie_id);
			article.categorie_key = categorie_key;

			article.save();
		}
		catch (Exception e)
		{
			System.out.println("exception occured while creating workflow creation activity");

			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return article;
	}
	
	/**
	 * 
	 * @param article,id
	 * @return
	 * @throws WebApplicationException
	 */
	@PUT
	@Path("/update-status/{id}")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Article updateArticleStatus(Article article) throws WebApplicationException
	{
		try
		{
			if(article.id == null)
				throw new Exception("Required params missing.");
			
			Article dbArticle = Article.dao.get(article.id);

			dbArticle.is_article_published = article.is_article_published;
			
			dbArticle.save();
		}
		catch (Exception e)
		{
			System.out.println("exception occured while creating workflow creation activity");

			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return article;
	}

}