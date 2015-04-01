package com.agilecrm.subscription.restrictions.entity.impl;

import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;

public class DomainUserBillingRestriction extends DaoBillingRestriction
{

    @Override
    public boolean can_create()
    {
	restriction.users_count = DomainUserUtil.count();

	System.out.println("max allowed : " + max_allowed + ", available :" + DomainUserUtil.count());
	// Returns true if count is less than maximum allowed users in
	// current plan
	if (restriction.users_count == null || restriction.users_count <= max_allowed)
	    return true;

	// TODO Auto-generated method stub
	return false;
    }

    @Override
    public boolean can_update()
    {
	// TODO Auto-generated method stub
	return true;
    }

    @Override
    public void send_warning_message()
    {
	// TODO Auto-generated method stub

    }

    @Override
    public boolean check()
    {
	DomainUser user = (DomainUser) entity;
	if (user.id == null)
	    return can_create();

	return can_update();
    }

    @Override
    public void setMax()
    {
	// TODO Auto-generated method stub
	if (restriction == null)
	    restriction = BillingRestrictionUtil.getBillingRestriction(sendReminder);

	System.out.println(restriction.plan);
	// Gets maximum allowed contacts in current plan
	max_allowed = restriction.planDetails.getAllowedUsers();

    }
}
