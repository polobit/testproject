var ACLRestriction = Backbone.Router.extend({
	routes : {

		/* Deals/Opportunity */
		"not-allowed" : "notAllowed",
		},	
		notAllowed : function(obj){
			$('#content').html(getTemplate("not-allowed", obj));
		}
});