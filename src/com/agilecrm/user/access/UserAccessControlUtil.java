package com.agilecrm.user.access;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

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

	if (throwException && !isOperationAllowed)
	    throw new WebApplicationException(Response.status(Response.Status.FORBIDDEN).entity(operation.errorMessage)
		    .build());

	return isOperationAllowed;
    }
}
