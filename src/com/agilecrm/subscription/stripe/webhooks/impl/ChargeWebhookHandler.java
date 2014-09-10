package com.agilecrm.subscription.stripe.webhooks.impl;

import java.util.Map;

import com.agilecrm.subscription.stripe.webhooks.StripeWebhookHandler;
import com.agilecrm.subscription.stripe.webhooks.StripeWebhookServlet;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;

public class ChargeWebhookHandler extends StripeWebhookHandler
{

    @Override
    public void process()
    {
	// TODO Auto-generated method stub
	/**
	 * CHARGE REFUNDED
	 * 
	 * Sends mail to domain owner regarding charge refund
	 */
	if (eventType.equals(StripeWebhookServlet.STRIPE_CHARGE_REFUNDED))
	{
		DomainUser user = DomainUserUtil.getDomainOwner(getDomain());

		if (user == null)
			return;

		// Send mail to domain user
		SendMail.sendMail(user.email, SendMail.REFUND_SUBJECT, SendMail.REFUND, getcustomDataForMail());
	}
    }

    @Override
    public void updateOurDomainContact()
    {
	// TODO Auto-generated method stub
	
    }

    @Override
    protected Map<String, Object> getPlanDetails()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    protected Map<String, Object> getMailDetails()
    {
	// TODO Auto-generated method stub
	return null;
    }

}
