package com.webruleio.reports;

 import org.apache.commons.lang.StringUtils;

import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

public class WebrulelogDeferredTask implements DeferredTask
{

    private static final long serialVersionUID = -4125770150185929876L;

    public String webruleId = null;
    public String emailId = null;
    public String domain = null;
    public String webruleType=null;

    public WebrulelogDeferredTask(String webruleId, String emailId, String domain,String webruleType)
    {
	this.webruleId = webruleId;
	this.emailId = emailId;
	this.domain = domain;
	this.webruleType=webruleType;
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

	    if (StringUtils.isEmpty(domain) || StringUtils.isEmpty(webruleId))
		return;

	    // To know SQL process time
	    long startTime = System.currentTimeMillis();

	    // Insert to SQL
	    WebruleReportsSQLUtil.insertData(emailId, domain, webruleId, webruleType);

	    long processTime = System.currentTimeMillis() - startTime;
	    System.out.println("Process time of WEBRULE for adding log is " + processTime + "ms");
	}
	catch (Exception e)
	{
	    System.out.println("Exception while executing WEBRULE write log deferred Task " + e.getMessage());
	}
	finally
	{
	    NamespaceManager.set(oldDomain);
	}

    }
}
