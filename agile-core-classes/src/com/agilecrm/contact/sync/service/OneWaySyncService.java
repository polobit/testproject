package com.agilecrm.contact.sync.service;

/**
 * <code>OneWaySyncService</code> implements {@link ContactSyncService} provide
 * abstraction for initSync which is implemented by third party client
 * 
 * @author jitendra
 * 
 */
public abstract class OneWaySyncService extends ContactSyncService
{

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.service.SyncService#initSync()
     */
    public abstract void initSync();
}
