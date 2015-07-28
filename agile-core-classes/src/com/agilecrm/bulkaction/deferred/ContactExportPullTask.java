package com.agilecrm.bulkaction.deferred;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import au.com.bytecode.opencsv.CSVWriter;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.export.util.ContactExportCSVUtil;
import com.agilecrm.contact.filter.ContactFilterResultFetcher;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.googlecode.objectify.Key;
t.export.ContactCSVExport;
import com.agilecrm.contact.export.util.ContactExportCSVUtil;
import com.agilecrm.contact.filter.ContactFilterResultFetcher;
import com.agilecrm.contact.util.NoteUtil;
import com.google.appengine.api.files.FileWriteChannel;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.googlecode.objectify.Key;
import com.thirdparty.mandrill.Mandrill;

public class ContactExportPullTask implements DeferredTask
{

    /**
     * 
     */
    private static final long serialVersionUID = -9119860558950199133L;

    private String filter;
    private Set<Key<Contact>> contactList = new HashSet<Key<Contact>>();
    private Long domainUserId;

    public ContactExportPullTask(String filter, Long domainUserId)
    {
	this.filter = filter;
	this.domainUserId = domainUserId;
    }

    public ContactExportPullTask(Set<Key<Contact>> contactList, Long domainUserId)
    {
	this.contactList = contactList;
	this.domainUserId = domainUserId;
    }

    @Override
    public void run()
    {
	if (filter != null)
	{
	    ContactFilterResultFetcher fetcher = new ContactFilterResultFetcher(filter, null, 200, null, domainUserId);

	    List<Contact> contacts = new ArrayList<Contact>();

	    while (fetcher.hasNext())
	    {
		contacts.addAll(fetcher.nextSet());
	    }
	}
	else if (contactList != null)
	{

	}

	String[] header = ContactExportCSVUtil.getCSVHeadersForContact();

	// TODO Auto-generated method stub

    }
    
    private void getConnection()
    {
	 URL outUrl = new URL(Mandrill.MANDRILL_API_POST_URL + Mandrill.MANDRILL_API_MESSAGE_CALL);
	    outConn = (HttpURLConnection) outUrl.openConnection();
	    outConn.setDoOutput(true);
	    outConn.setRequestMethod("POST");
	    outConn.setConnectTimeout(600000);
	    outConn.setReadTimeout(600000);
	    outConn.setRequestProperty("Content-Type", "application/json");
	    outConn.setRequestProperty("charset", "utf-8");

	    outStream = outConn.getOutputStream();
    }

    /**
     * Builds contacts csv and write to blob file.
     * 
     * @param writeChannel
     * @param contactList
     * @param isFirstTime
     */
    public static void writeContactCSV(List<Contact> contactList, String[] headers,
	    Boolean isFirstTime)
    {
	try
	{
	    CSVWriter writer = new CSVWriter(Channels.newWriter(writeChannel, "UTF8"));
	    
	    Writer i = new OutputStreamWriter(out)

	    if (isFirstTime)
		writer.writeNext(headers);

	    Map<String, Integer> indexMap = ContactExportCSVUtil.getIndexMapOfCSVHeaders(headers);

	    for (Contact contact : contactList)
	    {
		if (contact == null)
		    continue;

		String str[] = ContactCSVExport.insertContactProperties(contact, indexMap, headers.length);
		List<Note> notes = NoteUtil.getNotes(contact.id);
		writer.writeNext(addNotes(str, notes));
	    }

	    // Close without finalizing
	    writer.close();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in writeContactCSV " + e.getMessage());
	}
    }
}
