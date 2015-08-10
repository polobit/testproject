package com.agilecrm.export.impl;

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
}
