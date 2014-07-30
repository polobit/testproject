$(function()
{
	//$("#domain-search-results").live('click', function(e)
	$( "#domainSearchForm" ).submit(function( e ) 	{
		e.preventDefault(e);
		
		var email = $('#domainSearchText').val();
		console.log(" in all -domain users.js "+email);
		
			Backbone.history.navigate("getDomainUserDetails/"+email , {
                trigger: true
            });
	
	});
	
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
			
			},
			error : function(response)
			{
				alert("error in deletion ");
			} });
		
	});
	
	
	
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