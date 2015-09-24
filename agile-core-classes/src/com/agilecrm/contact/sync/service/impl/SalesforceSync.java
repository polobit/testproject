/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.IContactWrapper;

/**
 * @author jitendra
 * 
 */
public class SalesforceSync extends OneWaySyncService
{

    @Override
    public void initSync()
    {
	// TODO Auto-generated method stub

    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.service.SyncService#getWrapperService()
     */
    @Override
    public Class<? extends IContactWrapper> getWrapperService()
    {
	// TODO Auto-generated method stub
	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.agilecrm.contact.sync.service.ContactSyncService#updateLastSyncedInPrefs
     * ()
     */
    @Override
    protected void updateLastSyncedInPrefs()
    {
	// TODO Auto-generated method stub

    }

}
