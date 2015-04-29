$(function()
{
// takes searchbox value and navigate this to router
	$( "#domainSearchForm" ).submit(function( e ) 	{
		e.preventDefault(e);
		
		var email = $('#domainSearchText').val();
		console.log(" in all -domain users.js "+email);
		
			Backbone.history.navigate("getDomainUserDetails/"+email , {
                trigger: true
            });
	
	});
	
	// deltes user from domain from admin panel
	
$(".delete_user").die().live('click', function(e){
		
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
	
	$("#all-domain-users-model-list > tr").live('click', function(e)
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
		$(".delete-namespace").die().live('click', function(e){
			
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
		$(".refundpopup").live('click',function(e){
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



		$("#partialrefund").die().live('click', function(e){
			
			e.preventDefault();
			if (!isValidForm($("#CCform")))
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
		
		$(".refund").die().live('click', function(e){
	
			e.preventDefault();
			if (!confirm("Are you sure you want to apply for refund ?" ))
				return;
			var chargeid=$(this).attr("data");

			$.ajax({
				url: '/core/api/admin_panel/applyrefund?chargeid='+chargeid, 
				type : 'GET',
				success : function(data)
				{
					var amount = data.refunds.data[0].amount/100;
					add_refunded_info_as_note_to_owner(email,amount);
					alert("successfully applied for refund");
					location.reload(true);
				},
				error : function(response)
				{
					showNotyPopUp("information", "error occured please try again", "top");
				} });
			
		});
		$("#delete_userplan").die().live('click',function(e) {
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
		$("#delete_emailplan").die().live('click',function(e) {
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
		
		$('#unpause_mandrill').die().live('click',function(e) 
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
});
