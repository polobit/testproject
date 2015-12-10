package com.agilecrm.user.access;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public enum UserAccessScopes2
{
    IMPORT_CONTACTS, CREATE_CONTACT, UPDATE_CONTACT, VIEW_CONTACTS, RESTRICTED;

    public static List<UserAccessScopes2> customValues()
    {
	List<UserAccessScopes2> defaultScopes = new ArrayList<UserAccessScopes2>(Arrays.asList(UserAccessScopes2
		.values()));
	defaultScopes.remove(UserAccessScopes.RESTRICTED_ACCESS);
	defaultScopes.remove(UserAccessScopes.RESTRICTED);
	return defaultScopes;
    }

}
