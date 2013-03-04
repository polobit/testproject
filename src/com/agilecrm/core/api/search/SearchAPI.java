package com.agilecrm.core.api.search;

import java.util.Collection;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.agilecrm.search.AppengineSearch;

@Path("api/search")
public class SearchAPI
{
    // This method is called if XML is request
    @SuppressWarnings("rawtypes")
    @Path("/{keyword}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Collection searchContacts(@PathParam("keyword") String keyword,
	    @QueryParam("page_size") String count,
	    @QueryParam("cursor") String cursor)
    {
	return AppengineSearch.getSimpleSearchResults(keyword,
		Integer.parseInt(count), cursor);
    }
}
