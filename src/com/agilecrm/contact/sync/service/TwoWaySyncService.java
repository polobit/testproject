/**
 * 
 */
package com.agilecrm.contact.sync.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.thirdparty.google.ContactPrefs.SYNC_TYPE;
import com.thirdparty.google.contacts.ContactsSynctoGoogle;

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

    /**
     * Gets the new contacts.
     * 
     * @return the new contacts
     */
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
    
    public void syncContactsToClient()
    {
	uploadContactsToClient(fetchNewContactsFromAgile());
	uploadContactsToClient(fetchUpdatedContactsFromAgile());
    }

    public List<Contact> fetchNewContactsFromAgile()
    {
	Map<String, Object> queryMap = new HashMap<String, Object>();
	queryMap.put("created_time > ", time);

	if (prefs.my_contacts)
	    queryMap.put("owner_key", pref.getDomainUser());

	queryMap.put("type", Type.PERSON);

	System.out.println(queryMap);
    }
    
    public abstract Contact wrapContactToClientFormat();

    public abstract List<Contact> fetchUpdatedContactsFromAgile();

    private void syncContactToClient()
    {
	ContactsSynctoGoogle.updateContacts(prefs);
    }

    public abstract void syncContactFromClient();

    public abstract void uploadContactsToClient(List<Contact> contacts);

}
