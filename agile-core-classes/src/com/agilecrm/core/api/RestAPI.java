package com.agilecrm.core.api;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
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
		count = ContactUtil.searchContactCountByEmail(obj.getString("email"));

	    System.out.println("contacts available" + count);
	    if (count != 0)
	    {
		System.out.println("duplicate contact");
		return null;
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
	    e.printStackTrace();
	    return null;
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
	    Contact contact = ContactUtil.searchContactByEmail(obj.getString("email"));
	    if (contact == null)
		return null;

	    // Iterate data by keys ignore email key value pair
	    Iterator<?> keys = obj.keys();
	    while (keys.hasNext())
	    {
		String key = (String) keys.next();
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
		    json.put("name", key);
		    json.put("value", obj.getString(key));
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

}