package com.agilecrm.core.api.calendar;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
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
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.Category;
import com.agilecrm.activities.util.CategoriesUtil;
import com.agilecrm.contact.util.TagUtil;

@Path("/api/categories")
public class CategoriesAPI
{
    private CategoriesUtil categoriesUtil = null;

    public CategoriesAPI()
    {
	categoriesUtil = new CategoriesUtil();
    }

    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Category> getCategories(@QueryParam("entity_type") String entityType)
    {
	if (StringUtils.isEmpty(entityType))
	    return categoriesUtil.getAllCategories();
	return null;
    }

    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Category createCategory(Category category)
    {
	if (category.getId() != null)
	    return updateCategory(category);

	if (!TagUtil.isValidTag(category.getLabel()))
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Invalid category name.").build());

	if (categoriesUtil.getCategoryByName(category.getLabel()).size() > 0)
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Category with this name already exists.").build());

	return categoriesUtil.createCategory(category);
    }

    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Category updateCategory(Category category)
    {
	if (!TagUtil.isValidTag(category.getLabel()))
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Invalid category name.").build());

	/*
	 * if (category.getName() !=
	 * CategoriesUtil.encodeCategory(category.getLabel()))
	 * categoriesUtil.deleteCategory(category.getId());
	 */
	return categoriesUtil.updateCategory(category);
    }

    @Path("order")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public String saveCategoryOrder(@FormParam("ids") String ids)
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
		categoriesUtil.saveCategoryOrder(catIds);
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

    @Path("delete")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteCategory(@FormParam("id") String id)
    {
	try
	{
	    categoriesUtil.deleteCategory(Long.parseLong(id));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Unable to delete Category. Please check the input.").build());
	}
    }

}
