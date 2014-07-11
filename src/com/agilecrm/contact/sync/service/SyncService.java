/**
 * 
 */
package com.agilecrm.contact.sync.service;

import com.thirdparty.google.ContactPrefs;

/**
 * @author jitendra
 * 
 */
public interface SyncService
{

    Integer MAX_SYNC_LIMIT = 1000;

    /**
     * create service based on passed {@link SyncPref} and return SyncService
     * for synchronize contact from third party eg : google,Stripe etc.
     * 
     * @param pref
     * @return
     */
    public SyncService createService(ContactPrefs prefs);

    public ContactPrefs getPrefs();

    public void initSync();

}
