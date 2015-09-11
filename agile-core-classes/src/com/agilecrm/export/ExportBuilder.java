package com.agilecrm.export;

import java.io.File;
import java.io.IOException;

import com.agilecrm.contact.Contact;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.export.Exporter.EXPORT_TYPE;
import com.agilecrm.export.impl.ContactExporter;
import com.agilecrm.export.impl.DealsExporter;

public class ExportBuilder
{
    public static Exporter<Contact> buildContactExporter()
    {
	return new ContactExporter();
    }

    public static Exporter<Contact> buildCompanyExporter()
    {
	return new ContactExporter(EXPORT_TYPE.COMPANY);
    }

    public static Exporter<Contact> buildContactExporter(File file) throws IOException
    {
	return new ContactExporter(file);
    }

    public static Exporter<Opportunity> buildDealsExporter()
    {
	return new DealsExporter();
    }
}
