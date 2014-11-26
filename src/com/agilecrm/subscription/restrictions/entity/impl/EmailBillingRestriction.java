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

	// To avoid NullPointerException
	max_allowed = Integer.valueOf(max_allowed) == null ? 0 : max_allowed;
	emails = emails == null ? 0 : emails;

	System.out.println("Max allowed in EmailBillingRestriction check " + max_allowed);
	System.out.println("Emails remaind " + emails);

	// If reminder is set then tags are created and added in our domain
	send_warning_message();

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

	restriction.sendReminder = true;

	// Gets maximum allowed emails in current plan
	max_allowed = restriction.max_emails_count == null ? 0 : restriction.max_emails_count;
	emails = restriction.one_time_emails_count == null ? 0 : restriction.one_time_emails_count;
    }

    @Override
    public String getTag()
    {
	int emailsSent = 0;
	if(emails < 0)
	    emailsSent = max_allowed;
	else
	    emailsSent = max_allowed - emails;
	
	emailsSent = emailsSent < 0 ? 0 : emailsSent;
	System.out.println("emails sent : " + emailsSent);
	String tag = BillingRestrictionReminderUtil.getTag(emailsSent, max_allowed, "Email",
		hardUpdateTags);

	if (tag != null)
	{
	    int percentage = BillingRestrictionReminderUtil.calculatePercentage(max_allowed, emailsSent);

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
