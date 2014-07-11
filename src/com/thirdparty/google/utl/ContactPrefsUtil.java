package com.thirdparty.google.utl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.sync.SyncClient;
import com.agilecrm.contact.sync.SyncFrequency;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.groups.GoogleGroupDetails;

public class ContactPrefsUtil
{
    public static void delete(SyncClient type)
    {
	ContactPrefs prefs = ContactPrefsUtil.getPrefsByType(type);
	prefs.delete();
    }

    /**
     * Retrieves {@link ContactPrefs} based on enum {@link ContactPrefs.Type}
     * and current domain user (@link {@link DomainUser})
     * 
     * @param type
     *            {@link ContactPrefs.Type} from which contacts are imported
     * @return
     */
    public static ContactPrefs getPrefsByType(SyncClient type)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("client", type);
	searchMap.put("domainUser", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()));
	return ContactPrefs.dao.getByProperty(searchMap);
    }

    /**
     * Retrieves {@link ContactPrefs} based on its id from database
     * 
     * @param id
     *            {@link Long} id of {@link ContactPrefs}
     * @return
     */
    public static ContactPrefs get(Long id)
    {
	return get(new Key<ContactPrefs>(ContactPrefs.class, id));

    }

    public static List<Key<ContactPrefs>> getAllKeysBasedOnDuration(SyncFrequency duration)
    {
	return ContactPrefs.dao.listKeysByProperty("duration", duration);
    }

    public static ContactPrefs get(Key<ContactPrefs> prefsKey)
    {
	try
	{
	    return ContactPrefs.dao.get(prefsKey);
	}
	catch (EntityNotFoundException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return null;
	}
    }

    public static List<ContactPrefs> getprefs()
    {
	return ContactPrefs.dao.fetchAll();
    }

    public static List<ContactPrefs> getprefs(SyncFrequency duration)
    {
	Map<String, Object> queryMap = new HashMap<String, Object>();
	queryMap.put("duration", duration);

	return ContactPrefs.dao.listByProperty(queryMap);
    }

    public static ContactPrefs mergePrefs(ContactPrefs currentPrefs, ContactPrefs updatedPrefs)
    {
	updatedPrefs.setToken(currentPrefs.getToken());
	updatedPrefs.setSecret(currentPrefs.getSecret());
	updatedPrefs.setRefreshToken(currentPrefs.getRefreshToken());
	updatedPrefs.setLast_synced_to_client(currentPrefs.getLast_synced_to_client());
	updatedPrefs.setLast_synced_from_client(currentPrefs.getLast_synced_from_client());
	return updatedPrefs;
    }

    public static GoogleGroupDetails getGroup(String title, ContactPrefs prefs)
    {
	if (prefs.getGroups().isEmpty())
	    prefs.fillGroups();

	for (GoogleGroupDetails group : prefs.getGroups())
	{
	    if (prefs.sync_from_group == null && group.groupName.equals("Contacts"))
	    {
		prefs.sync_from_group = group.atomId;
	    }

	    if (title.equals(group.groupName))
		return group;
	}

	return null;
    }

    public static List<GoogleGroupDetails> getGroupList(String title, ContactPrefs prefs)
    {
	if (prefs.getGroups().isEmpty())
	    prefs.fillGroups();

	List<GoogleGroupDetails> groups = new ArrayList<GoogleGroupDetails>();
	for (GoogleGroupDetails group : prefs.getGroups())
	{
	    if (prefs.sync_from_group == null && group.groupName.equals("Contacts"))
	    {
		prefs.sync_from_group = group.atomId;
	    }

	    if (title.equals(group.groupName))
		groups.add(group);
	}

	return groups;
    }

    public static GoogleGroupDetails getGroupBasedOnID(String atomId, ContactPrefs prefs)
    {
	for (GoogleGroupDetails group : prefs.getGroups())
	{
	    if (atomId.equals(group.atomId))
	    {
		return group;
	    }
	}

	return null;
    }
}
