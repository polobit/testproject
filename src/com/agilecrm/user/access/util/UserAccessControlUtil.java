package com.agilecrm.user.access.util;

import java.util.List;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import com.agilecrm.contact.Contact;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.user.access.UserAccessControl;
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
	CREATE, READ, UPDATE, DELETE, IMPORT, EXPORT;

	String errorMessage = "Access Denied. Contact account administrator";
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
	    throw new WebApplicationException(Response.status(Response.Status.FORBIDDEN).entity(operation.errorMessage)
		    .build());

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
