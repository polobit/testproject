$(function()
{
		/**
		 * If user clicks on delete,
		 * delete request is sent to "core/api/admin/delete/namespace"
		 */
		$(".delete-namespace").die().live('click',
				function(e)
				{
					e.preventDefault();
					var namespace = $(this).closest('a').attr("data");
					
					if(namespace != "")
					{
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
					}
		});
});