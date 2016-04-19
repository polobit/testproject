/**
 * Ticket Router with callbacks
 */
var HelpcenterRouter = Backbone.Router.extend({
	routes: {

		/* Home routes */
		"helpcenter" : "categories",
		"helpcenter/categories":"categories",
        "helpcenter/category-add":"categoryAdd",
		"helpcenter/sections" : "sections"
	},
	categories: function(){

		//Initializing base collection with groups URL
		App_Helpcenter_Module.categoriesCollection = new Base_Collection_View({
			url : '/core/api/knowledgebase/categorie',
			templateKey : "helpcenter-categories",
			individual_tag_name : 'div',
			postRenderCallback : function(el, collection) {

			}
		});

		//Fetching groups collections
		App_Helpcenter_Module.categoriesCollection.collection.fetch();

		//Rendering template
		$('#content').html(App_Helpcenter_Module.categoriesCollection.el);
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