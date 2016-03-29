package com.agilecrm.imports.factory;

import com.agilecrm.contact.upload.blob.status.specifications.StatusProcessor;
import com.agilecrm.contact.upload.blob.status.specifications.factory.ImportFactory;
import com.agilecrm.imports.ImportStatusProcessor;
import com.agilecrm.imports.ImportStatusSender;

/**
 * Injects custom status processors to CSVUtil, this class overrides factory
 * implementation of status senders implemented in core classes
 * 
 * @author yaswanth
 *
 */
public class ImportStatusProcessorFactoryGCE
{
    static
    {
	ImportFactory.injectStatusProcessor((Class<? extends StatusProcessor<String>>) ImportStatusProcessor.class);
	ImportFactory.injectStatusSender(new ImportStatusSender());
    }

}
