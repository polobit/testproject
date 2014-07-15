package com.agilecrm.contact.sync.service;

import com.agilecrm.contact.Contact;

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

    @Override
    public abstract Contact wrapContactToAgileSchema(Object object);

}
