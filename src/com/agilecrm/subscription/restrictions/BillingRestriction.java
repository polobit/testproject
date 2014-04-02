package com.agilecrm.subscription.restrictions;

public interface BillingRestriction
{

    /**
     * Checks if entity can be created
     */
    public boolean can_create();

    /**
     * Checks if entity can be updated
     */
    public boolean can_update();

    /**
     * Sends warning message if limit exceeds
     */
    public void send_warning_message();
}
