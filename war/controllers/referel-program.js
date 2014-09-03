var ReferelRouter = Backbone.Router.extend({

	routes : {

	"referels":"referrelprogram"

	},

	referrelprogram:  function() {
		CURRENT_DOMAIN_REFERENCE_CODE="cef20eb0-23b0-44be-9b06-431cfe3cd9e0";
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
