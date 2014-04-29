package com.agilecrm.user.access;

import com.agilecrm.contact.Contact;

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

    Contact contact = null;

    /**
     * Type casts entity object in to contact type
     */

    public void init()
    {
	try
	{
	    System.out.println("************************************");
	    System.out.println(entityObject);
	    contact = (Contact) entityObject;
	    System.out.println(contact);
	}
	catch (ClassCastException e)
	{
	    contact = new Contact();
	}
    }

    public boolean canCreate()
    {
	if (contact.id != null)
	    return hasScope(UserAccessScopes.UPDATE_CONTACT);

	return hasScope(UserAccessScopes.CREATE_CONTACT);
    }

    public boolean canDelete()
    {
	return true;
	// return hasScope(UserAccessScopes.DELETE_CONTACTS);
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
