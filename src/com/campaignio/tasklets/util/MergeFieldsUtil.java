package com.campaignio.tasklets.util;

import org.json.JSONObject;

import com.agilecrm.user.DomainUser;

public class MergeFieldsUtil
{

	public static String addCalendarMergeField(DomainUser domainUser, JSONObject subscriberJSON)
	{
		// local http://localhost:8888
		// beta-sandbox
		// "https://"+domainUser.domain+"-dot-sandbox-dot-agilecrmbeta.appspot.com"
		// version "https://"+domainUser.domain+".agilecrm.com"

		String schedule_id = domainUser.schedule_id;
		String calendar_url = "https://" + domainUser.domain + ".agilecrm.com";

		if (schedule_id == null)
			schedule_id = domainUser.name;
		calendar_url += "/calendar/" + schedule_id;

		System.out.println("calendar url is " + calendar_url + " and the domain is " + domainUser.domain);
		return calendar_url;

	}
}
