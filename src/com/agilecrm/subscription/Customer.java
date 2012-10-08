package com.agilecrm.subscription;

import javax.persistence.Id;

public class Customer
{
    // Key
    @Id
    public Long id;

    public String stripe_id;

    public String card_number;

    public String csv;

}
