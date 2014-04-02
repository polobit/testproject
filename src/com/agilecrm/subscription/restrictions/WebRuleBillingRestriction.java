package com.agilecrm.subscription.restrictions;

import com.agilecrm.subscription.restrictions.util.BillingRestrictionUtil;
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
	restriction = BillingRestrictionUtil.getInstance(true);
	MAX = BillingRestrictionUtil.getInstance().planLimitsEnum.getWebRuleLimit();
    }

    /**
     * 
     */
    @Override
    public boolean can_create()
    {
	Integer webrulesCount = WebRule.dao.count();
	if (WebRule.dao.count() < MAX)
	    return true;

	send_warning_message();
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
	// BillingRestrictionUtil.addRestictionTagsInOurDomain()
    }

    private Integer calculatePercentage()
    {
	return 0;
    }
}
