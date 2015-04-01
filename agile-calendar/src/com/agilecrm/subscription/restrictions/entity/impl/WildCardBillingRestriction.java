package com.agilecrm.subscription.restrictions.entity.impl;

import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;

public class WildCardBillingRestriction extends DaoBillingRestriction
{

    @Override
    public boolean can_create()
    {
	// TODO Auto-generated method stub
	return true;
    }

    @Override
    public boolean can_update()
    {
	// TODO Auto-generated method stub
	return true;
    }

    @Override
    public boolean check()
    {
	// TODO Auto-generated method stub
	return true;
    }

    @Override
    public void setMax()
    {
	// TODO Auto-generated method stub

    }

}
