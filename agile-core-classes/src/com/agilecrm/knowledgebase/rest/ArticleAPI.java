package com.agilecrm.knowledgebase.rest;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.knowledgebase.entity.Article;
import com.agilecrm.knowledgebase.entity.Categorie;
import com.agilecrm.knowledgebase.entity.Section;
import com.agilecrm.knowledgebase.util.ArticleUtil;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi
 * 
 */
@Path("/api/knowledgebase/article")
public class ArticleAPI
{
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

	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Article> getArticles(@QueryParam("categorie_id") Long categorie_id,
			@QueryParam("section_id") Long section_id)
	{
		return ArticleUtil.getArticles(categorie_id, section_id);
	}

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

}
