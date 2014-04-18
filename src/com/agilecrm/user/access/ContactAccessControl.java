package com.agilecrm.user.access;

/**
 * <code>ContactAccess</code> class checks if current user can
 * update/create/import/export contacts. It checks based on the scopes saved in
 * user info/domain user class
 * 
 * @author yaswanth
 * 
 */
public class ContactAccessControl extends UserAccessControl
{

    public boolean canCreate()
    {

	return hasScope(UserAccessScopes.CREATE_CONTACT);
    }

    public boolean canUpdate()
    {
	return hasScope(UserAccessScopes.UPDATE_CONTACT);
    }

    public boolean canImport()
    {
	return hasScope(UserAccessScopes.IMPORT_CONTACTS);
    }

    public boolean canExport()
    {
	return hasScope(UserAccessScopes.EXPORT_CONTACTS);
    }
}
