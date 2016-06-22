package com.thirdparty.sendgrid.deferred;


import com.agilecrm.sendgrid.util.SendGridUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>SendGridSubAccountsDeferred</code> It will create sub account of 
 * SendGrid for domain
 *  Each AgileCRM domain name is set as different SendGrid sub account.
 * @author Naresh
 *
 */
public class SendGridSubAccountDeferred implements DeferredTask
{
	private static final long serialVersionUID = 1L;
	String domain=null;
	
	public SendGridSubAccountDeferred(String domain)
	{
		this.domain = domain;
	}

	@Override
	public void run() 
	{
		try
		{
			SendGridUtil.createSendGridSubUser(domain);
		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

}
