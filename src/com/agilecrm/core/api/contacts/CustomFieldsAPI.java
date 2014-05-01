package com.agilecrm.core.api.contacts;

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

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.CustomFieldDef.SCOPE;
import com.agilecrm.contact.util.CustomFieldDefUtil;

/**
 * <code>CustomFieldsAPI</code> includes REST calls to interact with
 * {@link CustomFieldDef} class to initiate Task CRUD operations
 * <p>
 * It is called from client side to create, update, fetch and delete the custom
 * fieds.It also interacts with {@link CustomFieldUtil} class to fetch the data
 * of <code>CustomFieldDef</code> class from database.
 * </p>
 * 
 * @author Yaswanth
 * 
 */
@Path("/api/custom-fields")
public class CustomFieldsAPI
{

    /**
     * Gets all custom fields
     * 
     * @return List of custom fields
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getCustomFields()
    {
	try
	{
	    return CustomFieldDefUtil.getAllCustomFields();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets all custom fields
     * 
     * @return List of custom fields
     */
    @Path("/scope")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getCustomFieldsByScopeType(@QueryParam("scope") String scope)
    {
	try
	{
	    if (scope == null)
		CustomFieldDefUtil.getAllCustomFields();

	    return CustomFieldDefUtil.getAllCustomFields(SCOPE.valueOf(scope));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets all custom fields
     * 
     * @return List of custom fields
     */
    @Path("/type/scope")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getCustomFieldsByScopeAndType(@QueryParam("scope") String scope,
	    @QueryParam("type") String type)
    {
	try
	{
	    if (scope == null)
		return CustomFieldDefUtil.getFieldByType(type);

	    if (type == null)
		return CustomFieldDefUtil.getAllCustomFields(SCOPE.valueOf(scope));

	    return CustomFieldDefUtil.getCustomFieldsByScopeAndType(SCOPE.valueOf(scope), type);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets all custom fields
     * 
     * @return List of custom fields
     */
    @Path("/searchable/scope")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getSearchableCustomFieldsByScope(@QueryParam("scope") String scope)
    {
	try
	{
	    if (scope == null)
		CustomFieldDefUtil.getSearchableCustomFields();

	    return CustomFieldDefUtil.getSearchableCustomFieldsByScope(SCOPE.valueOf(scope));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets all custom fields
     * 
     * @return List of custom fields
     */
    @Path("/searchable")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getSearchableCustomFields()
    {
	try
	{
	    return CustomFieldDefUtil.getSearchableCustomFields();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets all custom fields by type
     * 
     * @return List of custom fields
     */
    @Path("/type/{field_type}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getCustomFieldsByType(@PathParam("field_type") String type)
    {
	try
	{
	    return CustomFieldDefUtil.getFieldByType(type);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Deletes the custom field based on 'id' from the database
     * 
     * @param id
     *            unique id of the custom field
     */
    @Path("/{id}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteCustomField(@PathParam("id") Long id)
    {
	try
	{
	    CustomFieldDef customFieldDef = CustomFieldDefUtil.getCustomField(id);
	    if (customFieldDef != null)
		customFieldDef.delete();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Saves new custom field by validating its label name. Exception will be
     * thrown if a duplicate field with same label exists
     * 
     * @param customField
     * @return
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public CustomFieldDef createCustomField(CustomFieldDef customField)
    {
	try
	{
	    customField.save();
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry, a custom field with that name is already present.").build());
	}
	return customField;
    }

    /**
     * Updates the existing field by validating its label name
     * 
     * @param customField
     *            custom field which is going to be updated
     * @return updated custom field data
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public CustomFieldDef updateCustomField(CustomFieldDef customField)
    {
	try
	{
	    customField.save();
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry, a custom field with that name is already present.").build());
	}
	return customField;
    }

    /**
     * Deletes all selected custom fields using array of corresponding ids
     * 
     * @param model_ids
     *            array of custom field ids as String
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteCustomFields(@FormParam("ids") String model_ids) throws JSONException
    {
	JSONArray CustomFieldsJSONArray = new JSONArray(model_ids);
	CustomFieldDef.dao.deleteBulkByIds(CustomFieldsJSONArray);
    }
}