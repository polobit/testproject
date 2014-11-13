package com.agilecrm.contact.email;

import com.agilecrm.account.AccountEmailStats;
import com.agilecrm.account.EmailGateway;
import com.agilecrm.account.util.AccountEmailStatsUtil;
import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.mandrill.util.deferred.MailDeferredTask;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.subscription.limits.PlanLimits;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.subscription.restrictions.entity.impl.EmailBillingRestriction;
import com.agilecrm.util.EmailUtil;
import com.google.appengine.api.NamespaceManager;

public class EmailSender
{
    public BillingRestriction billingRestriction = null;
    public EmailBillingRestriction emailBillingRestriction = null;
    public EmailGateway emailGateway = null;
    public AccountEmailStats accountEmailStats = null;

    public PlanLimits limits = null;

    boolean isWhiteLabled = false;

    private EmailSender()
    {
    }

    public static EmailSender getEmailSender()
    {
	EmailSender emailSender = new EmailSender();

	emailSender.billingRestriction = BillingRestrictionUtil.getBillingRestriction(true);

	emailSender.emailBillingRestriction = (EmailBillingRestriction) DaoBillingRestriction.getInstace(
		DaoBillingRestriction.ClassEntities.Email.toString(), emailSender.billingRestriction);

	emailSender.emailGateway = EmailGatewayUtil.getEmailGateway();

	emailSender.accountEmailStats = AccountEmailStatsUtil.getAccountEmailStats();

	return emailSender;
    }

    public boolean isEmailWhiteLabelEnabled()
    {
	if (limits != null)
	{
	    return limits.isEmailWhiteLabelEnabled();
	}

	limits = billingRestriction.getCurrentLimits();
	return limits.isEmailWhiteLabelEnabled();
    }

    public boolean canSend()
    {
	return emailBillingRestriction.check();
    }

    public void updateStats()
    {
	if (billingRestriction != null)
	    billingRestriction.save();

	if (accountEmailStats != null)
	    accountEmailStats.save();
    }

    public void setCount(int count)
    {
	if (accountEmailStats != null)
	    accountEmailStats.count += count;

	if (billingRestriction != null)
	    billingRestriction.one_time_emails_count -= count;
    }

    public void incrementEmailsCount()
    {
	if (accountEmailStats != null)
	    accountEmailStats.count++;
    }

    public void incrementEmailsCount(int count)
    {
	if (accountEmailStats != null)
	    accountEmailStats.count = accountEmailStats.count + count;
    }

    public void decrementEmailLimitCount()
    {
	if (billingRestriction != null)
	    --billingRestriction.one_time_emails_count;
    }

    public void decrementEmailLimitCount(int count)
    {
	if (billingRestriction != null)
	    billingRestriction.one_time_emails_count = billingRestriction.one_time_emails_count - count;
    }

    public void sendEmail(String fromEmail, String fromName, String to, String cc, String bcc, String subject,
	    String replyTo, String html, String text, String mandrillMetadata, String... attachments) throws Exception
    {

	String domain = NamespaceManager.get();
	try
	{
	    if (canSend())
	    {
		EmailGatewayUtil.sendEmail(emailGateway, domain, fromEmail, fromName, to, cc, bcc, subject, replyTo,
			html, text, mandrillMetadata, attachments);

		// Sets Billing restriction limit and account email stats
		if (!EmailUtil.isToAgileEmail(to))
		{
		    setCount(AccountEmailStatsUtil.getEmailsTotal(to, cc, bcc));

		    updateStats();
		}

		return;
	    }
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while sending emails and updating count..." + e.getMessage());
	    e.printStackTrace();
	}

	// If plan exceeded, throw exception
	throw new Exception("Emails limit exceeded. Please increase your email limits.");

    }

    public void addToQueue(String queueName, String emailGatewayType, String apiUser, String apiKey, String domain,
	    String fromEmail, String fromName, String to, String cc, String bcc, String subject, String replyTo,
	    String html, String text, String mandrillMetadata, String subscriberId, String campaignId)
    {
	MailDeferredTask mailDeferredTask = new MailDeferredTask(emailGatewayType, apiUser, apiKey, domain, fromEmail,
		fromName, to, cc, bcc, subject, replyTo, html, text, mandrillMetadata, subscriberId, campaignId);

	// Add to pull queue with from email as Tag
	PullQueueUtil.addToPullQueue(queueName, mailDeferredTask, fromEmail);
    }

}
