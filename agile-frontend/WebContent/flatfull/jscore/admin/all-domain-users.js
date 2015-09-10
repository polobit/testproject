
function initializeDomainsearchListner(el){
	
	$("#domain-search-listners").on("click", '#domain-search-results2', function(e) {
		e.preventDefault(e);
		
		var email = $('#domainSearchText2').val();
		console.log(" in all -domain users.js "+email);
		$("#domainSearchText").val(email);
		
			Backbone.history.navigate("getDomainUserDetails/"+email , {
                trigger: true
            });
	
	});
	
	
	$( "#domainSearchForm" ).submit(function( e ) 	{
		e.preventDefault(e);
		
		var email = $('#domainSearchText').val();
		console.log(" in all -domain users.js "+email);
		
			Backbone.history.navigate("getDomainUserDetails/"+email , {
                trigger: true
            });
	
	});

}


function initializeAdminpanelListner(el){
// takes searchbox value and navigate this to router
	
	
	// deltes user from domain from admin panel
	$("#admin-panel-listners").on("click", '.delete_user', function(e) {
		
		e.preventDefault();
		if (!confirm("Are you sure you want to delete ?" ))
			return;
		var id = $(this).closest('a').attr("data");
		$.ajax({
			url: '/core/api/admin_panel/deleteuser?id='+id, 
			type : 'DELETE',
			success : function(data)
			{
				add_delete_user_info_as_note_to_owner(email);
				alert("user deleted" );
				location.reload(true);
					           
			},
			error : function(response)
			{
				alert("error in deletion ");
			} });
		
	});
	
	// navigates to domain details from all domain users
	$("#admin-panel-listners").on("click", '#all-domain-users-model-list > tr', function(e) 
			{
				e.preventDefault();

				// Reads the id
				var domainname = $(this).find('.data').attr('data');

				Backbone.history.navigate("getDomainUserDetails/"+domainname , {
	                trigger: true
	            });
				// App_Subscription.invoiceDetails(data);
			});
		/**
		 * If user clicks on delete, delete request is sent to
		 * "core/api/admin/delete/namespace"
		 */
	$("#admin-panel-listners").on("click", '.delete-namespace', function(e) {
			
					e.preventDefault();
					
				
					var namespace = $(this).closest('a').attr("data");
					
					if(namespace != "")
					{
							if (!confirm("Are you sure you want to delete ?" ))
								return;
							
							// Show loading in content
							$("#content").html(getRandomLoadingImg());
							/**
							 * Sends delete request to delete namespace
							 */
							$.ajax({
								type : "DELETE",
								url : "core/api/admin_panel/deletedomain/" + namespace,
								success : function(data)
								{
									alert("account deleted");
									Backbone.history.navigate("all-domain-users", { trigger : true });
								}
							});
						
					
				   }
		});
	$("#admin-panel-listners").on("click", '.refundpopup', function(e) {
			e.preventDefault();
			
			var chargeid = $(this).attr("chargeid");
			var totalamount = $(this).attr("totalamount");
			var refundedAmount = $(this).attr("refundedAmount");
			$("#errormsg").html("");
			$("#amount").val(totalamount - refundedAmount);
			$("#hchargeid").val(chargeid);
			$("#totamount").val(totalamount);
			$("#partialrefund").button('reset');
			$("#refundModal").modal("show");
	        
	    });



		$("#partial-refund-footer").off('click').on("click", '#partialrefund', function(e) { 
			
			e.preventDefault();
			if (!isValidForm($("#admin-partial-refund")))
			{
			    return;
			}
			$(this).button('loading');
			var amount = $("#amount").val();
			var totalamount = $(".totamount").val();
			var chargeid=$("#hchargeid").val();
			if(parseFloat(amount) <= 0)
			{
				
				$("#errormsg").html("Amount should be > 0").show().delay(1500).hide(1);
				$("#partialrefund").button('reset');
				return;
			}
			
			if(parseFloat(amount)>parseFloat(totalamount))
			{
				$("#errormsg").html("Amount Should not exceed "+totalamount).show().delay(1500).hide(1);
				$("#partialrefund").button('reset');
				return;
			}
			
			amount = 100*amount;
			amount = parseInt(amount.toPrecision(12));	
			$.ajax({
				url: '/core/api/admin_panel/applypartialrefund?chargeid='+chargeid+'&amount='+amount, 
				type : 'GET',
				success : function(data)
				{	
					alert("successfully applied for refund");
					location.reload(true);
				},
				error : function(response)
				{
					$("#partialrefund").button('reset');
					showNotyPopUp("information", "error occured please try again", "top");
				}
			});
		
		});
		
		
		$("#admin-panel-listners").on("click", '#delete_userplan', function(e) { 
			e.preventDefault();
			if (!confirm("Are you sure you want to cancel this subscription ?" ))
				return;
			var sub_id = $("#delete_userplan").attr("sub_id");
			var cus_id = $("#delete_userplan").attr("cus_id");
			$.ajax({url : 'core/api/admin_panel/deletesubscription?subscription_id='+sub_id+'&cus_id='+cus_id,
				type : 'DELETE',
				
				success: function()
			{
				add_cancel_subscription_info_as_note_to_owner(email);
				location.reload(true);
			},error : function(response)
			{

				console.log(response);
			}
			
		});
		});
		$("#admin-panel-listners").on("click", '#delete_emailplan', function(e) { 
			e.preventDefault();
			if (!confirm("Are you sure you want to cancel this subscription ?" ))
				return;
			var sub_id = $("#delete_emailplan").attr("sub_id");
			var cus_id = $("#delete_emailplan").attr("cus_id");
			$.ajax({url : 'core/api/admin_panel/deletesubscription?subscription_id='+sub_id+'&cus_id='+cus_id,
				type : 'DELETE',
				
				success: function()
			{
					add_cancel_subscription_info_as_note_to_owner(email);
					location.reload(true);
			},error : function(response)
			{

				console.log(response);
			}
			
		});
			
		});
		
		$("#admin-panel-listners").on("click", '#unpause_mandrill', function(e)
		{
			e.preventDefault();
			if (!confirm("Are you sure you want to UnPause Mandrill?" ))
				return;
			var domain = $(this).attr('domain');
			$.ajax({
				url : 'core/api/admin_panel/resumeMandrill?domain='+domain,
				type : 'PUT',
				success : function(){
					location.reload(true);
				},
				error : function(response){
					console.log(response);
					showNotyPopUp("information", "Error occured please try again", "top");
				}
			});
		});
}
