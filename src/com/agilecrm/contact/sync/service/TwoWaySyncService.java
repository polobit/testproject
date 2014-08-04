/**
 * 
 */
package com.agilecrm.contact.sync.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.filter.ContactFilterResultFetcher;
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
    private Long last_synced_to_client = 0l;

    private static final Integer MAX_UPLOAD_LIMIT = 1000;

    // Insert contact and updated contact are recorded as batch request to
    // create/update is limited to 100 per request.
    protected int insertRequestCount = 0;
    protected int updateRequestCount = 0;

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

    public void setCursor(Long created_time)
    {
	// fetched again ang again
	prefs.last_synced_to_client = created_time > prefs.last_synced_to_client ? created_time
	        : prefs.last_synced_to_client;
    }

    public abstract Contact wrapContactToClientFormat();

    public abstract List<Contact> fetchUpdatedContactsFromAgile();

    private void syncContactToClient()
    {
	ContactsSynctoGoogle.updateContacts(prefs);
    }

    public abstract void syncContactFromClient();

    private void uploadContactsToClient()
    {
	uploadNewContactsToClient();
	uploadUpdatedContactsToClient();
    }

    private void uploadNewContactsToClient()
    {
	Map<String, Object> queryMap = new HashMap<String, Object>();
	queryMap.put("created_time > ", prefs.last_synced_to_client);

	if (prefs.my_contacts)
	    queryMap.put("owner_key", prefs.getDomainUser());

	queryMap.put("type", Type.PERSON);

	ContactFilterResultFetcher fetcher = new ContactFilterResultFetcher(queryMap, "created_time", 300,
	        MAX_UPLOAD_LIMIT);

	while (fetcher.hasNextSet())
	{
	    saveContactsToClient(fetcher.nextSet());
	}

    }

    private void uploadUpdatedContactsToClient()
    {
	Map<String, Object> queryMap = new HashMap<String, Object>();
	queryMap.put("updated_time > ", prefs.last_synced_updated_contacts_to_client);

	if (prefs.my_contacts)
	    queryMap.put("owner_key", prefs.getDomainUser());

	queryMap.put("type", Type.PERSON);

	ContactFilterResultFetcher fetcher = new ContactFilterResultFetcher(queryMap, "updated_time", 300,
	        MAX_UPLOAD_LIMIT);

	while (fetcher.hasNextSet())
	{
	    saveContactsToClient(fetcher.nextSet());
	}

    }

    public abstract void saveContactsToClient(List<Contact> contacts);

}
