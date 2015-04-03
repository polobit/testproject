package com.agilecrm.user.access;

import java.util.List;

import com.agilecrm.activities.Activity;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.googlecode.objectify.Query;

public class ActivityAccessControl extends UserAccessControl
{
    Activity activity = null;

    public void init()
    {
	try
	{
	    if (entityObject != null)
		activity = (Activity) entityObject;
	    else
		activity = new Activity();
	    System.out.println("scopes in contact checking");
	    System.out.println(getCurrentUserMenuScopes());
	}
	catch (ClassCastException e)
	{
	    activity = new Activity();
	}
    }

    @Override
    public void setObject(Object object)
    {
	if (object != null)
	    activity = (Activity) object;
	else
	    activity = new Activity();
    }

    @Override
    public boolean canCreate()
    {
	// TODO Auto-generated method stub
	return true;
    }

    @Override
    public boolean canDelete()
    {
	// TODO Auto-generated method stub
	return false;
    }

    @Override
    public boolean canImport()
    {
	// TODO Auto-generated method stub
	return false;
    }

    @Override
    public boolean canExport()
    {
	// TODO Auto-generated method stub
	return false;
    }

    @Override
    public boolean canRead()
    {
	// TODO Auto-generated method stub
	return true;
    }

    public <T> Query<T> modifyDaoFetchQuery(Query<T> query)
    {

	return query;
    }

    @Override
    public <T> Query<T> modifyQuery(Query<T> query)
    {
	return modifyDaoFetchQuery(query);
    }

    @Override
    public void modifyTextSearchQuery(List<SearchRule> rules)
    {
	// TODO Auto-generated method stub

    }

}
