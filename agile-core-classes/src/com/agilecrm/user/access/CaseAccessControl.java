package com.agilecrm.user.access;

import java.util.List;

import com.agilecrm.account.NavbarConstants;
import com.agilecrm.cases.Case;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;

public class CaseAccessControl extends UserAccessControl
{
    Case newCase = null;

    /**
     * Type casts entity object in to Case type
     */

    public void init()
    {
	try
	{
	    if (entityObject != null)
		newCase = (Case) entityObject;
	    else
		newCase = new Case();
	    System.out.println("scopes in deal checking");
	    System.out.println(getCurrentUserMenuScopes());
	}
	catch (ClassCastException e)
	{
	    newCase = new Case();
	}
    }

    @Override
    public void setObject(Object object)
    {
	if (object != null)
	    newCase = (Case) object;
	else
	    newCase = new Case();
    }

    /**
     * Checks if deal is new
     * 
     * @return
     */
    public boolean isNew()
    {
	if (newCase == null || newCase.id != null)
	    return false;

	return true;
    }

    @Override
    public boolean canCreate()
    {
	// If case is defined, it checks for update operation if owner in
	// the case and current owner is different
	return hasMenuScope(NavbarConstants.CASES);

    }

    @Override
    public boolean canDelete()
    {
	// Delete condition is checked only if current user is not owner of the
	// opportunity
	if (!isNew() && !checkOwner())
	{
	    return hasMenuScope(NavbarConstants.CASES);
	}

	return true;
    }

    @Override
    public boolean canImport()
    {
	return hasMenuScope(NavbarConstants.CASES);
    }

    @Override
    public boolean canExport()
    {
	return hasMenuScope(NavbarConstants.CASES);
    }

    @Override
    public boolean canRead()
    {
	return true;
    }

    @Override
    public <T> Query<T> modifyQuery(Query<T> query)
    {
	UserInfo info = SessionManager.get();
	if (info == null)
	    return query;

	Key<DomainUser> ownerKey = new Key<DomainUser>(DomainUser.class, info.getDomainId());
	return query.filter("ownerKey", ownerKey);
    }

    @Override
    public void modifyTextSearchQuery(List<SearchRule> rules)
    {
	// TODO Auto-generated method stub

    }

    /**
     * Checks if current user is owner of the opportunity he is trying to
     * access.
     * 
     * @return boolean
     */
    public boolean checkOwner()
    {

	try
	{
	    if (newCase == null || newCase.getOwner() == null)
		return true;
	    // Gets current user id and opportunity owner id and checks for
	    // equity
	    Long currentCaseOwnerId = newCase.getOwner().id;
	    UserInfo info = SessionManager.get();

	    if (info == null)
		return true;

	    System.out.println("id" + info.getDomainId() + ", " + currentCaseOwnerId);

	    if (info.getDomainId().equals(currentCaseOwnerId))
		return true;
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	return false;
    }

}
