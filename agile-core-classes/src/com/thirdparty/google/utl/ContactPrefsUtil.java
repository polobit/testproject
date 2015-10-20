package com.thirdparty.google.utl;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.DataSyncUrlConstants;
import com.agilecrm.contact.sync.Type;
import com.agilecrm.contact.sync.SyncFrequency;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.groups.GoogleGroupDetails;

public class ContactPrefsUtil
{
    public static void delete(Type type)
    {
    System.out.println("type is printing     "+type);
	ContactPrefs prefs = ContactPrefsUtil.getPrefsByType(type);
	prefs.delete();
    }
    
    
    public static void deleteSyncwidgetById(Type type,Long id)
    {
    System.out.println("type is printing     "+type);
	ContactPrefs prefs = ContactPrefsUtil.get(id);
	if(prefs==null){
		prefs=ContactPrefsUtil.getPrefsByType(type);
	}
	if(prefs!=null)
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
    public static ContactPrefs getPrefsByType(Type type)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("type", type);
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
    
    
    public static List<ContactPrefs> getAllprefs()
    {
    List<String> prefsTyes=new ArrayList<String>();
    Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("domainUser", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()));
 	List<ContactPrefs> contactPrefs=ContactPrefs.dao.listByProperty(searchMap);
	for(ContactPrefs prefs:contactPrefs){
		if(prefs.type!=null)
		prefsTyes.add(prefs.type.toString());
	}
	
	return addSyncTemplates(prefsTyes,contactPrefs);
    }
    
    public static List<ContactPrefs> addSyncTemplates(List<String> configuredSync,List<ContactPrefs> finalSyncPrefs){
    	DataSyncUrlConstants dataSyncUrls=null;
    	dataSyncUrls=DataSyncUrlConstants.getDataSyncUrlInstance();
    	List<String> defaultSyncTemplates=dataSyncUrls.dataSyncTypes;
    	for(String defaults:defaultSyncTemplates){
    		if(!configuredSync.contains(defaults)){
    			finalSyncPrefs.add(dataSyncUrls.getDataSyncWidget(defaults));
    		}
    	}
    	return finalSyncPrefs;
    }


    public static List<ContactPrefs> getprefs(SyncFrequency duration)
    {
	Map<String, Object> queryMap = new HashMap<String, Object>();
	queryMap.put("duration", duration);

	return ContactPrefs.dao.listByProperty(queryMap);
    }

    public static ContactPrefs mergePrefs(ContactPrefs currentPrefs, ContactPrefs updatedPrefs)
    {
	updatedPrefs.token = currentPrefs.token;
	updatedPrefs.secret = currentPrefs.secret;
	updatedPrefs.refreshToken = currentPrefs.refreshToken;
	updatedPrefs.last_synced_to_client = currentPrefs.last_synced_to_client;
	updatedPrefs.last_synced_from_client = currentPrefs.last_synced_from_client;
	updatedPrefs.lastSyncCheckPoint = currentPrefs.lastSyncCheckPoint;
	updatedPrefs.othersParams = currentPrefs.othersParams;
	updatedPrefs.inProgress = currentPrefs.inProgress;
	return updatedPrefs;
    }

    public static GoogleGroupDetails getGroup(String title, ContactPrefs prefs)
    {
	if (prefs.groups.isEmpty())
	    prefs.fillGroups();

	for (GoogleGroupDetails group : prefs.groups)
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
	if (prefs.groups.isEmpty())
	    prefs.fillGroups();

	List<GoogleGroupDetails> groups = new ArrayList<GoogleGroupDetails>();
	for (GoogleGroupDetails group : prefs.groups)
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
	for (GoogleGroupDetails group : prefs.groups)
	{
	    if (URLDecoder.decode(atomId).equals(group.atomIdDecoded))
	    {
		return group;
	    }
	}

	return null;
    }
    
    /**
     * check for existence of sync widget 
     * @param type
     * @return
     */
    public static boolean findPrefsByType(Type type)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("type", type);
	searchMap.put("domainUser", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()));
	if(ContactPrefs.dao.getByProperty(searchMap)==null){
		return true;
	}
	return false;
    }
}
