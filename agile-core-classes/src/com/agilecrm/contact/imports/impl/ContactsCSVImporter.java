package com.agilecrm.contact.imports.impl;

import java.io.IOException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.imports.CSVImporter;
import com.agilecrm.contact.upload.blob.status.dao.ImportStatusDAO;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
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
	    Class<Contact> contactClass, int currentEntityCount, ImportStatusDAO importDAO)
    {
	super(domain, blobKey, domainUseId, entityMapper, contactClass, currentEntityCount, importDAO);
	// TODO Auto-generated constructor stub
    }

    protected void process()
    {
	NamespaceManager.set(domain);
	// TODO Auto-generated method stub
	try
	{
	    BillingRestriction restriction = getBillingRestriction();

	    // There is limiation on count in remote API (max count
	    // it gives is 1000)
	    restriction.contacts_count = currentEntityCount;

	    CSVUtil csvUtil = new CSVUtil(restriction, getUserAccessControl(), importDAO);
	    csvUtil.createContactsFromCSV(getInputStream(), getMapperEntity(), String.valueOf(domainUserId));

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
