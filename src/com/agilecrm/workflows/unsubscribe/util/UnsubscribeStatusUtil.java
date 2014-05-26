package com.agilecrm.workflows.unsubscribe.util;

import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.workflows.unsubscribe.UnsubscribeStatus;

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
}
