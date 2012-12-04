package com.agilecrm.workflows;

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
    Long id = null;
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
    ScoreDeferredTask(Long id, int oldScore, int newScore)
    {
	this.id = id;
	this.oldScore = oldScore;
	this.newScore = newScore;
    }

    public void run()
    {

	// Executes trigger when id is not null
	if (id != null)
	    TriggerUtil.executeTriggerforScore(id, oldScore, newScore);
    }

}
