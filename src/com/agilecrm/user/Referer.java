package com.agilecrm.user;

import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

public class Referer
{

    /**
     * referral_count to store referralcount reference_by_domain to store
     * referenced domain
     */

    public Integer referral_count = 0;
    @NotSaved(IfDefault.class)
    public String reference_by_domain = null;

    public Referer()
    {

    }

    @Override
    public String toString()
    {
	return "Referer [referral_count=" + referral_count + ", reference_by_domain=" + reference_by_domain + "]";
    }

}
