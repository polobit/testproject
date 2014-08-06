$(function()
{
	$("#import_shopify").die().live('click', function(e)
			{
				var shopName = $('#shop').val();
				var domain = window.location.origin;
		      
				e.preventDefault();
				window.location = "/scribe?service_type=shopify&shop="+shopName+"&domain="+domain+"";
				
			})
			
			
			$('#change-shop').die().live('click',function(e){
				e.preventDefault();
				alert("Are you sure?");
				$.ajax({
					url:'/core/api/shopify/delete',
					success:function(){
						window.location.reload();
					},
					error:function(){
						window.location.reload();
					}
					
				});
			})

});