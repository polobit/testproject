package com.agilecrm.subscription.restrictions;

public interface BillingRestriction
{

    public boolean can_create();

    public boolean can_update();

    public void send_warning_message();
}
