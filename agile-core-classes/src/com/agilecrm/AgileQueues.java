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
    public static final String BULK_CAMPAIGN_QUEUE = "bulk-campaign-queue";
    public static final String NORMAL_CAMPAIGN_QUEUE = "normal-campaign-queue";
    public static final String UPDATE_WORKFLOWS_QUEUE = "update-workflows-queue";

    // Cron Push Queue
    public static final String CRON_QUEUE = "cron-queue";
    public static final String MANDRILL_QUEUE = "mandrill-queue";
    public static final String CRON_INTERRUPT_QUEUE = "cron-interrupt-queue";

    public static final String ACCOUNT_STATS_UPDATE_QUEUE = "account-stats-update-queue";
    public static final String CONTACTS_DELETE_QUEUE = "contacts-delete-queue";
    public static final String CONTACTS_POST_DELETE_QUEUE = "contacts-post-delete-queue";

    public static final String OWNER_CHANGE_QUEUE = "owner-change-queue";
    public static final String CAMPAIGN_SUBSCRIBE_QUEUE = "campaign-subscribe-queue";
    public static final String BULK_TAGS_QUEUE = "bulk-tags-queue";
    public static final String CONTACTS_UPLOAD_QUEUE = "contacts-upload-queue";
    public static final String DEALS_UPLOAD_QUEUE = "deals-upload-queue";
    public static final String BULK_EMAILS_QUEUE = "bulk-emails-queue";
    public static final String CONTACTS_EXPORT_QUEUE = "contacts-export-queue";
    public static final String DEALS_EXPORT_QUEUE = "deals-export-queue";
    public static final String WORKFLOWS_RELATED_QUEUE = "workflows-related-queue";
    public static final String TAG_ENTITY_QUEUE = "tag-entity-queue";

    public static final String BULK_ACTION_QUEUE = "bulk-actions-queue";

    public static final String CAMPAIGN_SUBSCRIBE_SUBTASK_QUEUE = "campaign-subscribe-subtask-queue";
    public static final String LAST_CONTACTED_UPDATE_QUEUE = "last-contacted-update-queue";

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

    public static final String NOTIFICATION_PULL_QUEUE = "notification-pull-queue";

    public static final String CONTACTS_SCHEMA_CHANGE_QUEUE = "contacts-schema-change-queue";

    // Free Emails added push queue
    public static final String EMAILS_ADDED_QUEUE = "free-emails-added-queue";

    // Contacts and Deal push queue
    public static final String WEBHOOKS_REGISTER_ADD_QUEUE = "webhooks-register-add-queue";

	//Ticketing queue
	public static final String TICKET_BULK_ACTIONS_QUEUE = "ticket-bulk-actions";

}
