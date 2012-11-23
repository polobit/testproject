// Global variable to store statistics
var ACCOUNT_STATS;

// Show data being used by account
function setUpAccountStats(el)
{
	 var account_stats = new Base_Model_View({
		 url: "core/api/namespace-stats",
		 template: "account-stats",
	 });
	 
	 $('#account-stats', el).html(account_stats.render().el);
	 
	 account_stats.model.fetch({success: function(data){
		 
		 ACCOUNT_STATS = data.toJSON();
	 }})
}


// Confirmation
$(function(){
	$("#cancel-account").live('click', function(e){
		e.preventDefault();
		
		var el = getTemplate('warning', ACCOUNT_STATS);

		$('#content').append(el);
		
		$("#warning-deletion").modal('show');
		
		var that = this;
		
		$("#confirm-delete-account").live('click',function(e){
			e.preventDefault();
			
			$("#warning-deletion").modal('hide');
			
			$("#content").html(LOADING_HTML);
			
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
