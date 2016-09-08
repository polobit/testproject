package com.agilecrm.export.impl;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import com.agilecrm.deals.Opportunity;
import com.agilecrm.export.AbstractCSVExporter;
import com.agilecrm.export.DealCSVExport;

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
