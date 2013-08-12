package com.agilecrm.core.api.search;

import java.util.Collection;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.agilecrm.contact.Contact;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.query.QueryDocument;

/**
 * <code>SearchAPI</code> class is used to search contacts based on keywords and
 * type (Contact, Company). It uses AppengineSearch to connect with document
 * search, which is used for searching/filtering contacts.
 * 
 * @author Yaswanth
 * 
 */
@Path("api/search")
public class SearchAPI
{
	/**
	 * It initializes AppengineSearch, which is used to build query based on the
	 * search keyword. AppengineSearch calls {@link QueryDocument} to perform
	 * search, based on the keyword and cursor sent.
	 * 
	 * @param keyword
	 * @param count
	 * @param cursor
	 * @param type
	 * @return
	 */
	@Path("/{keyword}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Collection searchContacts(@PathParam("keyword") String keyword, @QueryParam("page_size") String count,
			@QueryParam("cursor") String cursor, @QueryParam("type") String type)
	{
		return new AppengineSearch<Contact>(Contact.class).getSimpleSearchResults(keyword, Integer.parseInt(count),
				cursor, type);
	}
}
