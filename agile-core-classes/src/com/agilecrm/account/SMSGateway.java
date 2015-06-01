package com.agilecrm.account;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

import com.googlecode.objectify.annotation.Cached;

/**
 * <code>SMSGateway</code> is the entity class representing SMSGateway
 * 
 * @author Kona
 */
@SuppressWarnings("serial")
@XmlRootElement
@Cached
public class SMSGateway implements Serializable
{

	/**
	 * SMS Gateway types
	 */
	public static enum SMS_API
	{
		TWILIO, PLIVO
	};

	public static SMS_API sms_api;

	public SMSGateway()
	{
	}

}
