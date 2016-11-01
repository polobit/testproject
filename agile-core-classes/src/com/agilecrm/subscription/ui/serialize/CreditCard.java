package com.agilecrm.subscription.ui.serialize;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * <code>CreaditCard</code> class is used to serialize credit card information
 * into object from subcsription form.
 * 
 * @author Yaswanth
 * 
 */
@XmlRootElement
public class CreditCard implements Serializable{
	// public String name = "";
	public String cvc = null;
	public String number = null;
	public String exp_month = "";
	public String exp_year = "";
}