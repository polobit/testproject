/*JSON object for alert type modals and confirm modals*/
var GLOBAL_MODAL_MESSAGES = {
	"global_delete": "Are you sure you want to delete?",
	"global_error_title" : "Error",
	"global_validation_title" : "Validation",
	"global_error_message" : "Error occured. Please try again"
}
var MODAL_MESSAGES = {


	"delete" : {
		"title": "Delete",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"error" : {
		"title": "Error",
		"message" : "Error occured. Please Reload the page."
	},
	"retry" : {
		"title": "Error",
		"message" : GLOBAL_MODAL_MESSAGES.global_error_message
	},
	"delete_task" : {
		"title": "Delete Task",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_contact" : {
		"title": "Delete Contact",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_company" : {
		"title": "Delete Company",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_event" : {
		"title": "Delete Event",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_opportunity" : {
		"title": "Delete Deal",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_custom_field" : {
		"title": "Delete Custom field",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_milestone" : {
		"title": "Delete Milestone",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_stream" : {
		"title": "Delete Stream",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_calendar_prefs" : {
		"title": "Delete Calendar Preferences",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_lost_reason" : {
		"title": "Delete Loss Reason",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_deal_source" : {
		"title": "Delete Deal Source",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"event_drop" : {
		"title": "Update Event",
		"message" : "Are you sure about this change?"
	},
	"delete_user" : {
		"title": "Delete User",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_account" : {
		"title": "Delete Account",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_free_trial" : {
		"title": "Cancel Free Trial",
		"message" : "Are you sure you want to cancel your free trial?"
	},
	"delete_subscription" : {
		"title": "Delete Subscription",
		"message" : "Are you sure you want to cancel this subscription ?"
	},
	"delete_rule" : {
		"title": "Delete Rule",
		"message" : "Are you sure to delete a rule?"
	},
	"delete_facebook_linked_page" : {
		"title": "Delete",
		"message" : "Are you sure you want to delete this Form from your Facebook page?"
	},
	"delete_facebook_linked_page_error" : {
		"title": "Error",
		"message" : "To delete the Form from Page, Link your Facebook account which is associated to the Page."
	},
	"delete_campaign_logs" : {
		"title": "Delete Campaign logs",
		"message" : "Are you sure you want to delete all logs?"
	},
	"bulk_delete" : {
		"title": "Bulk Delete",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"delete_activity" : {
		"title": "Delete Activity",
		"message" : GLOBAL_MODAL_MESSAGES.global_delete
	},
	"unlink_facebook" : {
		"title": "Unlink Facebook",
		"message" : "Are you sure you want to unlink your Facebook account ?"
	},
	"regenerate_api_key" : {
		"title": "Regenerate API key",
		"message" : "Resetting the API Key will break all existing integrations you may have setup using the current key. Are you sure you want to reset the API key?"
	},
	"delete_tweet" : {
		"title": "Delete Tweet",
		"message" : "Are you sure you want to delete this tweet?"
	},
	"undow_retweet_status" : {
		"title": "Undow Retweet status",
		"message" : "Are you sure you want to undo retweet this status?"
	},

	"activity_error" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "Category name should start with an alphabet and can not contain special characters other than underscore, space and hyphen"
	},
	"user_deleted" : {
		"title": "Delete",
		"message" : "User Deleted"
	},
	"download_error" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "Error downloading a file!"
	},
	"number_validation" : {
		"title": GLOBAL_MODAL_MESSAGES.global_validation_title,
		"message" : "Please enter a valid number."
	},
	"freshbook_domain_error" : {
		"title": GLOBAL_MODAL_MESSAGES.global_validation_title,
		"message" : "Please Enter Domain Name only"
	},
	"companies_merge_limit" : {
		"title": "Merge Companies",
		"message" : "Maximum of 2 companies can be merged at a time."
	},
	"contacts_merge_limit" : {
		"title": "Merge Contacts",
		"message" : "You can merge maximum of 2 records at a time with master record."
	},
	"empty_shop" : {
		"title": GLOBAL_MODAL_MESSAGES.global_validation_title,
		"message" : "Enter Shop name"
	},
	"won_milestone_delete_error" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "'Won' milestone cannot be changed now as the track already has deals."
	},
	"lost_milestone_delete_error" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "'Lost' milestone cannot be changed now as the track already has deals."
	},
	"multiple_conditions" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "Sorry. You can't have multiple 'Between' conditions."
	},
	"add_error" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "Failed to add."
	},
	"future_date" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "Please select Date/Time in future."
	},
	"select_plan" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "Please select a plan to proceed"
	},
	"change_plan" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "Please change your plan to proceed"
	},
	"social_access" : {
		"title": "Social Access",
		"message" : "You have to give access to your social account."
	},
	"tag_name_restriction" : {
		"title": "Tag Validation",
		"message" : "Tag name should start with an alphabet and cannot contain special characters other than underscore and space."
	},
	"on_call" : {
		"title": "Call",
		"message" : "Already on call."
	},
	"appointment_time" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "Please select appointment time."
	},
	"slot_booking" : {
		"title": "Slot Booking",
		"message" : "Looks like this slot is booked already. Please try another one."
	},
	"webrule_popup_limit" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "Only one popup is allowed per webrule. You have already set a popup action for this webrule."
	},
	"duplicate_widget" : {
		"title": "Duplicate Widget",
		"message" : "A widget with this name exists already. Please choose a different name"
	},
	"no_twilio_numbers" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "You have no twilio numbers. Please buy or port a number in your Twilio account."
	},
	"no_verified_num" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "You have no verified numbers. Please verify number in your Twilio account."
	},
	"valid_details" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "Please enter valid details."
	},
	"valid_details_try_again" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "Please try again with valid details."
	},
	"active_connection" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "A connection is currently active."
	},
	"enter_shop_name" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "Enter Shop name"
	},
	"name_not_valid" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "Name not valid"
	},
	"duplicate_workflow" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "Please change the name and click on 'Create a Copy' again."
	},
	"linkedin_invalid_url" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "URL provided for linkedin is not valid"
	},
	"proper_amount" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "Please enter proper amount"
	},
	"twitter_invalid_url" : {
		"title": GLOBAL_MODAL_MESSAGES.global_error_title,
		"message" : "URL provided for Twitter is not valid"
	},
	"stripe_customfield_selection_error" : {
		"title": "Stripe Custom Fields",
		"message" : "Please select one custom field to save the Stripe ID."
	}
};