package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

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
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {
	// Get Subject and Description
	String subject = getStringValue(nodeJSON, subscriberJSON, data, SUBJECT);
	String description = getStringValue(nodeJSON, subscriberJSON, data, DESCRIPTION);

	try
	{
	    // Get Contact Id
	    String contactId = AgileTaskletUtil.getId(subscriberJSON);

	    String ownerId = AgileTaskletUtil.getContactOwnerIdFromSubscriberJSON(subscriberJSON);

	    // Add note
	    addNote(subject, description, contactId, ownerId);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Got Exception while adding note..." + e.getMessage());
	}

	// Creates log for note
	LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Subject: "
	        + subject + "<br>Description: " + description, LogType.ADD_NOTE.toString());

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    }

    /**
     * Add note with subject and description to the contact of given contact-id
     * along with contact-owner.
     * 
     * @param subject
     *            - Note subject.
     * @param description
     *            - Note description.
     * @param contactId
     *            - Contact Id.
     * @param owner
     *            - Contact Owner.
     */
    private void addNote(String subject, String description, String contactId, String ownerId)
    {
	Long contactOwnerId = null;

	if (ownerId == null)
	{
	    // Fetch contact owner
	    contactOwnerId = ContactUtil.getContactOwnerId(Long.parseLong(contactId));

	    ownerId = contactOwnerId == null ? null : contactOwnerId.toString();
	}

	Note note = new Note(subject, description);
	note.addRelatedContacts(contactId);
	note.owner_id = ownerId;

	note.save();
    }

}