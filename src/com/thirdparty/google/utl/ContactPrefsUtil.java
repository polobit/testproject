package com.thirdparty.google.utl;

import java.util.HashMap;
import java.util.Map;

import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactPrefs.Type;

public class ContactPrefsUtil
{
	public static void delete(Type type)
	{
		ContactPrefs prefs = ContactPrefsUtil.getPrefsByType(type);
		prefs.delete();

	}

	/**
	 * Retrieves {@link ContactPrefs} based on enum {@link ContactPrefs.Type}
	 * 
	 * @param type
	 *            {@link ContactPrefs.Type} from which contacts are imported
	 * @return
	 */
	public static ContactPrefs getPrefsByType(ContactPrefs.Type type)
	{
	
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("type", type);
		searchMap.put("domainUser", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()));
		return ContactPrefs.dao.getByProperty(searchMap);
	}
}
