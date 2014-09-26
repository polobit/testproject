package com.agilecrm;

/**
 * 
 * <code>AgileQueues</code> is the class that holds queue globally
 * 
 * @author Naresh
 * 
 */
public class AgileQueues
{

    // Campaign Push Queue
    public static final String CAMPAIGN_QUEUE = "campaign-queue";

    // Cron Push Queue
    public static final String CRON_QUEUE = "cron-queue";

    // Campaign and Email pull queues
    public static final String CAMPAIGN_PULL_QUEUE = "sb-campaign-pull-queue";
    public static final String EMAIL_PULL_QUEUE = "sb-email-pull-queue";

    // Campaign pull queues
    public static final String BULK_CAMPAIGN_PULL_QUEUE = "bulk-campaign-pull-queue";
    public static final String NORMAL_CAMPAIGN_PULL_QUEUE = "normal-campaign-pull-queue";

    // Email pull queues
    public static final String BULK_EMAIL_PULL_QUEUE = "bulk-email-pull-queue";
    public static final String NORMAL_EMAIL_PULL_QUEUE = "normal-email-pull-queue";

    // SMS pull queues
    public static final String BULK_SMS_PULL_QUEUE = "bulk-sms-pull-queue";
    public static final String NORMAL_SMS_PULL_QUEUE = "normal-sms-pull-queue";

}
