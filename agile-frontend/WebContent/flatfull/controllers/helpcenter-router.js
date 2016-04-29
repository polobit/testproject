/**
 * Ticket Router with callbacks
 */
var HelpcenterRouter = Backbone.Router.extend({
	routes: {

		/* Home routes */
		"helpcenter" : "categories",
		"helpcenter/categories":"categories",
        "helpcenter/add-categorie":"categorieAdd",
	   	"categorie/:id/edit-categorie":"categorieEdit",
	   	"helpcenter/sections" : "sections",
	    "helpcenter/add-section" : "sectionAdd",
	    "categorie/:categorie_id/section/:section_id/edit-section":"sectionEdit",
        "helpcenter/add-article" : "articleAdd",
        "categorie/:id/add-section" : "addSectionfromCategorie",
        "categorie/:categorie_id/section/:section_id/articles" : "sectionArticles",
        "categorie/:categorie_id/section/:section_id/add-article" :  "addArticlefromSection",
        "categorie/:categorie_id/section/:section_id/article/:article_id": "showArticles",
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
 
  sectionAdd:function(){
		App_Helpcenter_Module.loadhelpcenterTemplate(function(callback){
			
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

  },
  articleAdd: function(){
  
  	setupTinyMCEEditor('textarea#description-article', true, undefined, function(){});
  
  		App_Helpcenter_Module.loadhelpcenterTemplate(function(callback){
	
			    var addarticleView = new Base_Model_View({
	 				isNew : true, 
	 				url : '/core/api/knowledgebase/article',
	 				template : "helpcenter-add-article",
	 				window : "#helpcenter/categories",
			        
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
    
			 	 		$('#catogery', el).html(getTemplate('helpcenter-section-category', collection.toJSON()));

					},'', true);

			        }
			        
			    });

				$('#helpcenter-content').html(addarticleView.render().el);    
	        
		});

  },
  addArticlefromSection: function(section_id){
  
  	setupTinyMCEEditor('textarea#description-article', true, undefined, function(){});
  
  		App_Helpcenter_Module.loadhelpcenterTemplate(function(callback){
	
			    var addsectionView = new Base_Model_View({
	 				isNew : true, 
	 				url : '/core/api/knowledgebase/article',
	 				template : "helpcenter-add-article",
	 				window : "#helpcenter/categories",
			        
                    prePersist : function(model){
						var json = {};
						var catogery_id = $("#catogery option:selected").data('catogery-id');
						json = {"categorie_id" : catogery_id };
						model.set(json, { silent : true });
				    },

			        postRenderCallback : function(el){
					fillSelect('catogery', '/core/api/knowledgebase/categorie', '', function(collection){
			 	 		getTemplate("helpcenter-section-category", collection.toJSON(), undefined, function(template_ui){

								
								if(!template_ui)
									return;
				
								$('#catogery', el).html($(template_ui));	
								$('#catogery option[value="'+section_id+'"]',el).attr("selected",true);

								//console.log("section_id:"+section_id);
                                 
					 			if(callback)
					 				callback();
			               	} );		
					
					},'', true);

			        }
			        
			    });

				$('#helpcenter-content').html(addsectionView.render().el);    
	        
		});
    },

  addSectionfromCategorie: function(category_id){
        
        App_Helpcenter_Module.loadhelpcenterTemplate(function(callback){
		
		    var addsectionView = new Base_Model_View({
 				isNew : true, 
 				url : '/core/api/knowledgebase/section',
 				template : "helpcenter-add-section",
 				window : "#helpcenter/categories",
		        postRenderCallback : function(el){
		        	 var optionsTemplate = "<option value={{id}}>{{name}}</option>";
						 fillSelect('catogery', '/core/api/knowledgebase/categorie', '',function(){
                               
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
						individual_tag_name : 'tbody'
					});

					//Fetching groups collections
					App_Helpcenter_Module.articlesCollection.collection.fetch();

					//Rendering template
					$('#articles-collection').html(App_Helpcenter_Module.articlesCollection.el);
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
  showArticles: function(category_id,section_id,article_id){
  		App_Helpcenter_Module.loadhelpcenterTemplate(function(){

			var articleView = new Base_Model_View({
				isNew : false,
				template : "helpcenter-article",
				url : "/core/api/knowledgebase/article/" + article_id,
		        postRenderCallback: function(el, data){

		        	//Helpcenter_Util.setBreadcrumbPath('article-breadcrumb', data);
				}
			});

	 		$('#helpcenter-content').html(articleView.render().el);
	 	});
  },
  editArticle : function(categorie_id,section_id,article_id){
    
	setupTinyMCEEditor('textarea#description-article', true, undefined, function(){});
       

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
					fillSelect('catogery', '/core/api/knowledgebase/categorie', '', function(collection){
    
			 	 		$('#catogery', el).html(getTemplate('helpcenter-section-category', collection.toJSON()));

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