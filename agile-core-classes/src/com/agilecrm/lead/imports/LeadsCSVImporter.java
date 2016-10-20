package com.agilecrm.lead.imports;

import java.io.IOException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.imports.CSVImporter;
import com.agilecrm.contact.upload.blob.status.dao.ImportStatusDAO;
import com.agilecrm.contact.upload.blob.status.specifications.StatusProcessor;
import com.agilecrm.contact.upload.blob.status.specifications.factory.ImportFactory;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.util.CSVUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.blobstore.BlobKey;

public class LeadsCSVImporter extends CSVImporter<Contact>
{
    /**
     * Should not remove this. It should match do deserialize importer object
     */
    private static final long serialVersionUID = 1L;

    public LeadsCSVImporter(String domain, BlobKey blobKey, Long domainUseId, String entityMapper,
	    Class<Contact> contactClass, int currentEntityCount, ImportStatusDAO importDAO)
    {
	super(domain, blobKey, domainUseId, entityMapper, contactClass, currentEntityCount, importDAO);
    }

    @SuppressWarnings("unchecked")
	protected void process()
    {
	NamespaceManager.set(domain);
	try
	{
	    BillingRestriction restriction = getBillingRestriction();

	    // There is limiation on count in remote API (max count
	    // it gives is 1000)
	    restriction.contacts_count = currentEntityCount;
	    try
	    {
		Class.forName("com.agilecrm.imports.factory.ImportStatusProcessorFactoryGCE");
	    }
	    catch (ClassNotFoundException e)
	    {
		e.printStackTrace();
	    }

	    CSVUtil csvUtil = new CSVUtil(restriction, getUserAccessControl(), importDAO);
	    csvUtil.setStatusSender(ImportFactory.getImportStatusSender());
	    StatusProcessor<String> statusProcessor = (StatusProcessor<String>) ImportFactory.getStatusProcessor();

	    System.out.println(statusProcessor);
	    statusProcessor.setTaskQueue("contact-import-queue");
	    csvUtil.setStatusProcessor(statusProcessor);

	    csvUtil.createLeadsFromCSV(getInputStream(), getMapperEntity(), String.valueOf(domainUserId));

	}
	catch (PlanRestrictedException e)
	{
	    e.printStackTrace();
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	}

	finally
	{
	    NamespaceManager.set(null);
	}

    }
}
