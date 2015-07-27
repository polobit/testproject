$('body').on('click', '#revoke-shopify', function(e)
{
				if (confirm("Are you sure to delete Shopify?"))
				{
								delete_widget("Shopify");
								window.location.href = window.location.origin + "/#Shopify";
				}
				return false;
});

$('body').on('click', '#widget_shopify', function(e)
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
				window.location = "/scribe?service_type=shopify&url=shopify&shop=" + shopName + "&domain=" + domain + "";

});

