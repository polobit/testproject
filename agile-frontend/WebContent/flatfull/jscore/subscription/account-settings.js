/**
 * account-setting.js is a script file to deal with account deletion, shows data
 * used by account and number of entities saved
 * 
 * @module Billing author: Yaswanth
 */

// Global variable to store statistics, to show details in confirmation of
// account delete
var ACCOUNT_STATS;

/**
 * Fetches account statistics for the current Namespace from
 * "core/api/namespace-stats", called when manage subscription details is loaded
 * 
 * @method setUpAccountStats
 * @param html
 *            element to show stats
 * @author Yaswanth
 */
function set_up_account_stats(el, callback)
{

	/**
	 * Creates base model for namespace stats, template is
	 * account-stats-template
	 */
	var account_stats = new Base_Model_View({
		url : "core/api/namespace-stats",
		template : "account-stats",
		postRenderCallback: function(el) {
			
			ACCOUNT_STATS = account_stats.model.toJSON();
			
			if (callback && typeof (callback) === "function")
			{
				callback(ACCOUNT_STATS);
			}
		}
	});

	// Shows account statistics in subscription page
	$('#account-stats', el).html(account_stats.render(true).el);

}


/**
 * Handles events on delete account at stats and confirmation, sends delete
 * request on confirmation
 */
$(function(){

/**
	 * If user clicks on confirm delete the modal is hidden and
	 * delete request is sent to "core/api/delete/account"
	 */
	$("#warning-deletion-feedback #confirm-delete-account").off("click");
	$('#warning-deletion-feedback').on('click', '#confirm-delete-account', function(e) {
		
			e.preventDefault();

			// Hides modal
			$(".modal-body").html(getRandomLoadingImg());

			/**
			 * Sends delete request to delete account , on
			 * success send to login
			 */
			$.ajax({
				type : "DELETE",
				url : "core/api/delete/account",
				success : function()
				{
					add_account_canceled_info(ACCOUNT_DELETE_REASON_JSON, function(data){
						
						$("#warning-deletion-feedback").modal('hide');	

						// Show loading in content
						$("#content").html(getRandomLoadingImg());
						// Navigate to login page after delete
						window.location.href = window.location.href .split('#')[0] + 'login';
					})
					
				}
			});
	});
	
	// Cancellation for free users
	$("#content #cancel-account").off("click");
	$('#content').on('click', '#cancel-account', function(e) {
			e.preventDefault();		

			// Shows account stats warning template with stats(data used)
			$("#warning-deletion-feedback").html(getTemplate('warning-feedback', {})).modal('show');	
			
			
	});
	
	// Cancellation for paid users
	$("#content #cancel-account-request").off("click");
	$('#content').on('click', '#cancel-account-request', function(e) {
			e.preventDefault();
			load_clickdesk_code();
			
			// Shows cancellation modal
			//$("#send-cancellation").html(getTemplate('send-cancellation-request', {})).modal('show');	
			$("#send-cancellation").html(getTemplate('cancel-subscription-request', {})).modal('show');	
			
	});

	$("#send-cancellation #cancel-account-request-proceed").off("click");
	$('#send-cancellation').on('click', '#cancel-account-request-proceed', function(e) {
			e.preventDefault();
			
			// Shows cancellation modal
			//$("#send-cancellation").html(getTemplate('send-cancellation-request', {})).modal('show');	
			getTemplate("send-cancellation-request",{} , undefined, function(template_ui){
				if(!template_ui)
					  return;
				$("#send-cancellation .modal-dialog").html($(template_ui));
			}, null);
			
	});

	$("#send-cancellation #account_cancel_chat_btn").off("click");
	$('#send-cancellation').on('click', '#account_cancel_chat_btn', function(e) {
			e.preventDefault();
			$(this).closest(".modal").modal("hide");
			CLICKDESK_LIVECHAT.show();
	});

	$("#send-cancellation #account_cancel_support_btn").off("click");
	$('#send-cancellation').on('click', '#account_cancel_support_btn', function(e) {
			e.preventDefault();
			
			$(this).closest(".modal").modal("hide");
	});

	$("#send-cancellation #account_pause_btn").off("click");
	$('#send-cancellation').on('click', '#account_pause_btn', function(e) {
		e.preventDefault();
		var period = $("#pause_count").html();
		$.ajax({
				url : 'core/api/subscription/pauseOrResumeSubscriptions?period='+period,
				type : 'POST',
				success : function(){
					location.reload(true);
				},
				error : function(response){
					showNotyPopUp("warning", response.responseText, "top");
				}
			});
			
	});

	$("#send-cancellation #add").off("click");
	$('#send-cancellation').on('click', '#add', function(e) {
			e.preventDefault();
			var value = $("#pause_count").html();
			if(value < 6)
				value++;
			$("#pause_count").html(value);
			if(value > 1)
				$("#send-cancellation #month_id").html("months");
	});
	$("#send-cancellation #minus").off("click");
	$('#send-cancellation').on('click', '#minus', function(e) {
			e.preventDefault();
			var value = $("#pause_count").html();
			if(value > 1)
				value--;
			$("#send-cancellation #pause_count").html(value);
			if(value == 1)
				$("#send-cancellation #month_id").html("month");
			
	});
	$('body').on('click', '#account_resume', function(e) {
		e.preventDefault();
		$.ajax({
			url : 'core/api/subscription/pauseOrResumeSubscriptions?period=0',
			type : 'POST',
			success : function(){
				showNotyPopUp("information", "Thank you, Your account will be Resume soon.", "top");
			},
			error : function(response){
				showNotyPopUp("warning", response.responseText, "top");
			}
		});
	});

});
	

