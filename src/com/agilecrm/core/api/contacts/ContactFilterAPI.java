package com.agilecrm.core.api.contacts;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.contact.filter.util.ContactFilterUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.google.gson.Gson;

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
    public List<Contact> getQueryResults(@PathParam("filter_id") String id, @QueryParam("page_size") String count,
	    @QueryParam("cursor") String cursor, @QueryParam("global_sort_key") String sortKey)
    {
	System.out.println("cursor : " + cursor);
	if (!StringUtils.isEmpty(count))
	    return ContactFilterUtil.getContacts(id, Integer.parseInt(count), cursor, sortKey);

	return ContactFilterUtil.getContacts(id, null, null, sortKey);
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
    public void deleteContacts(@FormParam("ids") String model_ids) throws JSONException
    {

	JSONArray contactFiltersJSONArray = new JSONArray(model_ids);

	// Deletes all contact filters with ids specified in the list
	ContactFilter.dao.deleteBulkByIds(contactFiltersJSONArray);
    }
    
    @GET
    @Path("/filter/dynamic-filter")
    @Consumes({ MediaType.WILDCARD})
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Contact> filterContacts(@QueryParam("data") String data, @QueryParam("page_size") String count,
    	    @QueryParam("cursor") String cursor, @QueryParam("global_sort_key") String sortKey)
    {
    	Gson gson = new Gson();
    	ContactFilter contact_filter = gson.fromJson(data, ContactFilter.class);
    	SearchRule rule = new SearchRule();
	    rule.LHS = "type";
	    rule.CONDITION = RuleCondition.EQUALS;
	    rule.RHS = contact_filter.contact_type.toString();
	    contact_filter.rules.add(rule);
    	/*if(isDatastoreQuery(contact_filter.rules)) {
    		return ContactUtil.getContactsForTagRules(contact_filter.rules, Integer.parseInt(count), cursor, sortKey);
    	}*/
    	return new ArrayList<Contact>(contact_filter.queryContacts(Integer.parseInt(count), cursor, sortKey));
    }
    
    private Boolean isDatastoreQuery(List<SearchRule> rules) {
    	boolean retVal = true;
    	for(SearchRule rule:rules) {
    		if(!rule.LHS.equals("tags")){
    			return false;
    		}
    	}
    	return retVal;
    }
}
