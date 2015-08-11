package com.agilecrm.export;

import com.agilecrm.contact.Contact;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.export.Exporter.EXPORT_TYPE;
import com.agilecrm.export.impl.ContactExporter;
import com.agilecrm.export.impl.DealsExporter;

public class ExportBuilder
{
    public static Exporter<Contact> buildContactExporter()
    {
	return new ContactExporter(EXPORT_TYPE.CONTACT);
    }

    public static Exporter<Opportunity> buildDealsExporter()
    {
	return new DealsExporter(Opportunity.class);
    }
}
