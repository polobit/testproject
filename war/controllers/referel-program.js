var ReferelRouter = Backbone.Router.extend({

	routes : {

	"referels":"referrelprogram"

	},

	referrelprogram:  function() {
		
	    referelsview = new Base_Collection_View({
	     url : '/core/api/users/getreferedbyme?referenceid='+CURRENT_DOMAIN_REFERENCE_CODE,
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
