package com.agilecrm.core.api.search;

import java.util.Collection;
import java.util.Iterator;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.document.Document;
import com.agilecrm.search.query.QueryDocument;
import com.agilecrm.search.query.util.QueryDocumentUtil;

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
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Collection searchContacts(@QueryParam("q") String keyword, @QueryParam("page_size") String count,
	    @QueryParam("cursor") String cursor, @QueryParam("type") String type)
    {
	// If user didn't give the page size, set it to 10 by default. This
	// condition is to use this call in the API calls.
	if (StringUtils.isEmpty(count))
	    count = "10";
	return new AppengineSearch<Contact>(Contact.class).getSimpleSearchResultsWithCompany(keyword, Integer.parseInt(count),
		cursor, type);
    }

    @Path("{keyword}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Collection searchContactsOld(@PathParam("keyword") String keyword, @QueryParam("page_size") String count,
	    @QueryParam("cursor") String cursor, @QueryParam("type") String type)
    {
	return new AppengineSearch<Contact>(Contact.class).getSimpleSearchResults(keyword, Integer.parseInt(count),
		cursor, type);
    }

    /**
     * It initializes AppengineSearch, which is used to build query based on the
     * search keyword. AppengineSearch calls {@link QueryDocument} to perform
     * search, based on the keyword and cursor sent. It searchs on all the
     * entities (contacts, deals, cases)
     * 
     * @param keyword
     * @param count
     * @param cursor
     * @param type
     * @return
     */
    @Path("/all/keyword")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Collection searchAll(@QueryParam("q") String keyword, @QueryParam("page_size") String count,
	    @QueryParam("cursor") String cursor, @QueryParam("type") String type)
    {

	if (StringUtils.isEmpty(type))
	    return new QueryDocument(new Document().index, null).simpleSearch(keyword, Integer.parseInt(count), cursor);

	return new QueryDocument(new Document().index, null).simpleSearchWithType(keyword, Integer.parseInt(count),
		cursor, type);
    }

    /**
     * It initializes AppengineSearch, which is used to build query based on the
     * search keyword. AppengineSearch calls {@link QueryDocument} to perform
     * search, based on the keyword and cursor sent. It searchs on all the
     * entities (contacts, deals, cases)
     * 
     * @param keyword
     * @param count
     * @param cursor
     * @param type
     * @return
     */
    @Path("/all/{keyword}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Collection searchAllOld(@PathParam("keyword") String keyword, @QueryParam("page_size") String count,
	    @QueryParam("cursor") String cursor, @QueryParam("type") String type)
    {

	if (StringUtils.isEmpty(type))
	    return new QueryDocument(new Document().index, null).simpleSearch(keyword, Integer.parseInt(count), cursor);

	return new QueryDocument(new Document().index, null).simpleSearchWithType(keyword, Integer.parseInt(count),
		cursor, type);
    }

    /**
     * It initializes AppengineSearch, which is used to build query based on the
     * search keyword. AppengineSearch calls {@link QueryDocument} to perform
     * search, based on the keyword and cursor sent. It searchs on all the
     * entities (contacts, deals, cases)
     * 
     * @param keyword
     * @param count
     * @param cursor
     * @param type
     * @return
     */
    @Path("/duplicate-contacts/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Collection getDuplicateContacts(@PathParam("id") String id, @QueryParam("page_size") String count,
	    @QueryParam("cursor") String cursor)
    {
	Collection collection = null;
	try
	{
	    Contact contact = ContactUtil.getContact(Long.valueOf(id));

	    // getting search query for finding duplicate contacts
	    String query = QueryDocumentUtil.constructDuplicateContactsQuery(contact);

	    int pageSize = Integer.parseInt(count) + 1;

	    System.out.println(query);

	    AppengineSearch<Contact> appEngineSearch = new AppengineSearch<Contact>(Contact.class);
	    collection = appEngineSearch.getSearchResults(query, pageSize, cursor);
	    Iterator iterator = collection.iterator();
	    int counter = 0;
	    while (iterator.hasNext())
	    {
		Contact ctc = (Contact) iterator.next();
		if (ctc.id.longValue() == contact.id.longValue())
		{
		    if (counter == 0)
		    {
			int collCount = ctc.count;
			iterator.remove();
			if (iterator.hasNext())
			{
			    Contact ctc1 = (Contact) iterator.next();
			    ctc1.count = collCount;
			}
			return collection;
		    }
		    else
		    {
			iterator.remove();
			return collection;
		    }
		}
		counter++;
	    }
	    return collection;
	}
	catch (Exception e)
	{
	    System.out.println(e.getMessage());
	}
	return collection;
    }

    @Path("/deals")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Collection searchDeals(@QueryParam("q") String keyword, @QueryParam("page_size") String count,
	    @QueryParam("cursor") String cursor, @QueryParam("type") String type)
    {
	return new AppengineSearch<Opportunity>(Opportunity.class).getSimpleSearchResults(keyword,
		Integer.parseInt(count), cursor, type);

    }
}
