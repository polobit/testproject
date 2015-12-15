package com.agilecrm.core.api.deals;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.deals.filter.DealFilter;
import com.agilecrm.deals.filter.util.DealFilterUtil;

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
}
