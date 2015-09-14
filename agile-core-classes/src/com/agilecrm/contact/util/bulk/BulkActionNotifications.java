package com.agilecrm.contact.util.bulk;

import org.json.JSONException;
import org.json.JSONObject;

import com.google.appengine.api.NamespaceManager;
import com.google.gson.JsonObject;
import com.thirdparty.PubNub;

public class BulkActionNotifications
{
    public static enum BulkAction
    {
	/**
	 * Basic Bulk Actions notification
	 */
	BULK_ACTIONS(""), DELETE("%s contacts %s deleted"), ADD_TAGS("Tag(s) %s added to %s contacts"), REMOVE_TAGS(
		"Tag(s) %s removed from %s contacts"),

	/**
	 * Import export bulk action notification
	 */
	CONTACTS_IMPORT_MESSAGE("%s"), CONTACTS_CSV_IMPORT("%s contacts imported"), EXPORT_CONTACTS_CSV(
		"Contact export operation is complete. Email is sent to you with the CSV file."),
		
	/**
	 * Import company bulk action notification
	 */
	COMPANIES_CSV_IMPORT("%s companies imported"), EXPORT_COMPANIES_CSV(
			"Companies export operation is complete. Email is sent to you with the CSV file."),
	/**
	 * Import Deals Bulk action notification
	 */
	DEALS_CSV_IMPORT("%s deals imported"),

	/**
	 * Campaign bulk action
	 */

	ENROLL_CAMPAIGN("%s Contacts added to campaign"), OWNER_CHANGE("Owner changed for %s contacts"), CONTACTS_IMPORT(
		"%s contacts uploaded"), REMOVE_ACTIVE_SUBSCRIBERS("%s subscriber(s) successfully removed from campaign."),

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
	JSONObject messageJSON = constructMessageJSON(String.format(type.getMessage(), (Object[]) parameters).toString(), type);
	
	PubNub.pubNubPush(NamespaceManager.get(), messageJSON);
    }

    public static void publishNotification(String message)
    {
	JSONObject messageJSON = constructMessageJSON(message, BulkAction.BULK_ACTIONS);
	PubNub.pubNubPush(NamespaceManager.get(), messageJSON);
    }

    private static JSONObject constructMessageJSON(String message, BulkAction actionType)
    {
	JSONObject messageJSON = new JSONObject();
	try
	{
	    System.out.println("message to send in notification " + message);
	    messageJSON.put("message", message);
	    messageJSON.put("type", BulkAction.BULK_ACTIONS);
	    messageJSON.put("sub_type", BulkAction.BULK_ACTIONS);
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	
	return messageJSON;
    }
}
