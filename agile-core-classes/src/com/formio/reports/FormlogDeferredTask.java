package com.formio.reports;

import org.apache.commons.lang.StringUtils;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

public class FormlogDeferredTask implements DeferredTask
{

    private static final long serialVersionUID = -4125770150185929876L;

    public String formId = null;
    public String emailId = null;
    public String domain = null;

    public FormlogDeferredTask(String formId, String emailId, String domain)
    {
	this.formId = formId;
	this.emailId = emailId;
	this.domain = domain;
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

	    if (StringUtils.isEmpty(domain) || StringUtils.isEmpty(formId))
		return;

	    // To know SQL process time
	    long startTime = System.currentTimeMillis();

	    // Insert to SQL
	    FormReportsSQLUtil.insertData(emailId, domain, formId);

	    long processTime = System.currentTimeMillis() - startTime;
	    System.out.println("Process time of FORM for adding log is " + processTime + "ms");
	}
	catch (Exception e)
	{
	    System.out.println("Exception while executing FORMS write log deferred Task " + e.getMessage());
	}
	finally
	{
	    NamespaceManager.set(oldDomain);
	}

    }
}
