package com.agilecrm.mandrill.util.deferred;

import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>MandrillDeferredTask</code> is the deferred task that handles email
 * info
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class MandrillDeferredTask implements DeferredTask
{
    public String subaccount = null;
    public String fromEmail = null;
    public String fromName = null;
    public String to = null;
    public String subject = null;
    public String replyTo = null;
    public String html = null;
    public String text = null;

    public MandrillDeferredTask(String subaccount, String fromEmail, String fromName, String to, String subject, String replyTo, String html, String text)
    {
	this.subaccount = subaccount;
	this.fromEmail = fromEmail;
	this.fromName = fromName;
	this.to = to;
	this.subject = subject;
	this.replyTo = replyTo;
	this.html = html;
	this.text = text;
    }

    public void run()
    {
	System.out.println("MandrillDeferredTask empty run");
    }
}
