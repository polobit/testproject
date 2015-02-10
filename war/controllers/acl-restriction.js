var ACLRestriction = Backbone.Router.extend({
	routes : {

		/* Deals/Opportunity */
		"not-allowed" : "notAllowed",
		},	
		notAllowed : function(){
			$('#content').html(getTemplate("not-allowed", {}));
		}
});