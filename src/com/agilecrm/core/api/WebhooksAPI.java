package com.agilecrm.core.api;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.JSAPIUtil;
import com.agilecrm.util.JSAPIUtil.Errors;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

@Path("hook")
public class WebhooksAPI
{

    @GET
    @Path("test")
    @Produces(MediaType.TEXT_PLAIN)
    public String getScore(@QueryParam("email") String email)
    {
	return "{\"test\" : \"Hello\"}";

    }

    @POST
    @Path("createContact")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public String createContact(@FormParam("dataJson") String json, @FormParam("email") String email, @FormParam("pluginType") String pluginType,
	    @FormParam("hookType") String hookType, @QueryParam("id") String apiKey)
    {
	System.out.println(json);
	try
	{

	    // Get Contact count by email
	    int count = ContactUtil.searchContactCountByEmail(email);
	    System.out.println("email " + email + " count: " + count);
	    if (count != 0)
	    {
		return JSAPIUtil.generateJSONErrorResponse(Errors.DUPLICATE_CONTACT, email);
	    }

	    ObjectMapper mapper = new ObjectMapper();
	    Contact contact = mapper.readValue(json, Contact.class);

	    // Sets owner key to contact before saving
	    contact.setContactOwner(JSAPIUtil.getDomainUserKeyFromInputKey(apiKey));
	    contact.addTags(pluginType);

	    try
	    {
		// If zero, save it
		System.out.println("Contact is saving...");
		contact.save();
	    }
	    catch (PlanRestrictedException e)
	    {
		return JSAPIUtil.generateJSONErrorResponse(Errors.CONTACT_LIMIT_REACHED);
	    }

	    return new JSONObject().put("success", true).toString();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return "{\"error\" : \"Error occured\"}";
	}

    }

    @POST
    @Path("addNote")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public String addNoteToContact(@FormParam("dataJson") String json, @FormParam("email") String email, @FormParam("pluginType") String pluginType,
	    @FormParam("hookType") String hookType, @QueryParam("id") String apiKey)
    {
	System.out.println(json);
	try
	{
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return JSAPIUtil.generateContactMissingError();

	    ObjectMapper mapper = new ObjectMapper();
	    Note note = mapper.readValue(json, Note.class);
	    note.addRelatedContacts(contact.id.toString());

	    DomainUser domainUser = null;
	    if (APIKey.isPresent(apiKey))
		domainUser = APIKey.getDomainUserRelatedToAPIKey(apiKey);
	    if (APIKey.isValidJSKey(apiKey))
		domainUser = APIKey.getDomainUserRelatedToJSAPIKey(apiKey);

	    if (domainUser == null)
		return "{\"error\" : \"Error occured\"}";
	    note.owner_id = domainUser.id.toString();
	    note.save();
	    System.out.println("note saved");
	    return new JSONObject().put("success", true).toString();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return "{\"error\" : \"Error occured\"}";
	}

    }

}