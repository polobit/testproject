package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.util.DBUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;
import com.googlecode.objectify.Key;

/**
 * <code>Add note</code> represents Add note node in workflow. It is used to add
 * note to the contact that subscribes to campaign. When the campaign runs with
 * the contact, then the note is added to that contact.
 * 
 * @author Naresh
 * 
 */
public class AddNote extends TaskletAdapter
{
    /**
     * Subject of a note
     */
    public static String SUBJECT = "subject";

    /**
     * Description of a note
     */
    public static String DESCRIPTION = "description";

    /*
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get Subject and Note
	String subject = getStringValue(nodeJSON, subscriberJSON, data, SUBJECT);
	String description = getStringValue(nodeJSON, subscriberJSON, data,
		DESCRIPTION);

	System.out.println(" Entered Subject: " + subject + " and Note : "
		+ description);

	// Get Contact Id
	String contactId = DBUtil.getId(subscriberJSON);
	Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

	System.out.println(" Contact Details: " + contact);

	if (contact != null)
	{
	    // Get DomainUser id who created workflow
	    Long domainId = campaignJSON.getLong("domainUserId");

	    if (domainId == null)
	    {
		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
			nodeJSON, null);
		return;
	    }

	    AgileUser agileUser = AgileUser
		    .getCurrentAgileUserFromDomainUser(domainId);
	    Key<AgileUser> owner = new Key<AgileUser>(AgileUser.class,
		    agileUser.id);

	    Note note = new Note(subject, description);

	    note.addRelatedContacts(contactId);
	    note.setOwner(owner);
	    note.save();

	}

	// Creates log for note
	log(campaignJSON, subscriberJSON, nodeJSON, "Subject - " + subject
		+ "<br>Description - " + description);

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }
}
