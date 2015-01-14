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

    public static final String CONTACTS_DELETE_QUEUE = "contacts-delete-queue";
    public static final String OWNER_CHANGE_QUEUE = "owner-change-queue";
    public static final String CAMPAIGN_SUBSCRIBE_QUEUE = "campaign-subscribe-queue";
    public static final String BULK_TAGS_QUEUE = "bulk-tags-queue";
    public static final String CONTACTS_UPLOAD_QUEUE = "contacts-upload-queue";
    public static final String DEALS_UPLOAD_QUEUE = "deals-upload-queue";
    public static final String BULK_EMAILS_QUEUE = "bulk-emails-queue";
    public static final String CONTACTS_EXPORT_QUEUE = "contacts-export-queue";
    public static final String DEALS_EXPORT_QUEUE = "deals-export-queue";
    public static final String WORKFLOWS_RELATED_QUEUE = "workflows-related-queue";

    // Personal bulk Email pull queues
    public static final String NORMAL_PERSONAL_EMAIL_PULL_QUEUE = "normal-personal-email-pull-queue";
    public static final String BULK_PERSONAL_EMAIL_PULL_QUEUE = "bulk-personal-email-pull-queue";

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
