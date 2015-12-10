package com.agilecrm.user.access;

import java.util.List;

import com.agilecrm.contact.Tag;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Query;

public class TagAccessControl extends UserAccessControl
{

    Tag tag = null;

    /**
     * Type casts entity object in to contact type
     */

    public void init()
    {
	try
	{
	    if (entityObject != null)
		tag = (Tag) entityObject;
	    else
		tag = new Tag();
	    System.out.println("scopes in tag checking");
	    System.out.println(getCurrentUserScopes());
	}
	catch (ClassCastException e)
	{
	    tag = new Tag();
	}
    }

    @Override
    public void setObject(Object object)
    {
	if (object != null)
	    tag = (Tag) object;
	else
	    tag = new Tag();
    }

    @Override
    public boolean canCreate()
    {
	if (DomainUserUtil.getCurrentDomainUser().is_admin)
	    return true;
	System.out.println("-------check access for tag----" + hasScope(UserAccessScopes.ADD_NEW_TAG));
	return hasScope(UserAccessScopes.ADD_NEW_TAG);
    }

    @Override
    public boolean canDelete()
    {
	// TODO Auto-generated method stub
	return hasScope(UserAccessScopes.ADD_NEW_TAG);
    }

    @Override
    public boolean canImport()
    {
	// TODO Auto-generated method stub
	return true;
    }

    @Override
    public boolean canExport()
    {
	// TODO Auto-generated method stub
	return true;
    }

    @Override
    public boolean canRead()
    {
	// TODO Auto-generated method stub
	return true;
    }

    @Override
    public <T> Query<T> modifyQuery(Query<T> query)
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public void modifyTextSearchQuery(List<SearchRule> rules)
    {
	// TODO Auto-generated method stub

    }

}
