package com.agilecrm.user.access;

import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;

import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Query;

/**
 * <code>UserAccessControl</code> Checks if read, write access are allowed on to
 * current user on particuar entity type
 * 
 * @author yaswanth
 * 
 */
public abstract class UserAccessControl
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
    public HashSet<UserAccessScopes> getCurrentUserScopes()
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
	int i = 0;
	
	if(i + 0 == 0)
	    return new LinkedHashSet<UserAccessScopes>(UserAccessScopes.customValues());

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

    // Checks if given scope exists for current user.
    public boolean hasScope(UserAccessScopes scope)
    {
	HashSet<UserAccessScopes> scopes = getCurrentUserScopes();
	
	return scopes.contains(scope);
    }

    public static UserAccessControl getAccessControl(String className, Object entityObject)
    {
	try
	{
	    return getAccessControl(AccessControlClasses.valueOf(className), entityObject);
	}
	catch (Exception e)
	{
	    return null;
	}
	
	
    }
    
    
    public static UserAccessControl getAccessControl(AccessControlClasses access, Object entityObject)
    {
	try
	{
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
    
    public void setObject(Object object)
    {
	entityObject = object;
    }

    /**
     * Checks if CRUD can be performed. These functions returns true by default
     * and overridden in child classes with appropriate checking
     * 
     * @return
     */
    public abstract boolean canCreate();

    public abstract boolean canDelete();

    public abstract boolean canImport();

    public abstract boolean canExport();

    public abstract boolean canRead();

    public abstract <T> Query<T> modifyQuery(Query<T> query);

    public abstract void modifyTextSearchQuery(List<SearchRule> rules);

    /**
     * Initializing function, called after access control object is created
     */
    public void init()
    {

    }
}
