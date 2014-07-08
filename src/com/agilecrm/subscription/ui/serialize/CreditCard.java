package com.agilecrm.subscription.ui.serialize;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * <code>CreaditCard</code> class is used to serialize credit card information
 * into object from subcsription form.
 * 
 * @author Yaswanth
 * 
 */
@XmlRootElement
public class CreditCard
{
    public String name = "";
    public String cvc = null;
    public String address_line1 = "";
    public String address_line2 = "";
    public String address_state = "";
    public String address_zip = "";
    public String address_country = "";
    public String number = "";
    public String exp_month = "";
    public String exp_year = "";

    @Override
    public String toString()
    {
	return "CreditCard: {name: " + name + ", cvc: " + cvc + ", address_line1: " + address_line1
		+ ", address_line2: " + address_line2 + ", address_city: " + address_state + ", address_zip: "
		+ address_zip + ", address_country: " + address_country + ", number: " + number + ", exp_month: "
		+ exp_month + ", exp_year: " + exp_year + "}";
    }
}