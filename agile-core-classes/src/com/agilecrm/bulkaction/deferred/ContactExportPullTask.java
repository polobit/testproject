package com.agilecrm.bulkaction.deferred;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilterResultFetcher;
import com.agilecrm.export.ExportBuilder;
import com.agilecrm.export.Exporter;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.googlecode.objectify.Key;

public class ContactExportPullTask implements DeferredTask
{

    File file = null;
    Exporter<Contact> exporter;

    /**
     * 
     */
    private static final long serialVersionUID = -9119860558950199133L;

    private String filter;
    private List<Key<Contact>> contactList = new ArrayList<Key<Contact>>();
    private Long domainUserId;

    public ContactExportPullTask(String filter, Long domainUserId)
    {
	this.filter = filter;
	this.domainUserId = domainUserId;
    }

    public ContactExportPullTask(List<Key<Contact>> contactList, Long domainUserId)
    {
	this.contactList = contactList;
	this.domainUserId = domainUserId;
    }

    @Override
    public void run()
    {
	if (file == null)
	{
	    file = new File("test-yaswanth.csv");
	}
	List<Contact> contacts = new ArrayList<Contact>();
	if (filter != null)
	{
	    ContactFilterResultFetcher fetcher = new ContactFilterResultFetcher(filter, null, 200, null, domainUserId);

	    while (fetcher.hasNext())
	    {
		contacts.addAll(fetcher.nextSet());
	    }
	}
	else if (contactList != null)
	{
	    contacts.addAll(Contact.dao.fetchAllByKeys(contactList));
	}

	writeContactCSV(contacts);

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
