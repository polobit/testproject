package com.agilecrm.user.access;

import java.util.List;

import com.agilecrm.account.NavbarConstants;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;

public class OpportunityAccessControl extends UserAccessControl
{
    Opportunity opportunity = null;

    /**
     * Type casts entity object in to Opportunity type
     */

    public void init()
    {
	try
	{
	    if (entityObject != null)
		opportunity = (Opportunity) entityObject;
	    else
		opportunity = new Opportunity();
	    System.out.println("scopes in deal checking");
	    System.out.println(getCurrentUserMenuScopes());
	}
	catch (ClassCastException e)
	{
	    opportunity = new Opportunity();
	}
    }

    @Override
    public void setObject(Object object)
    {
	if (object != null)
	    opportunity = (Opportunity) object;
	else
	    opportunity = new Opportunity();
    }

    /**
     * Checks if deal is new
     * 
     * @return
     */
    public boolean isNew()
    {
	if (opportunity == null || opportunity.id != null)
	    return false;

	return true;
    }

    @Override
    public boolean canCreate()
    {
	// If opportunity is defined, it checks for update operation if owner in
	// the
	// opportunity and current owner is different
	return hasMenuScope(NavbarConstants.DEALS);

    }

    @Override
    public boolean canDelete()
    {
	// Delete condition is checked only if current user is not owner of the
	// opportunity
	if (!isNew() && !checkOwner())
	{
	    return hasMenuScope(NavbarConstants.DEALS);
	}

	return true;
    }

    @Override
    public boolean canImport()
    {
	return hasMenuScope(NavbarConstants.DEALS);
    }

    @Override
    public boolean canExport()
    {
	return hasMenuScope(NavbarConstants.DEALS);
    }

    @Override
    public boolean canRead()
    {
	return true;
    }

    public <T> Query<T> modifyDaoFetchQuery(Query<T> query)
    {
	UserInfo info = SessionManager.get();
	if (info == null)
	    return query;

	Key<DomainUser> ownerKey = new Key<DomainUser>(DomainUser.class, info.getDomainId());
	return query.filter("ownerKey", ownerKey);
    }

    @Override
    public <T> Query<T> modifyQuery(Query<T> query)
    {
	return modifyDaoFetchQuery(query);
    }

    @Override
    public void modifyTextSearchQuery(List<SearchRule> rules)
    {
	UserInfo info = SessionManager.get();
	if (info == null)
	    return;

	SearchRule rule = new SearchRule();
	rule.RHS = info.getDomainId().toString();
	rule.CONDITION = RuleCondition.EQUALS;
	rule.LHS = "owner_id";

	rules.add(rule);
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
	    if (opportunity == null || opportunity.getOwner() == null)
		return true;
	    // Gets current user id and opportunity owner id and checks for
	    // equity
	    Long currentOpportunityOwnerId = opportunity.getOwner().id;
	    UserInfo info = SessionManager.get();

	    if (info == null)
		return true;

	    System.out.println("id" + info.getDomainId() + ", " + currentOpportunityOwnerId);

	    if (info.getDomainId().equals(currentOpportunityOwnerId))
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
