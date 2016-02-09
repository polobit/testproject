package com.agilecrm.core.api.contacts;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import javax.servlet.http.HttpServletResponse;
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

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.bulkaction.ContactExportBulkPullTask;
import com.agilecrm.bulkaction.deferred.ContactExportPullTask;
import com.agilecrm.cases.Case;
import com.agilecrm.cases.util.CaseUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactFullDetails;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.filter.ContactFilterResultFetcher;
import com.agilecrm.contact.filter.util.ContactFilterUtil;
import com.agilecrm.contact.imports.CSVImporter;
import com.agilecrm.contact.imports.impl.ContactsCSVImporter;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.document.Document;
import com.agilecrm.document.util.DocumentUtil;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.search.query.util.QueryDocumentUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.access.exception.AccessDeniedException;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.user.access.util.UserAccessControlUtil.CRUDOperation;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>ContactsAPI</code> includes REST calls to interact with {@link Contact}
 * class to initiate Contact CRUD operations
 * <p>
 * It is called from client side to create, update, fetch and delete the
 * contacts also to upload contacts from a file. It also interacts with
 * {@link ContactUtil} class to fetch the data of Contact class from database.
 * </p>
 * 
 * @author
 * 
 */
@Path("/api/contacts")
public class ContactsAPI
{
    /**
     * Fetches all the contacts (of type person). Activates infiniScroll, if
     * no.of contacts are more than count and cursor is not null. This method is
     * called if TEXT_PLAIN is request
     * 
     * If count is null fetches all the contacts at once
     * 
     * @param cursor
     *            activates infiniScroll
     * @param count
     *            no.of contacts to be fetched at once (if more contacts are
     *            there)
     * @return list of contacts
     */
    @Path("/list")
    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getContactsList(@FormParam("cursor") String cursor, @FormParam("page_size") String count,
	    @FormParam("reload") boolean force_reload, @FormParam("global_sort_key") String sortKey)
    {
	if (count == null)
	{
	    count = "50";
	}

	System.out.println("Fetching page by page");

	if (sortKey != null && ContactFilterUtil.isCustomField(sortKey))
	{
	    return ContactFilterUtil.getFilterContactsBySortKey(sortKey, Integer.parseInt(count), cursor, Type.PERSON);
	}
	List<Contact> contacts = ContactUtil.getAllContactsByOrder(Integer.parseInt(count), cursor, sortKey);
	return contacts;

    }

    /**
     * Fetches all the contacts (of type person). Activates infiniScroll, if
     * no.of contacts are more than count and cursor is not null. This method is
     * called if TEXT_PLAIN is request
     * 
     * If count is null fetches all the contacts at once
     * 
     * @param cursor
     *            activates infiniScroll
     * @param count
     *            no.of contacts to be fetched at once (if more contacts are
     *            there)
     * @return list of contacts
     */
    @Path("/list/count")
    @GET
    public int getContactsCount()
    {
	System.out.println("Fetching count int");
	Map searchMap = new HashMap();
	searchMap.put("type", Contact.Type.PERSON);

	return Contact.dao.getCountByProperty(searchMap);

    }

    /**
     * Fetches all the contacts (of type person). Activates infiniScroll, if
     * no.of contacts are more than count and cursor is not null. This method is
     * called if TEXT_PLAIN is request
     * 
     * If count is null fetches all the contacts at once
     * 
     * @param cursor
     *            activates infiniScroll
     * @param count
     *            no.of contacts to be fetched at once (if more contacts are
     *            there)
     * @return list of contacts
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getContacts(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count,
	    @QueryParam("reload") boolean force_reload, @QueryParam("global_sort_key") String sortKey)
    {
	if (count == null)
	{
	    count = "50";
	}

	System.out.println("Fetching page by page");
	return ContactUtil.getAllContactsByOrder(Integer.parseInt(count), cursor, sortKey);
    }

    /* Fetch all contacts related to a company */
    @Path("/related/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getContactsOfCompany(@QueryParam("cursor") String cursor,
	    @QueryParam("page_size") String count, @PathParam("id") String id)
    {
	if (count == null)
	{
	    count = "50";
	}

	System.out.println("Fetching page by page - by comapnyID");
	return ContactUtil.getAllContactsOfCompany(id, Integer.parseInt(count), cursor);
    }

    @Path("/recent")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getRecentContacts(@QueryParam("page_size") String count)
    {

	if (count != null)
	{
	    System.out.println("Fetching page by page");

	    return ContactUtil.getRecentContacts(count);
	}

	return ContactUtil.getRecentContacts("10");

    }

