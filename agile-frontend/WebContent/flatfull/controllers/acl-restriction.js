var ACLRestriction = Backbone.Router.extend({
	routes : {

		/* Deals/Opportunity */
		"not-allowed" : "notAllowed",
		},	
		notAllowed : function(obj){

			getTemplate('not-allowed', obj, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	

				if(obj.ERR_CONTAINER)
			 		$(obj.ERR_CONTAINER).html($(template_ui));

			}, "#content");

		}
});