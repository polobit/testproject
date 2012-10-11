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
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactFilter;

@Path("/api/filters")
public class ContactFilterAPI
{

    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<ContactFilter> getContactFilters()
    {
	return ContactFilter.getAllContactFilters();
    }

    // Save Filter contacts
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ContactFilter createContactFilter(ContactFilter contact_filter)
    {
	contact_filter.save();
	return contact_filter;
    }

    // Update filters
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ContactFilter updateContactFilter(ContactFilter contact_filter)
    {
	contact_filter.save();
	return contact_filter;
    }

    @Path("{filter_id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public ContactFilter getContactFilter(@PathParam("filter_id") String id)
    {
	try
	{
	    return ContactFilter.getContactFilter(Long.parseLong(id));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    @Path("/query/{filter_id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getQueryResults(@PathParam("filter_id") String id)
    {
	try
	{
	    ContactFilter filter = ContactFilter.getContactFilter(Long
		    .parseLong(id));

	    List<Contact> contacts = filter.queryContacts();

	    return contacts;
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    // Bulk operations - delete
    @Path("bulk")
    @DELETE
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteContacts(@FormParam("model_ids") String model_ids)
	    throws JSONException
    {

	JSONArray contactFiltersJSONArray = new JSONArray(model_ids);

	ContactFilter.dao.deleteBulkByIds(contactFiltersJSONArray);
    }
}
