package com.agilecrm.core.api.contacts;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.util.Util;

@Path("/api/contacts")
public class ContactsAPI
{

    // This method is called if TEXT_PLAIN is request
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getContacts(@QueryParam("cursor") String cursor,
	    @QueryParam("page_size") String count)
    {
	if (count != null)
	{

	    System.out.println("Fetching page by page");
	    return Contact.getAllContacts(Integer.parseInt(count), cursor);
	}

	return Contact.getAllContacts();
    }

    // This method is called if TEXT_PLAIN is request
    @Path("/companies")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getCompanies(@QueryParam("cursor") String cursor,
	    @QueryParam("page_size") String count)
    {
	if (count != null)
	{

	    System.out.println("Fetching companies page by page");
	    return Contact.getAllCompanies(Integer.parseInt(count), cursor);
	}

	return Contact.getAllContacts();
    }

    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Contact createContact(Contact contact)
    {

	// Check if the email exists with the current email address
	Contact currentContact = Contact.searchContactByEmail(contact
		.getContactFieldValue("EMAIL"));

	// Throw non-200 if it exists
	if (currentContact != null)
	{
	    throw new WebApplicationException(
		    Response.status(Response.Status.BAD_REQUEST)
			    .entity("Sorry, duplicate contact found with the same email address.")
			    .build());
	}

	contact.save();
	return contact;
    }

    @Path("multi/upload")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Contact> createMultipleContact(List<Contact> contacts)
    {
	for (Contact contact : contacts)
	    contact.save();

	return contacts;
    }

    // File Upload
    @Path("upload")
    // @Consumes(MediaType.MULTIPART_FORM_DATA)
    @POST
    public String post(@Context HttpServletRequest request)
    {
	try
	{

	    String filename = request.getHeader("X-File-Name");
	    InputStream file = request.getInputStream();

	    String csv = IOUtils.toString(file);
	    System.out.println(csv);

	    JSONObject success = new JSONObject();
	    success.put("success", true);

	    Hashtable result = Util.convertCSVToJSONArray2(csv, "Email");
	    JSONArray csvArray = (JSONArray) result.get("result");

	    success.put("data", csvArray);

	    return success.toString();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return null;
    }

    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Contact updateContact(Contact contact)
    {
	contact.save();
	return contact;
    }

    @Path("/{contact-id}")
    @DELETE
    public void deleteContact(@PathParam("contact-id") Long id)
    {
	Contact contact = Contact.getContact(id);
	if (contact != null)
	    contact.delete();
    }

    // This method is called if XML is request
    @Path("/{contact-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Contact getContact(@PathParam("contact-id") Long id)
    {
	Contact contact = Contact.getContact(id);
	return contact;
    }

    // Opportunities of contact in contact details
    @Path("/{contact-id}/deals")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Opportunity> getCurrentContactOpportunity(
	    @PathParam("contact-id") Long id)
    {
	return Opportunity.getCurrentContactDeals(id);
    }

    // Notes of contact in contact details
    @Path("/{contact-id}/tasks")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Task> getTasks(@PathParam("contact-id") Long id)
    {
	try
	{
	    return Task.getContactTasks(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Notes
    @Path("/{contact-id}/notes")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Note> getNotes(@PathParam("contact-id") Long id)
    {
	try
	{
	    return Note.getNotes(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Delete Notes
    @Path("/{contact-id}/notes/{id}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteNote(@PathParam("contact-id") Long contactId,
	    @PathParam("id") Long noteId)
    {
	try
	{
	    Note.deleteNote(noteId, contactId);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    // This method is called if XML is request
    @Path("/search/{keyword}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> searchContacts(@PathParam("keyword") String keyword)
    {
	return Contact.searchContacts(keyword.toLowerCase());
    }

    // This method is called if XML is request
    @Path("/search/email/{email}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Contact searchContactByEmail(@PathParam("email") String email)
    {
	return Contact.searchContactByEmail(email);
    }

    // Searching contacts by emaillist
    @Path("/search/email")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces({ MediaType.APPLICATION_JSON })
    public List<Contact> searchContactsByEmailList(
	    @FormParam("email_ids") String email_ids) throws JSONException
    {
	JSONArray contactsJSONArray = new JSONArray(email_ids);
	List<Contact> contacts_list = new ArrayList<Contact>();
	for (int i = 0; i < contactsJSONArray.length(); i++)
	{
	    try
	    {
		Contact contactDetails = Contact
			.searchContactByEmail(contactsJSONArray.getString(i));
		contacts_list.add(contactDetails);
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }
	}
	return contacts_list;
    }

    // Bulk operations - delete
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteContacts(@FormParam("model_ids") String model_ids)
	    throws JSONException
    {

	JSONArray contactsJSONArray = new JSONArray(model_ids);

	for (int i = 0; i < contactsJSONArray.length(); i++)
	{
	    Contact contact = Contact.getContact(Long
		    .parseLong(contactsJSONArray.getString(i)));

	    if (contact != null)
		contact.delete();
	}

    }

    // Bulk operations - change owner
    @Path("bulk/owner/{new_owner}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void changeOwnerToContacts(
	    @FormParam("contact_ids") String contact_ids,
	    @PathParam("new_owner") String new_owner) throws JSONException
    {
	JSONArray contactsJSONArray = new JSONArray(contact_ids);
	Contact.changeOwnerToContactsBulk(contactsJSONArray, new_owner);
    }

    // Bulk operations - add tags
    @Path("bulk/{tags}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void addTagsTOContacts(@FormParam("contact_ids") String contact_ids,
	    @PathParam("tags") String tagsString) throws JSONException
    {

	JSONArray contactsJSONArray = new JSONArray(contact_ids);
	String tags_array[] = tagsString.split(",");
	Contact.addTagsToContactsBulk(contactsJSONArray, tags_array);
    }

    // Bulk operations - delete tasks bulk related to a contact
    @Path("/tasks/bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteTasks(@FormParam("model_ids") String model_ids)
	    throws JSONException
    {
	
	JSONArray tasksJSONArray = new JSONArray(model_ids);
	Task.dao.deleteBulkByIds(tasksJSONArray);
    }

    // Bulk operations - delete notes bulk related to a contact
    @Path("/notes/bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteNotes(@PathParam("contact-id") Long contactId,
	    @FormParam("model_ids") String model_ids) throws JSONException
    {

	JSONArray notesJSONArray = new JSONArray(model_ids);
	Note.dao.deleteBulkByIds(notesJSONArray);
    }
}