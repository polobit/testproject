package com.agilecrm.export.impl;

import java.io.Writer;
import java.util.Map;

import com.agilecrm.deals.Opportunity;
import com.agilecrm.export.AbstractCSVExporter;
import com.agilecrm.export.DealCSVExport;

public class DealsExporter extends AbstractCSVExporter<Opportunity>
{

    public DealsExporter(Class<Opportunity> clazz)
    {
	// TODO Auto-generated constructor stub
	super(EXPORT_TYPE.DEAL);

    }

    public DealsExporter(Class<Opportunity> clazz, Writer writer)
    {
	// TODO Auto-generated constructor stub
	super(Opportunity.class, writer);
    }

    @Override
    public String[] convertEntityToCSVRow(Opportunity opportinuty, Map<String, Integer> indexMap, int headerLength)
    {

	// TODO Auto-generated method stub
	String str[] = DealCSVExport.insertDealFields(opportinuty, indexMap, headerLength);

	return str;
    }

}
