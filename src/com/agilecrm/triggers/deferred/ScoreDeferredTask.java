package com.agilecrm.triggers.deferred;

import com.agilecrm.contact.Contact;
import com.agilecrm.triggers.ScoreTriggerUtil;
import com.agilecrm.triggers.Trigger;
import com.agilecrm.triggers.TriggerUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * ScoreDeferredTask class executes {@link Trigger} when score of Contact meets
 * custom score of a trigger.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class ScoreDeferredTask implements DeferredTask
{
    String contactJSON = null;
    Integer oldScore = 0;
    Integer newScore = 0;

    /**
     * Constructs {@link ScoreDeferredTask} class
     * 
     * @param id
     *            Requires Contact Id
     * @param oldScore
     *            Requires score value of contact before changes made.
     * @param newScore
     *            Requires score value of contact after changes made.
     */
    public ScoreDeferredTask(String contactJSON, int oldScore, int newScore)
    {
	this.contactJSON = contactJSON;
	this.oldScore = oldScore;
	this.newScore = newScore;
    }

    public void run()
    {
	Contact contact = (Contact) TriggerUtil.getEntityFromJSONString(
		contactJSON, Contact.class);

	// Executes trigger when id is not null
	if (contact != null)
	    ScoreTriggerUtil
		    .executeTriggerForScore(contact, oldScore, newScore);
    }
}
