package com.thirdparty.mandrill.subaccounts.util.deferred;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.mandrill.util.MandrillUtil;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.thirdparty.mandrill.subaccounts.MandrillSubAccounts;

public class SubaccountCheckDeferredTask implements DeferredTask
{

	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String apiKey = null;
	private String subaccount = null;
	
	public SubaccountCheckDeferredTask()
	{
		
	}
	
	public SubaccountCheckDeferredTask(String apiKey, String subaccount)
	{
		this.apiKey  = apiKey;
		this.subaccount = subaccount;
	}
	
	@Override
	public void run(){
		
     if(StringUtils.isBlank(subaccount) || StringUtils.isBlank(apiKey))
    	 return;
     
     MandrillSubAccounts.checkSubAccountExists(subaccount, apiKey);
		
	}
}
