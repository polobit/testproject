package com.agilecrm.subscription.restrictions.entity.impl;

import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;

public class WorkflowBillingRestriction extends DaoBillingRestriction
{
	boolean hardUpdateTags = true;

	/**
	 * Checks if new workflow does not exceed limits in current plan
	 */
	@Override
	public boolean can_create()
	{
		restriction.campaigns_count = get_campaign_count();

		System.out.println("Active campaign count: " + restriction.campaigns_count);

		if (restriction.sendReminder)
			send_warning_message();

		Workflow workflow = (Workflow) entity;

		if (workflow.is_disabled)
			return true;

		if (restriction.campaigns_count < max_allowed)
			return true;

		return false;
	}

	/**
	 * Always returns as there are no limits on updation
	 */
	@Override
	public boolean can_update()
	{
		restriction.campaigns_count = get_campaign_count();

		System.out.println("Active campaign count: " + restriction.campaigns_count);

		Workflow workflow = (Workflow) entity;

		Workflow old_workflow = WorkflowUtil.getWorkflow(workflow.id);

		if (old_workflow.is_disabled != workflow.is_disabled && !workflow.is_disabled)
			restriction.campaigns_count += 1;

		if (restriction.campaigns_count <= max_allowed)
			return true;

		return false;
	}

	@Override
	public void send_warning_message()
	{
		getTag();
		if (restriction.tagsToAddInOurDomain.isEmpty())
			return;

		restriction.sendReminder();
	}

	/**
	 * Creates restriction object and gets Max allowed workflows count
	 */
	@Override
	public void setMax()
	{
		if (restriction == null)
			restriction = BillingRestrictionUtil.getInstance(sendReminder);

		max_allowed = restriction.planDetails.getWorkflowLimit();
	}

	@Override
	public String getTag()
	{

		if (restriction == null || restriction.campaigns_count == null)
			return null;

		int count = restriction.campaigns_count;

		String tag = setTagsToUpdate(max_allowed, daemonCheck ? restriction.campaigns_count
				: (restriction.campaigns_count + 1));

		restriction.campaigns_count = count;

		return tag;
	}

	@Override
	public boolean check()
	{
		Workflow workflow = (Workflow) entity;
		if (workflow.id == null)
			return can_create();

		return can_update();
	}

	/**
	 * @return - Returns active workflow count
	 */
	private int get_campaign_count()
	{
		return Workflow.dao.getCountByProperty("is_disabled", false);
	}
}
