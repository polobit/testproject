package com.agilecrm.contact.sync.service;

import org.scribe.utils.Preconditions;

import com.agilecrm.contact.Contact;
import com.thirdparty.google.ContactPrefs;

/**
 * <code>OneWaySyncService</code> implements {@link ContactSyncService} provide
 * abstraction for initSync which is implemented by third party client
 * 
 * @author jitendra
 * 
 */
public abstract class OneWaySyncService extends ContactSyncService
{

    @Override
    public SyncService createService(ContactPrefs pref)
    {
	Preconditions.checkNotNull(pref, "Prefs can't be null");
	this.prefs = pref;
	return this;
    }

    public ContactPrefs getPrefs()
    {
	return prefs;

    }

    public abstract void initSync();

    @Override
    public abstract Contact wrapContactToAgileSchema(Object object);

}
