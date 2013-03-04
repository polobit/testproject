package com.agilecrm.core.api.contacts;

import java.util.Collection;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactFilter;
import com.agilecrm.contact.ContactFilter.DefaultFilter;
import com.agilecrm.search.ui.serialize.SearchRule;

/**
 * <code>ContactFilterAPI</code> class includes REST calls to access
 * {@link ContactFilter}s
 * <p>
 * It is accessed from client, to create a new filter, shows filters in list, to
 * show filtered/queried results
 * </p>
 * 
 * @author Yaswanth
 */
@Path("/api/filters")
public class ContactFilterAPI
{

    /**
     * Fetches all the {@link List} of {@link ContactFilter}s
     * 
     * @return {@link List} of {@link ContactFilter}s
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<ContactFilter> getContactFilters()
    {
	return ContactFilter.getAllContactFilters();
    }

    /**
     * Saves a {@link ContactFilter} entity
     * 
     * @param contact_filter
     *            {@link ContactFilter}
     * @return {@link ContactFilter}
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ContactFilter createContactFilter(ContactFilter contact_filter)
    {
	contact_filter.save();
	return contact_filter;
    }

    /**
     * Updates the existing {@link ContactFilter} object
     * 
     * @param contact_filter
     *            {@link ContactFilter}
     * @return {@link ContactFilter}
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ContactFilter updateContactFilter(ContactFilter contact_filter)
    {
	contact_filter.save();
	return contact_filter;
    }

    /**
     * Fetches {@link ContactFilter} object based on its Id
     * 
     * @param id
     *            of {@link ContactFilter} entity
     * @return {@link ContactFilter}
     */
    @Path("{filter_id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public ContactFilter getContactFilter(@PathParam("filter_id") Long id)
    {
	try
	{
	    return ContactFilter.getContactFilter(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Returns {@link Contact}s list based on the {@link SearchRule} in the
     * {@link ContactFilter} which is fetched by its id. It checks the type of
     * request, whether filter is on custom built criteria or default filters,
     * based on which results are returned returned
     * 
     * @param id
     *            {@link ContactFilter} id
     * @return {@link Collection} list of contact
     */
    @Path("/query/{filter_id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Collection getQueryResults(@PathParam("filter_id") String id,
	    @QueryParam("page_size") String count,
	    @QueryParam("cursor") String cursor)
    {
	try
	{

	    // Checks if Filter id contacts "system", which indicates the
	    // request is to load results based on the default filters provided
	    if (id.contains("system"))
	    {
		// Seperates "system-" from id and checks the type of the filter
		// (RECETN of LEAD), accordingly contacts are fetched and
		// returned
		id = id.split("-")[1];

		if (id.equalsIgnoreCase("RECENT"))
		{
		    return ContactFilter.getContacts(DefaultFilter.RECENT);
		}
		else if (id.equalsIgnoreCase("LEAD"))
		{
		    return ContactFilter.getContacts(DefaultFilter.MY_LEAD);
		}

		// If requested id contains "system" in it, but it doesn't match
		// with RECENT/LEAD then return null
		return null;
	    }

	    // If Request is not on default filters, then fetch Filter based on
	    // id
	    ContactFilter filter = ContactFilter.getContactFilter(Long
		    .parseLong(id));

	    // Queries based on list of search rules in the filter object
	    return filter.queryContacts(Integer.parseInt(count), cursor);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Deletes List of filters, based on the ids sent
     * 
     * @param model_ids
     *            Stringified representation of list of ids
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteContacts(@FormParam("model_ids") String model_ids)
	    throws JSONException
    {

	JSONArray contactFiltersJSONArray = new JSONArray(model_ids);

	// Deletes all contact filters with ids specified in the list
	ContactFilter.dao.deleteBulkByIds(contactFiltersJSONArray);
    }
}
