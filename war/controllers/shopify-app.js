var ShopifyRouter = Backbone.Router.extend({
	routes: {
		"shopify/:shopurl" : "shopify"
	},
	shopify: function(shopurl){
		var post_url = "core/shopifyapp?shop=" + shopurl; 
		console.log(post_url);
		$.ajax({
			type : "POST",
			url : post_url
		});
	}
});