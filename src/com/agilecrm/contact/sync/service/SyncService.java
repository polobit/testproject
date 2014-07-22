/**
 * 
 */
package com.agilecrm.contact.sync.service;

import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.wrapper.WrapperService;
import com.thirdparty.google.ContactPrefs;

/**
 * <code>SyncService</code> Interface provide simple and easy to method for sync
 * Contacts in agile every third party need to implement all method provided by
 * this.
 * 
 * @author jitendra
 */
public interface SyncService
{

    /** max limit of contact to be saved in agile per call. */
    Integer MAX_SYNC_LIMIT = 10;

    /**
     * create service based on passed {@link SyncPref} and return SyncService
     * for synchronize contact from third party eg : google,Stripe etc.
     * 
     * @param prefs
     *            the prefs
     * @return the sync service
     */
    public SyncService createService(ContactPrefs prefs);

    /**
     * initialize Contact Sync into agile.
     */
    public void initSync();

    /**
     * Save contact.
     * 
     * @param contact
     *            the contact
     */
    public void saveContact(List<Contact> contact);

    /**
     * Gets the wrapper service.
     * 
     * @return the wrapper service
     */
    public Class<? extends WrapperService> getWrapperService();
}
