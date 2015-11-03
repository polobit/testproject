package com.agilecrm.contact.imports.impl;

import java.io.IOException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.imports.CSVImporter;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.util.CSVUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.blobstore.BlobKey;

public class ContactsCSVImporter extends CSVImporter<Contact>
{
    /**
     * Should not remove this. It should match do deserialize importer object
     */
    private static final long serialVersionUID = 1L;

    public ContactsCSVImporter(String domain, BlobKey blobKey, Long domainUseId, String entityMapper,
	    Class<Contact> contactClass)
    {
	super(domain, blobKey, domainUseId, entityMapper, contactClass);
	// TODO Auto-generated constructor stub
    }

    @Override
    public void run()
    {
	NamespaceManager.set(domain);
	// TODO Auto-generated method stub
	try
	{
	    new CSVUtil(getBillingRestriction(), getUserAccessControl()).createContactsFromCSV(getInputStream(),
		    getMapperEntity(), String.valueOf(domainUserId));
	}
	catch (PlanRestrictedException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(null);
	}

    }
}
