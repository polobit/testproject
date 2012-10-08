package com.agilecrm.subscription;

import javax.persistence.Embedded;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.customer.CreditCard;
import com.agilecrm.customer.Plan;

@XmlRootElement
public class SubscriptionForm
{
    @Embedded
    public CreditCard card;

    @Embedded
    public Plan plan;
}
