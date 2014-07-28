$(function()
{
	$("#import_shopify").die().live('click', function(e)
			{
				var shopName = $('#shopeName').val();
				var domain = window.location.origin;
		      
				e.preventDefault();
				window.location = "/scribe?service_type=shopify&shop="+shopName+"&domain="+domain+"";
				
			})

});