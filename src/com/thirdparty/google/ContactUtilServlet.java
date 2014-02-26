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
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs.Type;
import com.thirdparty.google.contacts.ContactSyncUtil;
import com.thirdparty.google.deferred.GoogleContactsDeferredTask;
import com.thirdparty.salesforce.SalesforceImportUtil;

/**
 * <code>ContactUtilServlet</code> contains method to get and import contacts
 * into agile
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

			if ("GOOGLE".equals(type) && !StringUtils.isEmpty(cron))
			{
				String duration = req.getParameter("duration");
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

	public void syncGoogleContacts(String duration)
	{
		System.out.println("duration" + duration);
		GoogleContactsDeferredTask task1 = new GoogleContactsDeferredTask("", duration);

		// Create Task and push it into Task Queue
		Queue queue1 = QueueFactory.getQueue("contact-sync-queue");

		// Add to queue
		queue1.add(TaskOptions.Builder.withPayload(task1));

		/*
		 * for (String namespace : NamespaceUtil.getAllNamespaces()) {
		 * GoogleContactsDeferredTask task = new
		 * GoogleContactsDeferredTask(namespace, duration);
		 * 
		 * // Create Task and push it into Task Queue Queue queue =
		 * QueueFactory.getQueue("contact-sync-queue");
		 * 
		 * // Add to queue queue.add(TaskOptions.Builder.withPayload(task)); }
		 */
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
				if (contactPrefs.salesforceFields.contains("accounts"))
					SalesforceImportUtil.importSalesforceAccounts(contactPrefs, key);

				if (contactPrefs.salesforceFields.contains("leads"))
					SalesforceImportUtil.importSalesforceLeads(contactPrefs, key);

				if (contactPrefs.salesforceFields.contains("contacts"))
					SalesforceImportUtil.importSalesforceContacts(contactPrefs, key);

				if (contactPrefs.salesforceFields.contains("deals"))
					SalesforceImportUtil.importSalesforceOpportunities(contactPrefs, key);

				if (contactPrefs.salesforceFields.contains("cases"))
					SalesforceImportUtil.importSalesforceCases(contactPrefs, key);

				BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE,
						"Imported successfully from Salesforce");
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
