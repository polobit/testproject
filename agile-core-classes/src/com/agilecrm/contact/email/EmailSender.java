package com.agilecrm.contact.email;

import java.util.List;

import com.agilecrm.Globals;
import com.agilecrm.account.AccountEmailStats;
import com.agilecrm.account.EmailGateway;
import com.agilecrm.account.EmailGateway.EMAIL_API;
import com.agilecrm.account.util.AccountEmailStatsUtil;
import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.mandrill.util.deferred.MailDeferredTask;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.subscription.restrictions.entity.impl.EmailBillingRestriction;
import com.agilecrm.util.EmailUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.blobstore.BlobKey;

public class EmailSender
{
    public BillingRestriction billingRestriction = null;
    public EmailBillingRestriction emailBillingRestriction = null;
    public EmailGateway emailGateway = null;
    public AccountEmailStats accountEmailStats = null;

    private String mandrillAPIKey = Globals.MANDRIL_API_KEY_VALUE;
    
    private int totalEmailsSent = 0;

    boolean isWhiteLabled = false;

    private EmailSender()
    {
    }

    public static EmailSender getEmailSender()
    {
	EmailSender emailSender = new EmailSender();

	emailSender.billingRestriction = BillingRestrictionUtil.getBillingRestrictionFromDB();

	emailSender.emailBillingRestriction = (EmailBillingRestriction) DaoBillingRestriction.getInstace(
	        DaoBillingRestriction.ClassEntities.Email.toString(), emailSender.billingRestriction);

	emailSender.emailGateway = EmailGatewayUtil.getEmailGateway();

	emailSender.accountEmailStats = AccountEmailStatsUtil.getAccountEmailStats();

	return emailSender;
    }

    public boolean isEmailWhiteLabelEnabled()
    {

	isWhiteLabled = billingRestriction.isEmailWhiteLabelEnabled();
	System.out.println("Email limit for domain " + NamespaceManager.get() + " whitelabel : " + isWhiteLabled
	        + "pending emails : " + billingRestriction.one_time_emails_count);

	return isWhiteLabled;
    }
    
    /**
     * Verifies whether Master plan paid or not
     * 
     * @return boolean
     */
    public boolean isPaid()
    {
    	return !billingRestriction.planDetails.isFreePlan();
    }

    public boolean canSend()
    {
	return emailBillingRestriction.check();

    }

    public void updateStats()
    {
	System.out.println("initial count : " + billingRestriction.one_time_emails_count);

	billingRestriction = BillingRestrictionUtil.getBillingRestriction(true);

	System.out.println("Updated Stats time is..." + System.currentTimeMillis());

	billingRestriction.one_time_emails_count = billingRestriction.one_time_emails_count == null ? 0
	        : billingRestriction.one_time_emails_count;

	billingRestriction.one_time_emails_count -= totalEmailsSent;

	System.out.println("Updated count : " + billingRestriction.one_time_emails_count + ", emails sent"
	        + totalEmailsSent);

	totalEmailsSent = 0;

	if (billingRestriction != null)
	    billingRestriction.save();

	if (accountEmailStats != null)
	    accountEmailStats.save();

	emailBillingRestriction.setBillingRestriction(billingRestriction);

	// Sets max and checks again. It will help adding tag
	emailBillingRestriction.setMax();
	emailBillingRestriction.check();

    }

    public void updateOneTimeEmailStats()
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
	{
	    // To avoid NullPointerException
	    billingRestriction.one_time_emails_count = billingRestriction.one_time_emails_count == null ? 0
		    : billingRestriction.one_time_emails_count;

	    billingRestriction.one_time_emails_count -= count;

	}

	totalEmailsSent += count;
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

    
    public void setMandrillAPIKey(String apiKey)
    {
    	this.mandrillAPIKey = apiKey;
    }
    
    public String getMandrillAPIKey()
    {
	if (emailGateway == null)
	{
		// For Paid plan return old Mandrill Account
		if(isPaid())
			return Globals.MANDRIL_API_KEY_VALUE;
	
		return mandrillAPIKey;
	}
		
	if(emailGateway.email_api.equals(EMAIL_API.MANDRILL))
	    return emailGateway.api_key;

	return null;
    }

    public void sendEmail(String fromEmail, String fromName, String to, String cc, String bcc, String subject,
	    String replyTo, String html, String text, String mandrillMetadata, List<Long> documentIds,
	    List<BlobKey> blobKeys, String... attachments) throws Exception
    {

	String domain = NamespaceManager.get();
	try
	{
	    if (canSend())
	    {
		EmailGatewayUtil.sendEmail(emailGateway, domain, fromEmail, fromName, to, cc, bcc, subject, replyTo,
		        html, text, mandrillMetadata, documentIds, blobKeys, attachments);

		// Sets Billing restriction limit and account email stats
		if (!EmailUtil.isToAgileEmail(to))
		{
		    setCount(1);

		    updateOneTimeEmailStats();
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
	throw new Exception(
	        "Your email quota has expired. Please <a href=\"#subscribe\">upgrade</a> your email subscription.");

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
