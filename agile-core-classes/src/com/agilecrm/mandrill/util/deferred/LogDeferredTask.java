package com.agilecrm.mandrill.util.deferred;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.util.CampaignLogsSQLUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.utils.SystemProperty;

@SuppressWarnings("serial")
public class LogDeferredTask implements DeferredTask
{
    
    private static final long serialVersionUID = -4125770150185929876L;
    
    public String campaignId = null;
    public String subscriberId = null;
    public String message = null;
    public String logType = null;
    public String domain = null;
    public String time = null;
    
    public LogDeferredTask(String campaignId, String subscriberId, String message, String logType, String domain,
	    String time)
    {
	this.campaignId = campaignId;
	this.subscriberId = subscriberId;
	this.message = message;
	this.logType = logType;
	this.domain = domain;
	this.time = time;
    }
    
    @Override
    public void run()
    {
	// TODO Auto-generated method stub
	String oldDomain = NamespaceManager.get();
	NamespaceManager.set(domain);
	try
	{
	    // For localhost
	    // if (SystemProperty.environment.value() ==
	    // SystemProperty.Environment.Value.Development)
	    // domain = "localhost";
	    
	    if (StringUtils.isEmpty(domain) || StringUtils.isEmpty(campaignId) || StringUtils.isEmpty(subscriberId))
		return;
	    
	    // To know SQL process time
	    long startTime = System.currentTimeMillis();
	    
	    // Insert to SQL
	    CampaignLogsSQLUtil.addToCampaignLogs(domain, campaignId, WorkflowUtil.getCampaignName(campaignId),
		    subscriberId, message, logType);
	    
	    long processTime = System.currentTimeMillis() - startTime;
	    System.out.println("Process time for adding log is " + processTime + "ms");
	}
	catch (Exception e)
	{
	    System.out.println("Exception while executing campaign write log deferred Task " + e.getMessage());
	}
	finally
	{
	    NamespaceManager.set(oldDomain);
	}
	
    }
}
