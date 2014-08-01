$(function()
{
//takes searchbox value and navigate this to router
	$( "#domainSearchForm" ).submit(function( e ) 	{
		e.preventDefault(e);
		
		var email = $('#domainSearchText').val();
		console.log(" in all -domain users.js "+email);
		
			Backbone.history.navigate("getDomainUserDetails/"+email , {
                trigger: true
            });
	
	});
	
	//deltes user from domain from admin panel
	
$(".delete_user").die().live('click', function(e){
		
		e.preventDefault();
		if (!confirm("Are you sure you want to delete ?" ))
			return;
		var id = $(this).closest('a').attr("data");
		

		$.ajax({
			url: '/core/api/users/admin/domain/adminpanel/'+id, 
			type : 'DELETE',
			success : function(data)
			{
				alert("user deleted" );
				Backbone.history.navigate("all-domain-users" , {
	                trigger: true
	            });
			},
			error : function(response)
			{
				alert("error in deletion ");
			} });
		
	});
	
	//navigates to domain details from all domain users
	
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
		 * If user clicks on delete,
		 * delete request is sent to "core/api/admin/delete/namespace"
		 */
		$(".delete-namespace").die().live('click', function(e){
			
					e.preventDefault();
					
				
					var namespace = $(this).closest('a').attr("data");
					alert(namespace);
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
								url : "core/api/users/admin/delete/" + namespace,
								success : function()
								{alert("account deleted");
									location.reload(true);
								}
							});
						
					
				   }
		});
});