$('#send-cancellation').on('click', '#send-delete-request', function(e) {

		e.preventDefault();

		if($(this).attr('disabled'))
	   	     return;
		
		// If not a valid form return else serialize form data to parse
		if(!isValidForm($("#cancelation-request-form")))
			return;
		
		// Disables send button and change text to Sending...
		disable_send_button($(this));
		
		var json = serializeForm("cancelation-request-form");
		
		var info = json.account_cancel_reason;
		
		// Replace \r\n with <br> tags as email is sent as text/html
		var reason = info.replace(/\r\n/g,"<br/>");
		
		// Build url
		var url =  'core/api/emails/send-email?from=' + encodeURIComponent(CURRENT_DOMAIN_USER.email) + '&to=' + 
		encodeURIComponent("care@agilecrm.com") + '&subject=' + encodeURIComponent("Cancellation Request") + '&body=' + 
		encodeURIComponent(reason);

		$.post(url,function(){

			// Reset form fields after sending email
			$("#cancelation-request-form").each(function () {
				this.reset();
			});
			
			// Adds "Cancellation Request" tag in "Our" domain
			add_tag_our_domain("Cancellation Request");
			
			// Adds note in "Our" domain
			var note = {};
			note.subject = "Cancellation Request";
			note.description = info;
			
			agile_addNote(note,'', CURRENT_DOMAIN_USER.email);
								
			$("#send-cancellation .modal-title").html($("#send-delete-request-step2 .modal-title").html());		    
		    $("#send-cancellation .modal-body").html($("#send-delete-request-step2 .modal-body").html());
			$("#send-cancellation .modal-footer").html($("#send-delete-request-step2 .modal-footer").html());
			
			// Enables Send Email button.
			enable_send_button($('#send-delete-request'));
			$("#send-cancellation").modal("hide");
		});
		
	});

$('#warning-deletion-feedback').on('click', '#warning-feedback-save', function(e) {
		e.preventDefault();
		
		var form = $("#cancelation-feedback-form");
		
		if(!isValidForm(form))
		{
			return;
		}
		
		var input =  $("input[name=cancellation_reason]:checked");
	
		ACCOUNT_DELETE_REASON_JSON = {};
		ACCOUNT_DELETE_REASON_JSON["reason"] = $(input).val();
		ACCOUNT_DELETE_REASON_JSON["reason_info"] = $("#account_delete_reason").val();
		$(".modal-body").html(getRandomLoadingImg());
		var delete_step1_el = "";
		if(ACCOUNT_STATS){
			getTemplate('warning', ACCOUNT_STATS, undefined, function(template_ui){
		 		if(!template_ui)
		    		return;
		    	delete_step1_el = $(template_ui);
				
			}, null);

		}
		else
			{
				set_up_account_stats($('#warning-deletion-feedback'), function(data){
					getTemplate('warning', data, undefined, function(template_ui){
				 		if(!template_ui)
				    		return;
				    	delete_step1_el = $(template_ui);
						$(".modal-body").css("padding", 0 ).html($(".modal-body", $(delete_step1_el)));
						$(".modal-footer").html($(".modal-footer", $(delete_step1_el)).html());
					}, null);
						
				})
				return;
			}
			 
		$(".modal-body").css("padding", 0 ).html($(".modal-body", $(delete_step1_el)));
		$(".modal-footer").html($(".modal-footer", $(delete_step1_el)).html());
		
	});

// Undefines delete reason, if use chose not to delete account in delete process
$("#warning-deletion-feedback").on('hidden.bs.modal', function(){
	ACCOUNT_DELETE_REASON_JSON = undefined;
});
				
