package com.agilecrm.core.api.contacts;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

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
    public void deleteCustomField(@PathParam("id") String id)
    {
	try
	{
	    CustomFieldDef customFieldDef = CustomFieldDef.get(Long
		    .parseLong(id));
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

}