$('#revoke-shopify').die().live('click', function(e)
{
				if (confirm("Are you sure to delete Shopify?"))
				{
								delete_widget("Shopify");
								window.location.href = window.location.origin + "/#Shopify";
				}
				return false;
});

$("#widget_shopify").die().live('click', function(e)
{
				var shopName = $('#shop').val();
				if (shopName == "")
				{
								alert("Enter Shop name");
								$('#shop').focus();
								return false;
				}
				var domain = window.location.origin;

				e.preventDefault();
				window.location = "/scribe?service_type=shopify&type=widget&shop=" + shopName + "&domain=" + domain + "";

});
