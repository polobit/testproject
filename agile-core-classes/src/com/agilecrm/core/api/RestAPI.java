package com.agilecrm.core.api;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.simple.JSONArray;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.contact.filter.util.ContactFilterUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.util.PHPAPIUtil;

@Path("/rest/api")
public class RestAPI
{
    /**
     * Used to create contact based on data given
     * 
     * @param data
     *            Contact data JSON
     * @param apiKey
     *            Agile API key
     * @return Contact as String
     */
    @POST
    @Path("contact")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public String createContact(String data, @QueryParam("id") String apiKey)
    {
	try
	{
	    Contact contact = new Contact();
	    List<ContactField> properties = new ArrayList<ContactField>();
	    String[] tags = new String[0];

	    // Get data and iterate over keys
	    JSONObject obj = new JSONObject(data);
	    Iterator<?> keys = obj.keys();
	    while (keys.hasNext())
	    {
		String key = (String) keys.next();

		if (key.equals("flag"))
		    continue;
		// If key equals to tags, format tags String and prepare tags
		// array
		if (key.equals("tags"))
		{
		    String tagString = obj.getString(key);
		    tagString = tagString.trim();
		    tagString = tagString.replace("/ /g", " ");
		    tagString = tagString.replace("/, /g", ",");
		    tags = tagString.split(",");
		}
		// Prepare Contact Field and add to properties list
		else
		{
		    ContactField field = new ContactField();
		    String value = obj.getString(key);
		    field.name = key;
		    field.value = value;
		    field.type = PHPAPIUtil.getFieldTypeFromName(key);
		    properties.add(field);
		}
	    }

	    int count = 0;

	    if (obj.has("email"))
		count = ContactUtil.searchContactCountByEmail(obj.getString("email").toLowerCase());

	    System.out.println("contacts available" + count);
	    if (count != 0)
	    {
		System.out.println("duplicate contact");
		if (obj.has("flag"))
		{
		    if (obj.getString("flag").equals("YES"))
		    {
			try
			{
			    // Get data and check if email is present
			    JSONObject obj1 = new JSONObject(data);
			    String[] tags1 = new String[0];
			    ObjectMapper mapper = new ObjectMapper();
			    if (!obj1.has("email"))
				return null;

			    // Search contact if email is present else return
			    // null
			    Contact contact1 = ContactUtil.searchContactByEmail(obj1.getString("email"));

			    // Iterate data by keys ignore email key value pair
			    Iterator<?> keys1 = obj1.keys();
			    JSONObject tester = new JSONObject();
			    while (keys1.hasNext())
			    {
				String key = (String) keys1.next();
				if (key.equals("flag"))
				    continue;
				if (key.equals("email"))
				    continue;
				else if (key.equals("tags"))
				{
				    String tagString = obj1.getString(key);
				    tagString = tagString.trim();
				    tagString = tagString.replace("/ /g", " ");
				    tagString = tagString.replace("/, /g", ",");
				    tags1 = tagString.split(",");
				}
				else
				{
				    // Create and add contact field to contact
				    JSONObject json = new JSONObject();
				    if (key.equals("address"))
				    {

					String zapaddress = obj1.getString(key);
					JSONObject jsonzap = new JSONObject(zapaddress);
					String oldaddress = contact1.getContactFieldValue("ADDRESS");
					if (oldaddress == null)
					{
					    tester = jsonzap;
					    json.put("name", key);
					    json.put("value", "" + tester + "");
					}
					else
					{
					    JSONObject jsonold = new JSONObject(oldaddress);

					    if (!jsonzap.has("address"))
					    {
						if (jsonold.has("address"))
						    jsonzap.put("address", jsonold.getString("address"));
					    }
					    if (!jsonzap.has("city"))
					    {
						if (jsonold.has("city"))
						    jsonzap.put("city", jsonold.getString("city"));
					    }
					    if (!jsonzap.has("state"))
					    {
						if (jsonold.has("state"))
						    jsonzap.put("state", jsonold.getString("state"));
					    }
					    if (!jsonzap.has("zip"))
					    {
						if (jsonold.has("zip"))
						    jsonzap.put("zip", jsonold.getString("zip"));
					    }
					    if (!jsonzap.has("country"))
					    {
						if (jsonold.has("country"))
						    jsonzap.put("country", jsonold.getString("country"));
					    }
					    tester = jsonzap;
					    json.put("name", key);
					    json.put("value", "" + tester + "");
					}

				    }
				    else
				    {
					json.put("name", key);
					json.put("value", obj1.getString(key));
				    }

				    ContactField field = mapper.readValue(json.toString(), ContactField.class);
				    contact1.addProperty(field);
				}
			    }
			    if (tags1.length > 0)
				contact1.addTags(PHPAPIUtil.getValidTags(tags1));
			    else
				contact1.save();

			    // Return contact object as String
			    return mapper.writeValueAsString(contact1);
			}
			catch (Exception e)
			{
			    e.printStackTrace();
			    return null;
			}
		    }
		    else
		    {
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
				.entity("Sorry, duplicate contact found with the same email address.").build());
		    }
		}
		else
		{
		    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
			    .entity("Sorry, duplicate contact found with the same email address.").build());
		}

	    }

