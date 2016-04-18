/**
 * Ticket Router with callbacks
 */
var HelpcenterRouter = Backbone.Router.extend({
	routes: {

		/* Home routes */
		"" : "categories",
		"categories":"categories",

		"sections" : "sections"
	},
	categories: function(){

		getTemplate("home", {}, undefined, function(template_ui){

	 		if(!template_ui)
	 			return;

	 		$('#content').html($(template_ui));

	 		//hideTransitionBar();
	 	});

		console.log('Hi....')
	}	
});