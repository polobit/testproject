package com.agilecrm.triggers;

import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.triggers.Trigger.Type;

public class ScoreTriggerUtil
{
    /**
     * Executes trigger if score of contact hits trigger custom score
     * 
     * @param contactId
     *            Contact Id
     * @param oldScore
     *            Contact score before changes made
     * @param newScore
     *            Contact score after changes made
     */
    public static void executeTriggerForScore(Contact contact,
	    Integer oldScore, Integer newScore)
    {

	List<Trigger> triggersList = null;

	try
	{
	    triggersList = TriggerUtil
		    .getTriggersByCondition(Trigger.Type.ADD_SCORE);

	    if (triggersList != null)
	    {
		for (Trigger trigger : triggersList)

		{
		    if ((oldScore < trigger.custom_score)
			    && (newScore >= trigger.custom_score))
		    {
			TriggerUtil.executeTrigger(contact,
				Long.parseLong(trigger.campaign_id));
		    }

		}

	    }
	}

	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

}
