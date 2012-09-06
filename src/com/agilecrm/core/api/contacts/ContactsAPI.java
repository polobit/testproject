package com.agilecrm.core.api.contacts;

import java.io.InputStream;
import java.util.Hashtable;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
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
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactCursorResult;
import com.agilecrm.contact.Note;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.util.Util;

@Path("/api/contacts")
public class ContactsAPI
{

    // This method is called if TEXT_PLAIN is request
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getContacts()
    {
	return Contact.getAllContacts();
    }

    // This method is called if TEXT_PLAIN is request
    @Path("/cursor/{count}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public ContactCursorResult getContactsByCount(
	    @QueryParam("c") String cursor, @PathParam("count") String count)
    {
	return Contact.getAllContactsByCount(Integer.parseInt(count), cursor);
    }

    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Contact createContact(Contact contact)
    {

	// Check if the email exists with the current email address
	Contact currentContact = Contact.searchContactByEmail(contact
		.getContactFieldValue("email"));

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

    /*
     * @Path("/upload")
     * 
     * @POST
     * 
     * @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
     * 
     * @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
     * public List<Contact> createMultipleContact(List<Contact> contacts) { for
     * (Contact contact : contacts) contact.save();
     * 
     * return contacts; }
     */

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
    public void deleteContact(@PathParam("contact-id") String id)
    {
	Contact contact = Contact.getContact(Long.parseLong(id));
	if (contact != null)
	    contact.delete();
    }

    // This method is called if XML is request
    @Path("/{contact-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Contact getContact(@PathParam("contact-id") String id)
    {
	Contact contact = Contact.getContact(Long.parseLong(id));
	return contact;
    }

    // Opportunities of contact in contact details
    @Path("/{contact-id}/deals")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Opportunity> getCurrentContactOpportunity(
	    @PathParam("contact-id") String id)
    {
	System.out.println("in api of contact deals");
	return Opportunity.getCurrentContactDeals(Long.parseLong(id));
    }

    // Notes
    @Path("/{contact-id}/notes")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Note> getNotes(@PathParam("contact-id") String id)
    {
	try
	{
	    return Note.getNotes(Long.parseLong(id));
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
    public void deleteNote(@PathParam("contact-id") String contactId,
	    @PathParam("id") String noteId)
    {
	try
	{
	    Note.deleteNote(Long.parseLong(noteId), Long.parseLong(contactId));
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
	return Contact.searchContacts(keyword);
    }

    // This method is called if XML is request
    @Path("/search/email/{email}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Contact searchContactByEmail(@PathParam("email") String email)
    {
	return Contact.searchContactByEmail(email);
    }

}