var ReferelRouter = Backbone.Router.extend({

	routes : {

	"referrals":"referrelprogram"

	},

	referrelprogram:  function() {
		
	    referelsview = new Base_Collection_View({
	     url : '/core/api/users/getreferedbyme?reference_domain='+CURRENT_DOMAIN_USER.domain,
	     templateKey : "referrals",
	     individual_tag_name : 'tr',
	     postRenderCallback : function(el) {
	    	
	     }
	    });
	    
	    referelsview.collection.fetch();
	    console.log(referelsview.collection.fetch());
	    
	    $('#content').html(referelsview.render().el);
	}
});