	    // Add properties list to contact properties
	    contact.properties = properties;
	    if (tags.length > 0)
		contact.addTags(PHPAPIUtil.getValidTags(tags));
	    else
		contact.save();

	    ObjectMapper mapper = new ObjectMapper();
	    return mapper.writeValueAsString(contact);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry, duplicate contact found with the same email address.").build());
	}
    }

    /**
     * Used to update contact
     * 
     * @param data
     *            Contact data
     * @param apiKey
     *            Agile API key
     * @return returns contact object as String
     */
    @PUT
    @Path("contact")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public String updateContact(String data)
    {
	try
	{
	    // Get data and check if email is present
	    JSONObject obj = new JSONObject(data);
	    String[] tags = new String[0];
	    ObjectMapper mapper = new ObjectMapper();
	    if (!obj.has("email"))
		return null;

	    // Search contact if email is present else return null
	    Contact contact = ContactUtil.searchContactByEmail(obj.getString("email").toLowerCase());

	    if (contact == null)
	    {
		System.out.println("No contact found first");

		if (obj.has("flag"))
		{
		    if (obj.getString("flag").equals("YES"))
		    {
			try
			{
			    Contact contact1 = new Contact();
			    List<ContactField> properties = new ArrayList<ContactField>();
			    String[] tags1 = new String[0];

			    // Get data and iterate over keys
			    JSONObject obj1 = new JSONObject(data);
			    Iterator<?> keys = obj1.keys();
			    while (keys.hasNext())
			    {
				String key = (String) keys.next();
				if (key.equals("flag"))
				    continue;
				// If key equals to tags, format tags String and
				// prepare
				// tags
				// array
				if (key.equals("tags"))
				{
				    String tagString = obj1.getString(key);
				    tagString = tagString.trim();
				    tagString = tagString.replace("/ /g", " ");
				    tagString = tagString.replace("/, /g", ",");
				    tags1 = tagString.split(",");
				}
				// Prepare Contact Field and add to properties
				// list
				else
				{
				    ContactField field = new ContactField();
				    String value = obj1.getString(key);
				    field.name = key;
				    field.value = value;
				    field.type = PHPAPIUtil.getFieldTypeFromName(key);
				    properties.add(field);
				}
			    }

			    int count = 0;

			    if (obj1.has("email"))
				count = ContactUtil.searchContactCountByEmail(obj1.getString("email"));

			    System.out.println("contacts available" + count);
			    if (count != 0)
			    {
				System.out.println("duplicate contact");
				return null;
			    }

			    // Add properties list to contact properties
			    contact1.properties = properties;
			    if (tags1.length > 0)
				contact1.addTags(PHPAPIUtil.getValidTags(tags1));
			    else
				contact1.save();

			    ObjectMapper mapper1 = new ObjectMapper();
			    return mapper1.writeValueAsString(contact1);
			}
			catch (Exception e)
			{
			    e.printStackTrace();
			    return null;
			}
		    }
		    else
		    {
			return null;
		    }
		}

	    }

	    // Iterate data by keys ignore email key value pair
	    Iterator<?> keys = obj.keys();
	    JSONObject tester = new JSONObject();
	    while (keys.hasNext())
	    {
		String key = (String) keys.next();
		if (key.equals("flag"))
		    continue;
		if (key.equals("email"))
		    continue;
		else if (key.equals("tags"))
		{
		    String tagString = obj.getString(key);
		    tagString = tagString.trim();
		    tagString = tagString.replace("/ /g", " ");
		    tagString = tagString.replace("/, /g", ",");
		    tags = tagString.split(",");
		}
		else
		{
		    // Create and add contact field to contact
		    JSONObject json = new JSONObject();
		    if (key.equals("address"))
		    {

			String zapaddress = obj.getString(key);
			JSONObject jsonzap = new JSONObject(zapaddress);
			String oldaddress = contact.getContactFieldValue("ADDRESS");
			if (oldaddress == null)
			{
			    tester = jsonzap;
			    json.put("name", key);
			    json.put("value", "" + tester + "");
			}
			else
			{
			    JSONObject jsonold = new JSONObject(oldaddress);

			    if (!jsonzap.has("address"))
			    {
				if (jsonold.has("address"))
				    jsonzap.put("address", jsonold.getString("address"));
			    }
			    if (!jsonzap.has("city"))
			    {
				if (jsonold.has("city"))
				    jsonzap.put("city", jsonold.getString("city"));
			    }
			    if (!jsonzap.has("state"))
			    {
				if (jsonold.has("state"))
				    jsonzap.put("state", jsonold.getString("state"));
			    }
			    if (!jsonzap.has("zip"))
			    {
				if (jsonold.has("zip"))
				    jsonzap.put("zip", jsonold.getString("zip"));
			    }
			    if (!jsonzap.has("country"))
			    {
				if (jsonold.has("country"))
				    jsonzap.put("country", jsonold.getString("country"));
			    }
			    tester = jsonzap;
			    json.put("name", key);
			    json.put("value", "" + tester + "");
			}

		    }
		    else
		    {
			json.put("name", key);
			json.put("value", obj.getString(key));
		    }

		    ContactField field = mapper.readValue(json.toString(), ContactField.class);
		    contact.addProperty(field);
		}
	    }
	    if (tags.length > 0)
		contact.addTags(PHPAPIUtil.getValidTags(tags));
	    else
		contact.save();

	    // Return contact object as String
	    return mapper.writeValueAsString(contact);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets an list of events sorted on created date.
     * 
     * @param id
     *            unique id of event
     * @return {@link Event}
     */
    @Path("/events")
    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public List<Event> getEventsList(@QueryParam("page_size") String count)

    {
	int max = 20;
	if (count != null)
	    max = Integer.parseInt(count);
	List<Event> events = EventUtil.getEvents(max);
	return events;
    }

    /**
     * Add note to a contact based on email address of the contact
     * 
     * @param email
     *            email of contact form parameter
     * @param note
     *            note data as string
     * @throws JSONException
     */
    @Path("/email/note/{email}")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String addNoteToContactsBasedOnEmail(Note note, @PathParam("email") String email) throws JSONException
    {

	System.out.println("email to search on" + email);
	System.out.println("Notes " + note);
	JSONObject object = new JSONObject();

	if (note == null)
	{
	    object.put("error", "Note could not be added");
	    return object.toString();
	}

	Contact contact = ContactUtil.searchContactByEmail(email);
	if (contact == null)
	{
	    object.put("error", "No contact found with email address \'" + email + "\'");
	    return object.toString();
	}

	Note noteObj = new Note();
	try
	{
	    note.addRelatedContacts(contact.id.toString());
	    note.save();
	    ObjectMapper mapper = new ObjectMapper();
	    return mapper.writeValueAsString(note);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return null;

    }

    /**
     * Saves new company into database, by verifying the existence of duplicates
     * with its name. If any duplicate is found throws web exception.
     * 
     * @param contact
     * @return
     */
    @POST
    @Path("company")
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Contact createCompany(Contact contact)
    {
	// Check if the email exists with the current email address
	boolean isDuplicate = ContactUtil.isExists(contact.getContactFieldValue("EMAIL"));

	// Throw non-200 if it exists
	if (isDuplicate)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry, duplicate contact found with the same email address.").build());
	}

	boolean isDuplicateCompany = ContactUtil.isCompanyExist(contact.getContactFieldValue("NAME"));

	// Throw non-200 if it exists
	if (isDuplicateCompany)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry, duplicate company found with the same name.").build());
	}
	contact.save();
	UserInfo user_info = SessionManager.get();
	if (user_info != null && !("agilecrm.com/js").equals(user_info.getClaimedId())
		&& !("agilecrm.com/dev").equals(user_info.getClaimedId())
		&& !("agilecrm.com/php").equals(user_info.getClaimedId()))
	{
	    try
	    {
		ActivitySave.createTagAddActivity(contact);
	    }
	    catch (Exception e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}
	return contact;
    }

    // This newTagsByUpdate is temporary solution for Zapier.
    /**
     * Gets all the contacts which are associated with the given tag and returns
     * as list
     * 
     * @param tag
     *            name of the tag
     * @return list of tags
     * @throws JSONException
     */
    @Path("/newTagsByUpdate/{tag}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getContactsBasedOnTagFilter(@PathParam("tag") String tag) throws JSONException
    {
	List<Contact> contactList = new ArrayList<Contact>();
	long currentTime = System.currentTimeMillis();
	long initialTime = currentTime - 1200000; // Time befor 20 minutes of
						  // current time

	JSONObject json = new JSONObject();
	json.put("LHS", "updated_time");
	json.put("CONDITION", "BETWEEN");
	json.put("RHS", initialTime);
	json.put("RHS_NEW", currentTime);

	JSONArray jsonArray = new JSONArray();
	jsonArray.add(json);
	JSONObject json1 = new JSONObject();
	json1.put("rules", jsonArray);
	json1.put("contact_type", "PERSON");

	ContactFilter contact_filter = ContactFilterUtil.getFilterFromJSONString(json1.toString());
	// Sets ACL condition
	UserAccessControlUtil.checkReadAccessAndModifyTextSearchQuery(
		UserAccessControl.AccessControlClasses.Contact.toString(), contact_filter.rules, null);

	List<Contact> licontacts = new ArrayList<Contact>(contact_filter.queryContacts(Integer.parseInt("100"), null,
		"-updated_time"));

	Map<Long, Contact> unsortMap = new HashMap<Long, Contact>();

	List<Contact> licontactsCreatedTime = ContactUtil.getContactsForTag(tag, Integer.parseInt("10"), null,
		"-created_time");
	for (Contact c : licontactsCreatedTime)
	{
	    if (c.updated_time == 0)
	    {
		int index = Arrays.asList(c.tags.toArray()).indexOf(tag);
		if ((System.currentTimeMillis() - c.tagsWithTime.get(index).createdTime) <= 1200000)
		    unsortMap.put(c.tagsWithTime.get(index).createdTime, c);
	    }

	}
	for (Contact c : licontacts)
	{
	    int index = Arrays.asList(c.tags.toArray()).indexOf(tag);
	    if (index >= 0)
	    {
		if ((System.currentTimeMillis() - c.tagsWithTime.get(index).createdTime) <= 1200000)
		    unsortMap.put(c.tagsWithTime.get(index).createdTime, c);

	    }
	}

	Map<Long, Contact> treeMap = new TreeMap<Long, Contact>(new Comparator<Long>()
	{
	    @Override
	    public int compare(Long o1, Long o2)
	    {
		return o2.compareTo(o1);
	    }
	});
	treeMap.putAll(unsortMap);

	for (Map.Entry<Long, Contact> entry : treeMap.entrySet())
	{
	    contactList.add((Contact) entry.getValue());
	}

	return contactList;

    }

}