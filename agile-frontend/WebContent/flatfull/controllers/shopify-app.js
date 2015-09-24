var ShopifyRouter = Backbone.Router.extend({
	routes: {
		"shopify/:shopurl" : "shopify","shopify":"shopify"
	},
	shopify: function(shopurl){
		var t_url = "core/shopifyapp?shop=" + shopurl;
		var response = {}; response["shopurl"] = shopurl;
		
		$.ajax({
			type : "GET",
			url : t_url,
			success: function(data){
				if(data){
					response["installed"] = true;

					getTemplate("shopifyboxes", response, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('#content').html($(template_ui));	
					}, "#content");

					return;
				}
				else{
					$.ajax({
						type : "POST",
						url : t_url,
						success: function(data){
							response["installed"] = false;
							getTemplate("shopifyboxes", response, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$('#content').html($(template_ui));	
							}, "#content");

							return;
						}
					});
				}
			}
		});
		
	}
});