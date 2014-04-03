package com.agilecrm.subscription.restrictions;

import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.util.BillingRestrictionReminderUtil;
import com.agilecrm.webrules.WebRule;

/**
 * Implementation class of {@link BillingRestriction} which is called from
 * objectify to check whether entity can be created/updated
 * 
 * @author yaswanth
 * 
 */
public class WebRuleBillingRestriction extends DaoBillingRestriction
{
    /**
     * Sets Max entities allowed to compare with existing count. Gets plan
     * limits based on billing restriction class.
     */
    @Override
    public void setMax()
    {
	if (restriction == null)
	    restriction = BillingRestrictionUtil.getInstance(sendReminder);

	MAX = restriction.planLimitsEnum.getWebRuleLimit();
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

	if (restriction.webrules_count < MAX)
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
	String tag = BillingRestrictionReminderUtil.getTag(restriction.webrules_count, MAX, "WebRule");

	if (tag != null)
	    restriction.tagsToAddInOurDomain.add(tag);

	return tag;
    }

}
