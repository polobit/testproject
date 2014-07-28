package com.agilecrm.contact.util.bulk;

import org.json.JSONException;
import org.json.JSONObject;

import com.google.appengine.api.NamespaceManager;
import com.thirdparty.PubNub;

public class BulkActionNotifications
{
    public static enum BulkAction
    {
	/**
	 * Basic Bulk Actions notification
	 */
	BULK_ACTIONS(""), DELETE("%s contacts %s deleted"), ADD_TAGS("Tag(s) %s added to %s contacts"), REMOVE_TAGS(
	s	"Tag(s) %s removed from %s contacts"),

	/**
	 * Import export bulk action notification
	 */
	CONTACTS_IMPORT_MESSAGE("%s"), CONTACTS_CSV_IMPORT("%s contacts imported"), EXPORT_CONTACTS_CSV(
		"Contact export operation is complete. Email is sent to you with the CSV file."),

	/**
	 * Campaign bulk action
	 */

	ENROLL_CAMPAIGN("%s Contacts added to campaign"), OWNER_CHANGE("Owner changed for %s contacts"), CONTACTS_IMPORT(
		"%s contacts uploaded"), REMOVE_ACTIVE_SUBSCRIBERS("%s subscribers successfully removed from campaign"),

	/**
	 * Send mail bulk action
	 */

	SEND_EMAIL("Email successfully sent to %s contact(s)");

	String message;

	BulkAction(String message)
	{
	    this.message = message;
	}

	public String getMessage()
	{
	    return this.message;
	}
    }

    public static void publishconfirmation(BulkAction type, String... parameters)
    {
	JSONObject messageJSON = new JSONObject();
	try
	{
	    messageJSON.put("message", String.format(type.getMessage(), parameters));

	    messageJSON.put("type", BulkAction.BULK_ACTIONS);
	    messageJSON.put("sub_type", type);
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	PubNub.pubNubPush(NamespaceManager.get(), messageJSON);
    }
}
