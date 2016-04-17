package com.agilecrm.contact.bulk;

import java.util.Set;

import org.json.JSONException;

import com.agilecrm.AgileQueues;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.bulkaction.deferred.ContactsBulkDeleteDeferredTask;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilterIdsResultFetcher;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;

public class ContactsDeleteTask implements DeferredTask
{
    /**
     * 
     */
    private static final long serialVersionUID = 3484681495377544666L;

    private ContactFilterIdsResultFetcher fetcher;
    private String model_ids;
    private String filter;
    private Long current_user_id;
    private String dynamicFilter;

    public ContactsDeleteTask(String model_ids, String filter, Long current_user_id, String dynamicFilter)
    {
	this.model_ids = model_ids;
	this.filter = filter;
	this.current_user_id = current_user_id;
	this.dynamicFilter = dynamicFilter;
    }

    public ContactsDeleteTask(ContactFilterIdsResultFetcher fetcher, Long current_user_id)
    {
	this.fetcher = fetcher;
	this.current_user_id = current_user_id;
    }

    public void execute()
    {

    }

    public void run()
    {
	if (fetcher == null)
	    fetcher = new ContactFilterIdsResultFetcher(filter, dynamicFilter, model_ids, null, 180, current_user_id);

	while (fetcher.hasNext())
	{

	    try
	    {
		Set<Key<Contact>> contactSet = fetcher.next();
		ContactsBulkDeleteDeferredTask task = new ContactsBulkDeleteDeferredTask(current_user_id,
			NamespaceManager.get(), contactSet);

		// Add to queue
		Queue queue = QueueFactory.getQueue(AgileQueues.CONTACTS_DELETE_QUEUE);
		queue.add(TaskOptions.Builder.withPayload(task));
		continue;

	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}

	try
	{
	    // Logs activity and sends notification
	    logActivity();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

    public void logActivity() throws JSONException
    {
	System.out.println("contacts : " + fetcher.getContactCount());
	System.out.println("companies : " + fetcher.getCompanyCount());

	String message = "";
	if (fetcher.getContactCount() > 0)
	{
	    message = fetcher.getContactCount() + " Contacts deleted";
	    ActivitySave.createBulkActionActivity(fetcher.getContactCount(), "DELETE", "", "contacts", "");
	}
	else if (fetcher.getCompanyCount() > 0)
	{
	    message = fetcher.getCompanyCount() + " Companies deleted";
	    ActivitySave.createBulkActionActivity(fetcher.getCompanyCount(), "DELETE", "", "companies", "");
	}
	else
	{
	    message = fetcher.getTotalCount() + " Contacts/Companies deleted";
	}

	BulkActionNotifications.publishNotification(message);
    }
}
