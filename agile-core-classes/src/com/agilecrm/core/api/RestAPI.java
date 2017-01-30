package com.agilecrm.core.api;

import java.io.IOException;
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

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;

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
import com.agilecrm.util.PHPAPIUtil;
import com.agilecrm.zapier.util.ZapierUtil;

@Path("/rest/api")
public class RestAPI {
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
    public String createContact(String data) {
	System.out.println("Input received = " + data);
	try {
	    Contact contact = new Contact();
	    String[] tags = new String[0];

	    // Get data and iterate over keys

	    JSONObject obj = new JSONObject(data);
	    Iterator<?> keys = obj.keys();
	    while (keys.hasNext()) {
		String key = (String) keys.next();

		if (key.equals("flag"))
		    continue;
		// If key equals to tags, format tags String and prepare tags
		// array
		if (key.equals("tags")) {
		    tags = ZapierUtil.getModifiedTag(obj.getString(key));
		}
	    }

	    List<ContactField> properties = ZapierUtil
		    .getAllPropertiesCreateContact(data);

	    int count = 0;

	    if (obj.has("email"))
		count = ContactUtil.searchContactCountByEmail(obj.getString(
			"email").toLowerCase());

	    System.out.println("contacts available" + count);
	    if (count != 0) {
		System.out.println("duplicate contact");
		if (obj.has("flag")) {
		    if (obj.getString("flag").equals("YES")) {
			return ZapierUtil.updateContactCanBeDone(data);
		    } else {
			throw new WebApplicationException(
				Response.status(Response.Status.BAD_REQUEST)
					.entity("Sorry, duplicate contact found with the same email address.")
					.build());
		    }
		} else {
		    System.out.println("No flag selected");
		    throw new WebApplicationException(Response
			    .status(Response.Status.BAD_REQUEST)
			    .entity("No flag selected").build());
		}

	    }

	    // Add properties list to contact properties
	    contact.properties = properties;
	    // developer rest API source identification
	    contact.source = "zapier";
	    
	    if (tags.length > 0)
		contact.addTags(PHPAPIUtil.getValidTags(tags));
	    else
		contact.save();

	    ObjectMapper mapper = new ObjectMapper();
	    return mapper.writeValueAsString(contact);
	} catch (Exception e) {
	    e.printStackTrace();
	    throw new WebApplicationException(
		    Response.status(Response.Status.BAD_REQUEST)
			    .entity("Sorry, duplicate contact found with the same email address.")
			    .build());
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
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonGenerationException
     * @throws JSONException
     */
    @PUT
    @Path("contact")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8;")
    public String updateContact(String data) throws JsonGenerationException,
	    JsonMappingException, IOException, JSONException {
	System.out.println("Input received = " + data);

	// Get data and check if email is present
	JSONObject obj = new JSONObject(data);
	String[] tags = new String[0];
	ObjectMapper mapper = new ObjectMapper();
	if (!obj.has("email"))
	    return null;

	// Search contact if email is present else return null
	Contact contact = ContactUtil.searchContactByEmailZapier(obj.getString(
		"email").toLowerCase());

	if (contact == null) {
	    System.out.println("No contact found first");

	    if (obj.has("flag")) {
		if (obj.getString("flag").equals("YES")) {
		    return ZapierUtil.createContactCanBeDone(data);
		} else {
		    throw new WebApplicationException(
			    Response.status(Response.Status.BAD_REQUEST)
				    .entity("New contact found, but create contact is diasbled")
				    .build());
		}
	    }

	}

	contact.contact_company_id = null;

	// Iterate data by keys ignore email key value pair
	Iterator<?> keys = obj.keys();
	List<ContactField> input_properties = new ArrayList<ContactField>();
	while (keys.hasNext()) {
	    String key = (String) keys.next();
	    if (key.equals("flag"))
		continue;
	    if (key.equals("email"))
		continue;
	    else if (key.equals("tags")) {
		tags = ZapierUtil.getModifiedTag(obj.getString(key));
	    } else {
		// Create and add contact field to contact
		JSONObject json = new JSONObject();
		if (key.equals("address")) {

		    String zapaddress = obj.getString(key);
		    JSONObject jsonzap = new JSONObject(zapaddress);
		    String oldaddress = contact.getContactFieldValue("ADDRESS");
		    json = ZapierUtil.modifyZapierAddress(oldaddress, jsonzap,
			    key);

		} else if (key.equals("phone")) {
		    json.put("name", "phone");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "work");
		} else if (key.equals("home_phone_zapier")) {
		    json.put("name", "phone");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "home");
		} else if (key.equals("mobile_phone_zapier")) {
		    json.put("name", "phone");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "mobile");
		} else if (key.equals("main_phone_zapier")) {
		    json.put("name", "phone");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "main");
		} else if (key.equals("home_fax_zapier")) {
		    json.put("name", "phone");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "home fax");
		} else if (key.equals("work_fax_zapier")) {
		    json.put("name", "phone");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "work fax");
		} else if (key.equals("website")) {
		    json.put("name", "website");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "URL");
		} else if (key.equals("skype_website_zapier")) {
		    json.put("name", "website");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "SKYPE");
		} else if (key.equals("twitter_website_zapier")) {
		    json.put("name", "website");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "TWITTER");
		} else if (key.equals("linkedin_website_zapier")) {
		    json.put("name", "website");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "LINKEDIN");
		} else if (key.equals("facebook_website_zapier")) {
		    json.put("name", "website");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "FACEBOOK");
		} else if (key.equals("xing_website_zapier")) {
		    json.put("name", "website");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "XING");
		} else if (key.equals("feed_website_zapier")) {
		    json.put("name", "website");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "FEED");
		}else if (key.equals("googleplus_website_zapier")) {
		    json.put("name", "website");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "GOOGLE_PLUS");
		}else if (key.equals("flickr_website_zapier")) {
		    json.put("name", "website");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "FLICKR");
		}else if (key.equals("github_website_zapier")) {
		    json.put("name", "website");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "GITHUB");
		}else if (key.equals("youtube_website_zapier")) {
		    json.put("name", "website");
		    json.put("value", obj.getString(key));
		    json.put("subtype", "YOUTUBE");
		} else {
		    json.put("name", key);
		    json.put("value", obj.getString(key));
		}

		ContactField field = mapper.readValue(json.toString(),
			ContactField.class);
		input_properties.add(field);
	    }
	}
	// Partial update, send all properties
	contact.addPropertiesData(input_properties);
	if (tags.length > 0)
	    contact.addTags(PHPAPIUtil.getValidTags(tags));

	// Return contact object as String
	return mapper.writeValueAsString(contact);

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
    public String addNoteToContactsBasedOnEmail(Note note,
	    @PathParam("email") String email) throws JSONException {

	System.out.println("email to search on" + email);
	System.out.println("Notes " + note);
	JSONObject object = new JSONObject();

	if (note == null) {
	    object.put("error", "Note could not be added");
	    return object.toString();
	}

	Contact contact = ContactUtil.searchContactByEmailZapier(email
		.toLowerCase());
	if (contact == null) {
	    object.put("error", "No contact found with email address \'"
		    + email + "\'");
	    return object.toString();
	}

	try {
	    note.addRelatedContacts(contact.id.toString());
	    note.save();
	    ObjectMapper mapper = new ObjectMapper();
	    return mapper.writeValueAsString(note);
	} catch (Exception e) {
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
    public Contact createCompany(Contact contact) {
	// Check if the email exists with the current email address
	boolean isDuplicate = ContactUtil.isExists(contact
		.getContactFieldValue("EMAIL"));

	// Throw non-200 if it exists
	if (isDuplicate) {
	    throw new WebApplicationException(
		    Response.status(Response.Status.BAD_REQUEST)
			    .entity("Sorry, duplicate contact found with the same email address.")
			    .build());
	}

	boolean isDuplicateCompany = ContactUtil.isCompanyExist(contact
		.getContactFieldValue("NAME"));

	// Throw non-200 if it exists
	if (isDuplicateCompany) {
	    throw new WebApplicationException(
		    Response.status(Response.Status.BAD_REQUEST)
			    .entity("Sorry, duplicate company found with the same name.")
			    .build());
	}
	contact.save();
	UserInfo user_info = SessionManager.get();
	if (user_info != null
		&& !("agilecrm.com/js").equals(user_info.getClaimedId())
		&& !("agilecrm.com/dev").equals(user_info.getClaimedId())
		&& !("agilecrm.com/php").equals(user_info.getClaimedId())) {
	    try {
		ActivitySave.createTagAddActivity(contact);
	    } catch (Exception e) {
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
    public List<Contact> getContactsBasedOnTagFilter(
	    @PathParam("tag") String tag) throws JSONException {
	List<Contact> contactList = new ArrayList<Contact>();
	String filterJson = "";

	filterJson = "{'rules':[{'LHS':'tags','CONDITION':'EQUALS','RHS':'"
		+ tag + "'}],'or_rules':[],'contact_type':'PERSON'}";

	ContactFilter contact_filter = ContactFilterUtil
		.getFilterFromJSONString(filterJson);

	List<Contact> contactList1 = new ArrayList<Contact>(
		contact_filter.queryContacts(Integer.parseInt("10"), null,
			"-updated_time"));

	List<Contact> contactList2 = new ArrayList<Contact>(
		contact_filter.queryContacts(Integer.parseInt("10"), null,
			"-created_time"));

	Map<Long, Contact> unsortMap = new HashMap<Long, Contact>();

	System.out
		.println("========================  Log 1  =================================== ");
	for (Contact c : contactList1) {
	    System.out
		    .println("========================  Log 2  =================================== ");
	    int index = Arrays.asList(c.tags.toArray()).indexOf(tag);
	    if (index != -1 && index >= 0)
		unsortMap.put(c.tagsWithTime.get(index).createdTime, c);

	    System.out
		    .println("========================  Log 3  =================================== ");

	}

	System.out
		.println("========================  Log 4  =================================== ");
	for (Contact c : contactList2) {
	    System.out
		    .println("========================  Log 5  =================================== ");
	    int index = Arrays.asList(c.tags.toArray()).indexOf(tag);
	    if (index != -1 && index >= 0)
		unsortMap.put(c.tagsWithTime.get(index).createdTime, c);
	}

	Map<Long, Contact> treeMap = new TreeMap<Long, Contact>(
		new Comparator<Long>() {
		    @Override
		    public int compare(Long o1, Long o2) {
			return o2.compareTo(o1);
		    }
		});
	treeMap.putAll(unsortMap);

	for (Map.Entry<Long, Contact> entry : treeMap.entrySet()) {
	    contactList.add((Contact) entry.getValue());
	}
	System.out
		.println("========================  Log 6  =================================== ");
	return contactList;
    }

}