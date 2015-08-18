package com.agilecrm.bulkaction.deferred;

import java.io.File;
import java.io.IOException;
import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilterResultFetcher;
import com.agilecrm.export.ExportBuilder;
import com.agilecrm.export.Exporter;
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
	if (file == null)
	{
	    file = new File("test-yaswanth.csv");
	}

	writeContacts();

	getExporter().finalize();

	// TODO Auto-generated method stub

    }

    private Exporter<Contact> getExporter()
    {
	if (exporter != null)
	    return exporter;
	try
	{
	    return exporter = ExportBuilder.buildContactExporter(file);
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	return (Exporter<Contact>) null;
    }

    private void writeContacts()
    {
	ContactFilterResultFetcher fetcher = new ContactFilterResultFetcher(filter, dynamicFilter, 200, contact_ids,
		currentUserId);

	while (fetcher.hasNextSet())
	{
	    getExporter().writeEntitesToCSV(fetcher.nextSet());
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
}
