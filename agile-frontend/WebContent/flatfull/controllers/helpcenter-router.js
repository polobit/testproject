/**
 * Ticket Router with callbacks
 */
var HelpcenterRouter = Backbone.Router.extend({
	routes: {

		/* Home routes */
		"helpcenter" : "categories",

		/* Show add edit categorie */
		"helpcenter/categories":"categories",
        "helpcenter/add-categorie":"categorieAdd",
	   	"categorie/:id/edit-categorie":"categorieEdit",
	   	
	   	/* Show add edit section */
	   	"helpcenter/sections" : "sections",
	    "helpcenter/add-section" : "addSection",
        "categorie/:id/add-section" : "addSection",
	    "categorie/:categorie_id/section/:section_id/edit-section":"sectionEdit",
        
        /* Show add edit article */
        "helpcenter/add-article" : "addArticle",
        "categorie/:categorie_id/section/:section_id/articles" : "sectionArticles",
        "categorie/:categorie_id/section/:section_id/add-article" :  "addArticle",
        "categorie/:categorie_id/section/:section_id/article/:article_id": "showArticle",
        "categorie/:categorie_id/section/:section_id/article/:article_id/edit-article": "editArticle"       
    },
	categories: function(){

		App_Helpcenter_Module.loadhelpcenterTemplate(function(callback){
			
			//Initializing base collection with groups URL
			App_Helpcenter_Module.categoriesCollection = new Base_Collection_View({
				url : '/core/api/knowledgebase/categorie',
				templateKey : "helpcenter-categories",
				individual_tag_name : 'div',
				postRenderCallback : function(el, collection) {

                  Helcenter_Events.categorieDelete(el);
				}
			});

			//Fetching groups collections
			App_Helpcenter_Module.categoriesCollection.collection.fetch();

			//Rendering template
			$('#helpcenter-content').html(App_Helpcenter_Module.categoriesCollection.el);
	    });
	},

	categorieAdd: function(){
		
		App_Helpcenter_Module.loadhelpcenterTemplate(function(callback){
					
		    var addCatogeryView = new Base_Model_View({
					isNew : true, 
				 	url : '/core/api/knowledgebase/categorie',
					template : "helpcenter-add-catogery",
					window : "#helpcenter/categories",
		    });

			$('#helpcenter-content').html(addCatogeryView.render().el);    
		});
  },
  
  addArticle: function(category_id,section_id){
  
  	setupTinyMCEEditor('textarea#description-article', true, undefined, function(){});
  
  		App_Helpcenter_Module.loadhelpcenterTemplate(function(callback){
	
			    var addsectionView = new Base_Model_View({
	 				isNew : true, 
	 				url : '/core/api/knowledgebase/article',
	 				template : "helpcenter-add-article",
	 				window : "back",
			        
					prePersist : function(model){
						var json = {};
						var catogery_id = $("#catogery option:selected").data('catogery-id');
						json = {"categorie_id" : catogery_id };

						var plain_content = '';

						try{
							plain_content = $(tinyMCE.activeEditor.getBody()).text();

							json.plain_content = plain_content;
						}
						catch(err){}
						
						model.set(json, { silent : true });
				    },

			        postRenderCallback : function(el){
					
						fillSelect('catogery', '/core/api/knowledgebase/categorie', '', function(collection){
			 	 			getTemplate("helpcenter-section-category", collection.toJSON(), undefined, function(template_ui){

						

								if(!template_ui)
									return;

				                $('#catogery', el).html($(template_ui));

				                if(category_id && section_id)
									$('#catogery option[value="'+section_id+'"]',el).attr("selected",true);

								if(callback)
					 				callback();
			               	} );		
					
					},'', true);

			        },
			        
			    });

				$('#helpcenter-content').html(addsectionView.render().el);    
	        
		});
    },

  addSection: function(category_id){
        
        App_Helpcenter_Module.loadhelpcenterTemplate(function(callback){
		
		    var addsectionView = new Base_Model_View({
 				isNew : true, 
 				url : '/core/api/knowledgebase/section',
 				template : "helpcenter-add-section",
 				window : "#helpcenter/categories",
		        postRenderCallback : function(el){
		        	 var optionsTemplate = "<option value={{id}}>{{name}}</option>";
						 fillSelect('catogery', '/core/api/knowledgebase/categorie', '',function(){
                                           
                                       if(!category_id)
                                       	  return;

                                       $('select option[value="'+category_id+'"]').attr("selected",true);
                                        
						 },optionsTemplate, true);

		        }
			});

				$('#helpcenter-content').html(addsectionView.render().el);    
	        
		});
   },

  categorieEdit: function(category_id){

  	if(!App_Helpcenter_Module.categoriesCollection || !App_Helpcenter_Module.categoriesCollection.collection){

	 				Backbone.history.navigate( "helpcenter/categories", { trigger : true });
	 				return;
	} 			
  	
  		App_Helpcenter_Module.loadhelpcenterTemplate(function(callback){
		
	    	var categorieModel = App_Helpcenter_Module.categoriesCollection.collection.get(category_id);

        	console.log(categorieModel);
		
		    var editCatogeryView = new Base_Model_View({
 				model : categorieModel,
 				isNew : true, 
 				url : '/core/api/knowledgebase/categorie',
 				template : "helpcenter-add-catogery",
 				window : "#helpcenter/categories",
		    });

			$('#helpcenter-content').html(editCatogeryView.render().el);    
		});
  },

  sectionArticles: function(categorie_id,section_id){
		  
		App_Helpcenter_Module.loadhelpcenterTemplate(function(){
			
			var sectionView = new Base_Model_View({
				isNew : false,
				template : "helpcenter-section",
				url : "/core/api/knowledgebase/section?id=" + section_id,
		        postRenderCallback: function(){
		        	//Initializing base collection with groups URL
					App_Helpcenter_Module.articlesCollection = new Base_Collection_View({
						url : '/core/api/knowledgebase/article?section_id=' + section_id + '&categorie_id=' + categorie_id,
						templateKey : "helpcenter-articles",
						individual_tag_name : 'tr',
						postRenderCallback: function(el){
                          
					      Helcenter_Events.initializeStatuscheckbox(el);
					    	
					    	$('[data-toggle="tooltip"]', el).tooltip();
					     
					    },
					    
					});

					//Fetching groups collections
					App_Helpcenter_Module.articlesCollection.collection.fetch();

					//Rendering template
					showTransitionBar();
					$('#articles-collection').html(App_Helpcenter_Module.articlesCollection.el);
		        },
		        deleteCallback : function(){
							Backbone.history.navigate( "helpcenter/categories", { trigger : true });
		   		}
			});

	 		$('#helpcenter-content').html(sectionView.render().el);
	 	});                 
		  
  },

  sectionEdit: function(category_id,section_id){ 	
  		
  		App_Helpcenter_Module.loadhelpcenterTemplate(function(){
			
			var sectionView = new Base_Model_View({
				isNew : false,
				template : "helpcenter-add-section",
				url : "/core/api/knowledgebase/section?id=" + section_id,
				window:'back',
			    postRenderCallback : function(el){
			        var optionsTemplate = "<option value={{id}}>{{name}}</option>";
 						 fillSelect('catogery', '/core/api/knowledgebase/categorie', '', function(){
                                       $('select option[value="'+category_id+'"]').attr("selected",true);    
			                     },optionsTemplate, true);
 					}
			   
			    	});
              
              
	 		$('#helpcenter-content').html(sectionView.render().el);
	 	});			
  },
  showArticle: function(category_id,section_id,article_id){
  		
	App_Helpcenter_Module.loadhelpcenterTemplate(function(){

		var articleView = new Base_Model_View({
			isNew : false,
			template : "helpcenter-article",
			url : "/core/api/knowledgebase/article/" + article_id,
	        no_reload_on_delete:false,
	        postRenderCallback: function(el, data){

	        	//Helpcenter_Util.setBreadcrumbPath('article-breadcrumb', data);
			},
			deleteCallback : function(){
				window.history.back();
		    }
		});

 		$('#helpcenter-content').html(articleView.render().el);
 	});
  },
  editArticle : function(categorie_id,section_id,article_id){
    
		App_Helpcenter_Module.loadhelpcenterTemplate(function(callback){
	
		    var editarticleView = new Base_Model_View({
 				isNew : false, 
 				url : "/core/api/knowledgebase/article/" +article_id,
 				template : "helpcenter-add-article",
 				window : "back",
		        
                prePersist : function(model){
					var json = {};
					var catogery_id = $("#catogery option:selected").data('catogery-id');
					json = {"categorie_id" : catogery_id };
					model.set(json, { silent : true });
			    },

		        postRenderCallback : function(el){
				setupTinyMCEEditor('textarea#description-article', true, undefined, function(){
					$("textarea#description-article").css("display", "none");
				});

				fillSelect('catogery', '/core/api/knowledgebase/categorie', '', function(collection){

		 	 		$('#catogery', el).html(getTemplate('helpcenter-section-category', collection.toJSON()));
   					$('#catogery option[value="'+section_id+'"]',el).attr("selected",true);                    
				
				},'', true);

				
				 

		        }
		    });    
			    $('#helpcenter-content').html(editarticleView.render().el); 
	    });
  },

  loadhelpcenterTemplate: function(callback){

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
		},'#helpcenter' );
}
});