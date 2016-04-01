package com.agilecrm.contact.deferred;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.agilecrm.contact.util.NoteUtil;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.twitter.util.TwitterJobQueueUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>ContactPostDeleteTask</code> performs secondary operations in contacts
 * delete operation. Secondary operations can be deleting SQL logs, Unlinking
 * notes from contacts, Campaign crons, social suite crons and so on.
 * 
 * @author Yaswanth
 */
public class ContactPostDeleteTask implements DeferredTask
{
    /**
     * Serial Id for deserialization
     */
    private static final long serialVersionUID = 1023128426135878034L;

    private final List<Long> contactIdList;
    private final Set<String> tags;
    private final String domain;

    /**
     * Constructor to process post delete of single contact
     * 
     * @param contactId
     * @param tags
     * @param domain
     */
    public ContactPostDeleteTask(Long contactId, Set<String> tags, String domain)
    {
	this.contactIdList = new ArrayList<Long>(1);
	contactIdList.add(contactId);
	this.tags = tags;
	this.domain = domain;
    }

    /**
     * Constructor to process post delete of multiple contacts
     * 
     * @param contactIdList
     * @param tags
     * @param domain
     */
    public ContactPostDeleteTask(List<Long> contactIdList, Set<String> tags, String domain)
    {
	this.contactIdList = contactIdList;
	this.tags = tags;
	this.domain = domain;
    }

    @Override
    public void run()
    {
	for (Long id : contactIdList)
	{
	    // Delete Notes
	    NoteUtil.deleteAllNotes(id);

	    // Delete Crons.
	    CronUtil.removeTask(null, id.toString());

	    Long start = System.currentTimeMillis();

	    // Deletes logs of contact.
	    LogUtil.deleteSQLLogs(null, id.toString());

	    System.out.println("Time taken to delete logs : " + (System.currentTimeMillis() - start));

	    // Deletes TwitterCron
	    TwitterJobQueueUtil.removeTwitterJobs(null, id.toString(), NamespaceManager.get());
	}
	// TODO Auto-generated method stub
    }
}