    /**
     * Fetches all the contacts (of type company). Activates infiniScroll, if
     * no.of contacts are more than count and cursor is not null. This method is
     * called if TEXT_PLAIN is request
     * 
     * If count is null fetches all the contacts at once
     * 
     * @param cursor
     *            activates infiniScroll
     * @param count
     *            no.of contacts to be fetched at once (if more contacts are
     *            there)
     * @return list of contacts
     */
    @Path("/companies/list")
    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getCompaniesList(@FormParam("cursor") String cursor, @FormParam("page_size") String count,
	    @FormParam("global_sort_key") String sortKey)
    {
    	
    	if (count != null)
    	{
    		
    		if (sortKey != null && ContactFilterUtil.isCustomField(sortKey)){
    			return ContactFilterUtil.getFilterContactsBySortKey(sortKey, Integer.parseInt(count), cursor, Type.COMPANY);
    		}
    		
    	    System.out.println("Fetching companies page by page");
    	    return ContactUtil.getAllCompaniesByOrder(Integer.parseInt(count), cursor, sortKey);
    	}

    	return ContactUtil.getAllCompaniesByOrder(sortKey);
    }

    /**
     * Fetches all the contacts (of type person). Activates infiniScroll, if
     * no.of contacts are more than count and cursor is not null. This method is
     * called if TEXT_PLAIN is request
     * 
     * If count is null fetches all the contacts at once
     * 
     * @param cursor
     *            activates infiniScroll
     * @param count
     *            no.of contacts to be fetched at once (if more contacts are
     *            there)
     * @return list of contacts
     */
    @Path("/companies/list/count")
    @GET
    public int getCompaniesCount()
    {
	System.out.println("Fetching count of companies");
	Map searchMap = new HashMap();
	searchMap.put("type", Contact.Type.COMPANY);

	return Contact.dao.getCountByProperty(searchMap);

    }

    /**
     * Fetches all the contacts (of type company). Activates infiniScroll, if
     * no.of contacts are more than count and cursor is not null. This method is
     * called if TEXT_PLAIN is request
     * 
     * If count is null fetches all the contacts at once
     * 
     * @param cursor
     *            activates infiniScroll
     * @param count
     *            no.of contacts to be fetched at once (if more contacts are
     *            there)
     * @return list of contacts
     */
    @Path("/companies")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getCompanies(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count,
	    @QueryParam("global_sort_key") String sortKey)
    {
	if (count != null)
	{

	    System.out.println("Fetching companies page by page");
	    return ContactUtil.getAllCompaniesByOrder(Integer.parseInt(count), cursor, sortKey);
	}

	return ContactUtil.getAllContactsByOrder(sortKey);
    }

    @Path("/")
    /**
     * Saves new contact into database, by verifying the existence of duplicates
     * with its email. If any duplicate is found throws web exception.
     * 
     * @param contact
     * @return
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Contact createContact(Contact contact)
    {
	// Check if the email exists with the current email address
	boolean isDuplicate = ContactUtil.isExists(contact.getContactFieldValue("EMAIL"));

	// Throw non-200 if it exists
	if (isDuplicate)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry, duplicate contact found with the same email address.").build());
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
	System.out.println("Contacts properties = ");
	for (ContactField f : contact.properties)
	{
	    System.out.println("\t" + f.name + " - " + f.value);
	}
	System.out.println("contact tags : " + contact.tags);
	return contact;
    }

    /**
     * Updates the existing contact
     * 
     * @param contact
     *            {@link Contact} object to update
     * @return updated contact
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Contact updateContact(Contact contact)
    {
	UserInfo user_info = SessionManager.get();
	if (contact.id != null && user_info != null && !("agilecrm.com/js").equals(user_info.getClaimedId())
		&& !("agilecrm.com/dev").equals(user_info.getClaimedId())
		&& !("agilecrm.com/php").equals(user_info.getClaimedId()))
	{
	    try
	    {
		ActivitySave.createTagAddActivityWhenContactUpdated(contact);
	    }
	    catch (Exception e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}
	contact.save();
	System.out.println("returned tags : " + contact.tags);
	return contact;
    }

    /**
     * Deletes a contact from database based on its id
     * 
     * @param id
     *            id of a contact to delete
     */
    @Path("/{contact-id}")
    @DELETE
    public void deleteContact(@PathParam("contact-id") Long id)
    {
	Contact contact = ContactUtil.getContact(id);
	if (contact != null)
	{
	    UserInfo user_info = SessionManager.get();
	    if (user_info != null && !("agilecrm.com/js").equals(user_info.getClaimedId())
		    && !("agilecrm.com/dev").equals(user_info.getClaimedId())
		    && !("agilecrm.com/php").equals(user_info.getClaimedId()))
	    {
		try
		{
		    if (contact.type.toString().equals(("PERSON")))
			ActivityUtil.createContactActivity(ActivityType.CONTACT_DELETE, contact, null, null, null);
		    else if (contact.type.toString().equals(("COMPANY")))
			ActivityUtil.createContactActivity(ActivityType.COMPANY_DELETE, contact, null, null, null);
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		}
	    }
	    contact.delete();
	}

	Response.ok();
    }

