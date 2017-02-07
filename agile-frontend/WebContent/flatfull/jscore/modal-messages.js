/*JSON object for alert type modals and confirm modals*/
var GLOBAL_MODAL_MESSAGES = {
	"global_delete": "{{agile_lng_translate 'others' 'delete-warn'}}",
	"global_error_title" : "{{agile_lng_translate 'contact-details' 'error'}}",
	"global_validation_title" : "{{agile_lng_translate 'admin-settings-custom-fields' 'validation'}}",
	"global_error_message" : "{{agile_lng_translate 'others' 'error-occured'}}"
}
var MODAL_MESSAGES = {


	"delete" : {
		"title": "{{agile_lng_translate 'contact-details' 'delete'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"error" : {
		"title": "{{agile_lng_translate 'contact-details' 'error'}}",
		"message" : "{{agile_lng_translate 'others' 'error-occured-reload'}}"
	},
	"retry" : {
		"title": "{{agile_lng_translate 'contact-details' 'error'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_error_message
	},
	"delete_task" : {
		"title": "{{agile_lng_translate 'report-view' 'delete-task'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_contact" : {
		"title": "{{agile_lng_translate 'contacts-view' 'delete-contact'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_company" : {
		"title": "{{agile_lng_translate 'companies' 'delete-company'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_event" : {
		"title": _agile_get_translated_val('events','delete-event'),
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_opportunity" : {
		"title": "{{agile_lng_translate 'deals' 'delete-deal'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_custom_field" : {
		"title": "{{agile_lng_translate 'customfields' 'delete'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_milestone" : {
		"title": "{{agile_lng_translate 'admin-settings-deals' 'delete-milestone'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_stream" : {
		"title": "{{agile_lng_translate 'social' 'delete-stream'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_calendar_prefs" : {
		"title": "{{agile_lng_translate 'calendar' 'delete-prefs'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_lost_reason" : {
		"title": "{{agile_lng_translate 'deals' 'delete-loss'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_deal_source" : {
		"title": "{{agile_lng_translate 'deals' 'delete-source'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"event_drop" : {
		"title": _agile_get_translated_val('events','update-event'),
		"message" : "{{agile_lng_translate 'users' 'confirm-change'}}"
	},
	"delete_user" : {
		"title": "{{agile_lng_translate 'users' 'deleted-user-text'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_account" : {
		"title": "{{agile_lng_translate 'users' 'delete-account'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_free_trial" : {
		"title": "{{agile_lng_translate 'account' 'cancel-account'}}",
		"message" : "{{agile_lng_translate 'users' 'delete-account-confirm'}}"
	},
	"delete_subscription" : {
		"title": "{{agile_lng_translate 'account' 'delete-subscription'}}",
		"message" : "{{agile_lng_translate 'account' 'delete-subscription-confirm'}}"
	},
	"delete_acl_subscription" : {
		"title": "{{agile_lng_translate 'account' 'cancel-addons'}}",
		"message" : "{{agile_lng_translate 'account' 'delete-acl-subscription-confirm'}}"
	},
	"delete_campaigns_subscription" : {
		"title": "{{agile_lng_translate 'account' 'cancel-addons'}}",
		"message" : "{{agile_lng_translate 'account' 'delete-campaigns-subscription-confirm'}}"
	},
	"delete_triggers_subscription" : {
		"title": "{{agile_lng_translate 'account' 'cancel-addons'}}",
		"message" : "{{agile_lng_translate 'account' 'delete-triggers-subscription-confirm'}}"
	},
	"delete_rule" : {
		"title": "{{agile_lng_translate 'webrule' 'delete'}}",
		"message" : "{{agile_lng_translate 'webrule' 'delete-confirm'}}"
	},
	"delete_facebook_linked_page" : {
		"title": "{{agile_lng_translate 'contact-details' 'delete'}}",
		"message" : "{{agile_lng_translate 'forms' 'delete-confirm'}}"
	},
	"delete_facebook_linked_page_error" : {
		"title": "{{agile_lng_translate 'contact-details' 'error'}}",
		"message" : "{{agile_lng_translate 'forms' 'delete-ass-page'}}"
	},
	"delete_campaign_logs" : {
		"title": "{{agile_lng_translate 'campaigns' 'delete-logs'}}",
		"message" : "{{agile_lng_translate 'campaigns' 'delete-logs-confirm'}}"
	},
	"bulk_delete" : {
		"title": "{{agile_lng_translate 'bulk-delete' 'bulk-delete'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_activity" : {
		"title": "{{agile_lng_translate 'bulk-delete' 'bulk-activity'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"unlink_facebook" : {
		"title": "{{agile_lng_translate 'pages' 'unlink-fb'}}",
		"message" : "{{agile_lng_translate 'pages' 'unlink-fb-confirm'}}"
	},
	"regenerate_api_key" : {
		"title": "{{agile_lng_translate 'apikeys' 'regenerate'}}",
		"message" : "{{agile_lng_translate 'apikeys' 'regenerate-confirm'}}"
	},
	"delete_tweet" : {
		"title": "{{agile_lng_translate 'tweets' 'delete'}}",
		"message" : "{{agile_lng_translate 'tweets' 'delete-confirm'}}"
	},
	"undow_retweet_status" : {
		"title": "{{agile_lng_translate 'tweets' 'undo-retweet'}}",
		"message" : "{{agile_lng_translate 'tweets' 'undo-retweet-confirm'}}"
	},

	"activity_error" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : _agile_get_translated_val('category','name-error')
	},
	"affiliate_error" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "User not registered with affiliate program."
	},
	"user_deleted" : {
		"title": "{{agile_lng_translate 'contact-details' 'delete'}}",
		"message" : "{{agile_lng_translate 'activity_type' 'User_Deleted'}}"
	},
	"download_error" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'downloads' 'error'}}"
	},
	"number_validation" : {
		"title": GLOBAL_MODAL_MESSAGES.global_validation_title,
		"message" : "{{agile_lng_translate 'validation-msgs' 'number'}}"
	},
	"freshbook_domain_error" : {
		"title": GLOBAL_MODAL_MESSAGES.global_validation_title,
		"message" : "{{agile_lng_translate 'validation-msgs' 'domain-name-only'}}"
	},
	"companies_merge_limit" : {
		"title": "{{agile_lng_translate 'companies' 'merge'}}",
		"message" : "{{agile_lng_translate 'companies' 'merge-max'}}"
	},
	"contacts_merge_limit" : {
		"title": "{{agile_lng_translate 'contacts' 'merge'}}",
		"message" : "{{agile_lng_translate 'contacts' 'merge-max'}}"
	},
	"empty_shop" : {
		"title": GLOBAL_MODAL_MESSAGES.global_validation_title,
		"message" : "{{agile_lng_translate 'widgets' 'enter-shop'}}"
	},
	"won_milestone_delete_error" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'deals' 'milestone-change-error'}}"
	},
	"lost_milestone_delete_error" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'deals' 'lost-milestone-change-error'}}"
	},
	"multiple_conditions" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'validation-msgs' 'between-error'}}"
	},
	"add_error" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'validations' 'failed-to-add'}}"
	},
	"future_date" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'validations' 'future-date-error'}}"
	},
	"select_plan" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'billing' 'plan-select'}}"
	},
	"change_plan" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'billing' 'plan-change-select'}}"
	},
	"change_campaigns_addon" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'billing' 'campaigns-addon-change-select'}}"
	},
	"change_triggers_addon" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'billing' 'triggers-addon-change-select'}}"
	},
	"social_access" : {
		"title": "{{agile_lng_translate 'social' 'access'}}",
		"message" : "{{agile_lng_translate 'social' 'give-access'}}"
	},
	"tag_name_restriction" : {
		"title": "{{agile_lng_translate 'tags' 'validation'}}",
		"message" : "{{agile_lng_translate 'tags' 'invalid-tag'}}"
	},
	"on_call" : {
		"title": "{{agile_lng_translate 'admin-settings-tasks' 'call'}}",
		"message" : "{{agile_lng_translate 'calls' 'already-on-call'}}"
	},
	"appointment_time" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'calendar' 'select-appointment'}}"
	},
	"slot_booking" : {
		"title": "{{agile_lng_translate 'calendar' 'solt-book'}}",
		"message" : "{{agile_lng_translate 'calendar' 'solt-book-error'}}"
	},
	"webrule_popup_limit" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'webrule' 'popup-error'}}"
	},
	"duplicate_widget" : {
		"title": "{{agile_lng_translate 'widgets' 'duplicate'}}",
		"message" : "{{agile_lng_translate 'widgets' 'name-exists'}}"
	},
	"no_twilio_numbers" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'twillio' 'invalid-number'}}"
	},
	"no_verified_num" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'twillio' 'no-verified-number'}}"
	},
	"valid_details" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'twill' 'enter-valid-details'}}"
	},
	"valid_details_try_again" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'twill' 'try-valid-details'}}"
	},
	"active_connection" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'social' 'connection-active'}}"
	},
	"enter_shop_name" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'widgets' 'enter-shop'}}"
	},
	"name_not_valid" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'social' 'name-not-valid'}}"
	},
	"duplicate_workflow" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'social' 'pl-change-name'}}"
	},
	"linkedin_invalid_url" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'linkedin' 'url-invalid'}}"
	},
	"proper_amount" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'widgets' 'enter-valid-amount'}}"
	},
	"twitter_invalid_url" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "{{agile_lng_translate 'twitter' 'url-invalid'}}"
	},
	"stripe_customfield_selection_error" : {
		"title": "{{agile_lng_translate 'stripe' 'custom-field'}}",
		"message" : "{{agile_lng_translate 'stripe' 'select-custom-field'}}"
	},
	"complete_task" : {
		"title": "{{agile_lng_translate 'tasks' 'completed'}}",
		"message" : "{{agile_lng_translate 'tasks' 'confirm-delete'}}"
	},
	"sync_contacts" : {
		"title": "{{agile_lng_translate 'sync' 'all-contacts'}}",
		"message" : "{{agile_lng_translate 'sync' 'sync-all-continue'}}"
	},
	"delete_lead" : {
		"title": "{{agile_lng_translate 'leads-view' 'delete-lead'}}",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"no_nexmo_numbers" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "invalid nexmo number"
	},
};