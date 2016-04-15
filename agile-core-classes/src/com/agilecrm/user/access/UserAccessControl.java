package com.agilecrm.user.access;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;

import com.agilecrm.account.NavbarConstants;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.VersioningUtil;
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

    protected boolean skipCheck = false;

    private HashSet<UserAccessScopes> scopes = null;

    private HashSet<NavbarConstants> menuScopes = null;

    private DomainUser user = null;

    public static enum AccessControlClasses
    {
	Contact(ContactAccessControl.class), Opportunity(OpportunityAccessControl.class), Tag(TagAccessControl.class), Event(EventAccessControl.class);

	Class<? extends UserAccessControl> clazz;

	private AccessControlClasses(Class<? extends UserAccessControl> clazz)
	{
	    this.clazz = clazz;
	}

    }

    // Returns current user scopes
    public HashSet<UserAccessScopes> getCurrentUserScopes()
    {
	if (user != null)
	{
	    return user.scopes;
	}

	if (scopes != null)
	    return scopes;

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

	    info.setScopes(user.scopes);

	    scopes = user.scopes;
	}

	return info.getScopes();
    }

    /**
     * Returns current user menu scopes.
     * 
     * @return current user menu scopes
     */
    public HashSet<NavbarConstants> getCurrentUserMenuScopes()
    {
	if (menuScopes != null)
	    return menuScopes;

	// Gets user info from session manager
	UserInfo info = SessionManager.get();

	// If info is null then menu scopes are returned from domain user. It
	// barely occurs
	if (info == null)
	{
	    return new LinkedHashSet<NavbarConstants>(NavbarConstants.customValues());
	}

	// To give all menu scopes as of now.

	// If menu scopes in info is not set, menu scopes are fetched from
	// current domain user, set in user info, and returned.
	if (info.getMenuScopes() == null)
	{
	    DomainUser user = DomainUserUtil.getCurrentDomainUser();
	    if (user == null)
		return new LinkedHashSet<NavbarConstants>(NavbarConstants.customValues());

	    info.setMenuScopes(user.menu_scopes);

	    menuScopes = user.menu_scopes;
	}

	return info.getMenuScopes();
    }

    // Checks if given scope exists for current user.
    public boolean hasScope(UserAccessScopes scope)
    {
	HashSet<UserAccessScopes> scopes = getCurrentUserScopes();

	return scopes.contains(scope);
    }

    // Checks if given scope exists for current user.
    public boolean hasMenuScope(NavbarConstants menuScope)
    {
	HashSet<NavbarConstants> menuScopes = getCurrentUserMenuScopes();

	return menuScopes.contains(menuScope);
    }

    public static UserAccessControl getAccessControl(String className, Object entityObject, DomainUser user)
    {
	try
	{
	    System.out.println("-----------" + AccessControlClasses.valueOf(className));
	    return getAccessControl(AccessControlClasses.valueOf(className), entityObject, user);
	}
	catch (Exception e)
	{
	    return null;
	}

    }

    public static UserAccessControl getAccessControl(AccessControlClasses access, Object entityObject, DomainUser user)
    {
	try
	{

	    System.out.println("*********************");
	    if (user == null)
	    {
		boolean skipCheck = VersioningUtil.isBackgroundThread();
		if (skipCheck)
		{
		    System.out.println("skipping access check");
		    return new WildcardAccessControl();
		}

	    }

	    UserAccessControl accessControl = access.clazz.newInstance();
	    accessControl.entityObject = entityObject;
	    accessControl.user = user;

	    accessControl.init();
	    System.out.println("---------fd---------" + accessControl.canRead());
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

    public boolean isNew()
    {
	return false;
    }
}
