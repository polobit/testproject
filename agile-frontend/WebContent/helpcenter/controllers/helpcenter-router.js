/**
 * Ticket Router with callbacks
 */
var HelpcenterRouter = Backbone.Router.extend({
	routes: {

		/* Home routes */
		"" : "categories",
		"categories":"categories",
        "category-add":"categoryAdd",
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
	},

	categoryAdd: function(){

		getTemplate("add-catogery", {}, undefined, function(template_ui){

				    if(!template_ui)
		 				return;

	 				$('#content').html($(template_ui));

				    var addCatogeryView = new Base_Model_View({
		 				isNew : true, 
		 				url : '/core/api/knowledgebase/categorie',
		 				template : "add-catogery",
		 				window : "categories",
		                saveCallback : function(){
	 				},

					
					});

	 			$('#content').html(addCatogeryView.render().el);    

       });
	}
});