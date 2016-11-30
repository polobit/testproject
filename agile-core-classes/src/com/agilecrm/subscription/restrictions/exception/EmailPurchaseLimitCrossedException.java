/**
 * 
 */
package com.agilecrm.subscription.restrictions.exception;

/**
 * @author santhosh
 *
 */
public class EmailPurchaseLimitCrossedException extends Exception{
	
	public enum Type{
		BULK_EMAIL_PURCHASE_EXCEPTION
	}
	
	public EmailPurchaseLimitCrossedException(String reason) {
		super(reason);
	}
}
