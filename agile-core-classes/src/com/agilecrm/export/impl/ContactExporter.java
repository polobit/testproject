package com.agilecrm.export.impl;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.export.ContactCSVExport;
import com.agilecrm.contact.export.util.ContactExportCSVUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.export.AbstractCSVExporter;

public class ContactExporter extends AbstractCSVExporter<Contact>
{

    public ContactExporter(Class<Contact> clazz)
    {
	super(clazz);
	// TODO Auto-generated constructor stub
    }

    @Override
    protected String[] convertEntityToCSVRow(Contact contact, Map<String, Integer> indexMap, int headerLength)
    {
	// TODO Auto-generated method stub
	String str[] = ContactCSVExport.insertContactProperties(contact, indexMap, headerLength);
	List<Note> notes;
	try
	{
	    notes = NoteUtil.getNotes(contact.id);
	    return ContactExportCSVUtil.addNotes(str, notes);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	return str;
    }

    ByteArrayOutputStream stream;

    byte[] data;

    @Override
    protected Writer getWriter()
    {

	stream = new ByteArrayOutputStream(16000000);

	return new OutputStreamWriter(stream);
    }

    @Override
    protected InputStream getInputStream()
    {

	Long startTime = System.currentTimeMillis();
	byte[] b = stream.toByteArray();

	System.out.println(System.currentTimeMillis() - startTime);

	Long startTime1 = System.currentTimeMillis();
	System.out.println(stream.size());
	System.out.println(System.currentTimeMillis() - startTime1);

	// TODO Auto-generated method stub
	return new BufferedInputStream(new ByteArrayInputStream(b));
    }
}
