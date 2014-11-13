package com.agilecrm.subscription.restrictions.entity.impl;

import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.subscription.restrictions.util.BillingRestrictionReminderUtil;

public class EmailBillingRestriction extends DaoBillingRestriction
{

    private Integer emails = 0;

    @Override
    public boolean can_create()
    {
	return check();
    }

    @Override
    public boolean can_update()
    {
	// TODO Auto-generated method stub
	return false;
    }

    @Override
    public boolean check()
    {
	emails = restriction.one_time_emails_count;
	// TODO Auto-generated method stub
	if (max_allowed == 0 && (emails <= 0 && emails >= -5000))
	    return true;

	// TODO Auto-generated method stub
	if (emails > 0)
	    return true;

	return false;
    }

    @Override
    public void setMax()
    {
	if (restriction == null)
	    restriction = BillingRestrictionUtil.getBillingRestriction(sendReminder);

	// Gets maximum allowed contacts in current plan
	max_allowed = restriction.max_emails_count == null ? 0 : restriction.max_emails_count;
	emails = restriction.one_time_emails_count;
    }

    @Override
    public String getTag()
    {
	String tag = BillingRestrictionReminderUtil.getTag(restriction.one_time_emails_count, max_allowed, "Email",
		hardUpdateTags);

	if (tag != null)
	{
	    int percentage = BillingRestrictionReminderUtil.calculatePercentage(max_allowed,
		    restriction.one_time_emails_count);

	    // If tags are not there then new tag is saved in tags in our domain
	    // class
	    if ((restriction.tags_in_our_domain.isEmpty() || !restriction.tags_in_our_domain.contains(tag))
		    && percentage >= 75)
	    {

		// Removes previous tags
		for (String percentageString : BillingRestrictionUtil.percentages)
		{
		    restriction.tags_in_our_domain.remove("Email-" + percentageString);
		}

		restriction.tags_in_our_domain.add(tag);

		restriction.save();
		restriction.tagsToAddInOurDomain.add(tag);
		return tag;
	    }

	    // Updates tag even if percentage is less than 75%
	    if (hardUpdateTags && percentage < 75)
		restriction.tagsToAddInOurDomain.add(tag);
	}

	// TODO Auto-generated method stub
	return null;
    }

}
