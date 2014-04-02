package com.agilecrm.subscription.restrictions;

import com.agilecrm.workflows.Workflow;

public class WorkflowBillingRestriction extends DaoBillingRestriction
{

    @Override
    public boolean can_create()
    {
	if (Workflow.dao.count() < restriction.planLimitsEnum.getWorkflowLimit())
	    return true;

	send_warning_message();
	return false;

	// TODO Auto-generated method stub
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
    public void setMax()
    {
	// TODO Auto-generated method stub

    }

}
