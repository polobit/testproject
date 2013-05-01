$(function()
{
		/**
		 * If user clicks on delete,
		 * delete request is sent to "core/api/admin/delete/namespace"
		 */
		$(".delete-namespace").die().live('click', function(e){
			
					e.preventDefault();
					var namespace = $(this).closest('a').attr("data");
					if(namespace != "")
					{
						// Shows account stats warning template with stats(data used)
						/**
						 * Getting namespace stats for this domain
						 */
						var account_stats = new Base_Model_View({
							url : "core/api/users/admin/namespace-stats/" + namespace,
							template : "warning",
						});
						
						// Appends to content, warning is modal can call show if
						// appended in content
						$('#content').append(account_stats.render(true).el);

						// Shows warning modal
						$("#warning-deletion").modal('show');

						/**
						 * If user clicks on confirm delete the modal is hidden and
						 * delete request is sent to "core/api/admin/delete/namespace"
						 */
						$("#confirm-delete-account").click(function(e){
							
								e.preventDefault();
		
								// Hides modal
								$("#warning-deletion").modal('hide');
		
								// Show loading in content
								$("#content").html(LOADING_HTML);
								/**
								 * Sends delete request to delete namespace 
								 */
								$.ajax({
									type : "DELETE",
									url : "core/api/users/admin/delete/" + namespace,
									success : function()
									{
										console.log("Deleted namespace: "+ namespace);
									}
								});
					     });
				   }
		});
});