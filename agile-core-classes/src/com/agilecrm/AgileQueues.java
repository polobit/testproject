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
    public static final String CAMPAIGN_LOG_QUEUE = "campaign-log-queue";
    public static final String BULK_CAMPAIGN_QUEUE = "bulk-campaign-queue";
    public static final String NORMAL_CAMPAIGN_QUEUE = "normal-campaign-queue";
    public static final String UPDATE_WORKFLOWS_QUEUE = "update-workflows-queue";
    public static final String JSONIO_NODE_QUEUE = "jsonio-node-queue";
    public static final String BULK_CAMPAIGN_QUEUE_1 = "bulk-campaign-queue-1";

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
    
    public static final String AMAZON_SES_EMAIL_PULL_QUEUE ="amazon-ses-pull-queue";

    // Campaign pull queues
    public static final String BULK_CAMPAIGN_PULL_QUEUE = "bulk-campaign-pull-queue";
    public static final String NORMAL_CAMPAIGN_PULL_QUEUE = "normal-campaign-pull-queue";
    public static final String BULK_CAMPAIGN_PULL_QUEUE_1 = "bulk-campaign-pull-queue-1";
    
    //Time out noraml campaign pull queue
    public static final String TIME_OUT_EMAIL_PULL_QUEUE = "time-out-email-pull-queue";
    
    // Campaign push queues
    public static final String NORMAL_CAMPAIGN_PUSH_QUEUE = "normal-campaign-push-queue";
    
    //Wakeup or interrupt push queues
    public static final String TIMEOUT_PUSH_QUEUE = "timeout-push-queue";
    
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
    
    // Credits auto renewal queue
    public static final String CREDITS_AUTO_RENEWAL_QUEUE = "credits-auto-renewal-queue";

    // Contacts and Deal push queue
    public static final String WEBHOOKS_REGISTER_ADD_QUEUE = "webhooks-register-add-queue";

	//Ticketing queue
	public static final String TICKET_BULK_ACTIONS_QUEUE = "ticket-bulk-actions";
	
	//Deals update to textsearch queue
	public static final String DEALS_SCHEMA_CHANGE_QUEUE = "deals-schema-change-queue";
	
	//Queue to update name in companies
	public static final String NAME_UPDATE_COMPANIES = "name-update-companies-queue";
	
	//Task bulk action queues
	public static final String BULK_TASK_CHANGE_PRIORITY = "task-change-priority-queue";
	public static final String BULK_TASK_CHANGE_STATUS = "task-change-status-queue";
	public static final String BULK_TASK_CHANGE_DUEDATE = "task-change-duedate-queue";
	public static final String BULK_CALL_PULL_QUEUE = "bulk-call-pull-queue";
		
	//Email attachemnt queue for send an attachment
	public static final String EMAIL_ATTACHEMNT_QUEUE = "email-attachment-queue";
	
	public static final String IP_FILTERS_TRANSFER_QUEUE = "ip-filters-transfer-queue";
	
	public static final String CRON_PULL_TASK_QUEUE = "cron-pull-task-queue";
	
	// Errors Queue
	public static final String AGILE_APP_ERRORS_QUEUE = "app-error-queue";
}
