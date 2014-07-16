/**
 * 
 */
package com.agilecrm.contact.sync.service;

import java.util.List;

import com.agilecrm.contact.Contact;
import com.thirdparty.google.ContactPrefs.SYNC_TYPE;

/**
 * <code>TwoWaySyncService</code> can be implemented by third party who needs to
 * share data to and from client
 * 
 * @author jitendra
 * 
 */
public abstract class TwoWaySyncService extends ContactSyncService
{

    private static final Integer MAX_UPLOAD_LIMIT = 1000;

    public List<Contact> getNewContacts()
    {
	return null;
    }

    public void initSync()
    {
	if (prefs.sync_type == SYNC_TYPE.TWO_WAY)
	{
	    syncContactToClient();
	    syncContactFromClient();
	}
	else if (prefs.sync_type == SYNC_TYPE.AGILE_TO_CLIENT)
	{
	    syncContactToClient();
	}
	else if (prefs.sync_type == SYNC_TYPE.CLIENT_TO_AGILE)
	{
	    syncContactFromClient();
	}

    }

    public abstract List<Contact> fetchNewContactsFromAgile();

    public abstract List<Contact> fetchUpdatedContactsFromAgile();

    private void syncContactToClient()
    {
	// Uploads newly created contacts in agile to client
	uploadContactsToClient(fetchNewContactsFromAgile());

	// Uploads updated contacts in agile to client
	uploadContactsToClient(fetchUpdatedContactsFromAgile());
    }

    public abstract void syncContactFromClient();

    public abstract void uploadContactsToClient(List<Contact> contacts);

}
