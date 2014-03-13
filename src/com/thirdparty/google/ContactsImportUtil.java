package com.thirdparty.google;

import java.io.ByteArrayOutputStream;
import java.io.ObjectOutputStream;

import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;
import com.thirdparty.google.deferred.GoogleContactsDeferredTask;
import com.thirdparty.google.utl.ContactPrefsUtil;

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
    public static void initializeImport(String type)
    {
	ContactPrefs contactPrefs = ContactPrefsUtil.getPrefsByType(ContactPrefs.Type.valueOf(type.toUpperCase()));

	System.out.println("in initialize backends");
	System.out.println(contactPrefs);

	/*
	 * If no preferences are saved, there might an error while
	 * authenticating
	 */
	if (contactPrefs == null)
	{
	    // notifies user after adding contacts
	    BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE, "Authentication failed. Please import again");
	    return;
	}

	// if contact preferences exists for google, initialize backends
	initilaizeImportBackend(contactPrefs);
    }

    /**
     * Initializes backend with contact preferences and hits
     * {@link ContactUtilServlet}
     * 
     * @param contactPrefs
     *            {@link ContactPrefs}
     */
    public static void initilaizeImportBackend(ContactPrefs contactPrefs)
    {
	// notifies user after adding contacts
	BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE, "Import scheduled");

	Queue queue = QueueFactory.getQueue("bulk-actions-queue");
	TaskOptions taskOptions;
	try
	{
	    ByteArrayOutputStream byteArrayStream = new ByteArrayOutputStream();
	    ObjectOutputStream objectOutputStream = new ObjectOutputStream(byteArrayStream);
	    objectOutputStream.writeObject(contactPrefs);
	    System.out.println("byte array length in initialize backends: " + byteArrayStream.toByteArray().length);
	    taskOptions = TaskOptions.Builder.withUrl("/backend/contactsutilservlet").payload(byteArrayStream.toByteArray()).method(Method.POST);
	    queue.addAsync(taskOptions);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }

    public static void initilaizeGoogleSyncBackend(Long id)
    {
	GoogleContactsDeferredTask task = new GoogleContactsDeferredTask(NamespaceManager.get(), id);

	// Create Task and push it into Task Queue
	Queue queue = QueueFactory.getQueue("contact-sync-queue");

	// Add to queue
	queue.addAsync(TaskOptions.Builder.withPayload(task));
    }
}
