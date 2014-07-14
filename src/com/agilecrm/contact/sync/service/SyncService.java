/**
 * 
 */
package com.agilecrm.contact.sync.service;

import com.thirdparty.google.ContactPrefs;

/**
 * <code>SyncService</code> Interface provide simple and easy to method for sync
 * Contacts in agile every third party need to implement all method provided by
 * this
 * 
 * @author jitendra
 * 
 */
public interface SyncService
{

    /**
     * max limit of contact to be saved in agile per call
     */
    Integer MAX_SYNC_LIMIT = 1000;

    /**
     * create service based on passed {@link SyncPref} and return SyncService
     * for synchronize contact from third party eg : google,Stripe etc.
     * 
     * @param pref
     * @return
     */
    public SyncService createService(ContactPrefs prefs);

    /**
     * @return ContactPrefs
     */
    public ContactPrefs getPrefs();

    /**
     * initialize Contact Sync into agile
     */
    public void initSync();

}
