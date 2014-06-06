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
$(function()
{
	ACCOUNT_DELETE_REASON_JSON = undefined;
	/**
	 * If user clicks on confirm delete the modal is hidden and
	 * delete request is sent to "core/api/delete/account"
	 */
	$("#confirm-delete-account").die().live('click',
			function(e)
			{
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
							window.location.href = window.location.href
									.split('#')[0]
									+ 'login';
						})
						
						
					}
				});
			});
	

	$("#cancel-account").die().live('click',
			function(e)
			{
				e.preventDefault();

				
				$("#warning-deletion-feedback").remove();
				// Shows account stats warning template with stats(data used)
				var el = getTemplate('warning-feedback', {});

				// Appends to content, warning is modal can call show if
				// appended in content
				$('#content').append(el);

				// Shows warning modal
				$("#warning-deletion-feedback").modal('show');

				// Undefines delete reason, if use chose not to delete account in delete process
				$("#warning-deletion-feedback").on('hidden', function(){
					ACCOUNT_DELETE_REASON_JSON = undefined;
				});
				

				
				
				
				$("#warning-feedback-save").die().live('click', function(e){
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
					if(ACCOUNT_STATS)
						delete_step1_el = $(getTemplate('warning', ACCOUNT_STATS));
					else
						{
							set_up_account_stats(el, function(data){
								delete_step1_el = $(getTemplate('warning', data));
								$(".modal-body").css("padding", 0 ).html($(".modal-body", $(delete_step1_el)));
								$(".modal-footer").html($(".modal-footer", $(delete_step1_el)).html());
							})
							return;
						}
						 
					$(".modal-body").css("padding", 0 ).html($(".modal-body", $(delete_step1_el)));
					$(".modal-footer").html($(".modal-footer", $(delete_step1_el)).html());
					
				});
				
			})
});