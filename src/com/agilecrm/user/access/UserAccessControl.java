package com.agilecrm.user.access;

import java.util.Arrays;
import java.util.List;

import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;

/**
 * <code>UserAccessControl</code> Checks if read, write access are allowed on to
 * current user on particuar entity type
 * 
 * @author yaswanth
 * 
 */
public class UserAccessControl
{
    protected UserInfo info;

    protected Object entityObject = null;

    public static enum AccessControlClasses
    {
	Contact(ContactAccessControl.class);
	Class<? extends UserAccessControl> clazz;

	private AccessControlClasses(Class<? extends UserAccessControl> clazz)
	{
	    this.clazz = clazz;
	}

    }

    // Returns current user scopes
    public List<UserAccessScopes> getCurrentUserScopes()
    {
	// Gets user info from session manager
	UserInfo info = SessionManager.get();

	// If info is null then scopes are returned from domain user. It barely
	// occurs
	if (info == null)
	    return Arrays.asList(UserAccessScopes.values());

	// If scopes in info is not set, scopes are fetched from current domain
	// user, set in user info, and returned.
	if (info.getScopes() == null)
	{
	    DomainUser user = DomainUserUtil.getCurrentDomainUser();
	    if (user == null)
		Arrays.asList(UserAccessScopes.values());

	    info.setScopes(DomainUserUtil.getCurrentDomainUser().scopes);
	}

	return info.getScopes();
    }

    // Checks if given scope exists for current user.
    public boolean hasScope(UserAccessScopes scope)
    {
	return getCurrentUserScopes().contains(scope);
    }

    public static UserAccessControl getAccessControl(String className, Object entityObject)
    {
	AccessControlClasses access = null;
	try
	{
	    access = AccessControlClasses.valueOf(className);
	    UserAccessControl accessControl = access.clazz.newInstance();
	    accessControl.entityObject = entityObject;
	    accessControl.init();
	    return accessControl;
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    /**
     * Checks if CRUD can be performed. These functions returns true by default
     * and overridden in child classes with appropriate checking
     * 
     * @return
     */
    public boolean canCreate()
    {
	return true;
    }

    public boolean canDelete()
    {
	return true;
    }

    public boolean canImport()
    {
	return true;
    }

    public boolean canExport()
    {
	return true;
    }

    /**
     * Initializing function, called after access control object is created
     */
    public void init()
    {

    }
}