    /**
     * Gets a contact based on its id. This method is called if XML is request
     * 
     * @param id
     *            unique id of contact
     * @return contact associated with the id
     */
    @Path("/{contact-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Contact getContact(@PathParam("contact-id") Long id) throws AccessDeniedException
    {
	Contact contact = ContactUtil.getContact(id);

	UserAccessControlUtil.check(Contact.class.getSimpleName(), contact, CRUDOperation.READ, true);

	return contact;
    }

    @Path("related-entities/{contact-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public ContactFullDetails getContactRelatedEnties(@PathParam("contact-id") Long id)
    {
	return new ContactFullDetails(id);
    }

    /**
     * Opportunities (deals) of a contact, which is in contact detail view
     * 
     * @param id
     *            id of contact
     * @return list of deals related to a contact
     */
    @Path("/{contact-id}/deals")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Opportunity> getCurrentContactOpportunity(@PathParam("contact-id") Long id)
    {
	return OpportunityUtil.getDeals(id, null, null);
    }

    /**
     * Tasks of a contact, which is in contact detail view
     * 
     * @param id
     *            contact id to get its related entities (tasks)
     * @return list of tasks related to a contact
     */
    @Path("/{contact-id}/tasks")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Task> getTasks(@PathParam("contact-id") Long id)
    {
	try
	{
	    return TaskUtil.getContactTasks(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Events of a contact, which is in contact detail view
     * 
     * @param id
     *            contact id to get its related entities (events)
     * @return list of events related to a contact
     */
    @Path("/{contact-id}/events")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Event> getEvents(@PathParam("contact-id") Long id)
    {
	try
	{
	    return EventUtil.getContactEvents(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * get cases related to this contact id
     * 
     * @param id
     *            - id of contact
     * @return List of Cases
     */
    @Path("/{contact-id}/cases")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Case> getCurrentContactCases(@PathParam("contact-id") Long id)
    {
	return CaseUtil.getCases(id, null, null);
    }

    /**
     * Notes of a contact, which is in contact detail view
     * 
     * @param id
     *            contact id to get its related entities (notes)
     * @return list of notes related to a contact
     */
    @Path("/{contact-id}/notes")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Note> getNotes(@PathParam("contact-id") Long id, @QueryParam("cursor") String cursor,
	    @QueryParam("page_size") String count)
    {
	try
	{
	    return NoteUtil.getNotes(id, count, cursor);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Deletes a note related to a contact
     * 
     * @param contactId
     *            contact id, the note related to
     * @param noteId
     *            note id
     */
    @Path("/{contact-id}/notes/{id}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteNote(@PathParam("contact-id") Long contactId, @PathParam("id") Long noteId)
    {
	try
	{
	    NoteUtil.deleteNote(noteId, contactId);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    @Path("/change-owner/{new_owner}/{contact_id}")
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Contact changeOwnerToContacts(Contact contact, @PathParam("new_owner") String new_owner,
	    @PathParam("contact_id") Long contact_id) throws JSONException
    {
	String old_owner_name = contact.getOwner() != null ? contact.getOwner().name : null;
	List<Contact> contacts = new ArrayList<Contact>();
	contacts.add(contact);

	ContactUtil.changeOwnerToContactsBulk(contacts, new_owner);
	try
	{
	    ActivitySave.contactOwnerChangeActivity(contact, old_owner_name);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return contact;
    }

    /**
     * Change owner of the contact. For API only.
     * 
     * @param contact
     * @param new_owner
     * @param contact_id
     * @return
     * @throws JSONException
     */
    @Path("/change-owner")
    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public String changeContactOwner(@FormParam("owner_email") String owner_email,
	    @FormParam("contact_id") Long contact_id) throws JSONException
    {
	if (StringUtils.isEmpty(owner_email) || contact_id == null)
	    return null;

	return ContactUtil.changeContactOwner(owner_email, contact_id);
    }

    /**
     * Gets a contact based on its email
     * 
     * @param email
     *            email of a contact to fetch it
     * @return contact related to email
     */
    @Path("/search/email/{email}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Contact searchContactByEmail(@PathParam("email") String email)
    {
	return ContactUtil.searchContactByEmail(email);
    }

    /**
     * Searches contacts for each email, by iterating a list of emails. The
     * request method is taken as POST to read form data
     * 
     * @param email_ids
     *            to get their associated contacts
     * @return list of contacts
     * @throws JSONException
     */
    @Path("/search/email")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces({ MediaType.APPLICATION_JSON })
    public List<Contact> searchContactsByEmailList(@FormParam("email_ids") String email_ids) throws JSONException
    {
	JSONArray emailsJSONArray = new JSONArray(email_ids);
	List<Contact> contacts_list = new ArrayList<Contact>();
	for (int i = 0; i < emailsJSONArray.length(); i++)
	{
	    try
	    {
		Contact contactDetails = ContactUtil.searchContactByEmail(emailsJSONArray.getString(i));
		contacts_list.add(contactDetails);
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }
	}
	return contacts_list;
    }

    /**
     * Add tags to a contact based on email address of the contact
     * 
     * @param email
     *            email of contact form parameter
     * @param tagsString
     *            array of tags as string
     * @return
     * @throws JSONException
     */
    @Path("/email/tags/add")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Tag[] addTagsToContactsBasedOnEmail(@FormParam("email") String email, @FormParam("tags") String tagsString,
	    @Context HttpServletResponse response) throws JSONException
    {

	System.out.println("email to search on" + email);
	JSONObject object = new JSONObject();

	if (StringUtils.isEmpty(tagsString))
	{

	    object.put("error", "No tags to add");
	    HTTPUtil.writeResonse(response, object.toString());
	    return null;
	}

	Contact contact = ContactUtil.searchContactByEmail(email);
	if (contact == null)
	{
	    object.put("error", "No contact found with email address \'" + email + "\'");
	    HTTPUtil.writeResonse(response, object.toString());
	    return null;
	}

	JSONArray tagsJSONArray = new JSONArray(tagsString);
	Tag[] tagsArray = null;
	try
	{
	    tagsArray = new ObjectMapper().readValue(tagsJSONArray.toString(), Tag[].class);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	if (tagsArray == null)
	    return null;

	System.out.println("Tags to add : " + tagsArray);
	contact.addTags(tagsArray);
	System.out.println("Tags after added : " + contact.tagsWithTime);

	return tagsArray;

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
    @Path("/email/note/add")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void addNoteToContactsBasedOnEmail(@FormParam("email") String email, @FormParam("note") String note,
	    @Context HttpServletResponse response) throws JSONException
    {

	System.out.println("email to search on" + email);
	JSONObject object = new JSONObject();

	if (StringUtils.isEmpty(note))
	{
	    object.put("error", "Note could not be added");
	    HTTPUtil.writeResonse(response, object.toString());
	    return;
	}

	Contact contact = ContactUtil.searchContactByEmail(email);
	if (contact == null)
	{
	    object.put("error", "No contact found with email address \'" + email + "\'");
	    HTTPUtil.writeResonse(response, object.toString());
	    return;
	}

	Note noteObj = new Note();
	try
	{
	    noteObj = new ObjectMapper().readValue(note.toString(), Note.class);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	if (noteObj == null)
	    return;

	noteObj.addRelatedContacts(contact.id.toString());
	noteObj.save();
    }

    /**
     * delete tags from a contact based on email address of the contact
     * 
     * @param email
     *            email of contact form parameter
     * @param tagsString
     *            array of tags as string
     * @throws JSONException
     */
    @Path("/email/tags/delete")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteTagsToContactsBasedOnEmail(@FormParam("email") String email,
	    @FormParam("tags") String tagsString, @Context HttpServletResponse response) throws JSONException
    {

	System.out.println("email to search on" + email);
	JSONObject object = new JSONObject();

	if (StringUtils.isEmpty(tagsString))
	{

	    object.put("error", "No tags to delete");
	    HTTPUtil.writeResonse(response, object.toString());
	    return;
	}

	Contact contact = ContactUtil.searchContactByEmail(email);
	if (contact == null)
	{
	    object.put("error", "No contact found with email address \'" + email + "\'");
	    HTTPUtil.writeResonse(response, object.toString());
	    return;
	}

	JSONArray tagsJSONArray = new JSONArray(tagsString);
	Tag[] tagsArray = null;
	try
	{
	    tagsArray = new ObjectMapper().readValue(tagsJSONArray.toString(), Tag[].class);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	if (tagsArray == null)
	    return;

	System.out.println("tags to delete : " + Arrays.asList(tagsArray));
	contact.removeTags(tagsArray);
	System.out.println("tags after delete : " + contact.tagsWithTime);
    }

    /**
     * delete tags from a contact based on email address of the contact
     * 
     * @param email
     *            email of contact form parameter
     * @param tagsString
     *            array of tags as string
     * @throws JSONException
     */
    @Path("/email/tags/delete/sandbox")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteTagsToContactsBasedOnEmail1(@FormParam("email") String email,
	    @FormParam("tags") String tagsString, @Context HttpServletResponse response) throws JSONException
    {

	System.out.println("email to search on" + email);
	JSONObject object = new JSONObject();

	if (StringUtils.isEmpty(tagsString))
	{

	    object.put("error", "No tags to delete");
	    HTTPUtil.writeResonse(response, object.toString());
	    return;
	}

	Contact contact = ContactUtil.searchContactByEmail(email);
	if (contact == null)
	{
	    object.put("error", "No contact found with email address \'" + email + "\'");
	    HTTPUtil.writeResonse(response, object.toString());
	    return;
	}

	JSONArray tagsJSONArray = new JSONArray(tagsString);
	Tag[] tagsArray = null;
	try
	{
	    tagsArray = new ObjectMapper().readValue(tagsJSONArray.toString(), Tag[].class);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	if (tagsArray == null)
	    return;

	System.out.println("tags to delete : " + Arrays.asList(tagsArray));
	contact.removeTags(tagsArray, false);
	System.out.println("tags after delete : " + contact.tagsWithTime);
    }

    /**
     * Deletes all selected tasks for a particular contact
     * 
     * @param model_ids
     *            array of task ids as String
     * @throws JSONException
     */
    @Path("/tasks/bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteTasks(@FormParam("ids") String model_ids) throws JSONException
    {
	JSONArray tasksJSONArray = new JSONArray(model_ids);
	Task.dao.deleteBulkByIds(tasksJSONArray);
    }

    /**
     * Deletes all selected notes of a particular contact.
     * 
     * @param model_ids
     *            array of note ids as String
     * @throws JSONException
     */
    @Path("/notes/bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteNotes(@FormParam("ids") String model_ids) throws JSONException
    {
	JSONArray notesJSONArray = new JSONArray(model_ids);
	Note.dao.deleteBulkByIds(notesJSONArray);
    }

    /**
     * Deletes all selected deals of a particular contact
     * 
     * @param model_ids
     *            array of deal ids as String
     * @throws JSONException
     */
    @Path("/deals/bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteDeals(@FormParam("ids") String model_ids) throws JSONException
    {
	JSONArray dealsJSONArray = new JSONArray(model_ids);
	Opportunity.dao.deleteBulkByIds(dealsJSONArray);
    }

    /**
     * Deletes all selected deals of a particular contact
     * 
     * @param model_ids
     *            array of deal ids as String
     * @throws JSONException
     */
    @Path("/viewed-at/{id}")
    @POST
    public void UpdateViewedTime(@PathParam("id") String id) throws JSONException
    {
	Contact contact = ContactUtil.getContact(Long.parseLong(id));

	contact.viewed_time = System.currentTimeMillis();

	contact.save();
    }

    /**
     * Adds a contact property or replaces a contact property if it already
     * exists based on property name.
     * 
     * @param email
     *            email of the contact to add property.
     * @param ContactField
     * 
     * @return Contact
     */
    @Path("/add/property")
    @POST
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Contact addProperty(ContactField field, @QueryParam("email") String email)
    {
	try
	{
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    System.out.println("contact" + contact);

	    if (contact == null)
		return null;

	    contact.addProperty(field);
	    return contact;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets a contact based on its contact number
     * 
     * @param number
     *            phone number of a contact to fetch it
     * @return contact related to phone number
     */
    @Path("/search/phonenumber/{phone_number}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Contact searchContactByPhoneNumber(@PathParam("phone_number") String sipPhoneNumber)
    {
	System.out.println("In searchContactByPhoneNumber : " + sipPhoneNumber);
	int positionOfColon = sipPhoneNumber.indexOf(":");
	int positionOfAt = sipPhoneNumber.indexOf("@");

	String phoneNumber = null;

	if (positionOfColon != -1 && positionOfAt != -1)
	    phoneNumber = sipPhoneNumber.substring(positionOfColon + 1, positionOfAt);
	else
	    phoneNumber = sipPhoneNumber;

	System.out.println("In searchContactByPhoneNumber : " + phoneNumber);

	try
	{
	    return QueryDocumentUtil.getContactsByPhoneNumber(phoneNumber);
	}
	catch (Exception e)
	{
	    return ContactUtil.searchContactByPhoneNumber(phoneNumber);
	}
    }

    /**
     * Add score to the contact. Searches contact based on the email sent and
     * adds score to the existing score of the contact
     * 
     * @param email
     *            email of the contact
     * @param score
     *            score to be added to the contact
     * @return
     */
    @Path("/add-score")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Contact addScore(@FormParam("email") String email, @FormParam("score") Integer score)
    {
	try
	{
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return null;

	    contact.addScore(score);
	    return contact;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}

    }

    /**
     * Count of tasks, notes, events and documents of a contact.
     * 
     * @param id
     *            contact id to get its related entities (tasks)
     * @param taskType
     *            - type of task
     * @return Map containing the count of all the above items.
     */
    @Path("/{contact-id}/items/count")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Map<String, Integer> getContactItemsCount(@PathParam("contact-id") Long id,
	    @QueryParam("task-type") String taskType)
    {
	try
	{
	    Map<String, Integer> itemsCount = new HashMap<String, Integer>();
	    itemsCount.put("Tasks", TaskUtil.getTaskCountForContact(taskType, id));
	    itemsCount.put("Notes", NoteUtil.getNotesCount(id));
	    itemsCount.put("Events", EventUtil.getContactEventsCount(id));
	    itemsCount.put("Documents", DocumentUtil.getContactDocumentsCount(id));
	    return itemsCount;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Tasks of a contact sorted on due date.
     * 
     * @param id
     *            contact id to get its related entities (tasks)
     * @param taskType
     *            - type of task
     * @return list of tasks related to a contact
     */
    @Path("/{contact-id}/tasks/sort")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Task> getSortedTasks(@PathParam("contact-id") Long id, @QueryParam("task-type") String taskType)
    {
	try
	{
	    return TaskUtil.getContactSortedTasks(taskType, id);
	}
	catch (Exception e)
	{
	    System.out.println("Exception in Sorting Tasks on Due date : " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Events of a contact sorted on start date.
     * 
     * @param id
     *            contact id to get its related entities (tasks)
     * @return list of tasks related to a contact
     */
    @Path("/{contact-id}/events/sort")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Event> getSortedEvents(@PathParam("contact-id") Long id)
    {
	try
	{
	    return EventUtil.getContactSortedEvents(id);
	}
	catch (Exception e)
	{
	    System.out.println("Exception in Sorting Events on Start date : " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Checks whether the given contact updated after the given time.
     * 
     * @param contactId
     *            the id of contact to check.
     * @param updatedTime
     *            previously updated time.
     * @return true if the contact is updated after the given time or else
     *         false.
     */
    @Path("/{contact-id}/isUpdated")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public boolean isContactUpdated(@PathParam("contact-id") Long id, @QueryParam("updated_time") Long updatedTime)
    {
	return ContactUtil.isContactUpdated(id, updatedTime);
    }

    /**
     * check for company exist
     * 
     * @param companyName
     * @return
     */
    @Path("/company/validate")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public boolean isCompanyExist(@QueryParam("companyName") String companyName)
    {
	return ContactUtil.isCompanyExist(companyName);
    }

    /**
     * merge duplicated contacts and related items such as
     * notes,document,events,task,deals and documents
     * 
     * @param Contact
     *            contact and duplication contact ids
     * @return Single Contact
     */
    @Path("/merge/{contactIds}")
    @PUT
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Contact mergeContacts(Contact contact, @PathParam("contactIds") String contactIds)
    {
	String[] ids = contactIds.split(",");
	for (String id : ids)
	{
	    // update notes
	    try
	    {
		List<Note> notes = NoteUtil.getNotes(Long.valueOf(id));

		for (Note note : notes)
		{
		    note.addContactIds(contact.id.toString());
		    note.owner_id = String.valueOf(note.getDomainOwner().id);
		    note.save();
		}

		// update events

		List<Event> events = EventUtil.getContactEvents(Long.valueOf(id));

		for (Event event : events)
		{
		    event.addContacts(contact.id.toString());
		    event.save();
		}

		// update task
		List<Task> tasks = TaskUtil.getContactTasks(Long.valueOf(id));
		for (Task task : tasks)
		{
		    task.addContacts(contact.id.toString());
		    task.save();
		}

		// update deals
		List<Opportunity> opportunities = OpportunityUtil.getAllOpportunity(Long.valueOf(id));
		for (Opportunity opportunity : opportunities)
		{
		    opportunity.addContactIds(contact.id.toString());
		    opportunity.save();
		}

		// merge document

		List<Document> documents = DocumentUtil.getContactDocuments(Long.valueOf(id));
		for (Document document : documents)
		{
		    document.getContact_ids().add(contact.id.toString());
		    document.save();
		}

		// merge Case
		List<Case> cases = CaseUtil.getCases(Long.valueOf(id));
		for (Case cas : cases)
		{
		    cas.addContactToCase(contact.id.toString());
		    cas.save();
		}
		// delete duplicated record
		ContactUtil.getContact(Long.valueOf(id)).delete();
		// save master reccord
		contact.save();

	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	}
	if (contact.type.toString().equals(("PERSON")))
		ActivityUtil.mergeContactActivity(ActivityType.MERGE_CONTACT,contact,ids.length);
	// merge notes
	return contact;
    }

    /* Fetch current time from contact's time zone */
    @Path("/gettz/{latitude}/{longitude}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getContactsCurrentTime(@PathParam("latitude") String latitude,
	    @PathParam("longitude") String longitude) throws JSONException
    {
	long epoch = System.currentTimeMillis() / 1000;

	// URL for get request
	String urlForTZ = "https://maps.googleapis.com/maps/api/timezone/json?location=" + latitude + "," + longitude
		+ "&timestamp=" + epoch;

	// Send get request and get result
	String contactTimeZone = HTTPUtil.accessURL(urlForTZ);

	JSONObject contactTimeZoneJson = new JSONObject(contactTimeZone);
	if (contactTimeZoneJson.toString().isEmpty() || !contactTimeZoneJson.get("status").equals("OK"))
	    return null;

	// Get time zone
	TimeZone tz = TimeZone.getTimeZone(contactTimeZoneJson.getString("timeZoneId"));

	// Set calendar
	Calendar calendar = new GregorianCalendar();
	calendar.setTimeZone(tz);

	// Set date formatter
	DateFormat formatter = new SimpleDateFormat("hh:mm a (E, dd-MMM)");
	formatter.setTimeZone(TimeZone.getTimeZone(contactTimeZoneJson.getString("timeZoneId")));

	// Get current date and time
	String currentDate = formatter.format(calendar.getTime());

	// Return result
	return currentDate.toString();
    }

    /* Fetch current time from contact's time zone */
    @Path("/export")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void exportContacts(@FormParam("contact_ids") String contact_ids, @QueryParam("filter") String filter,
	    @FormParam("dynamic_filter") String dynamicFilter, @FormParam("data") String data)
    {
	if (StringUtils.isBlank(data))
	{
	    System.out.println("Not proceeding further as data is null.");
	    return;
	}

	Long currentUserId = SessionManager.get().getDomainId();

	ContactFilterResultFetcher fetcher = new ContactFilterResultFetcher(filter, dynamicFilter, 200, contact_ids,
		currentUserId);

	int totalCount = fetcher.getAvailableContacts();
	if (totalCount == 0)
	    totalCount = fetcher.getAvailableCompanies();

	DeferredTask task = null;
	System.out.println("Total contacts to export : " + totalCount);
	if (totalCount > 5000)
	{
	    task = new ContactExportBulkPullTask(contact_ids, filter, dynamicFilter, currentUserId,
		    NamespaceManager.get());
	    PullQueueUtil.addToPullQueue("bulk-export-pull-queue", task, NamespaceManager.get());
	}
	else
	{
	    task = new ContactExportPullTask(contact_ids, filter, dynamicFilter, currentUserId, NamespaceManager.get());
	    PullQueueUtil.addToPullQueue("export-pull-queue", task, NamespaceManager.get());
	}

	// filter, dynamicFilter, data);

	// ContactExportEmailUtil.exportContactCSVAsEmail(data, downloadUrl,
	// String.valueOf(count),
	// ContactExportType.CONTACT);
	// ActivityUtil.createLogForImport(ActivityType.CONTACT_EXPORT,
	// EntityType.CONTACT, count, 0);
    }

    @Path("/import/{key}/{type}")
    @POST
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void contactsBulkSave(Contact contact, @PathParam("key") String key, @PathParam("type") String type)
    {
	// it gives is 1000)
	int currentEntityCount = ContactUtil.getCount();

	// Creates a blobkey object from blobkey string
	BlobKey blobKey = new BlobKey(key);

	// new CSVUtil(restrictions,
	// accessControl).createContactsFromCSV(blobStream, contact,
	// ownerId);
	UserInfo info = SessionManager.get();

	CSVImporter<Contact> importer;
	try
	{
	    importer = new ContactsCSVImporter(NamespaceManager.get(), blobKey, info.getDomainId(),
		    new ObjectMapper().writeValueAsString(contact), Contact.class, currentEntityCount);

	    PullQueueUtil.addToPullQueue("contact-import-queue", importer, key);
	}

	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }

    @Path("/email/chrome/{email}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Contact updateContactOfChrome(@PathParam("email") String email) throws JSONException
    {
	Contact contact = null;
	// Get contact based on email.
	contact = ContactUtil.searchContactByEmail(email);
	// ContactId
	String contactId = null;
	// Saves email with contact-id
	if (contact != null)
	{
	    contactId = contact.id.toString();

	    contact.setLastEmailed(System.currentTimeMillis() / 1000);
	    contact.update();

	}
	return contact;
    }

    /**
     * Updates the existing contact (Partial update)
     * 
     * @param contactJson
     * 
     * @return updated contact
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonGenerationException
     * @throws JSONException
     * @throws JsonParseException
     */
    @Path("/edit-properties")
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Contact updatePropertiesById(String contactJson) throws JSONException, JsonParseException,
	    JsonMappingException, IOException
    {
	// Get data and check if id is present
	JSONObject obj = new JSONObject(contactJson);

	ObjectMapper mapper = new ObjectMapper();
	if (!obj.has("id"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Please check id value should not be null.").build());
	}

	// Search contact if id is present else throw exception
	Contact contact = ContactUtil.getContact(obj.getLong("id"));
	if (contact == null)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Contact is not availabe for given id.").build());
	}

	// Iterate data by keys ignore email key value pair
	Iterator<?> keys = obj.keys();

	while (keys.hasNext())
	{
	    String key = (String) keys.next();

	    if (key.equals("properties"))
	    {
		JSONArray propertiesJSONArray = new JSONArray(obj.getString(key));
		for (int i = 0; i < propertiesJSONArray.length(); i++)
		{
		    // Create and add contact field to contact
		    JSONObject json = new JSONObject();
		    json.put("name", propertiesJSONArray.getJSONObject(i).getString("name"));
		    json.put("value", propertiesJSONArray.getJSONObject(i).getString("value"));
		    ContactField field = mapper.readValue(json.toString(), ContactField.class);
		    contact.addProperty(field);
		}
	    }
	}

	return contact;
    }

    /**
     * Updates the existing contact (Partial update)
     * 
     * @param contactJson
     * 
     * @return updated contact
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonGenerationException
     * @throws JSONException
     */
    @Path("/edit/add-star")
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Contact updateStarValueById(String contactJson) throws JSONException
    {
	// Get data and check if id is present
	JSONObject obj = new JSONObject(contactJson);

	ObjectMapper mapper = new ObjectMapper();
	if (!obj.has("id"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Please check id value passed.").build());
	}

	// Search contact if id is present else throw exception
	Contact contact = ContactUtil.getContact(obj.getLong("id"));
	if (contact == null)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Contact is not availabe for given id.").build());
	}

	// Iterate data by keys ignore email key value pair
	Iterator<?> keys = obj.keys();

	while (keys.hasNext())
	{
	    String key = (String) keys.next();

	    if (key.equals("star_value"))
	    {
		if ((short) obj.getInt(key) > 5 || (short) obj.getInt(key) < 0)
		{
		    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
			    .entity("Star value should be less then or equal to 5.").build());
		}
		contact.star_value = (short) obj.getInt(key);
	    }

	}

	contact.save();

	return contact;
    }

    /**
     * Updates the existing contact (Partial update)
     * 
     * @param contactJson
     * 
     * @return updated contact
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonGenerationException
     * @throws JSONException
     */
    @Path("/edit/lead-score")
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Contact updateLeadScoreById(String contactJson) throws JSONException
    {
	// Get data and check if id is present
	JSONObject obj = new JSONObject(contactJson);

	ObjectMapper mapper = new ObjectMapper();
	if (!obj.has("id"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Please check id value passed.").build());
	}

	// Search contact if id is present else throw exception
	Contact contact = ContactUtil.getContact(obj.getLong("id"));
	if (contact == null)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Contact is not availabe for given id.").build());
	}

	// Iterate data by keys ignore email key value pair
	Iterator<?> keys = obj.keys();

	while (keys.hasNext())
	{
	    String key = (String) keys.next();

	    if (key.equals("lead_score"))
		contact.lead_score = obj.getInt(key);
	}

	contact.save();

	return contact;
    }

    /**
     * Updates the existing contact (Partial update)
     * 
     * @param tagJson
     * 
     * @return updated contact
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonGenerationException
     * @throws JSONException
     * @throws JsonParseException
     */
    @Path("/edit/tags")
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Contact updateTagsById(String tagJson) throws JSONException, JsonParseException, JsonMappingException,
	    IOException
    {
	// Get data and check if id is present
	JSONObject obj = new JSONObject(tagJson);
	Tag[] tagsArray = null;
	ObjectMapper mapper = new ObjectMapper();
	if (!obj.has("id"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Please check id value passed.").build());
	}

	// Search contact if id is present else throw exception
	Contact contact = ContactUtil.getContact(obj.getLong("id"));
	if (contact == null)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Contact is not availabe for given id.").build());
	}

	// Iterate data by keys ignore email key value pair
	Iterator<?> keys = obj.keys();

	while (keys.hasNext())
	{
	    String key = (String) keys.next();

	    if (key.equals("tags"))
	    {
		String tagString = obj.getString(key);
		if (StringUtils.isEmpty(tagString))
		{
		    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
			    .entity("Sorry, tag input is empty").build());
		}
		JSONArray tagsJSONArray = new JSONArray(tagString);
		tagsArray = new ObjectMapper().readValue(tagsJSONArray.toString(), Tag[].class);
	    }

	}

	if (tagsArray != null)
	{
	    try
	    {
		contact.addTags(tagsArray);
	    }
	    catch (WebApplicationException e)
	    {
		return null;
	    }
	}
	else
	    contact.save();

	return contact;
    }

    /**
     * Delete the existing tags to a contact (Partial update)
     * 
     * @param tagJson
     * 
     * @return tag list
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonGenerationException
     * @throws JSONException
     * @throws JsonParseException
     */
    @Path("/delete/tags")
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ArrayList<Tag> deleteTagsById(String tagJson) throws JSONException, JsonParseException,
	    JsonMappingException, IOException
    {
	// Get data and check if id is present
	JSONObject obj = new JSONObject(tagJson);
	Tag[] tagsArray = null;
	ObjectMapper mapper = new ObjectMapper();
	if (!obj.has("id"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Please check id value passed.").build());
	}

	// Search contact if id is present else throw exception
	Contact contact = ContactUtil.getContact(obj.getLong("id"));
	if (contact == null)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Contact is not availabe for given id.").build());
	}

	// Iterate data by keys ignore email key value pair
	Iterator<?> keys = obj.keys();

	while (keys.hasNext())
	{
	    String key = (String) keys.next();

	    if (key.equals("tags"))
	    {
		String tagString = obj.getString(key);
		System.out.println(tagString.length() == 0);
		if (StringUtils.isEmpty(tagString))
		{
		    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
			    .entity("Sorry, tag input is empty").build());
		}
		JSONArray tagsJSONArray = new JSONArray(tagString);
		tagsArray = new ObjectMapper().readValue(tagsJSONArray.toString(), Tag[].class);
		if (tagsArray.length == 0)
		{
		    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
			    .entity("Sorry, tag input is empty").build());
		}
	    }

	}

	if (tagsArray != null)
	{
	    try
	    {
		contact.removeTags(tagsArray, true);

	    }
	    catch (WebApplicationException e)
	    {
		return null;
	    }
	}
	else
	    return null;

	return contact.getTagsList();
    }

}