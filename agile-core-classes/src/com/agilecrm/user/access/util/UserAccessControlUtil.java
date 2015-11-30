package com.agilecrm.user.access.util;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;

import com.agilecrm.deals.Opportunity;
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
	CREATE("You do not have permission to create %className%s."),

	READ("You do not have permission to view this %className%."),

	UPDATE("You do not have permission to update %className%s."),

	DELETE("You do not have permission to delete this %className%."),

	IMPORT("You do not have permission to import %className%s"),

	EXPORT("You do not have permission to export %className%s");

	String errorMessage = "Access Denied. Contact account administrator";

	CRUDOperation(String errorMessage)
	{
	    this.errorMessage = errorMessage;
	}

	public String getErrorMessage()
	{
	    return errorMessage;
	}

	public void throwException(String className)
	{
	    className = className.equals("Opportunity") ? "Deal" : className;
	    throw new AccessDeniedException(this.errorMessage.replace("%className%", className));
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
	// if (!className.equals(Contact.class.getSimpleName()))
	// return true;

	UserAccessControl acccessControl = UserAccessControl.getAccessControl(className, object, null);
	if (acccessControl == null)
	    return true;

	boolean isOperationAllowed = true;

	if (operation == CRUDOperation.CREATE)
	{
	    if (!acccessControl.isNew())
		operation = CRUDOperation.UPDATE;

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
	    operation.throwException(className);

	return isOperationAllowed;
    }

    public static <T> void checkReadAccessAndModifyQuery(String className, Query<T> q)
    {
	System.out.println("class name " + className);

	UserAccessControl userAccess = UserAccessControl.getAccessControl(className, null, null);

	System.out.println("access : " + userAccess);

	if (userAccess == null)
	    return;

	System.out.println(userAccess.getCurrentUserScopes());
	if (!userAccess.canRead())
	{
	    if (className.equals("Contact"))
		userAccess.modifyQuery(q);
	    else if (className.equals("Opportunity"))
		userAccess.modifyQuery(q);
	    else
		CRUDOperation.READ.throwException(className);
	}
    }

    public static void checkReadAccessAndModifyTextSearchQuery(String className, List<SearchRule> rules, DomainUser user)
    {
	System.out.println("class name" + className);
	UserAccessControl userAccess = UserAccessControl.getAccessControl(className, null, user);

	System.out.println("user access :  " + userAccess);

	if (userAccess == null)
	    return;

	if (!userAccess.canRead())
	    userAccess.modifyTextSearchQuery(rules);
    }

    public static UserAccessControl getAccessControl(String className, Object object, DomainUser user)
    {
	return UserAccessControl.getAccessControl(className, object, user);
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
    
    public static <T> void checkDeletePrivilege(String className, Opportunity opportunity)
    {
	System.out.println("class name " + className);

	UserAccessControl userAccess = UserAccessControl.getAccessControl(className, opportunity, null);

	System.out.println("access : " + userAccess);

	if (userAccess == null)
	    return;

	System.out.println(userAccess.getCurrentUserScopes());
	if (!userAccess.canDelete())
	{
	    CRUDOperation.DELETE.throwException(className);
	}
    }

}
