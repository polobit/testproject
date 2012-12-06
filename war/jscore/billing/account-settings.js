/**
 * account-setting.js is a script file to deal with account deletion and shown 
 * client side.
 * 
 * @module Billing
 * 
 * author: Yaswanth
 */

// Global variable to store statistics
var ACCOUNT_STATS;

/**
 * Fetches stats for the current namespace from "core/api/namespace-stats", 
 * called when manage subscription details is loaded
 * @method setUpAccountStats
 * @param html element to show stats
 * @author Yaswanth
 */
function setUpAccountStats(el)
{
	// Creates base model for namespace stats, template is account-stats-template
	 var account_stats = new Base_Model_View({
		 url: "core/api/namespace-stats",
		 template: "account-stats",
	 });
	 
	 // Show Fetched data
	 $('#account-stats', el).html(account_stats.render().el);
	 
	 
	 account_stats.model.fetch({success: function(data){
		 
		 ACCOUNT_STATS = data.toJSON();
	 }})
}


/**
 * Handles events on delete account at stats and confirmation, sends delete request on confirmation
 */
$(function(){
	$("#cancel-account").live('click', function(e){
		e.preventDefault();
		
		// Shows account stats warning template with stats(data used)
		var el = getTemplate('warning', ACCOUNT_STATS);

		// Appends to content, as warning is modal can call show if appended in content
		$('#content').append(el);
		
		// Show warning modal with data
		$("#warning-deletion").modal('show');

		// Event on confirmation warning modal
		$("#confirm-delete-account").live('click',function(e){
			e.preventDefault();
			
			// Hides modal
			$("#warning-deletion").modal('hide');
			
			// Show loading in content
			$("#content").html(LOADING_HTML);
			
			// Sends delete request to delete account , on success send to login 
			$.ajax({
				  type: "DELETE",
				  url: "core/api/delete/account",
				  success: function(){
					  
					  // Navigate to login page after delete
					  window.location.href = window.location.href.split('#')[0]+'login';
				  }
				});
		});
	})
});
