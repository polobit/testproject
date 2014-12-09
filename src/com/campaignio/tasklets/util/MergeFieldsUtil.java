package com.campaignio.tasklets.util;

import org.json.JSONObject;

import com.agilecrm.user.DomainUser;
import com.agilecrm.util.VersioningUtil;

public class MergeFieldsUtil
{

	public static String addCalendarMergeField(DomainUser domainUser, JSONObject subscriberJSON)
	{

		String schedule_id = domainUser.schedule_id;
		String calender_url = VersioningUtil
				.getLoginURL(domainUser.name, VersioningUtil.getAppVersion(domainUser.name));

		if (schedule_id == null)
			schedule_id = domainUser.name;
		calender_url += "/calendar/" + schedule_id;

		return calender_url;

	}
}
