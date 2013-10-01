package com.agilecrm.core.api;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONObject;

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
import com.agilecrm.gadget.GadgetTemplate;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.status.CampaignStatus;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.Log;
import com.campaignio.logger.util.LogUtil;

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
    @Produces("application/x-javascript")
    public String getContact(@QueryParam("email") String email)
    {
	try
	{
	    // Search contact based on email, returns empty contact if contact
	    // is not available with given email

		ObjectMapper mapper = new ObjectMapper();
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    System.out.println("Contact " + contact);
	    if (contact == null)
	    	contact = new Contact();
	    return mapper.writeValueAsString(contact);
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
     * 	properties:[{name:first_name, type:person/company, value: harry},
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
    @Produces("application/x-javascript")
    public String createContact(@QueryParam("contact") String json, @QueryParam("id") String apiKey)
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
	    contact.setContactOwner(APIKey.getDomainUserKeyRelatedToAPIKey(apiKey));

	    // If zero, save it
	    contact.save();

	    return mapper.writeValueAsString(contact);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Deletes a contact. Fetches contact based on email and deletes.
     * 
     * It returns true if contact is found and deleted.
     * 
     * @param email
     * @return
     */
    @Path("contact/delete")
    @GET
    @Produces("application/x-javascript")
    public String deleteContact(@QueryParam("email") String email)
    {
    try
    {
	Contact contact = ContactUtil.searchContactByEmail(email);
	
	if(contact == null)
	return null;
    contact.delete();
    JSONObject obj = new JSONObject();
    obj.put("success", "Contact deleted successfully");
	return obj.toString();
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
    @Produces("application/x-javascript")
    public String createTask(@QueryParam("email") String email, @QueryParam("task") String json,
	    @QueryParam("id") String key)
    {
	try
	{
	    ObjectMapper mapper = new ObjectMapper();
	    Task task = mapper.readValue(json, Task.class);
	    System.out.println(task);

	    // Get Contact
	    Contact contact = ContactUtil.searchContactByEmail(email);

	    // task.setOwner(new Key<AgileUser>(AgileUser.class,
	    // APIKey.getAgileUserRelatedToAPIKey(key).id));
	    task.setOwner(APIKey.getDomainUserKeyRelatedToAPIKey(key));
	    if (contact == null)
		return null;

	    task.contacts = new ArrayList<String>();
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
    @Produces("application/x-javascript")
    public String createOpportunity(@QueryParam("email") String email, @QueryParam("opportunity") String json,
	    @QueryParam("id") String apiKey)
    {
	try
	{
	    ObjectMapper mapper = new ObjectMapper();
	    Opportunity opportunity = mapper.readValue(json, Opportunity.class);
	    System.out.println(opportunity);

	    // Get Contact
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return null;

	    opportunity.addContactIds(contact.id.toString());

	    // Set, owner id to opportunity (owner of the apikey is set as owner
	    // to opportunity)
	    opportunity.owner_id = String.valueOf(APIKey.getDomainUserKeyRelatedToAPIKey(apiKey).getId());

	    opportunity.save();
	    System.out.println("opportunitysaved");

	    return mapper.writeValueAsString(opportunity);

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
    @Produces(MediaType.APPLICATION_JSON)
    public String addTags(@QueryParam("email") String email, @QueryParam("tags") String tags)
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

	    return new ObjectMapper().writeValueAsString(contact);

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
    @Produces(MediaType.APPLICATION_JSON)
    public Contact removeTags(@QueryParam("email") String email, @QueryParam("tags") String tags)
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

	    return contact;

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
    @Produces("application/x-javascript")
    public String addScore(@QueryParam("email") String email, @QueryParam("score") Integer score)
    {
	try
	{
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return null;

	    contact.addScore(score);
	    return new ObjectMapper().writeValueAsString(contact);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}

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
    @Produces("application/x-javascript")
    public String subtractScore(@QueryParam("email") String email, @QueryParam("score") Integer score)
    {
    try
    {

	// Get Contact
	Contact contact = ContactUtil.searchContactByEmail(email);
	if (contact == null)
	    return null;

	contact.subtractScore(score);
	return new ObjectMapper().writeValueAsString(contact);
    }
    catch (Exception e)
    {
    	e.printStackTrace();
    	return null;
    }
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
    public Boolean subscribeContact(@PathParam("contact-id") Long contactId, @PathParam("workflow-id") Long workflowId)
    {
	Contact contact = ContactUtil.getContact(contactId);
	if (contact == null)
	{
	    System.out.println("Null contact");
	    return true;
	}

	WorkflowSubscribeUtil.subscribe(contact, workflowId);

	return true;
    }

    /**
     * Adds a contact property or replaces a contact property if it already
     * exists based on property name.
     * 
     * @param email
     *            email of the contact to add property.
     * @param data
     *            json object containing property data and value to be added.
     * @param jsoncallback
     * 
     * @return String
     */
    @Path("contacts/add-property")
    @GET
    @Produces("application / x-javascript")
    public String addProperty(@QueryParam("data") String json, @QueryParam("email") String email)
    {
	try
	{
	    // Fetches contact based on email
	    Contact contact = ContactUtil.searchContactByEmail(email);

	    // Returns if contact is null
	    if (contact == null)
		return null;

	    ObjectMapper mapper = new ObjectMapper();

	    // Reads contact field object from json.
	    ContactField field = mapper.readValue(json, ContactField.class);

	    // Adds/updates field to contact and saves it
	    contact.addProperty(field);

	    // Returns updated contact
	    return mapper.writeValueAsString(contact);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Adds a note to the contact based on email of contact
     * 
     * @param data
     *            json object containing the subject and decription fields of
     *            the note
     * @param jsoncallback
     * 
     * @return String
     */
    @Path("contacts/add-note")
    @GET
    @Produces("application / x-javascript")
    public String addNote(@QueryParam("data") String json, @QueryParam("email") String email)
    {
    try
    {
    	Contact contact = ContactUtil.searchContactByEmail(email);
    	if (contact == null)
    	return null;
    	ObjectMapper mapper = new ObjectMapper();
    	Note note = mapper.readValue(json, Note.class);
   		note.addRelatedContacts(contact.id.toString());
   		note.save();
   		System.out.println("note saved");
   		return mapper.writeValueAsString(note);
   	}
   	catch (Exception e)
   	{
   		e.printStackTrace();
   		return null;
   	}
    }

    /**
     * Get score from contact based on email of contact
     * 
     * @param email
     * 				email of the contact
     * 
     * @return Integer
     */
    @Path ("contacts/get-score")
    @GET
    @Produces ("application / x-javascript")
    public String getScore(@QueryParam("email") String email)
    {
    try
    {
    	Contact contact = ContactUtil.searchContactByEmail(email);
    	if (contact == null)
    	return null;
    	else
    	{
    		ObjectMapper mapper = new ObjectMapper();
    		System.out.println("getting score" + contact.lead_score);
    		return mapper.writeValueAsString(contact.lead_score);
    	}
    }
    catch(Exception e)
    {
    	e.printStackTrace();
    	return null;
    }
    }

    /**
     * Get notes from contact based on email
     * 
     * @param email
     * 				email of the contact
     * 
     * @return String (notes)
     */
    @Path ("contacts/get-notes")
    @GET
    @Produces ("application / x-javascript")
    public String getNotes(@QueryParam("email") String email)
    {
    try 
    {
    	Contact contact = ContactUtil.searchContactByEmail(email);
    	if (contact == null)
    		return null;
    	else
    	{
    		List<Note> Notes = new ArrayList<Note>();
    		Notes = NoteUtil.getNotes(contact.id);
    		ObjectMapper mapper = new ObjectMapper();
    		JSONArray arr = new JSONArray();
    		for(Note note : Notes)
    		{
    			arr.put(mapper.writeValueAsString(note));
    		}
    		return arr.toString();
    	}
    }
    catch(Exception e)
    {
    	e.printStackTrace();
    	return null;
    }
    }

    /**
     * Get contact tags based on email
     * 
     * @param email
     * 				email of the contact
     * 
     * @return String (tags)
     */
    @Path("contacts/get-tags")
    @GET
    @Produces ("application / x-javascript")
    public String getTags(@QueryParam("email") String email)
    {
    try
    {
    	Contact contact = ContactUtil.searchContactByEmail(email);
    	if (contact == null)
    	return null;
    	else
    	{
    		ObjectMapper mapper = new ObjectMapper();
    		System.out.println("getting tags" + contact.tags);
    		return mapper.writeValueAsString(contact.tags);
    	}
    }
    catch(Exception e)
    {
    	e.printStackTrace();
    	return null;
    }
    }

    /**
     * Get tasks based on email of the contact
     * 
     * @param email
     * 				email of the contact
     * 
     * @return 
     * 				String (tasks)
     */
    @Path("contacts/get-tasks")
    @GET
    @Produces ("application / x-javascript")
    public String getTasks(@QueryParam("email") String email)
    {
    try
    {
    	Contact contact = ContactUtil.searchContactByEmail(email);
    	if (contact==null)
    	return null;
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
    catch(Exception e)
    {
    	e.printStackTrace();
    	return null;
    }
    }
    
    /**
     * Get deals based on the email of the contact
     * 
     * @param email
     * 				email of the contact
     * 
     * @return String 
     */
    @Path("contacts/get-deals")
    @GET
    @Produces ("application / x-javascript")
    public String getDeals(@QueryParam("email") String email)
    {
    try
    {
    	Contact contact = ContactUtil.searchContactByEmail(email);
    	if(contact==null)
    	return null;
    	List<Opportunity> deals = new ArrayList<Opportunity>();
    	deals = OpportunityUtil.getCurrentContactDeals(contact.id);
    	ObjectMapper mapper = new ObjectMapper();
    	JSONArray arr = new JSONArray();
    	for (Opportunity deal : deals)
    	{
    		arr.put(mapper.writeValueAsString(deal));
    	}
    	return arr.toString();
    }
    catch(Exception e)
    {
    	e.printStackTrace();
    	return null;
    }
    }
    
    /**
     * Add campaign based on contact email to already existing workflow
     * 
     * @param email
     * 				email of the contact
     * 
     * @return String
     */
    @Path("contacts/add-campaign")
    @GET
    @Produces ("application / x-javascript")
    public String addCampaign(@QueryParam("data") String json, @QueryParam("email") String email)
    {
    try
    {
    	
    	Contact contact = ContactUtil.searchContactByEmail(email);
    	if (contact == null)
    	return null;
    	ObjectMapper mapper = new ObjectMapper();
    	Workflow workflow = mapper.readValue(json, Workflow.class);
    	WorkflowSubscribeUtil.subscribe(contact, workflow.id);
    	return mapper.writeValueAsString(workflow);
    }
    catch(Exception e)
    {
    	e.printStackTrace();
    	return null;
    }
    }
    
    /**
     * Get campaigns to which contact is subscribed by contact email
     * 
     * @param email
     * 				email of the contact
     * 
     * @return String
     */
    @Path("contacts/get-campaigns")
    @GET
    @Produces("application / x-javascript")
    public String getCampaigns(@QueryParam("email") String email)
    {
    try
    {
    	Contact contact = ContactUtil.searchContactByEmail(email);
    	if (contact == null)
    	return null;
    	
    	JSONArray arr = new JSONArray();
    	List<CampaignStatus> campaignStatusList = contact.campaignStatus;
    	for (CampaignStatus campaignStatus : campaignStatusList)
    	{
    		JSONObject workflow = WorkflowUtil.getWorkflowJSON(Long.parseLong(campaignStatus.campaign_id));
    		if (workflow == null)
    		continue;
    		arr.put(workflow);
    	}
    	return arr.toString();
    }
    catch(Exception e)
    {
    	e.printStackTrace();
    	return null;
    }
    }
    
    /**
     * Get multiple campaign logs to which contact is subscribed based on his email
     * 
     * @param email
     * 				email of the contact
     * 
     * @return 	String 
     */
    @Path("contacts/get-campaign-logs")
    @GET
    @Produces("application / x-javascript")
    public String getCampaignLogs(@QueryParam("email") String email)
    {
    try
    {
    	Contact contact = ContactUtil.searchContactByEmail(email);
    	if(contact == null)
    		return null;
    	JSONArray arr = new JSONArray();
    	ObjectMapper mapper = new ObjectMapper();
    	List<Log> logs = new ArrayList<Log>();
    	logs = LogUtil.getSQLLogs(null, contact.id.toString(), "50");
    	for (Log log : logs)
    	{
    		arr.put(mapper.writeValueAsString(log));
    	}
    	return arr.toString();
    }
    catch(Exception e)
    {
    	e.printStackTrace();
    	return null;
    }
    }
    
    /**
     *  Get all work-flows created by the current domain user
     *  
     *  @param pagesize
     *  
     *  @return 
     */
    @Path ("contacts/get-workflows")
    @GET
    @Produces("application / x-javascript")
    public String getWorkflows()
    {
    try
    {
    	JSONArray arr = new JSONArray();
    	List<Workflow> workflows = new ArrayList<Workflow>();
    	workflows = WorkflowUtil.getAllWorkflows();
    	for (Workflow workflow : workflows)
    	{
    		JSONObject obj = WorkflowUtil.getWorkflowJSON(workflow.id);
    		arr.put(obj);
    		if(obj == null)
    		continue;
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
	 * @method service
	 * 
	 * @param {String} template template name.
	 * */
    @Path ("gmail-template")
    @GET
    @Produces("application / x-javascript")
    public String getGadgetTemplate(@QueryParam("template") String template)
	{

		try {

			if (StringUtils.isBlank(template))
				throw new Exception("Invalid param for template");

			JSONObject reponseJSON = new JSONObject();
			// Creating response data
			reponseJSON.put("status", "success");
			reponseJSON.put("content",
					GadgetTemplate.getGadgetTemplate(template));

			// Returning data by calling callback function retrieved from
			// request.
			
			return reponseJSON.toString();
		} catch (Exception e) {
			e.printStackTrace();
			// TODO: handle exception
			return null;
		}
	}
}