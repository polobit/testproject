package com.agilecrm.core.api.search;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.document.Document;
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
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Collection searchContacts(@QueryParam("q") String keyword, @QueryParam("page_size") String count,
			@QueryParam("cursor") String cursor, @QueryParam("type") String type)
	{
		return new AppengineSearch<Contact>(Contact.class).getSimpleSearchResults(keyword, Integer.parseInt(count),
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
		Contact contact = ContactUtil.getContact(Long.valueOf(id));
		String firstName = contact.getContactFieldValue("first_name");
		String lastName = contact.getContactFieldValue("last_name");
		StringBuffer emailBuffer = new StringBuffer();
		StringBuffer phoneBuffer = new StringBuffer();
		StringBuffer stringBuffer = new StringBuffer();
		List<String> emails = new ArrayList<String>();
		List<String> phones = new ArrayList<String>();
		stringBuffer.append("(first_name=" + firstName + " AND " + "last_name=" + lastName + ")");
		List<ContactField> properties = contact.getProperties();
		for (int i = 0; i < properties.size(); i++)
		{
			ContactField contactField = properties.get(i);
			if (contactField.name.equalsIgnoreCase("phone"))
				phones.add(contactField.value);
			if (contactField.name.equalsIgnoreCase("email"))
				emails.add(contactField.value);
		}
		if (emails.size() > 0)
		{
			emailBuffer.append(" OR email=(");
			for (int i = 0; i < emails.size(); i++)
			{
				emailBuffer.append(emails.get(i));
				if (!(i == emails.size() - 1))
					emailBuffer.append(" OR ");
				else
					emailBuffer.append(")");
			}
		}
		if (phones.size() > 0)
		{
			phoneBuffer.append(" OR phone=(");
			for (int i = 0; i < phones.size(); i++)
			{
				phoneBuffer.append(phones.get(i));
				if (!(i == phones.size() - 1))
					phoneBuffer.append(" OR ");
				else
					phoneBuffer.append(")");
			}
		}
		int pageSize = Integer.parseInt(count) + 1;

		stringBuffer.append(phoneBuffer.toString());
		stringBuffer.append(emailBuffer.toString());

		String query = stringBuffer.toString();

		System.out.println(query);

		AppengineSearch<Contact> appEngineSearch = new AppengineSearch<Contact>(Contact.class);
		Collection collection = appEngineSearch.getSearchResults(query, pageSize, cursor);
		Iterator iterator = collection.iterator();
		while (iterator.hasNext())
		{
			Contact ctc = (Contact) iterator.next();
			if (ctc.id.longValue() == contact.id.longValue())
			{
				iterator.remove();
				return collection;
			}
		}
		return collection;
	}
}
