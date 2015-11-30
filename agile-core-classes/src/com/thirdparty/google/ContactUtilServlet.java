package com.thirdparty.google;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.ObjectInputStream;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;

import com.agilecrm.contact.sync.SyncFrequency;
import com.agilecrm.contact.sync.SyncServiceBuilder;
import com.agilecrm.contact.sync.service.IContactSyncService;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.thirdparty.google.deferred.GoogleContactsDeferredTask;
import com.thirdparty.sync.ContactSyncDeferredTask;

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

	ContactPrefs contactPrefs = null;
	try
	{

	    /**
	     * check this servlet request came from normal request or cron
	     * request if this is cron request then X-AppEngine-Cron parameter
	     * must be present in request header
	     */

	    String cronAttr = req.getHeader("X-AppEngine-Cron");

	    System.out.println(cronAttr);

	    /**
	     * if cronAttr not present in request then read contact prefs from
	     * stream
	     */
	    if (cronAttr == null)
	    {
		System.out.println("normal request......");
		InputStream stream = req.getInputStream();
		byte[] contactPrefsByteArray = IOUtils.toByteArray(stream);

		ByteArrayInputStream b = new ByteArrayInputStream(contactPrefsByteArray);
		ObjectInputStream o = new ObjectInputStream(b);

		System.out.println("contactPrefsByteArray " + contactPrefsByteArray);
		// retrieves Object which was added in taskQueue
		contactPrefs = (ContactPrefs) o.readObject();

		if (contactPrefs != null)
		{
		    doSync(contactPrefs);
		}
	    }
	    else
	    {
		System.out.println("cron request came....");
		String duration = req.getParameter("duration");
		initializeCronSync(duration);
	    }

	    /*
	     * 
	     * if ("GOOGLE".equals(type) && !StringUtils.isEmpty(cron)) { String
	     * duration = req.getParameter("duration"); String offline =
	     * req.getParameter("offline"); String namespace =
	     * req.getParameter("domain"); if (StringUtils.isNotEmpty(offline)
	     * && StringUtils.isNotEmpty(namespace)) {
	     * syncGoogleContacts(namespace, duration); return; }
	     * syncGoogleContacts(duration); return; }
	     * 
	     * } else { // handling ordinary request
	     * importContacts(contactPrefs); } }
	     */

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

    private void initializeCronSync(String duration)
    {
	SyncFrequency frequency = SyncFrequency.valueOf(duration);

	if (frequency == null)
	    return;

	// Create Task and push it into Task Queue
	Queue queue = QueueFactory.getQueue("contact-sync-queue");

	for (String namespace : NamespaceUtil.getAllNamespaces())
	{
	    ContactSyncDeferredTask task = new ContactSyncDeferredTask(namespace, frequency);

	    queue.add(TaskOptions.Builder.withPayload(task));
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

	/*
	 * // contactPrefs = ContactPrefs.get(contactPrefs.id);
	 * 
	 * Key<DomainUser> key = contactPrefs.getDomainUser();
	 * BulkActionUtil.setSessionManager(key.getId());
	 * 
	 * 
	 * if (contactPrefs.type == SyncClient.GOOGLE) {
	 * ContactSyncUtil.syncContacts(contactPrefs); return; }
	 * 
	 * 
	 * try {
	 * 
	 * if (contactPrefs.getClient().equals(SyncClient.SALESFORCE)) {
	 * 
	 * if (contactPrefs.getThirdPartyField().contains("accounts"))
	 * SalesforceImportUtil.importSalesforceAccounts(contactPrefs, key);
	 * 
	 * if (contactPrefs.thirdPartyField.contains("leads"))
	 * SalesforceImportUtil.importSalesforceLeads(contactPrefs, key);
	 * 
	 * if (contactPrefs.thirdPartyField.contains("contacts"))
	 * SalesforceImportUtil.importSalesforceContacts(contactPrefs, key);
	 * 
	 * if (contactPrefs.thirdPartyField.contains("deals"))
	 * SalesforceImportUtil .importSalesforceOpportunities(contactPrefs,
	 * key);
	 * 
	 * if (contactPrefs.thirdPartyField.contains("cases"))
	 * SalesforceImportUtil.importSalesforceCases(contactPrefs, key);
	 * 
	 * BulkActionNotifications.publishconfirmation(BulkAction.
	 * CONTACTS_IMPORT_MESSAGE, "Imported successfully from Salesforce");
	 * 
	 * } else if (contactPrefs.type == SyncClient.ZOHO) {
	 * 
	 * assert contactPrefs != null : "contact cant be empty";
	 * ZohoImportService zohoService = new ZohoImportService();
	 * 
	 * if (contactPrefs.thirdPartyField.contains("leads"))
	 * zohoService.importZohoLeads(contactPrefs, key);
	 * 
	 * if (contactPrefs.thirdPartyField.contains("accounts"))
	 * zohoService.importAccounts(contactPrefs, key);
	 * 
	 * if (contactPrefs.thirdPartyField.contains("contacts"))
	 * zohoService.importContacts(contactPrefs, key);
	 * 
	 * if (contactPrefs.thirdPartyField.contains("event"))
	 * zohoService.importEvent(contactPrefs, key);
	 * 
	 * if (contactPrefs.thirdPartyField.contains("task"))
	 * zohoService.importTask(contactPrefs, key);
	 * 
	 * BulkActionNotifications.publishconfirmation(BulkAction.
	 * CONTACTS_IMPORT_MESSAGE, "Imported successfully from Zoho");
	 * 
	 * }
	 * 
	 * else if (contactPrefs.type == SyncClient.STRIPE) {
	 * StripeImportUtil.importCustomers(contactPrefs, key);
	 * 
	 * BulkActionNotifications.publishconfirmation(BulkAction.
	 * CONTACTS_IMPORT_MESSAGE, "Imported successfully from Stripe");
	 * 
	 * }
	 * 
	 * // else if (contactPrefs.type == SyncClient.SHOPIFY)
	 * 
	 * {
	 * 
	 * ShopifyUtil.importCustomers(contactPrefs, key);
	 * 
	 * BulkActionNotifications.publishconfirmation(BulkAction.
	 * CONTACTS_IMPORT_MESSAGE, "Imported successfully from Shopify");
	 * 
	 * }
	 * 
	 * 
	 * } catch (Exception e) {
	 * BulkActionNotifications.publishconfirmation(BulkAction
	 * .CONTACTS_IMPORT_MESSAGE,
	 * "Problem occured while importing. Please try again"); } finally { //
	 * contactPrefs.delete(); }
	 */
    }

    public void doSync(ContactPrefs contactPrefs)
    {

	if (contactPrefs == null)
	    return;
	if (contactPrefs.domainUser != null)
	{
	    DomainUser user = DomainUserUtil.getDomainUser(contactPrefs.domainUser.getId());
	    BulkActionUtil.setSessionManager(user);

	    BillingRestriction restriction = BillingRestriction.getInstance(null, null);
	    restriction.refreshContacts();

	    /** contact restriction. */
	    DaoBillingRestriction contactRestriction = DaoBillingRestriction.getInstace(
		    DaoBillingRestriction.ClassEntities.Contact.toString(), restriction);

	    if (contactRestriction == null)
	    {
		return;
	    }
		

	    // Returns if contacts limit is reached
	    if (!contactRestriction.can_create())
	    {
		contactPrefs.inProgress = false;
		contactPrefs.save();
		return;
	    }
		
	}

	IContactSyncService service = new SyncServiceBuilder().config(contactPrefs).getService(contactPrefs.type.getClazz());

	if (service != null)
	{
	    try
	    {
		service.initSync();
	    }
	    finally
	    {
		contactPrefs.inProgress = false;
		contactPrefs.save();
		ContactUtil.eraseContactsCountCache();
	    }
	}
    }

}