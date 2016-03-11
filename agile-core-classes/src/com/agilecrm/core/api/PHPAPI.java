/**
 * This file handles requests from the PHP API calls
 */
package com.agilecrm.core.api;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;

import com.agilecrm.account.APIKey;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.JSAPIUtil;
import com.agilecrm.util.PHPAPIUtil;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

@Path("php/api")
public class PHPAPI
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
		    tagString = tagString.trim().replaceAll(" +", " ");
		    tagString = tagString.replaceAll(", ", ",");
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
		return null;
	    }

	    // Set contact owner from API key and save contact
	    contact.setContactOwner(APIKey.getDomainUserKeyRelatedToAPIKey(apiKey));

	    // Add properties list to contact properties
	    contact.properties = properties;
	    if (tags.length > 0)
	    {
		try
		{
		    contact.addTags(tags);
		}
		catch (WebApplicationException e)
		{
		    return null;
		}
	    }
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
     * Used to delete contact based on contact email
     * 
     * @param email
     *            email of contact
     * @return String "contact deleted"
     */
    @DELETE
    @Path("contact")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public String deleteContact(@QueryParam("email") String email)
    {
	try
	{
	    // Search contact by email
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return null;

	    // Delete Contact
	    contact.delete();
	    JSONObject json = new JSONObject();
	    json.put("contact", "deleted");
	    return json.toString();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Used to add note to contact
     * 
     * @param data
     *            Note data
     * @return Note object as string
     */
    @POST
    @Path("note")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public String addNote(String data)
    {
	try
	{
	    Note note = new Note();

	    // Get note data and iterate over keys
	    JSONObject obj = new JSONObject(data);
	    ObjectMapper mapper = new ObjectMapper();
	    Contact contact = new Contact();
	    Iterator<?> keys = obj.keys();
	    while (keys.hasNext())
	    {

		// If key equals email search contact with email
		String key = (String) keys.next();
		if (key.equals("email"))
		{
		    contact = ContactUtil.searchContactByEmail(obj.getString(key));
		    if (contact == null)
			return null;
		}
	    }
	    // Remove email key value pair from note JSON
	    obj.remove("email");

	    // Save note to related contact
	    note = mapper.readValue(obj.toString(), Note.class);
	    note.addRelatedContacts(contact.id.toString());
	    note.save();
	    return mapper.writeValueAsString(note);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Create task
     * 
     * @param data
     *            task data
     * @param apikey
     *            Agile API key
     * @return task object as String
     */
    @POST
    @Path("task")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public String addTask(String data, @QueryParam("id") String apikey)
    {
	try
	{
	    Contact contact = new Contact();
	    Task task = new Task();

	    // Get data and iterate over keys
	    JSONObject obj = new JSONObject(data);
	    Iterator<?> keys = obj.keys();
	    while (keys.hasNext())
	    {

		// Get email from JSON and search for contact
		String key = (String) keys.next();
		if (key.equals("email"))
		{
		    contact = ContactUtil.searchContactByEmail(obj.getString(key));
		    if (contact == null)
			return null;
		}
	    }
	    // Remove email key value pair from JSON
	    obj.remove("email");
	    ObjectMapper mapper = new ObjectMapper();
	    task = mapper.readValue(obj.toString(), Task.class);

	    // Set task owner
	    task.setOwner(APIKey.getDomainUserKeyRelatedToAPIKey(apikey));
	    task.contacts = new ArrayList<String>();

	    // Save task to related contact
	    task.contacts.add(contact.id.toString());
	    task.save();
	    return mapper.writeValueAsString(task);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Used to add deal to contact
     * 
     * @param data
     *            deal data
     * @param apikey
     *            Agile API key
     * @return deal object as string
     */
    @POST
    @Path("deal")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public String addDeal(String data, @QueryParam("id") String apikey)
    {
	try
	{
	    Contact contact = new Contact();

	    // Get data object and iterate
	    JSONObject obj = new JSONObject(data);
	    Iterator<?> keys = obj.keys();
	    while (keys.hasNext())
	    {
		String key = (String) keys.next();

		// If key equals email, search contact based on email
		if (key.equals("email"))
		{
		    contact = ContactUtil.searchContactByEmail(obj.getString(key));

		    // If contact not found return null
		    if (contact == null)
			return null;
		}
	    }
	    // Remove email key value pair from JSON
	    obj.remove("email");
	    ObjectMapper mapper = new ObjectMapper();

	    // Read deal data and assign deal to contact
	    Opportunity opportunity = mapper.readValue(obj.toString(), Opportunity.class);
	    opportunity.addContactIds(contact.id.toString());

	    // Set deal owner based on API key, save and return deal as String
	    opportunity.owner_id = String.valueOf(APIKey.getDomainUserKeyRelatedToAPIKey(apikey).getId());
	    opportunity.save();
	    return mapper.writeValueAsString(opportunity);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Used to add tags to contact
     * 
     * @param data
     *            data with tags and email
     * @return Contact object with added tags as string
     */
    @POST
    @Path("tags")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public String addTags(String data)
    {
	try
	{
	    Contact contact = new Contact();
	    String[] tagsArray = new String[0];

	    // Get data and iterate
	    JSONObject obj = new JSONObject(data);
	    Iterator<?> keys = obj.keys();
	    while (keys.hasNext())
	    {
		// Get email and search for contact
		String key = (String) keys.next();
		if (key.equals("email"))
		{
		    contact = ContactUtil.searchContactByEmail(obj.getString(key));

		    // If contact not found return null
		    if (contact == null)
			return null;
		}
		if (key.equals("tags"))
		{
		    // Search for tags, format tags String, convert to tags
		    // array
		    String value = obj.getString(key);
		    String tags = value;
		    tags = tags.trim().replaceAll(" +", " ");
		    tags = tags.replaceAll(", ", ",");
		    tagsArray = tags.split(",");
		}
	    }
	    // Add tags to contact, return contact as String
	    try
	    {
		contact.addTags(tagsArray);
	    }
	    catch (WebApplicationException e)
	    {
		return null;
	    }
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
     * Used to remove tags from contact
     * 
     * @param data
     *            data with tags and contact email
     * @return Contact object as string after removing tags
     */
    @PUT
    @Path("tags")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public String removeTags(String data)
    {
	try
	{
	    Contact contact = new Contact();

	    // Get data and iterate over data
	    String[] tagsArray = new String[0];
	    JSONObject obj = new JSONObject(data);
	    Iterator<?> keys = obj.keys();
	    while (keys.hasNext())
	    {
		// Search contact by email
		String key = (String) keys.next();
		if (key.equals("email"))
		{
		    contact = ContactUtil.searchContactByEmail(obj.getString(key));
		    if (contact == null)
			return null;
		}
		// Format tags string and convert to tags array
		if (key.equals("tags"))
		{
		    String tags = obj.getString(key);
		    tags = tags.trim().replaceAll(" +", " ");
		    tags = tags.replaceAll(", ", ",");
		    tagsArray = tags.split(",");
		}
	    }
	    // Remove tags from contact and return as string
	    contact.removeTags(tagsArray);
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
     * Add / Subtract score to contact
     * 
     * @param data
     *            contact data with score and email
     * @return Contact object as String after updating contact
     */
    @PUT
    @Path("score")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public String updateScore(String data)
    {
	try
	{
	    // Get data and iterate
	    Contact contact = new Contact();
	    JSONObject obj = new JSONObject(data);
	    Iterator<?> keys = obj.keys();
	    while (keys.hasNext())
	    {
		String key = (String) keys.next();

		// Search contact by email
		if (key.equals("email"))
		{
		    contact = ContactUtil.searchContactByEmail(obj.getString(key));
		    if (contact == null)
			return null;
		}

		// Get score from data and add to contact
		if (key.equals("score"))
		{
		    Integer value = obj.getInt(key);
		    contact.addScore(value);
		}
	    }

	    // Return contact as String
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
     * Used to get tags related to contact based on email of contact
     * 
     * @param email
     *            email of the contact
     * @return tags as String
     */
    @GET
    @Path("tags")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public String getTags(@QueryParam("email") String email)
    {
	try
	{
	    // Search contact by email
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return null;

	    // Return tags as string
	    ObjectMapper mapper = new ObjectMapper();
	    return mapper.writeValueAsString(contact.tags);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Get current score of contact based on email
     * 
     * @param email
     *            email of the contact
     * @return score of contact as string
     */
    @GET
    @Path("score")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public String getScore(@QueryParam("email") String email)
    {
	try
	{
	    // Search contact by email
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return null;

	    // Return contact as string
	    ObjectMapper mapper = new ObjectMapper();
	    return mapper.writeValueAsString(contact.lead_score);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Get notes associated with contact
     * 
     * @param email
     *            email of the contact
     * @return notes as String
     */
    @GET
    @Path("note")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public String getNotes(@QueryParam("email") String email)
    {
	try
	{
	    // Search contact by email
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return null;

	    // Get notes related to contact as a list
	    List<Note> Notes = new ArrayList<Note>();
	    Notes = NoteUtil.getNotes(contact.id);

	    // Convert list to array
	    ObjectMapper mapper = new ObjectMapper();
	    JSONArray arr = new JSONArray();
	    for (Note note : Notes)
	    {
		arr.put(mapper.writeValueAsString(note));
	    }
	    // Return notes array as string
	    return arr.toString();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Used to get deal data of the contact based on email
     * 
     * @param email
     *            email of the contact
     * @return Deal data as String
     */
    @GET
    @Path("deal")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public String getDeals(@QueryParam("email") String email)
    {
	try
	{
	    // Search contact by email of the contact
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return null;

	    // Get deals related to contact as a list
	    List<Opportunity> deals = new ArrayList<Opportunity>();
	    deals = OpportunityUtil.getDeals(contact.id, null, null);

	    // Convert deals list into array and return as String
	    ObjectMapper mapper = new ObjectMapper();
	    JSONArray arr = new JSONArray();
	    for (Opportunity deal : deals)
	    {
		arr.put(mapper.writeValueAsString(deal));
	    }
	    return arr.toString();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Get tasks based in email of contact
     * 
     * @param email
     *            email of the contact
     * @return task data as String
     */
    @GET
    @Path("task")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public String getTasks(@QueryParam("email") String email)
    {
	try
	{
	    // Search contact by email
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return null;

	    // Get tasks related to contact as a list
	    List<Task> tasks = new ArrayList<Task>();
	    tasks = TaskUtil.getContactTasks(contact.id);

	    // Convert tasks list to array
	    JSONArray arr = new JSONArray();
	    ObjectMapper mapper = new ObjectMapper();
	    for (Task task : tasks)
	    {
		arr.put(mapper.writeValueAsString(task));
	    }
	    // Return array as String
	    return arr.toString();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Used to get contact data by email of contact
     * 
     * @param email
     *            email of the contact
     * @return Contact as String
     */
    @GET
    @Path("contact")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public String getContact(@QueryParam("email") String email)
    {
	try
	{
	    // Search contact by email
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return null;

	    // Return contact as String
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
    public String updateContact(String data, @QueryParam("id") String apiKey)
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
		    tagString = tagString.trim().replaceAll(" +", " ");
		    tagString = tagString.replaceAll(", ", ",");
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
	    {
		try
		{
		    contact.addTags(tags);
		}
		catch (WebApplicationException e)
		{
		    return null;
		}
	    }
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
     * Get all domain users. for google gadgets.
     */
    @Path("users")
    @GET
    @Produces("application / x-javascript;charset=UTF-8;")
    public String getAllDomainUsers()
    {
	try
	{
	    ObjectMapper mapper = new ObjectMapper();
	    return mapper.writeValueAsString(DomainUserUtil.getUsers());
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    /**
     * Get tasks based on email of the contact
     * 
     * @param email
     *            email of the contact
     * 
     * @return String (tasks)
     */
    @Path("contacts/get-tasks")
    @GET
    @Produces("application / x-javascript;charset=UTF-8;")
    public String getTasksGadget(@QueryParam("email") String email)
    {
	try
	{
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return JSAPIUtil.generateContactMissingError();

	    List<Task> tasks = new ArrayList<Task>();
	    tasks = TaskUtil.getContactTasks(contact.id);
	    ObjectMapper mapper = new ObjectMapper();
	    JSONArray arr = new JSONArray();
	    for (Task task : tasks)
	    {
		arr.put(mapper.writeValueAsString(task));
	    }
	    return arr.toString();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Get notes from contact based on email
     * 
     * @param email
     *            email of the contact
     * 
     * @return String (notes)
     */
    @Path("contacts/get-notes")
    @GET
    @Produces("application / x-javascript;charset=UTF-8;")
    public String getNotesGadget(@QueryParam("email") String email)
    {
	try
	{
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return JSAPIUtil.generateContactMissingError();

	    else
	    {
		List<Note> Notes = new ArrayList<Note>();
		Notes = NoteUtil.getNotes(contact.id);
		ObjectMapper mapper = new ObjectMapper();
		JSONArray arr = new JSONArray();
		for (Note note : Notes)
		{
		    arr.put(mapper.writeValueAsString(note));
		}
		return arr.toString();
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Get deals based on the email of the contact
     * 
     * @param email
     *            email of the contact
     * 
     * @return String
     */
    @Path("contacts/get-deals")
    @GET
    @Produces("application / x-javascript;charset=UTF-8;")
    public String getDealsGadget(@QueryParam("email") String email)
    {
	try
	{
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return JSAPIUtil.generateContactMissingError();

	    List<Opportunity> deals = new ArrayList<Opportunity>();
	    deals = OpportunityUtil.getDeals(contact.id, null, null);
	    ObjectMapper mapper = new ObjectMapper();
	    JSONArray arr = new JSONArray();
	    for (Opportunity deal : deals)
	    {
		arr.put(mapper.writeValueAsString(deal));
	    }
	    return arr.toString();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
}