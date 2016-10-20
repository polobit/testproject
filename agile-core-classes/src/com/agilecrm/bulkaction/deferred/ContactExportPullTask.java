package com.agilecrm.bulkaction.deferred;

import java.io.File;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;

import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.util.ActivityUtil;
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
	DateFormat dateTimeFormat = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
	HashMap<String, String> stats = new HashMap<String, String>();

	if (user == null)
	    return;

	try{
		Long time = System.currentTimeMillis();
    	stats.put("start_time", dateTimeFormat.format(time));
	writeContacts();
	time = System.currentTimeMillis();
	stats.put("end_time", dateTimeFormat.format(time));
	}
	catch(Exception e)
	{
		e.printStackTrace();
	}

	getExporter().finalize();

	getExporter().sendEmail(user.email);
	getExporter().sendEmail("nidhi@agilecrm.com",stats,user.domain);
	
	ActivityUtil.createLogForExport(ActivityType.CONTACT_EXPORT, EntityType.CONTACT, 0,null);
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
