package com.campaignio.tasklets.agile;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.util.DBUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>Add note</code> represents Add note node in workflow.It is used to add
 * note to the contact that subscribes to campaign.When the campaign runs with
 * the contact, then the note is added to that contact.
 * 
 * @author Naresh
 * 
 */
public class AddNote extends TaskletAdapter
{

    // Fields of AddNote node
    /**
     * Subject of a note
     */
    public static String SUBJECT = "subject";
    /**
     * Description of a note
     */
    public static String DESCRIPTION = "description";

    // Run
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

	// Creates log for note
	log(campaignJSON, subscriberJSON, "About : " + subject
		+ "Description : " + description);

	System.out.println(" Contact Details: " + contact);

	if (contact != null)
	{

	    Note note = new Note(subject, description);
	    List<String> contacts = new ArrayList<String>();

	    contacts.add(contactId);
	    note.contacts = contacts;
	    note.save();

	}

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }

}
