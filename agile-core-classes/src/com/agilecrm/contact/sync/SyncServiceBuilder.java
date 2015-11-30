/**
 * 
 */
package com.agilecrm.contact.sync;

import org.scribe.utils.Preconditions;

import com.agilecrm.contact.sync.config.SyncPrefs;
import com.agilecrm.contact.sync.service.IContactSyncService;
import com.thirdparty.google.ContactPrefs;

/**
 * <code>SyncPrefBuilder</code> build {@link SyncPrefs} based on client and it
 * will return {@link IContactSyncService}
 * 
 * @author jitendra
 * 
 */
public class SyncServiceBuilder
{
    /**
     * Holds ContactPrefs instance
     */
    private ContactPrefs prefs;

    /**
     * Holds SyncService Instance
     */
    private IContactSyncService api;

    /**
     * initialize {@link ContactPrefs}.
     * 
     * @param prefs
     *            the prefs
     * @return SyncPrefsBuilder
     */
    public SyncServiceBuilder config(ContactPrefs prefs)
    {
	Preconditions.checkNotNull(prefs, "ContactPrefs can't be null");
	this.prefs = prefs;
	return this;
    }

    /**
     * create Service based in Sync Client ie third party and return
     * {@link IContactSyncService}
     * 
     * @param clazz
     *            which extends {@link IContactSyncService}
     * @return SyncService
     */
    public IContactSyncService getService(Class<? extends IContactSyncService> clazz)
    {
	Preconditions.checkNotNull(clazz, "service Provider class can't be empty");
	try
	{
	    this.api = clazz.newInstance();
	}
	catch (InstantiationException e)
	{
	    e.printStackTrace();
	}
	catch (IllegalAccessException e)
	{
	    e.printStackTrace();
	}

	return api.createService(prefs);
    }

}
