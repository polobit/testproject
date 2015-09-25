package com.agilecrm.export.impl;

import java.io.File;
import java.io.IOException;
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

    public ContactExporter()
    {
	super(EXPORT_TYPE.CONTACT);
	// TODO Auto-generated constructor stub
    }

    public ContactExporter(EXPORT_TYPE type)
    {
	super(type);
	// TODO Auto-generated constructor stub
    }

    public ContactExporter(File file) throws IOException
    {
	super(EXPORT_TYPE.CONTACT, file);
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
	    Long start = System.currentTimeMillis();
	    notes = NoteUtil.getNotes(contact.id);
	    System.out.println("Notes Fetch Time :" + (System.currentTimeMillis() - start) + " , Notes fetched : "
		    + notes.size());

	    return ContactExportCSVUtil.addNotes(str, notes);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	return str;
    }
}
