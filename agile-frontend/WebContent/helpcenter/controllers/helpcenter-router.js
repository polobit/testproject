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

	 		//Initializing base collection with groups URL
			App_Helpcenter.categoriesCollection = new Base_Collection_View({
				url : '/core/api/knowledgebase/categorie',
				templateKey : "helpcenter-categories",
				individual_tag_name : 'div',
				postRenderCallback : function(el, collection) {

				}
			});

			//Fetching groups collections
			App_Helpcenter.categoriesCollection.collection.fetch();

			//Rendering template
			$('#categories').html(App_Helpcenter.categoriesCollection.el);
	 	});
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