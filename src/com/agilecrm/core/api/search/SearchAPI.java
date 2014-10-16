package com.agilecrm.core.api.search;

import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

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
		Collection collection = null;
		try
		{
			Contact contact = ContactUtil.getContact(Long.valueOf(id));
			String firstName = contact.getContactFieldValue("first_name");
			String lastName = contact.getContactFieldValue("last_name");
			StringBuffer emailBuffer = new StringBuffer();
			StringBuffer phoneBuffer = new StringBuffer();
			StringBuffer stringBuffer = new StringBuffer();
			Set<String> emails = new HashSet<String>();
			Set<String> phones = new HashSet<String>();
			String fName = firstName.replaceAll("\"", "\\\\\"");
			if (StringUtils.isNotBlank(lastName))
			{
				String lName = lastName.replaceAll("\"", "\\\\\"");
				stringBuffer.append("(first_name=\"" + fName + "\" AND " + "last_name=\"" + lName + "\")");
			}
			else
				stringBuffer.append("first_name=" + firstName);
			List<ContactField> properties = contact.getProperties();
			for (int i = 0; i < properties.size(); i++)
			{
				ContactField contactField = properties.get(i);
				if (contactField.name.equalsIgnoreCase("phone"))
				{
					if (StringUtils.isNotBlank(contactField.value))
						phones.add((contactField.value).trim());
				}
				if (contactField.name.equalsIgnoreCase("email"))
				{
					if (StringUtils.isNotBlank(contactField.value))
						emails.add(contactField.value);
				}
			}
			if (emails.size() > 0)
			{
				Object[] emailsArray = emails.toArray();
				for (int i = 0; i < emailsArray.length; i++)
				{
					if (i == 0)
					{
						emailBuffer.append(" OR email=(");
					}
					emailBuffer.append("\"");
					emailBuffer.append(emailsArray[i]);
					emailBuffer.append("\"");
					if (!(i == emailsArray.length - 1))
						emailBuffer.append(" OR ");
					else
						emailBuffer.append(")");
				}
			}
			if (phones.size() > 0)
			{
				Object[] phonesArray = phones.toArray();
				for (int i = 0; i < phonesArray.length; i++)
				{
					if (i == 0)
					{
						phoneBuffer.append(" OR phone=(");
					}
					phoneBuffer.append("\"");
					phoneBuffer.append(phonesArray[i]);
					phoneBuffer.append("\"");
					if (!(i == phonesArray.length - 1))
						phoneBuffer.append(" OR ");
					else
						phoneBuffer.append(")");
				}
			}
			int pageSize = Integer.parseInt(count) + 1;

			stringBuffer.append(phoneBuffer.toString());
			stringBuffer.append(emailBuffer.toString());
			stringBuffer.append(" AND type=PERSON");

			String query = stringBuffer.toString();

			System.out.println(query);

			AppengineSearch<Contact> appEngineSearch = new AppengineSearch<Contact>(Contact.class);
			collection = appEngineSearch.getSearchResults(query, pageSize, cursor);
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
		catch (Exception e)
		{
			System.out.println(e.getMessage());
		}
		return collection;
	}
}
