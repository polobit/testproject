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

    public abstract void initSync();
}
