package com.thirdparty.google;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.ObjectInputStream;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs.Type;
import com.thirdparty.google.contacts.ContactSyncUtil;
import com.thirdparty.google.deferred.GoogleContactsDeferredTask;
import com.thirdparty.salesforce.SalesforceImportUtil;
import com.thirdparty.stripe.StripeUtil;
import com.thirdparty.zoho.ZohoImportUtil;
import com.thirdparty.shopify.ShopifyUtil;

/**
 * <code>ContactUtilServlet</code> contains method to get and import contacts.
 * Initialized using cron into agile
 * 
 * @author Tejaswi
 * 
 */
@SuppressWarnings("serial")
public class ContactUtilServlet extends HttpServlet
{
    public void doPost(HttpServletRequest req, HttpServletResponse res)
    {
	doGet(req, res);
    }

    /**
     * Called from backends to import contacts into agile
     */
    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {

	try
	{

	    System.out.println("in contact util servlet");
    	String type = req.getParameter("type");
	    String cron = req.getParameter("cron");

	    /**
	     * If sync type is google the contact sync based on duration is
	     * initialized
	     */
	    if ("GOOGLE".equals(type) && !StringUtils.isEmpty(cron))
	    {
		String duration = req.getParameter("duration");
		String offline = req.getParameter("offline");
		String namespace = req.getParameter("domain");
		if (StringUtils.isNotEmpty(offline) && StringUtils.isNotEmpty(namespace))
		{
		    syncGoogleContacts(namespace, duration);
		    return;
		}
		syncGoogleContacts(duration);
		return;
	    }

	    InputStream stream = req.getInputStream();
	    byte[] contactPrefsByteArray = IOUtils.toByteArray(stream);

	    ByteArrayInputStream b = new ByteArrayInputStream(contactPrefsByteArray);
	    ObjectInputStream o = new ObjectInputStream(b);

	    System.out.println("contactPrefsByteArray " + contactPrefsByteArray);
	    ContactPrefs contactPrefs = (ContactPrefs) o.readObject();

	    System.out.println("domain user key in contacts util servlet " + contactPrefs.getDomainUser());
	    importContacts(contactPrefs);

	}
	catch (Exception e)
	{
	    System.out.println("in sync servlet");
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }

    /**
     * Fetches all namespaces and initializes deferred task which fetches
     * contact prefs based on sync duration set.
     * 
     * @param duration
     */
    public void syncGoogleContacts(String duration)
    {
	System.out.println("duration" + duration);

	// Create Task and push it into Task Queue
	Queue queue = QueueFactory.getQueue("contact-sync-queue");

	// Add to queue
	for (String namespace : NamespaceUtil.getAllNamespaces())
	{
	    GoogleContactsDeferredTask task = new GoogleContactsDeferredTask(namespace, duration);

	    // Add to queue
	    queue.add(TaskOptions.Builder.withPayload(task));
	}
    }

    public void syncGoogleContacts(String namespace, String duration)
    {
	System.out.println("duration" + duration);

	// Create Task and push it into Task Queue
	Queue queue = QueueFactory.getQueue("contact-sync-queue");

	// Add to queue
	GoogleContactsDeferredTask task = new GoogleContactsDeferredTask(namespace, duration);

	// Add to queue
	queue.add(TaskOptions.Builder.withPayload(task));
    }

    /**
     * Calls {@link GoogleContactToAgileContactUtil} to retrieve contacts and
     * saves it in agile
     * 
     * @param contactPrefs
     *            {@link ContactPrefs}
     * @throws Exception
     */
    public static void importContacts(ContactPrefs contactPrefs) throws Exception
    {

	// contactPrefs = ContactPrefs.get(contactPrefs.id);

	Key<DomainUser> key = contactPrefs.getDomainUser();
	BulkActionUtil.setSessionManager(key.getId());

	if (contactPrefs.type == Type.GOOGLE)
	{
	    ContactSyncUtil.syncContacts(contactPrefs);
	    return;
	}

	try
	{

	    if (contactPrefs.type == Type.SALESFORCE)
	    {
		if (contactPrefs.thirdPartyField.contains("accounts"))
		    SalesforceImportUtil.importSalesforceAccounts(contactPrefs, key);

		if (contactPrefs.thirdPartyField.contains("leads"))
		    SalesforceImportUtil.importSalesforceLeads(contactPrefs, key);

		if (contactPrefs.thirdPartyField.contains("contacts"))
		    SalesforceImportUtil.importSalesforceContacts(contactPrefs, key);

		if (contactPrefs.thirdPartyField.contains("deals"))
		    SalesforceImportUtil.importSalesforceOpportunities(contactPrefs, key);

		if (contactPrefs.thirdPartyField.contains("cases"))
		    SalesforceImportUtil.importSalesforceCases(contactPrefs, key);

		BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE,
			"Imported successfully from Salesforce");
	    }else if(contactPrefs.type == Type.ZOHO){
	    	assert contactPrefs!=null:"contact cant be empty";
	    	
	    	if(contactPrefs.thirdPartyField.contains("leads"))
	    		ZohoImportUtil.importZohoLeads(contactPrefs, key);
	    	
	    	if(contactPrefs.thirdPartyField.contains("accounts"))
	    		ZohoImportUtil.importAccounts(contactPrefs, key);
	    	
	    	if(contactPrefs.thirdPartyField.contains("contacts"))
	    		ZohoImportUtil.importContacts(contactPrefs, key);
	    	 
	    	if(contactPrefs.thirdPartyField.contains("event"))
	    		ZohoImportUtil.importEvent(contactPrefs, key);
	    	
	    	if(contactPrefs.thirdPartyField.contains("task"))
	    		ZohoImportUtil.importTask(contactPrefs, key);
	    	
	    	BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE,
	    			"Imported successfully from Zoho");
	    }else if(contactPrefs.type == Type.STRIPE){
	    	  StripeUtil.importCustomer(contactPrefs, key);
	    	  
	    		BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE,
		    			"Imported successfully from Stripe");
	    	
	    }else if(contactPrefs.type == Type.SHOPIFY){
	    	ShopifyUtil.importCustomer(contactPrefs,key);
	    	
	    	BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE,
	    			"Imported successfully from Shopify");
	    }

	}
	catch (Exception e)
	{
	    BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE,
		    "Problem occured while importing. Please try again");
	}
	finally
	{
	    // contactPrefs.delete();
	}
    }

}
