package com.agilecrm.subscription.restrictions.entity.impl;

import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.subscription.restrictions.entity.EntityDaoRestrictionInterface;
import com.agilecrm.webrules.WebRule;

/**
 * Implementation class of {@link EntityDaoRestrictionInterface} which is called
 * from objectify to check whether entity can be created/updated
 * 
 * @author yaswanth
 * 
 */
public class WebRuleBillingRestriction extends DaoBillingRestriction
{
    boolean hardUpdateTags = true;

    /**
     * Sets Max entities allowed to compare with existing count. Gets plan
     * limits based on billing restriction class.
     */
    @Override
    public void setMax()
    {
	if (restriction == null)
	    restriction = BillingRestrictionUtil.getInstance(sendReminder);

	max_allowed = restriction.planDetails.getWebRuleLimit();
    }

    /**
     * Fetches count of existing webrules and checks with max allowed in current
     * plan. Returns boolean based also send warning message
     */
    @Override
    public boolean can_create()
    {
	restriction.webrules_count = WebRule.dao.count();

	if (restriction.sendReminder)
	    send_warning_message();

	if (restriction.webrules_count < max_allowed)
	    return true;

	return false;
    }

    /**
     * Checks if Webrule can be updated. It always returns true as there are not
     * limitation on updation of entity
     */
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
	getTag();
	if (restriction.tagsToAddInOurDomain.isEmpty())
	    return;

	restriction.sendReminder();
    }

    @Override
    public String getTag()
    {
	if (restriction == null || restriction.webrules_count == null)
	    return null;

	int count = restriction.webrules_count;

	String tag = setTagsToUpdate(max_allowed, restriction.webrules_count);

	restriction.webrules_count = count;

	return tag;
    }

    @Override
    public boolean check()
    {
	WebRule webRule = (WebRule) entity;
	if (webRule.id == null)
	    return can_create();

	return can_update();
    }

}
