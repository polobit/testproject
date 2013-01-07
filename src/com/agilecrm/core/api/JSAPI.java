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

import com.agilecrm.account.APIKey;
import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.sun.jersey.api.json.JSONWithPadding;

/**
 * <code>JSAPI</code> provides facility to perform actions, such as creating a
 * contact, deal, tag, note and also to fetch them by required query conditions.
 * 
 * <p>
 * It provides API that can be used to access the account by providing APIKey as
 * a parameter in get request. API key is provided to each user of the domain
 * registered, using this key user can use the JSAPI that can be simply used
 * from javascript providing APIKey and other query parameters
 * </p>
 * 
 */
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

    /**
     * Accessing
     * <domain>.agilecrm.com/js/api/contact/email?id=xxxxx&email=encoded
     * (email)&callback=< function-name> will return contact with email, which
     * is given as query parameter
     * 
     * <p>
     * Returns Contact JSON object. If contact is not present with given email
     * address then it returns empty JSON
     * <P>
     * 
     * @param email
     *            of the contact
     * @param jsoncallback
     * @return contact {@link JSONWithPadding}
     */
    @Path("contact/email")
    @GET
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces("application/x-javascript")
    public JSONWithPadding getContact(@QueryParam("email") String email,
	    @QueryParam("callback") String jsoncallback)
    {

	try
	{
	    // Search contact based on email, returns empty contact if contact
	    // is not available with given email
	    Contact contact = ContactUtil.searchContactByEmail(email);
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

    /**
     * Adds contact in the domain
     * 
     * <pre>
     * var contact_json = {tags:[tag1, tag2, tag3], lead_score:100, 
     * 	properties:[{name:fist_name, type:person/company, value: harry},
     * {name: first_name, type:person/company, value:harry}]
     * }
     * 
     * (domain-name).agilecrm.com/js/api/contacts?contact=contact_json&callback=< function-name>
     * </pre>
     * 
     * @param json
     *            contact as json string
     * @param jsoncallback
     * @return {@link JSONWithPadding}, returns saved contact or null if contact
     *         exists with sent email
     */
    @Path("contacts")
    @GET
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces("application/x-javascript")
    public JSONWithPadding createContact(@QueryParam("contact") String json,
	    @QueryParam("id") String apiKey,
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
	    int count = ContactUtil.searchContactCountByEmail(email);
	    if (count != 0)
	    {
		System.out.println("Duplicate found for " + email);
		return null;
	    }

	    // Sets owner key to contact before saving
	    contact.setOwner(APIKey.getDomainUserIdRelatedToAPIKey(apiKey));

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

    /**
     * Adds task. Takes email, task json and callback as query parameters, task
     * is created and related to contact based on the email. If contact doesn't
     * exist with current email, null is returned with out creating a task
     * 
     * <pre>
     *  var task_json = {"type": CALL/EMAIL/FOLLOW_UP/MEETING/MILESTONE/SEND/TWEET, "PriorityType":HIGH/NORMAL/LOW, "subject": "call jim"}
     * 
     * (domain-name).agilecrm.com/core/js/api/task?email="encoded(email)"&id=api_key&task=task_json
     * </pre>
     * 
     * @param email
     * @param json
     * @param jsoncallback
     * @return
     */
    @Path("/task")
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
	    Contact contact = ContactUtil.searchContactByEmail(email);
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

    /**
     * Adds note to the contact, which is searched based on the email id
     * 
     * @param email
     *            email of the contact to relate note to particular contact
     * @param json
     *            note object as JSON string format
     * @param jsoncallback
     * @return {@link JSONWithPadding} Returns note object which is saved and
     *         calls the specified callback
     */
    @Path("/note")
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
	    Contact contact = ContactUtil.searchContactByEmail(email);
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
    /**
     * Adds deal and relate contact to the deal
     * 
     * <pre>
     *  var opportunity_json = {"name": "Deal sales", "description": "brief description on deal", "expected_value": "100", 
     *  	"milestone":"won", "close_date": data as epoch time}
     *  
     *  (domain-name).agilecrm.com/core/js/api/opportunity?email=encoded(email)&id=apikey&opportunity=opportunity_json&callback="callback"
     * </pre>
     * 
     * @param email
     *            email of contact to be added in deal
     * @param json
     *            opportunity object as json object
     * @param jsoncallback
     * @return
     */
    @Path("/opportunity")
    @GET
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces("application/x-javascript")
    public JSONWithPadding createOpportunity(@QueryParam("email") String email,
	    @QueryParam("id") String apiKey,
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
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return null;
	    opportunity.contacts = new ArrayList<String>();
	    opportunity.contacts.add(contact.id + "");

	    // Set, owner id to opportunity (owner of the apikey is set as owner
	    // to opportunity)
	    opportunity.owner_id = String.valueOf(APIKey
		    .getDomainUserIdRelatedToAPIKey(apiKey).getId());

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

    /**
     * Adds tags to particular contact (based on email of contact). If contact
     * doesn't exit with given email id, null is returned
     * 
     * <pre>
     * var tags= "tag1, tag2, tag3" (or) var tags="tag1 tag2 tag3";
     * 
     *   (domain-name).agilecrm.com/core/js/api/contacts/add-tags?email=encoded(email)&id=apikey&tags=tags&callback="callback";
     * </pre>
     * 
     * @param email
     *            email of the contact to add tags
     * @param tags
     *            tags to be added
     * @param jsoncallback
     * @return {@link JSONWithPadding} contact with added tags
     */
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

	    Contact contact = ContactUtil.searchContactByEmail(email);
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

    /**
     * Removes tags from a contact based on the email address
     * 
     * <pre>
     * var tags = "tag1, tag2, tag3"
     * 
     * (domain-name).agilecrm.com/core/js/api/contacts/remove-tags?email=encoded(email)&id=apikey&tags=tags&callback="callback"
     * </pre>
     * 
     * @param email
     *            email of the contact, whose tags are to be removed
     * @param tags
     *            tags to be removed
     * @param jsoncallback
     * @return {@link JSONWithPadding} returns contact after removing tags
     */
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

	    Contact contact = ContactUtil.searchContactByEmail(email);
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

    /**
     * Add score to the contact. Searches contact based on the email sent and
     * adds score to the existing score of the contact
     * 
     * <pre>
     * (domain-name).agilecrm.com/core/js/api/contacts/add-score?email=encoded(email)&score="100"
     * </pre>
     * 
     * @param email
     *            email of the contact
     * @param score
     *            score to be added to the contact
     * @return
     */
    @Path("contacts/add-score")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public boolean addScore(@QueryParam("email") String email,
	    @QueryParam("score") Integer score)
    {
	Contact contact = ContactUtil.searchContactByEmail(email);
	if (contact == null)
	    return true;

	contact.addScore(score);
	return true;
    }

    // Subtract score
    /**
     * Subtract score from the existing score of the contact
     * 
     * <pre>
     * (domain-name).agilecrm.com/core/js/api/contacts/subtract-score?email=encode(email)&score="10";
     * 
     * It subtracts score 10 from the existing score of the contact
     * </pre>
     * 
     * @param email
     *            email address of the contact
     * @param score
     *            score to be subtracted
     * @return
     */
    @Path("contacts/subtract-score")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public boolean subtractScore(@QueryParam("email") String email,
	    @QueryParam("score") Integer score)
    {

	// Get Contact
	Contact contact = ContactUtil.searchContactByEmail(email);
	if (contact == null)
	    return true;

	contact.subtractScore(score);
	return true;

    }

    /**
     * Enrolls a contact to particular workflow. Takes contact id and workflow
     * id as parameters in addition apikey parameter. contact-id and worflow-id
     * is given
     * 
     * <pre>
     * (domain-name).agilecrm.com/core/js/api/campaign/enroll/{contact-id}/{workflow-id};
     * </pre>
     * 
     * @param contactId
     * @param workflowId
     * @return
     */
    @Path("/campaign/enroll/{contact-id}/{workflow-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Boolean subscribeContact(@PathParam("contact-id") Long contactId,
	    @PathParam("workflow-id") Long workflowId)
    {
	Contact contact = ContactUtil.getContact(contactId);
	if (contact == null)
	{
	    System.out.println("Null contact");
	    return true;
	}

	WorkflowUtil.subscribe(contact, workflowId);

	return true;
    }
}