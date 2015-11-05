package com.agilecrm.bulkaction.deferred;

import java.io.File;
import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilterResultFetcher;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.export.ExportBuilder;
import com.agilecrm.export.Exporter;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

public class ContactExportPullTask implements DeferredTask
{

    File file = null;
    Exporter<Contact> exporter;

    /**
     * 
     */
    private static final long serialVersionUID = -9119860558950199133L;
    private String filter;
    private String contact_ids;
    private Long domainUserId;
    private String dynamicFilter;
    private Long currentUserId;
    private String namespace = null;

    public ContactExportPullTask(String contact_ids, String filter, String dynamicFilter, Long currentUserId,
	    String namespace)
    {
	this.contact_ids = contact_ids;
	this.dynamicFilter = dynamicFilter;
	this.filter = filter;
	this.currentUserId = currentUserId;
	this.namespace = namespace;
    }

    @Override
    public void run()
    {
	NamespaceManager.set(namespace);
	System.out.println("-----------------------------------------------------------------------------------------");
	System.out.println(contact_ids + " " + dynamicFilter + " " + filter + " " + currentUserId + " " + namespace);

	DomainUser user = DomainUserUtil.getDomainUser(currentUserId);

	if (user == null)
	    return;

	writeContacts();

	getExporter().finalize();

	getExporter().sendEmail(user.email);

	BulkActionNotifications.publishconfirmation(BulkAction.EXPORT_CONTACTS_CSV);

	NamespaceManager.set(null);

	// TODO Auto-generated method stub

    }

    private Exporter<Contact> getExporter()
    {
	if (exporter != null)
	    return exporter;

	return exporter = ExportBuilder.buildContactExporter();
    }

    private void writeContacts()
    {
	ContactFilterResultFetcher fetcher = new ContactFilterResultFetcher(filter, dynamicFilter, 200, contact_ids,
		currentUserId);

	while (fetcher.hasNextSet())
	{
	    Long time = System.currentTimeMillis();
	    getExporter().writeEntitesToCSV(fetcher.nextSet());
	    System.out.println(System.currentTimeMillis() - time);
	}
    }

    /**
     * Builds contacts csv and write to blob file.
     * 
     * @param writeChannel
     * @param contactList
     * @param isFirstTime
     */
    public void writeContactCSV(List<Contact> contactList)
    {
	getExporter().writeEntitesToCSV(contactList);
    }

    public static void main(String[] args)
    {

	ContactFilterResultFetcher fetcher = new ContactFilterResultFetcher("6407376026468352", null, 20, null,
		1752041L);

	while (fetcher.hasNextSet())
	{
	    Long time = System.currentTimeMillis();
	    System.out.println(fetcher.nextSet());
	    System.out.println(System.currentTimeMillis() - time);
	}
    }
}
