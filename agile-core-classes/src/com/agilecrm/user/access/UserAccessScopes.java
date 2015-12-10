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

    DEFAULT, EXPORT_CONTACTS, DELETE_CONTACTS, RESTRICTED_ACCESS, ADD_NEW_TAG;

    public static List<UserAccessScopes> customValues()
    {
	List<UserAccessScopes> defaultScopes = new ArrayList<UserAccessScopes>(Arrays.asList(UserAccessScopes.values()));
	defaultScopes.remove(UserAccessScopes.RESTRICTED_ACCESS);
	defaultScopes.remove(UserAccessScopes.RESTRICTED);
	defaultScopes.remove(UserAccessScopes.DEFAULT);

	return defaultScopes;
    }
}
