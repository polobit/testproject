package com.agilecrm.cms;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.user.AgileUser;
import com.thirdparty.PubNub;

public class CMSPlugin {

	public enum EventName {
		WebRule, LandingPages, Forms, Campaigns
	}

	/**
	 * 
	 * @param name
	 * @param isCreated
	 */
	public static void updateToCmsPlugins(EventName name, boolean isCreated) {
		try {
			AgileUser agileUser = AgileUser.getCurrentAgileUser();
			if (agileUser == null)
				return;

			// Get Rest key
			APIKey apiKey = APIKey.getAPIKey();
			if (apiKey == null)
				return;

			JSONObject messageJSON = new JSONObject();
			messageJSON.put("type", name);

			String action = "Created";
			if (!isCreated)
				action = "Updated";

			messageJSON.put("action", action);

			PubNub.pubNubPush(apiKey.api_key, messageJSON);

		} catch (Exception e) {
			// TODO: handle exception
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

	}
}
