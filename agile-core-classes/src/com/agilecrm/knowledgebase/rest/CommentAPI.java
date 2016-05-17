package com.agilecrm.knowledgebase.rest;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

import com.agilecrm.knowledgebase.entity.Article;
import com.agilecrm.knowledgebase.entity.Categorie;
import com.agilecrm.knowledgebase.entity.Comment;
import com.agilecrm.knowledgebase.entity.HelpcenterUser;
import com.agilecrm.knowledgebase.entity.Section;
import com.agilecrm.knowledgebase.util.CommentUtil;
import com.agilecrm.knowledgebase.util.SectionUtil;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi
 * 
 */
@Path("/api/knowledgebase/comment")
public class CommentAPI
{
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Comment> getComments(@QueryParam("article_id") Long article_id)
	{
		try
		{
			return CommentUtil.getCommentsByArticleID(article_id);
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
	public List<Comment> createComment(Comment comment,@QueryParam("article_id") long article_id) throws WebApplicationException
	{
		try
		{
			comment.article_key = new Key<Article>(Article.class, article_id);
			comment.save();			
		
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			System.out.println("exception occured while creating workflow creation activity");

			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return CommentUtil.getCommentsByArticleID(article_id);
	}
	
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Comment updateComment(Comment comment,@QueryParam("article_id") long article_id) throws WebApplicationException
	{
		try
		{
			comment.article_key = new Key<Article>(Article.class, article_id);
			comment.save();			
		
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			System.out.println("exception occured while creating workflow creation activity");

			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return comment;
	}

	@DELETE 
	@Produces(MediaType.APPLICATION_JSON)
	public String deletecomment(@QueryParam("id") Long id)
	{
	    	
		try
		{
			if (id == null)
				throw new Exception("Required parameter missing.");

						
			CommentUtil.delete(id);

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