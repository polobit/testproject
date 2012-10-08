package com.agilecrm.customer;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class CreditCard
{
    public String name = "";
    public Integer cvc = null;
    public String address_line1 = "";
    public String address_line2 = "";
    public String address_city = "";
    public String address_zip = "";
    public String address_country = "";
    public String gateway = "";
    public String number = "";
    public String exp_month = "";
    public String exp_year = "";

    @Override
    public String toString()
    {
	return "CreditCard: {name: " + name + ", cvc: " + cvc
		+ ", address_line1: " + address_line1 + ", address_line2: "
		+ address_line2 + ", address_city: " + address_city
		+ ", address_zip: " + address_zip + ", address_country: "
		+ address_country + ", gateway: " + gateway + ", number: "
		+ number + ", exp_month: " + exp_month + ", exp_year: "
		+ exp_year + "}";
    }

}