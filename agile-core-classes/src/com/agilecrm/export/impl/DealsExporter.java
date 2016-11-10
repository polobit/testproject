package com.agilecrm.export.impl;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import com.agilecrm.contact.Note;
import com.agilecrm.contact.export.util.ContactExportCSVUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.export.AbstractCSVExporter;
import com.agilecrm.export.DealCSVExport;
import com.agilecrm.export.util.DealExportCSVUtil;

public class DealsExporter extends AbstractCSVExporter<Opportunity>
{

    public DealsExporter()
    {
	// TODO Auto-generated constructor stub
	super(EXPORT_TYPE.DEAL);
    }

    public DealsExporter(File file) throws IOException
    {
	// TODO Auto-generated constructor stub
	super(EXPORT_TYPE.DEAL, file);
    }

    @Override
    public String[] convertEntityToCSVRow(Opportunity opportinuty, Map<String, Integer> indexMap, int headerLength)
    {

	// TODO Auto-generated method stub
	String str[] = DealCSVExport.insertDealFields(opportinuty, indexMap, headerLength);
	
	List<Note> notes;
	try
	{
	    Long start = System.currentTimeMillis();
	    notes = opportinuty.getNotes();
	    System.out.println("Notes Fetch Time :" + (System.currentTimeMillis() - start) + " , Notes fetched : "
		    + notes.size());
	    
	    Collections.sort(notes,new Comparator<Note>(){
			@Override  
            public int compare(Note o1, Note o2){
				return o2.created_time.compareTo(o1.created_time);  
            }
        });
	    return DealExportCSVUtil.addNotes(str, notes);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	return str;
    }

	@Override
	protected String[] convertEntityToCSVRow(Opportunity entity,
			Map<String, Integer> indexMap, int headerLength,
			Map<Long, String> source_map, Map<Long, String> status_map) {
		// TODO Auto-generated method stub
		return null;
	}

}
