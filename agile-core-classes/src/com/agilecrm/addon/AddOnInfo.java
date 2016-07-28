/**
 * 
 */
package com.agilecrm.addon;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * Saves Extra information about add on subscriptions
 * @author Santhosh
 *
 */
@XmlRootElement
public class AddOnInfo implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public static enum AddOnStatus{
		SUCCESS, FAILED1, FAILED2, FAILED3, DELETED
	}
	
	/**
	 * Billing status of addOns of type AddOnStatus
	 */
	@NotSaved(IfDefault.class)
	public AddOnStatus status;
	
	/**
	 * addOn subscription id from stripe
	 * sets in webhook
	 */
	@NotSaved(IfDefault.class)
	public String subscriptionId;
	
	/**
	 * quantity 
	 */
	@NotSaved(IfDefault.class)
	public int quantity;
	
	public AddOnInfo(){
		
	}

}
