package com.agilecrm.user.access.util;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.UserAccessScopes;
import com.agilecrm.user.access.exception.AccessDeniedException;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Query;

/**
 * <code>UserAccessControlUtil</code> class calls appropriate method to check if
 * access is allowed to user. It checks based on the operation
 * 
 * @author yaswanth
 * 
 */
public class UserAccessControlUtil
{
    public enum CRUDOperation
    {
	CREATE("You do not have permission to create contacts."),

	READ("You do not have permission to view this contact."),

	UPDATE("You do not have permission to update contacts."),

	DELETE("You do not have permission to update this contact."),

	IMPORT("You do not have permission to import contacts"),

	EXPORT("You do not have permission to export contacts");

	String errorMessage = "Access Denied. Contact account administrator";

	CRUDOperation(String errorMessage)
	{
	    this.errorMessage = errorMessage;
	}

	public String getErrorMessage()
	{
	    return errorMessage;
	}

	public void throwException()
	{
	    throw new AccessDeniedException(this.errorMessage);
	}

    }

    /*
     * Initializes User access control class and checks if current operation is
     * allowed to current user
     */
    public static boolean check(String className, Object object, CRUDOperation operation, boolean throwException)
    {
	// Return true if type is not contact. There is only check on contact
	// class to avoid delay using reflections class name comparsion is done
	// directly
	if (!className.equals(Contact.class.getSimpleName()))
	    return true;

	UserAccessControl acccessControl = UserAccessControl.getAccessControl(className, object);
	if (acccessControl == null)
	    return true;

	boolean isOperationAllowed = true;

	if (operation == CRUDOperation.CREATE)
	{
	    if (!acccessControl.isNew())
		operation = CRUDOperation.DELETE;

	    isOperationAllowed = acccessControl.canCreate();
	}
	else if (operation == CRUDOperation.DELETE)
	    isOperationAllowed = acccessControl.canDelete();
	else if (operation == CRUDOperation.IMPORT)
	    isOperationAllowed = acccessControl.canImport();
	else if (operation == CRUDOperation.EXPORT)
	    isOperationAllowed = acccessControl.canExport();
	else if (operation == CRUDOperation.READ)
	    isOperationAllowed = acccessControl.canRead();

	if (throwException && !isOperationAllowed)
	    operation.throwException();

	return isOperationAllowed;
    }

    public static <T> void checkReadAccessAndModifyQuery(String className, Query<T> q)
    {
	System.out.println("class name " + className);
	UserAccessControl userAccess = UserAccessControl.getAccessControl(className, null);

	System.out.println("access : " + userAccess);

	if (userAccess == null)
	    return;

	System.out.println(userAccess.getCurrentUserScopes());
	if (!userAccess.canRead())
	    userAccess.modifyQuery(q);
    }

    public static void checkReadAccessAndModifyTextSearchQuery(String className, List<SearchRule> rules)
    {
	System.out.println("class name" + className);
	UserAccessControl userAccess = UserAccessControl.getAccessControl(className, null);

	System.out.println("user access :  " + userAccess);

	if (userAccess == null)
	    return;

	if (!userAccess.canRead())
	    userAccess.modifyTextSearchQuery(rules);
    }

    public static UserAccessControl getAccessControl(String className, Object object)
    {
	return UserAccessControl.getAccessControl(className, object);
    }

    // Returns current user scopes
    public static HashSet<UserAccessScopes> getCurrentUserScopes()
    {
	// Gets user info from session manager
	UserInfo info = SessionManager.get();

	// If info is null then scopes are returned from domain user. It barely
	// occurs
	if (info == null)
	{
	    return new LinkedHashSet<UserAccessScopes>(UserAccessScopes.customValues());
	}

	// To give all scopes as of now.

	// If scopes in info is not set, scopes are fetched from current domain
	// user, set in user info, and returned.
	if (info.getScopes() == null)
	{
	    DomainUser user = DomainUserUtil.getCurrentDomainUser();
	    if (user == null)
		return new LinkedHashSet<UserAccessScopes>(UserAccessScopes.customValues());

	    info.setScopes(DomainUserUtil.getCurrentDomainUser().scopes);
	}

	return info.getScopes();
    }

    public static boolean hasScope(UserAccessScopes scope)
    {
	return getCurrentUserScopes().contains(scope);
    }

}
