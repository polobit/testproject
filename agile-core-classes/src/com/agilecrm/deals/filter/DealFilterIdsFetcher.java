package com.agilecrm.deals.filter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import com.agilecrm.account.NavbarConstants;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessScopes;
import com.agilecrm.user.util.DomainUserUtil;

public class DealFilterIdsFetcher {
	
	private Long domainUserId;

    HashSet<UserAccessScopes> scopes;
    HashSet<NavbarConstants> menuScopes;

    DomainUser user;
    
    private List<Opportunity> dealsList;
    
    public DealFilterIdsFetcher(List<Opportunity> dealsList, Long domainUserId)
    {
    	this.dealsList = dealsList;
    	this.domainUserId = domainUserId;
    }
    
    public List<Opportunity> getDealsAfterResriction(){
    	List<Opportunity> opportunityList = new ArrayList<Opportunity>();
    	try {
			for (Opportunity opportunity : dealsList)
			{
				if(hasMenuScope(NavbarConstants.DEALS) && (hasScope(UserAccessScopes.MANAGE_DEALS) || isDealOwner(opportunity) ))
		    	{
					opportunityList.add(opportunity);
		    	}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
    	return opportunityList;
    }
    
    private HashSet<UserAccessScopes> getScopes()
    {
	if (scopes != null)
	    return scopes;

	getDomainUser();

	if (user == null)
	{
	    scopes = new HashSet<UserAccessScopes>(UserAccessScopes.customValues());
	    return scopes;
	}

	scopes = user.scopes;

	return scopes;
    }

    private boolean hasMenuScope(NavbarConstants menuScope)
    {
	return getMenuScopes().contains(menuScope);
    }
    
    private HashSet<NavbarConstants> getMenuScopes()
    {
	if (menuScopes != null)
	    return menuScopes;

	getDomainUser();

	if (user == null)
	{
		menuScopes = new HashSet<NavbarConstants>(NavbarConstants.customValues());
	    return menuScopes;
	}

	menuScopes = user.menu_scopes;

	return menuScopes;
    }

    private boolean hasScope(UserAccessScopes scope)
    {
	return getScopes().contains(scope);
    }
    
    private DomainUser getDomainUser()
    {
	if (user == null)
	    user = DomainUserUtil.getDomainUser(domainUserId);

	return user;
    }
    
    private boolean isDealOwner(Opportunity opportunity)
    {
    try {
    	if(opportunity.owner_id != null){
        	if(opportunity.owner_id.equals(String.valueOf(domainUserId)))
        	{
        		return true;
        	}
        }else if (opportunity.owner_id == null){
        	DomainUser domainUser = opportunity.getOwner();
        	if(domainUser != null && domainUser.id.equals(domainUserId))
        	{
        		return true;
        	}		
        }
	} catch (Exception e) {
		e.printStackTrace();
	}
    return false;
    }
}
