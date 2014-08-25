package com.campaignio.tasklets.agile;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.notification.NotificationPrefs.Type;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

public class Notify extends TaskletAdapter
{

    /**
     * Notification name
     */
    public static String NOTIFY_NAME = "notify_name";

    /**
     * Agile User id
     */
    public static String OWNER_ID = "owner_id";

    /**
     * If replied then Yes
     */
    public static String BRANCH_YES = "Yes";

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {
	String notifyName = getStringValue(nodeJSON, subscriberJSON, data, NOTIFY_NAME);
	String ownerId = getStringValue(nodeJSON, subscriberJSON, data, OWNER_ID);

	try
	{
	    String contactId = AgileTaskletUtil.getId(subscriberJSON);

	    // Get Owner
	    Contact contact = ContactUtil.getContact(Long.parseLong(contactId));
	    DomainUser contactOwner = contact.getOwner();

	    Long givenOwnerId = AgileTaskletUtil.getOwnerId(ownerId, contactOwner == null ? null : contactOwner.id);

	    // Push notification
	    pushNotification(contact, givenOwnerId, notifyName);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while executing notification..." + e.getMessage());
	}

	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_YES);

    }

    /**
     * Pushes given notification message to given owner
     * 
     * @param contact
     *            - subscribed contact
     * @param givenOwnerId
     *            - given owner id
     * @param notifyName
     *            - notification message
     * @throws JSONException
     */
    public void pushNotification(Contact contact, Long givenOwnerId, String notifyName) throws JSONException
    {
	// Custom json with message and owner-id
	JSONObject content = new JSONObject();
	content.put("owner_id", givenOwnerId == null ? "ALL" : givenOwnerId.toString());
	content.put("msg", notifyName);

	// Execute notification
	NotificationPrefsUtil.executeNotification(Type.CAMPAIGN_NOTIFY, contact,
	        new JSONObject().put("custom_value", content.toString()));
    }
}
