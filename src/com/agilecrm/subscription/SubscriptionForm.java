package com.agilecrm.subscription;

import javax.persistence.Embedded;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.billing.CreditCard;
import com.agilecrm.billing.Plan;

@XmlRootElement
public class SubscriptionForm
{
    @Embedded
    public CreditCard card;

    @Embedded
    public Plan plan;
}
