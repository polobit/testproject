package com.agilecrm.user.access;

import java.util.List;

import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.util.DomainUserUtil;

public class UserAccessControl
{
    protected UserInfo info;

    public static enum AccessControlClasses
    {
	CONTACT_ACCESS_CONTROL(ContactAccessControl.class);
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
	    return DomainUserUtil.getCurrentDomainUser().scopes;

	// If scopes in info is not set, scopes are fetched from current domain
	// user, set in user info, and returned.
	if (info.getScopes() == null)
	{
	    List<UserAccessScopes> scopes = DomainUserUtil.getCurrentDomainUser().scopes;
	    info.setScopes(scopes);
	}

	return info.getScopes();
    }

    // Checks if given scope exists for current user.
    public boolean hasScope(UserAccessScopes scope)
    {
	return getCurrentUserScopes().contains(scope);
    }

    /*
     * public UserAccessControl getAccessControl() {
     * 
     * }
     */
}
