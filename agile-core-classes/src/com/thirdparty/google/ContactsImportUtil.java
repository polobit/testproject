package com.thirdparty.google;

import java.io.ByteArrayOutputStream;
import java.io.ObjectOutputStream;

import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;

/**
 * <code>ContactsImporter</code> contains methods to initialize backend process
 * and save imported contacts in agile
 * 
 * @author Tejaswi
 * 
 */
public class ContactsImportUtil
{

    /**
     * This is called when the user comes second time.Since we have his
     * preferences, we can initialize backends with the available preferences
     * 
     * @param type
     *            {@link ContactPrefs.Type}
     */
    /*
     * public static void initializeImport(String type) { ContactPrefs
     * contactPrefs = ContactPrefsUtil.getPrefsByType(SyncClient.valueOf(type));
     * 
     * System.out.println("in initialize backends");
     * System.out.println(contactPrefs);
     * 
     * 
     * If no preferences are saved, there might an error while authenticating
     * 
     * if (contactPrefs == null) { // notifies user after adding contacts
     * BulkActionNotifications
     * .publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE,
     * "Authentication failed. Please import again"); return; }
     * 
     * // if contact preferences exists for google, initialize backends
     * initilaizeImportBackend(contactPrefs); }
     */

    /**
     * Initializes backend with contact preferences and hits
     * {@link ContactUtilServlet}
     * 
     * @param contactPrefs
     *            {@link ContactPrefs}
     */
    public static void initilaizeImportBackend(ContactPrefs contactPrefs, boolean isSyncImmediately)
    {
	// notifies user after adding contacts
	BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE, "Import scheduled");

	Queue queue = null;
	if (isSyncImmediately)
        queue = QueueFactory.getQueue("contact-sync-now-queue");
	else
	   queue = QueueFactory.getQueue("contact-sync-queue");

	TaskOptions taskOptions;
	try
	{
	    // load contactPrefs in taskQueue
	    ByteArrayOutputStream byteArrayStream = new ByteArrayOutputStream();
	    ObjectOutputStream objectOutputStream = new ObjectOutputStream(byteArrayStream);
	    objectOutputStream.writeObject(contactPrefs);

	    // Create Task and push it into Task Queue
	    taskOptions = TaskOptions.Builder.withUrl("/backend/contactsutilservlet")
		    .payload(byteArrayStream.toByteArray()).method(Method.POST);

	    // submitting jobs in push queue
	    queue.addAsync(taskOptions);
	}
	catch (Exception e)
	{
	    contactPrefs.inProgress = false;
	    contactPrefs.save();
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }
    /*
     * public static void initilaizeGoogleSyncBackend(Long id) {
     * GoogleContactsDeferredTask task = new
     * GoogleContactsDeferredTask(NamespaceManager.get(), id);
     * 
     * // Create Task and push it into Task Queue Queue queue =
     * QueueFactory.getQueue("contact-sync-queue");
     * 
     * // Add to queue queue.addAsync(TaskOptions.Builder.withPayload(task)); }
     */
}
