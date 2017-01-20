package com.agilecrm.core.api.deals;

import java.util.ArrayList;
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

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.contact.filter.util.ContactFilterUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.filter.DealFilter;
import com.agilecrm.deals.filter.util.DealFilterUtil;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.util.UserAccessControlUtil;

@Path("/api/deal/filters")
public class DealFilterAPI {
	/**
	 * Gets List of deal filters added for current user
	 * 
	 * @return {@link List} of {@link DealFilter}
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<DealFilter> getAllFilters()throws Exception{
		// Returns list of filters saved by current user
		return DealFilterUtil.getAllFilters();
	}
	
	/**
	 * Adding of new filter
	 * 
	 * @param dealFilter
	 * 
	 * @return {@link DealFilter}
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public DealFilter createFilter(DealFilter dealFilter) {
		try {
			if(dealFilter!=null){	
				dealFilter.save();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return dealFilter;
	}
	
	/**
	 * Adding of new filter
	 * 
	 * @param dealFilter
	 * 
	 * @return {@link DealFilter}
	 */
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public DealFilter updateFilter(DealFilter dealFilter) {
		try {
			if(dealFilter!=null){	
				dealFilter.save();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return dealFilter;
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
	DealFilter.dao.deleteBulkByIds(contactFiltersJSONArray);
    }
    
    /**
     * Returns {@link Opportunity} list based on the {@link SearchRule} in the
     * {@link DealFilter} which is fetched by its id. It checks the type of
     * request, whether filter is on custom built criteria or default filters,
     * based on which results are returned returned
     * 
     * @param id
     *            {@link DealFilter} id
     * @return {@link Collection} list of contact
     */
    @Path("/query/list/{filter_id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Opportunity> getQueryResultsList(@PathParam("filter_id") String id, @QueryParam("page_size") String count,
    		@QueryParam("cursor") String cursor, @QueryParam("order_by") String sortKey) throws JSONException
    {
	System.out.println("cursor : " + cursor);
	if (!StringUtils.isEmpty(count))
	    return DealFilterUtil.getDeals(id, Integer.parseInt(count), cursor, sortKey, null, null);

	return DealFilterUtil.getDeals(id, 25, null, sortKey, null, null);
    }
    
    /**
     * Returns {@link Opportunity} list based on the {@link SearchRule} in the
     * {@link DealFilter} which is fetched by its id. It checks the type of
     * request, whether filter is on custom built criteria or default filters,
     * based on which results are returned returned
     * 
     * @param id
     *            {@link DealFilter} id
     * @return {@link Collection} list of contact
     */
    @Path("/query/grid/{filter_id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Opportunity> getQueryResults(@PathParam("filter_id") String id, @QueryParam("page_size") String count, @QueryParam("cursor") String cursor, 
    		@QueryParam("order_by") String sortKey, @QueryParam("pipeline_id") String pipeline, @QueryParam("milestone") String milestone) throws JSONException
    {
	System.out.println("cursor : " + cursor);
	if (!StringUtils.isEmpty(count))
	    return DealFilterUtil.getDeals(id, Integer.parseInt(count), cursor, sortKey, pipeline, milestone);

	return DealFilterUtil.getDeals(id, 25, null, sortKey, pipeline, milestone);
    }
    
    /**
     * Returns {@link Opportunity} list based on tags in the
     * {@link DealFilter} which is fetched by its id. It checks the type of
     * request, whether filter is on custom built criteria or default filters,
     * based on which results are returned returned
     * 
     * @param id
     *            {@link DealFilter} id
     * @return {@link Collection} list of contact
     */
    @Path("/query/list/tags/{tag_name}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Opportunity> getOpportubitiesListWithTags(@PathParam("tag_name") String tagName, @QueryParam("page_size") String count, @QueryParam("cursor") String cursor, 
    		@QueryParam("order_by") String sortKey) throws JSONException
    {
	System.out.println("cursor : " + cursor);
	if (!StringUtils.isEmpty(count))
	    return DealFilterUtil.getDealsWithTag(tagName, Integer.parseInt(count), cursor, sortKey);

	return DealFilterUtil.getDealsWithTag(tagName, 25, null, sortKey);
    }
    
    /**
     * Returns {@link Opportunity} count object based on the {@link SearchRule} in the
     * {@link DealFilter} which is fetched by its id. It checks the type of
     * request, whether filter is on custom built criteria or default filters,
     * based on which results are returned returned
     * 
     * @param id
     *            {@link DealFilter} id
     * @return {@link Collection} list of contact
     */
    @Path("/query/total/{filter_id}")
    @GET
    @Produces({ MediaType.TEXT_PLAIN, MediaType.APPLICATION_JSON })
    public JSONObject getQueryResultsCount(@PathParam("filter_id") String id, @QueryParam("page_size") String count, @QueryParam("cursor") String cursor, 
    		@QueryParam("order_by") String sortKey, @QueryParam("pipeline_id") String pipeline, @QueryParam("milestone") String milestone) throws JSONException
    {
    List<Opportunity> oppList = null;
	System.out.println("cursor : " + cursor);
	if (!StringUtils.isEmpty(count))
	    oppList = DealFilterUtil.getDeals(id, Integer.parseInt(count), cursor, sortKey, pipeline, milestone);

	oppList = DealFilterUtil.getDeals(id, 1000, null, sortKey, pipeline, milestone);
	
	return DealFilterUtil.getDealsCountBasedOnList(oppList, milestone);
	
    }
    
    @POST
    @Path("/filter/report-filter")
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @SuppressWarnings("unchecked")
    public List<Opportunity> filterDeals(@FormParam("filterJson") String filterJson, @FormParam("page_size") String count, @FormParam("cursor") String cursor,
    		@QueryParam("order_by") String sortKey)
    {
	DealFilter deal_filter = DealFilterUtil.getFilterFromJSONString(filterJson);
	
	
	DealFilterUtil.setTrackAndMilestoneFilters(deal_filter, null, null);
	DealFilterUtil.lostDeals(deal_filter);
	// Modification to sort based on company name. This is required as
	// company name lower is saved in different field in text search
	sortKey = (sortKey != null ? ((sortKey.equals("name") || sortKey.equals("-name")) ? sortKey.replace("name",
		"name_lower") : sortKey) : null);

	// Sets ACL condition
	UserAccessControlUtil.checkReadAccessAndModifyTextSearchQuery(
		UserAccessControl.AccessControlClasses.Opportunity.toString(), deal_filter.rules, null);
	return new ArrayList<Opportunity>(deal_filter.queryDeals(Integer.parseInt(count), cursor, sortKey));
    }
}
