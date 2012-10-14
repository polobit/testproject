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
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.CustomFieldDef;

@Path("/api/custom-fields")
public class CustomFieldsAPI
{

    // Custom Fields
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<CustomFieldDef> getCustomFields()
    {

	try
	{
	    return CustomFieldDef.getCustomFields();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Delete Custom Field
    @Path("/{id}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteCustomField(@PathParam("id") Long id)
    {
	try
	{
	    CustomFieldDef customFieldDef = CustomFieldDef.get(id);
	    if (customFieldDef != null)
		customFieldDef.delete();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    // New Custom Field
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public CustomFieldDef createCustomField(CustomFieldDef customField)
    {
	CustomFieldDef custom_field = CustomFieldDef.dao.ofy()
		.query(CustomFieldDef.class)
		.filter("field_label", customField.field_label).get();
	if (custom_field != null)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Sorry, duplicate custom field label.").build());
	}

	customField.save();
	return customField;
    }

    // Update Custom Field
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public CustomFieldDef updateCustomField(CustomFieldDef customField)
    {
	customField.save();
	return customField;
    }

    // Bulk operations - delete
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteContacts(@FormParam("model_ids") String model_ids)
	    throws JSONException
    {
	JSONArray CustomFieldsJSONArray = new JSONArray(model_ids);
	CustomFieldDef.dao.deleteBulkByIds(CustomFieldsJSONArray);
    }
}