package com.agilecrm.core.api.calendar;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.activities.Category;
import com.agilecrm.activities.util.CategoriesUtil;

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
	return categoriesUtil.createCategory(category);
    }

    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Category updateCategory(Category category)
    {
	if (category.getName() != CategoriesUtil.encodeCategory(category.getLabel()))
	    categoriesUtil.deleteCategory(category.getId());
	return categoriesUtil.updateCategory(category);
    }

}
