/**
 * Ticket Router with callbacks
 */
var HelpcenterRouter = Backbone.Router.extend({
	routes: {

		/* Home routes */
		"" : "categories",
		"categories":"categories",
		"section/:id" : "sectionArticles",
		"categorie/:categorie_id/section/:section_id/articles" : "sectionArticles"
	},
	categories: function(){

		App_Helpcenter.renderHomeTemplate(function(){

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
			$('#helpcenter-container').html(App_Helpcenter.categoriesCollection.el);
		});
	},

	sectionArticles: function(categorie_id, section_id){

		App_Helpcenter.renderHomeTemplate(function(){
			var sectionView = new Base_Model_View({
				isNew : false,
				template : "section",
				url : "/core/api/knowledgebase/section?id=" + section_id,
		        postRenderCallback: function(){

		        	//Initializing base collection with groups URL
					App_Helpcenter.articlesCollection = new Base_Collection_View({
						url : '/core/api/knowledgebase/article?section_id=' + section_id + '&categorie_id=' + categorie_id,
						templateKey : "helpcenter-articles",
						individual_tag_name : 'div'
					});

					//Fetching groups collections
					App_Helpcenter.articlesCollection.collection.fetch();

					//Rendering template
					$('#articles-collection').html(App_Helpcenter.articlesCollection.el);
		        }
			});

	 		$('#helpcenter-container').html(sectionView.render().el);
	 	});
	},

	renderHomeTemplate: function(callback){

		if($('#helpcenter-container').length)
		{
			callback();
			return;
		}

		getTemplate("home", {}, undefined, function(template_ui){

	 		if(!template_ui)
	 			return;

	 		$('#content').html($(template_ui));

	 		if(callback)
	 			callback();
	 	});
	}
});