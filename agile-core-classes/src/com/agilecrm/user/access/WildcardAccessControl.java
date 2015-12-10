package com.agilecrm.user.access;

import java.util.List;

import com.agilecrm.search.ui.serialize.SearchRule;
import com.googlecode.objectify.Query;

public class WildcardAccessControl extends UserAccessControl
{

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
	return true;
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
	return query;
    }

    @Override
    public void modifyTextSearchQuery(List<SearchRule> rules)
    {
	// TODO Auto-generated method stub

    }

}
