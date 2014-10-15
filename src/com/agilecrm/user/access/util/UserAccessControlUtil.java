package com.agilecrm.user.access.util;

import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.exception.AccessDeniedException;
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
	CREATE("Contact creation access denied. Contact account administrator"),

	READ("Contact view access denied. Contact account administrator"),

	UPDATE("Contact update access denied. Contact account administrator"),

	DELETE("Contact delete access denied. Contact account administrator"),

	IMPORT("Contact import access denied. Contact account administrator"),

	EXPORT("Contact export access denied. Contact account administrator");

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
	    isOperationAllowed = acccessControl.canCreate();
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

}
