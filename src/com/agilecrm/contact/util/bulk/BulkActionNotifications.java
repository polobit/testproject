package com.agilecrm.contact.util.bulk;

import org.json.JSONException;
import org.json.JSONObject;

import com.google.appengine.api.NamespaceManager;
import com.thirdparty.PubNub;

public class BulkActionNotifications
{
	public static enum BulkAction
	{
		BULK_ACTIONS(""), DELETE("%s Contacts deleted"), ADD_TAGS("Tag(s) %s added to %s contacts"), ENROLL_CAMPAIGN(
				"%s Contacts added to campaign"), OWNER_CHANGE("Owner changed for %s contacts"), CONTACTS_IMPORT(
				"%s contacts uploaded"), CONTACTS_IMPORT_MESSAGE("%s"), CONTACTS_CSV_IMPORT("%s contacts imported");

		String message;

		BulkAction(String message)
		{
			this.message = message;
			// TODO Auto-generated constructor stub
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
