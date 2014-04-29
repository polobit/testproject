package com.agilecrm.subscription.restrictions.entity.impl;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;

public class ReportGraphBillingRestriction extends DaoBillingRestriction
{

    String reporting = null;
    Long startTime = 0l;
    Long endTime = 0l;

    @Override
    public boolean can_create()
    {
	// TODO Auto-generated method stub
	return false;
    }

    @Override
    public boolean can_update()
    {
	// TODO Auto-generated method stub
	return false;
    }

    @Override
    public void send_warning_message()
    {
	// TODO Auto-generated method stub

    }

    @Override
    public boolean check()
    {
	if ("ALL".equals(reporting))
	    return true;

	if (entity != null)
	{
	    JSONObject object = (JSONObject) entity;
	    System.out.println(entity);
	    if (object.has("startTime") && object.has("endTime"))
	    {
		try
		{
		    startTime = object.getLong("startTime");
		    endTime = object.getLong("endTime");
		}
		catch (JSONException e)
		{
		    return true;
		}

	    }
	}

	System.out.println(endTime);
	System.out.println(startTime);

	System.out.println("number of days : " + ((endTime - startTime) / (1000 * 60 * 60 * 24)));
	if ((endTime - startTime) / (1000 * 60 * 60 * 24) > 7)
	    return false;
	// TODO Auto-generated method stub
	return true;
    }

    @Override
    public void setMax()
    {
	reporting = restriction == null ? BillingRestrictionUtil.getInstance(false).getCurrentLimits().getReporting() : restriction.getCurrentLimits()
		.getReporting();

	// TODO Auto-generated method stub

    }
}
