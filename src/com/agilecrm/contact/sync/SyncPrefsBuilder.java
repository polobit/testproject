/**
 * 
 */
package com.agilecrm.contact.sync;

import org.scribe.utils.Preconditions;

import com.agilecrm.contact.sync.config.SyncPrefs;
import com.agilecrm.contact.sync.service.SyncService;
import com.thirdparty.google.ContactPrefs;

/**
 * <code>SyncPrefBuilder</code> build {@link SyncPrefs} based on client and it
 * will return {@link SyncService}
 * 
 * @author jitendra
 * 
 */
public class SyncPrefsBuilder
{
    private ContactPrefs prefs;

    private SyncService api;

    /**
     * initialize {@link ContactPrefs}
     * 
     * @param prefs
     * @return SyncPrefsBuilder
     */
    public SyncPrefsBuilder config(ContactPrefs prefs)
    {
	Preconditions.checkNotNull(prefs, "ContactPrefs can't be null");
	this.prefs = prefs;
	return this;
    }

    /**
     * return {@link SyncService}
     * 
     * @param clazz
     *            which extends {@link SyncService}
     * @return SyncService
     */
    public SyncService getService(Class<? extends SyncService> clazz)
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
