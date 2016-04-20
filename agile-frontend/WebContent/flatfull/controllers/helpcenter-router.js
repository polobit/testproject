/**
 * Ticket Router with callbacks
 */
var HelpcenterRouter = Backbone.Router.extend({
	routes: {

		/* Home routes */
		"helpcenter" : "categories",
		"helpcenter/categories":"categories",
        "helpcenter/add-categorie":"categorieAdd",
	   	"helpcenter/sections" : "sections",
	    "helpcenter/add-section" : "sectionAdd"
	},
	categories: function(){

		App_Helpcenter_Module.loadhelpdeskTemplate(function(callback){
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
			$('#helpcenter-content').html(App_Helpcenter_Module.categoriesCollection.el);
	    });
	},

	categorieAdd: function(){
		App_Helpcenter_Module.loadhelpdeskTemplate(function(callback){
			getTemplate("helpcenter-add-catogery", {}, undefined, function(template_ui){

			    if(!template_ui)
	 				return;

					$('#helpcenter-content').html($(template_ui));

			    var addCatogeryView = new Base_Model_View({
	 				isNew : true, 
	 				url : '/core/api/knowledgebase/categorie',
	 				template : "helpcenter-add-catogery",
	 				window : "#helpcenter/categories",
			    });

				$('#helpcenter-content').html(addCatogeryView.render().el);    
	        });
		});
  },
 
  sectionAdd:function(){
	App_Helpcenter_Module.loadhelpdeskTemplate(function(callback){
			getTemplate("helpcenter-add-section", {}, undefined, function(template_ui){

			    if(!template_ui)
	 				return;

					$('#helpcenter-content').html($(template_ui));

			    var addsectionView = new Base_Model_View({
	 				isNew : true, 
	 				url : '/core/api/knowledgebase/section',
	 				template : "helpcenter-add-section",
	 				window : "#helpcenter/categories",
			        postRenderCallback : function(el){
			        	 var optionsTemplate = "<option value={{id}}>{{name}}</option>";
 						 fillSelect('catogery', '/core/api/knowledgebase/categorie', '', null,
 						             optionsTemplate, true);

			        }
			    });

				$('#helpcenter-content').html(addsectionView.render().el);    
	        });
		});

  },

loadhelpdeskTemplate: function(callback){

		if($("div #helpcenter-root-div").length > 0){
          if(callback)
 				callback();
 			return;
	    }
		getTemplate("helpcenter", {}, undefined, function(template_ui){

			if(!template_ui)
				return;
			
			$('#content').html($(template_ui));	
			

 			if(callback)
 				callback();
		});
}
});