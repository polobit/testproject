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

$(function()
{
				var plugin_name = "Shopify";
				Shopify_PROFILE_LOAD_IMAGE = '<center><img id="stripe_profile_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';
				var shopify_widget = agile_crm_get_widget(plugin_name);
				console.log("In shopify widget");
				console.log(shopify_widget);
				var shopify_plugin_id = shopify_widget.id;
});
