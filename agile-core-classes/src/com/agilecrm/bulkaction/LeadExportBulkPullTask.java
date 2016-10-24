package com.agilecrm.bulkaction;

import com.agilecrm.bulkaction.deferred.ContactExportPullTask;
import com.agilecrm.bulkaction.deferred.bulk.BigTask;

public class LeadExportBulkPullTask extends ContactExportPullTask implements BigTask
{
    private static final long serialVersionUID = 1L;

    public LeadExportBulkPullTask(String contact_ids, String filter, String dynamicFilter, Long currentUserId, String namespace)
    {
	super(contact_ids, filter, dynamicFilter, currentUserId, namespace);
    }
}
