package com.agilecrm.user.notification.util;

import org.json.JSONArray;

import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.user.notification.NotificationPrefs;

/**
 * <code>DealNotificationPrefsUtil</code> is the base class to execute
 * notifications for Deals. Executes notification when deal is added and deal is
 * deleted.
 * 
 * @author Naresh
 * 
 */
public class DealNotificationPrefsUtil
{
    /**
     * Executes notification when deal is created.
     * 
     * @param opportunity
     *            Deal object that is created.
     */
    public static void executeNotificationForNewDeal(Opportunity opportunity)
    {
	if (opportunity != null)
	    NotificationPrefsUtil.executeNotification(NotificationPrefs.Type.DEAL_CREATED, opportunity, null);
    }

    /**
     * Executes notification when deals are deleted.
     * 
     * @param OpportunityIds
     *            List of Ids of Deals that are selected for deletion.
     */
    public static void executeNotificationForDeleteDeal(JSONArray OpportunityIds)
    {
	// Executes notification when deal is deleted
	if (OpportunityIds != null)
	{
	    try
	    {
		for (int i = 0; i < OpportunityIds.length(); i++)
		{
		    String id = OpportunityIds.get(i).toString();

		    // Gets Opportunity based on id
		    Opportunity opportunityObject = OpportunityUtil.getOpportunity(Long.parseLong(id));

		    // Executes notification when deal is deleted
		    NotificationPrefsUtil.executeNotification(NotificationPrefs.Type.DEAL_CLOSED, opportunityObject, null);
		}
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
    }
}
