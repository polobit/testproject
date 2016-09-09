package com.campaignio.servlets.deferred;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.account.APIKey;
import com.agilecrm.account.util.APIKeyUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

public class IpFilterTransferDeferredTask implements DeferredTask
{
    /**
     * 
     */
    private static final long serialVersionUID = -3059642150327535614L;
    public String domain;
    
    public IpFilterTransferDeferredTask(String domain)
    {
	this.domain = domain;
    }
    
    public void run()
    {
	String oldNamespace = NamespaceManager.get();
	try
	{
	    if (StringUtils.isBlank(domain))
		return;
	    
	    NamespaceManager.set(domain);
	    
	    DomainUser domainUser = DomainUserUtil.getDomainOwner(domain);
	    APIKey apiKey = APIKey.getAPIKeyRelatedToUser(domainUser.id);
	    if (apiKey != null)
	    {
		String blockedIps = apiKey.blocked_ips;
		if (StringUtils.isNotBlank(blockedIps))
		    APIKeyUtil.updateBlockedIpsInStatsServer(blockedIps);
	    }
	}
	catch(Exception e)
	{
	    System.err.println(e.getMessage());
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
	
    }
}
