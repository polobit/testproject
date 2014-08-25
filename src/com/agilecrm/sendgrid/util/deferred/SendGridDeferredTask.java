package com.agilecrm.sendgrid.util.deferred;

import com.google.appengine.api.taskqueue.DeferredTask;

@SuppressWarnings("serial")
public class SendGridDeferredTask implements DeferredTask
{
    public String apiUser = null;
    public String apiKey = null;
    public String fromEmail = null;
    public String fromName = null;
    public String to = null;
    public String cc = null;
    public String bcc = null;
    public String subject = null;
    public String replyTo = null;
    public String html = null;
    public String text = null;

    public SendGridDeferredTask(String apiUser, String apiKey, String fromEmail, String fromName, String to, String cc,
	    String bcc, String subject, String replyTo, String html, String text)
    {
	this.apiUser = apiUser;
	this.apiKey = apiKey;
	this.fromEmail = fromEmail;
	this.fromName = fromName;
	this.to = to;
	this.cc = cc;
	this.bcc = bcc;
	this.subject = subject;
	this.replyTo = replyTo;
	this.html = html;
	this.text = text;
    }

    public void run()
    {
	System.out.println("SendGridDeferredTask empty run...");
    }
}
