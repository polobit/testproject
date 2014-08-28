package com.agilecrm.mandrill.util.deferred;

import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>MandrillDeferredTask</code> is the deferred task that handles send
 * email details of every task
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
    public String cc = null;
    public String bcc = null;
    public String subject = null;
    public String replyTo = null;
    public String html = null;
    public String text = null;
    public String metadata = null;

    /**
     * Constructs a new {@link MandrillDeferredTask}
     * 
     * @param subaccount
     *            - domain name
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @param to
     *            - to email
     * @param subject
     *            - subject
     * @param replyTo
     *            - reply to email
     * @param html
     *            - html content
     * @param text
     *            - text content
     */
    public MandrillDeferredTask(String subaccount, String fromEmail, String fromName, String to, String cc, String bcc,
	    String subject, String replyTo, String html, String text, String metadata)
    {
	this.subaccount = subaccount;
	this.fromEmail = fromEmail;
	this.fromName = fromName;
	this.to = to;
	this.cc = cc;
	this.bcc = bcc;
	this.subject = subject;
	this.replyTo = replyTo;
	this.html = html;
	this.text = text;
	this.metadata = metadata;
    }

    public void run()
    {
	System.out.println("MandrillDeferredTask empty run");
    }
}
