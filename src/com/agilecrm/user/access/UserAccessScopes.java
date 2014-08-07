package com.agilecrm.user.access;

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
    DEFAULT, RESTRICTED, CREATE_CONTACT, UPDATE_CONTACT, IMPORT_CONTACTS, EXPORT_CONTACTS, DELETE_CONTACTS, VIEW_CONTACTS, RESTRICTED_ACCESS;
    
    public static List<UserAccessScopes> customValues()
    {
	List<UserAccessScopes> defaultScopes = Arrays.asList(UserAccessScopes.values());
	defaultScopes.remove(UserAccessScopes.RESTRICTED_ACCESS);
	defaultScopes.remove(UserAccessScopes.RESTRICTED);
	return defaultScopes;
    }
}
