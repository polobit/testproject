package com.agilecrm.subscription.restrictions.entity.impl;

import com.agilecrm.contact.Contact;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;

/**
 * Contacts billing restriction class to check whether new contacts can be
 * created.
 * 
 * @author yaswanth
 * 
 */
public class ContactBillingRestriction extends DaoBillingRestriction
{
    /**
     * Unlike other entities contacts count is not fetched, to avoid count
     * fetching delay, it is read from {@link BillingRestriction} from DB
     */
    @Override
    public boolean can_create()
    {
	// If reminder is set then tags are created and added in our domain
	if (restriction.sendReminder)
	    send_warning_message();

	// Returns true if count is less than maximum allowed contacts in
	// current plan
	if (restriction.contacts_count == null || restriction.contacts_count <= max_allowed)
	    return true;

	return false;
    }

    /**
     * Returns true as there are not limitations on updation
     */
    @Override
    public boolean can_update()
    {
	// TODO Auto-generated method stub
	return true;
    }

    /**
     * Gets {@link BillingRestriction} instance and sets maximum allowed limits
     * contacts in current plan
     */
    @Override
    public void setMax()
    {
	if (restriction == null)
	    restriction = BillingRestrictionUtil.getBillingRestriction(sendReminder);

	// Gets maximum allowed contacts in current plan
	max_allowed = BillingRestrictionUtil.getInstance().planDetails.getContactLimit();
    }

    /**
     * Calculates percentage of contacts used and add tags if percentage exceeds
     * 75%
     */
    public String getTag()
    {

	if (restriction == null || restriction.contacts_count == null)
	    return null;

	int count = restriction.contacts_count;

	String tag = setTagsToUpdate(max_allowed, restriction.contacts_count + 1);

	restriction.contacts_count = count;

	return tag;

    }

    @Override
    public boolean check()
    {
	Contact contact = (Contact) entity;
	if (contact.id == null)
	    return can_create();

	return can_update();
    }

    @Override
    public int getPendingCount()
    {
	if (restriction.contacts_count == null || restriction.contacts_count == 0)
	    return max_allowed;

	// TODO Auto-generated method stub
	return max_allowed - restriction.contacts_count;
    }
}
