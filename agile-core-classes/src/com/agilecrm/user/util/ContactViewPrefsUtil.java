package com.agilecrm.user.util;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.core.api.prefs.UserPrefsAPI;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.ContactViewPrefs;
import com.agilecrm.user.ContactViewPrefs.Type;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>ContactViewPrefsUtil</code> is the utility class for ContactViewPrefs.
 * It handles some of the REST calls of {@link UserPrefsAPI}. It fetches
 * ContactViewPrefs with respect to id and current agile user. It sets default
 * ContactViewPrefs with respect to agile id.
 * 
 */
public class ContactViewPrefsUtil
{
    /**
     * ContactViewPrefs Dao.
     */
    private static ObjectifyGenericDao<ContactViewPrefs> dao = new ObjectifyGenericDao<ContactViewPrefs>(
	    ContactViewPrefs.class);

    /**
     * Returns ContactViewPrefs with respect to current agile-user.
     * 
     * @return ContactViewPrefs of current user.
     */
    public static ContactViewPrefs getCurrentUserContactViewPrefs()
    {
	// Agile User
	AgileUser agileUser = AgileUser.getCurrentAgileUser();

	// Get Prefs
	return getContactViewPrefs(agileUser);
    }

    /**
     * Returns ContactViewPrefs with respect to current agile-user.
     * 
     * @return ContactViewPrefs of current user.
     */
    public static ContactViewPrefs getCurrentUserContactViewPrefs(String type)
    {
	// Agile User
	AgileUser agileUser = AgileUser.getCurrentAgileUser();

	Objectify ofy = ObjectifyService.begin();
	Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, agileUser.id);

	List<ContactViewPrefs> viewsPrefsList = ofy.query(ContactViewPrefs.class).ancestor(userKey).list();

	if (viewsPrefsList != null && !viewsPrefsList.isEmpty())
	{
	    for (ContactViewPrefs viewPrefs : viewsPrefsList)
	    {
		if (viewPrefs.type.toString().equalsIgnoreCase(type))
		    return viewPrefs;
	    }
	}
	if ("COMPANY".equalsIgnoreCase(type))
	{
	    return getDefaultCompanyViewPrefs(agileUser);
	}
	else
	{
	    return getDefaultContactViewPrefs(agileUser);
	}

    }

    /**
     * Returns ContactViewPrefs with respect to given AgileUser if exists,
     * otherwise returns default ContactViewPrefs.
     * 
     * @param agileUser
     *            - AgileUser object.
     * @return ContactViewPrefs of given agile-user.
     */
    public static ContactViewPrefs getContactViewPrefs(AgileUser agileUser)
    {
	Objectify ofy = ObjectifyService.begin();
	Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, agileUser.id);

	List<ContactViewPrefs> viewPrefsList = ofy.query(ContactViewPrefs.class).ancestor(userKey).list();

	if (viewPrefsList != null && !viewPrefsList.isEmpty())
	{
	    for (ContactViewPrefs viewPrefs : viewPrefsList)
	    {
		if (viewPrefs.type == Type.PERSON)
		    return viewPrefs;
	    }

	}

	return getDefaultContactViewPrefs(agileUser);

    }

    /**
     * Returns ContactViewPrefs of the domain.
     * 
     * @param agileUser
     *            - AgileUser object.
     * @return ContactViewPrefs of given agile-user.
     */
    public static List<ContactViewPrefs> getAllContactViewPrefs(String type)
    {
	Objectify ofy = ObjectifyService.begin();

	List<ContactViewPrefs> viewPrefs = ofy.query(ContactViewPrefs.class).list();

	List<ContactViewPrefs> result = new ArrayList<ContactViewPrefs>();

	for (ContactViewPrefs viewPref : viewPrefs)
	{
	    if (type.equalsIgnoreCase(viewPref.type.toString())
		    || (type.equals(CustomFieldDef.SCOPE.CONTACT.toString()) && viewPref.type
			    .equals(ContactViewPrefs.Type.PERSON)))
	    {
		result.add(viewPref);
	    }
	}

	return result;
    }

    public static void handleCustomFieldDelete(CustomFieldDef customFieldDef)
    {
	List<ContactViewPrefs> contactViewPrefs = getAllContactViewPrefs(customFieldDef.scope.toString());

	for (ContactViewPrefs viewPref : contactViewPrefs)
	{
	    if (viewPref.fields_set.contains("CUSTOM_" + customFieldDef.field_label))
	    {
		viewPref.fields_set.remove("CUSTOM_" + customFieldDef.field_label);
		viewPref.save();
	    }
	}
    }

    /**
     * Returns default ContactViewPrefs.
     * 
     * @param agileUser
     *            - AgileUser Object.
     * @return default ContactViewPrefs.
     */
    private static ContactViewPrefs getDefaultContactViewPrefs(AgileUser agileUser)
    {
	LinkedHashSet<String> fields_set = new LinkedHashSet<String>();
	fields_set.add("basic_info");
	fields_set.add("company");
	fields_set.add("tags");
	fields_set.add("lead_score");
	ContactViewPrefs viewPrefs = new ContactViewPrefs(agileUser.id, fields_set);
	viewPrefs.save();
	return viewPrefs;
    }

    /**
     * Returns default ContactViewPrefs.
     * 
     * @param agileUser
     *            - AgileUser Object.
     * @return default ContactViewPrefs.
     */
    private static ContactViewPrefs getDefaultCompanyViewPrefs(AgileUser agileUser)
    {
	LinkedHashSet<String> fields_set = new LinkedHashSet<String>();
	fields_set.add("basic_info");
	fields_set.add("owner");
	fields_set.add("star_value");
	fields_set.add("created_time");
	ContactViewPrefs viewPrefs = new ContactViewPrefs(agileUser.id, fields_set);
	viewPrefs.type = ContactViewPrefs.Type.COMPANY;
	viewPrefs.save();
	return viewPrefs;
    }

    /**
     * Returns ContactViewPrefs with respect to Id if exists, otherwise returns
     * null.
     * 
     * @param id
     *            - ContactViewPrefs Id.
     * @return ContactViewPrefs with respect to given id.
     */
    public static ContactViewPrefs getUserPrefs(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (EntityNotFoundException e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

}
