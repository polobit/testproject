package com.agilecrm.user.access;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * User access level access scope to check user permistions to add, update,
 * delete
 * 
 * @author yaswanth
 * 
 */
public enum UserAccessScopes
{
    IMPORT_CONTACTS, CREATE_CONTACT, UPDATE_CONTACT, VIEW_CONTACTS, RESTRICTED,

    DEFAULT, EXPORT_CONTACTS, DELETE_CONTACTS, RESTRICTED_ACCESS, ADD_NEW_TAG, MANAGE_CALENDAR, VIEW_CALENDAR, MANAGE_DEALS, VIEW_DEALS, EDIT_CONTACT, DELETE_CONTACT;

    public static List<UserAccessScopes> customValues()
    {
	List<UserAccessScopes> defaultScopes = new ArrayList<UserAccessScopes>(Arrays.asList(UserAccessScopes.values()));
	defaultScopes.remove(UserAccessScopes.RESTRICTED_ACCESS);
	defaultScopes.remove(UserAccessScopes.RESTRICTED);
	defaultScopes.remove(UserAccessScopes.DEFAULT);
	//In previous versions DELETE_CONTACTS is used for update contacts permission, 
	//now update is split into update(EDIT_CONTACT) and delete(DELETE_CONTACT), so we are removing this
	defaultScopes.remove(UserAccessScopes.DELETE_CONTACTS);

	return defaultScopes;
    }
}
