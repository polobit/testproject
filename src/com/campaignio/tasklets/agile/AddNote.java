package com.campaignio.tasklets.agile;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.util.DBUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.TaskletManager;

public class AddNote extends TaskletAdapter
{

    // Fields
    public static String SUBJECT = "subject";
    public static String ADD_NOTE = "add_note";

    // Run
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {

	// Get Subject and Note
	String subject = getStringValue(nodeJSON, subscriberJSON, data, SUBJECT);
	String addNote = getStringValue(nodeJSON, subscriberJSON, data,
		ADD_NOTE);

	System.out.println("Entered Subject:" + subject + "and Note :"
		+ addNote);

	// Get Contact Id
	String contactId = DBUtil.getId(subscriberJSON);
	Contact contact = Contact.getContact(Long.parseLong(contactId));

	System.out.println("Contact Details:" + contact);

	if (contact != null)
	{
	    Note note = new Note(subject, addNote);
	    List<String> contacts = new ArrayList<String>();
	    // Storing contactId to 'contacts' list
	    contacts.add(contactId);
	    note.contacts = contacts;
	    note.save();
	}

	// Execute Next One in Loop
	TaskletManager.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }

}
