package com.thirdparty.sendgrid.deferred;


import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.sendgrid.util.SendGridUtil;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.thirdparty.sendgrid.subusers.SendGridSubUser;
import com.thirdparty.sendgrid.subusers.SendGridSubUser.SendGridStats;

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
	private Boolean checkSubUserExists = false;
	
	public Boolean getCheckSubUserExists() {
		return checkSubUserExists;
	}

	public void setCheckSubUserExists(Boolean checkSubUserExists) {
		this.checkSubUserExists = checkSubUserExists;
	}

	public SendGridSubAccountDeferred(String domain)
	{
		this.domain = domain;
	}

	@Override
	public void run() 
	{
		try
		{
			// Boolean flag whether to check SubUser exists or not
			if(checkSubUserExists)
			{
				SendGridStats stats = new SendGridStats();
				stats.setStartTime(System.currentTimeMillis());
				
				String response = SendGridSubUser.getSubUserStatistics(domain, null, stats);
				
				System.out.println("Response obtained is " + response);
				
				// If response doesn't contain errors return
				if(!(response != null &&
					StringUtils.containsIgnoreCase(response, "error") &&
					StringUtils.containsIgnoreCase(response, "one or more usernames do not belong to this parent account")))
						return;
					
			}
			
			SendGridUtil.createSendGridSubUser(domain);
		}
		catch (Exception e)
		{
			System.out.println("Exception occured in SendgridSubAccountDeferredtask...");
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}
		
	}
}
