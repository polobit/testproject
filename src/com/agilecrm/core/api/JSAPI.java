package com.agilecrm.core.api;

import java.util.ArrayList;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.workflows.WorkflowManager;
import com.sun.jersey.api.json.JSONWithPadding;

@Path("js/api")
public class JSAPI
{
    // This method is called if TEXT_PLAIN is request
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String sayPlainTextHello()
    {
	return "Invalid Path";
    }

    @Path("contact/email")
    @GET
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces("application/x-javascript")
    public JSONWithPadding getContact(@QueryParam("email") String email,
	    @QueryParam("callback") String jsoncallback)
    {

	try
	{
	    Contact contact = Contact.searchContactByEmail(email);
	    System.out.println("Contact " + contact);
	    if (contact == null)
		contact = new Contact();

	    return new JSONWithPadding(new GenericEntity<Contact>(contact)
	    {
	    }, jsoncallback);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    @Path("contacts")
    @GET
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces("application/x-javascript")
    public JSONWithPadding createContact(@QueryParam("contact") String json,
	    @QueryParam("callback") String jsoncallback)
    {
	try
	{
	    ObjectMapper mapper = new ObjectMapper();
	    Contact contact = mapper.readValue(json, Contact.class);
	    System.out.println(mapper.writeValueAsString(contact));
	    System.out.println(contact);

	    // Get Contact count by email
	    String email = contact.getContactFieldValue(Contact.EMAIL);
	    int count = Contact.searchContactCountByEmail(email);
	    if (count != 0)
	    {
		System.out.println("Duplicate found for " + email);
		return null;
	    }
	    // If zero, save it
	    contact.save();

	    return new JSONWithPadding(new GenericEntity<Contact>(contact)
	    {
	    }, jsoncallback);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Add task
    @Path("js/task")
    @GET
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces("application/x-javascript")
    public JSONWithPadding createTask(@QueryParam("email") String email,
	    @QueryParam("task") String json,
	    @QueryParam("callback") String jsoncallback)
    {
	try
	{
	    ObjectMapper mapper = new ObjectMapper();
	    Task task = mapper.readValue(json, Task.class);
	    System.out.println(mapper.writeValueAsString(task));
	    System.out.println(task);

	    // Get Contact
	    Contact contact = Contact.searchContactByEmail(email);
	    if (contact == null)
		return null;
	    task.contacts = new ArrayList<String>();
	    task.contacts.add(contact.id + "");
	    task.save();

	    return new JSONWithPadding(new GenericEntity<Task>(task)
	    {
	    }, jsoncallback);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Add note
    @Path("js/note")
    @GET
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces("application/x-javascript")
    public JSONWithPadding createNote(@QueryParam("email") String email,
	    @QueryParam("note") String json,
	    @QueryParam("callback") String jsoncallback)
    {
	try
	{
	    ObjectMapper mapper = new ObjectMapper();
	    Note note = mapper.readValue(json, Note.class);
	    System.out.println(mapper.writeValueAsString(note));
	    System.out.println(note);

	    // Get Contact
	    Contact contact = Contact.searchContactByEmail(email);
	    if (contact == null)
		return null;
	    note.contacts = new ArrayList<String>();
	    note.contacts.add(contact.id + "");
	    note.save();

	    return new JSONWithPadding(new GenericEntity<Note>(note)
	    {
	    }, jsoncallback);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Add deal
    @Path("js/opportunity")
    @GET
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces("application/x-javascript")
    public JSONWithPadding createOpportunity(@QueryParam("email") String email,
	    @QueryParam("opportunity") String json,
	    @QueryParam("callback") String jsoncallback)
    {
	try
	{
	    ObjectMapper mapper = new ObjectMapper();
	    Opportunity opportunity = mapper.readValue(json, Opportunity.class);
	    System.out.println(mapper.writeValueAsString(opportunity));
	    System.out.println(opportunity);

	    // Get Contact
	    Contact contact = Contact.searchContactByEmail(email);
	    if (contact == null)
		return null;
	    opportunity.contacts = new ArrayList<String>();
	    opportunity.contacts.add(contact.id + "");
	    opportunity.save();
	    System.out.println("opportunitysaved");
	    return new JSONWithPadding(new GenericEntity<Opportunity>(
		    opportunity)
	    {
	    }, jsoncallback);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    @Path("contacts/add-tags")
    @GET
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces("application/x-javascript")
    public JSONWithPadding addTags(@QueryParam("email") String email,
	    @QueryParam("tags") String tags,
	    @QueryParam("callback") String jsoncallback)
    {
	try
	{

	    // Replace multiple space with single space
	    tags = tags.trim().replaceAll(" +", " ");

	    // Replace ,space with ,
	    tags = tags.replaceAll(", ", ",");

	    String[] tagsArray = tags.split(",");

	    Contact contact = Contact.searchContactByEmail(email);
	    if (contact == null)
		return null;

	    contact.addTags(tagsArray);

	    return new JSONWithPadding(new GenericEntity<Contact>(contact)
	    {
	    }, jsoncallback);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    @Path("contacts/remove-tags")
    @GET
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces("application/x-javascript")
    public JSONWithPadding removeTags(@QueryParam("email") String email,
	    @QueryParam("tags") String tags,
	    @QueryParam("callback") String jsoncallback)
    {
	try
	{

	    // Replace multiple space with single space
	    tags = tags.trim().replaceAll(" +", " ");

	    // Replace ,space with space
	    tags = tags.replaceAll(", ", ",");

	    String[] tagsArray = tags.split(",");

	    Contact contact = Contact.searchContactByEmail(email);
	    if (contact == null)
		return null;

	    contact.removeTags(tagsArray);

	    return new JSONWithPadding(new GenericEntity<Contact>(contact)
	    {
	    }, jsoncallback);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Add score
    @Path("contacts/add-score")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public boolean addScore(@QueryParam("email") String email,
	    @QueryParam("score") Integer score)
    {

	Contact contact = Contact.searchContactByEmail(email);
	if (contact == null)
	    return true;

	contact.addScore(score);
	return true;

    }

    // Subtract score
    @Path("contacts/subtract-score")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public boolean subtractScore(@QueryParam("email") String email,
	    @QueryParam("score") Integer score)
    {

	// Get Contact
	Contact contact = Contact.searchContactByEmail(email);
	if (contact == null)
	    return true;

	contact.subtractScore(score);
	return true;

    }

    // Campaign
    @Path("js/campaign/enroll/{contact-id}/{workflow-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Boolean subscribeContact(@PathParam("contact-id") Long contactId,
	    @PathParam("workflow-id") Long workflowId)
    {
	Contact contact = Contact.getContact(contactId);
	if (contact == null)
	{
	    System.out.println("Null contact");
	    return true;
	}

	WorkflowManager.subscribe(contact, workflowId);

	return true;
    }
}