package com.agilecrm.workflows.unsubscribe.util;

import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.workflows.unsubscribe.UnsubscribeStatus;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;

public class UnsubscribeStatusUtil
{

    public static void removeUnsubscribeStatus(Contact contact, String campaignId)
    {
	List<UnsubscribeStatus> statusList = contact.unsubscribeStatus;

	Iterator<UnsubscribeStatus> itr = statusList.listIterator();

	while (itr.hasNext())
	{
	    if (!StringUtils.isBlank(campaignId) && campaignId.equals(itr.next().campaign_id))
	    {
		itr.remove();
		break;
	    }
	}

	contact.save();
    }

    public static void addUnsubscribeLog(String campaignId, String contactId, String message)
    {
	// Add log
	LogUtil.addLogToSQL(campaignId, contactId, message, LogType.UNSUBSCRIBED.toString());
    }
}
