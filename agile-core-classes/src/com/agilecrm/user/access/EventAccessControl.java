package com.agilecrm.user.access;

import java.util.List;

import com.agilecrm.account.NavbarConstants;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;

/**
 * <code>EventAccess</code> class checks if current user can
 * update/create/delete events. It checks based on the scopes saved in
 * user info/domain user class
 * 
 * @author Subrahmanyam
 * 
 */
public class EventAccessControl extends UserAccessControl
{

    Event event = null;

    /**
     * Type casts entity object in to Event type
     */

    public void init()
    {
	try
	{
	    if (entityObject != null)
	    	event = (Event) entityObject;
	    else
	    	event = new Event();
	    System.out.println("scopes in event checking");
	    System.out.println(getCurrentUserMenuScopes());
	}
	catch (ClassCastException e)
	{
		event = new Event();
	}
    }

    @Override
    public void setObject(Object object)
    {
	if (object != null)
		event = (Event) object;
	else
		event = new Event();
    }

    /**
     * Checks if event is new
     * 
     * @return
     */
    public boolean isNew()
    {
	if (event == null || event.id != null)
	    return false;

	return true;
    }

    @Override
    public boolean canCreate()
    {
    // If event is defined, it checks for update operation if owner in
	// the
	// event and current owner is different
    if(!isNew())
    {
    	if(hasMenuScope(NavbarConstants.CALENDAR) && (hasScope(UserAccessScopes.MANAGE_CALENDAR) || (isOldOwner() && checkOwner()) ))
    	{
    		return true;
    	}
    }
    else
    {
    	if(hasMenuScope(NavbarConstants.CALENDAR) && (hasScope(UserAccessScopes.MANAGE_CALENDAR) || checkOwner()))
    	{
    		return true;
    	}
    }
	return false;
    }

    @Override
    public boolean canDelete()
    {
	// Delete condition is checked only if current user is not owner of the
	// event
	if(!isNew() && hasMenuScope(NavbarConstants.CALENDAR) && (hasScope(UserAccessScopes.MANAGE_CALENDAR) || checkOwner()))
	{
		return true;
	}
	return false;
    }

    @Override
    public boolean canImport()
    {
	return hasMenuScope(NavbarConstants.CALENDAR);
    }

    @Override
    public boolean canExport()
    {
	return hasMenuScope(NavbarConstants.CALENDAR);
    }

    @Override
    public boolean canRead()
    {
    if(hasMenuScope(NavbarConstants.CALENDAR))
    {
    	if(hasScope(UserAccessScopes.VIEW_CALENDAR))
    	{
    		return true;
    	}
    	else if((hasScope(UserAccessScopes.VIEW_CALENDAR) || checkOwner()) && event != null && event.id != null)
    	{
    		return true;
    	}
    }
    return false;
    }

    public <T> Query<T> modifyDaoFetchQuery(Query<T> query)
    {
	UserInfo info = SessionManager.get();
	if (info == null)
	    return query;

	AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(info.getDomainId());
	Key<AgileUser> ownerKey = null;
	if(agileUser !=null)
	{
		ownerKey = new Key<AgileUser>(AgileUser.class, agileUser.id);
	}
	return query.filter("owner", ownerKey);
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
     * Checks if current user is owner of the event he is trying to
     * access.
     * 
     * @return boolean
     */
    public boolean checkOwner()
    {

	try
	{
	    if (event == null || (event.owner_id == null && event.getOwner() == null))
		return true;
	    // Gets current user id and event owner id and checks for
	    // equity
	    Long currentEventOwnerId = 0L;
	    if (event.owner_id != null)
	    {
	    	currentEventOwnerId = Long.valueOf(event.owner_id);
	    }
	    if (event.getOwner() != null)
	    {
	    	currentEventOwnerId = event.getOwner().id;
	    }
	    
	    UserInfo info = SessionManager.get();

	    if (info == null)
		return true;

	    System.out.println("id" + info.getDomainId() + ", " + currentEventOwnerId);

	    if (info.getDomainId().equals(currentEventOwnerId))
		return true;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return false;
    }
    
    /**
     * Checks old event owner and saving event owner is same or not
     * 
     * @return boolean
     */
    public boolean isOldOwner()
    {

	try
	{
	    if (event == null || (event.owner_id == null && event.getOwner() == null))
		return true;
	    // Gets current user id and event owner id and checks for
	    // equity
	    Long currentEventOwnerId = 0L;
	    if (event.owner_id != null)
	    {
	    	currentEventOwnerId = Long.valueOf(event.owner_id);
	    }
	    if (event.getOwner() != null)
	    {
	    	currentEventOwnerId = event.getOwner().id;
	    }
	    
	    Event oldEvent = EventUtil.getEvent(event.id);
	    
	    if (currentEventOwnerId.equals(oldEvent.getOwner().id))
	    {
	    	return true;
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return false;
    }

}
