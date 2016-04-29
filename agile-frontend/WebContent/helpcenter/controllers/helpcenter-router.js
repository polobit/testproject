/**
 * Ticket Router with callbacks
 */
var HelpcenterRouter = Backbone.Router.extend({
	routes: {

		/* Home routes */
		"" : "categories",
		"categories":"categories",
		"section/:id" : "sectionArticles",
		"categorie/:categorie_id" : "categorieSections",
		"categorie/:categorie_id/section/:section_id" : "sectionArticles",
		"categorie/:categorie_id/section/:section_id/article/:article_id" : "viewArticle",

		/*Search articles*/
		"search-article/:search_term" : "searchArticle",
	},
	categories: function(){

		App_Helpcenter.renderHomeTemplate(function(){

			//Initializing base collection with groups URL
			App_Helpcenter.categoriesCollection = new Base_Collection_View({
				url : '/helpcenterapi/api/knowledgebase/categorie',
				templateKey : "helpcenter-categories",
				individual_tag_name : 'div',
				postRenderCallback : function(el, collection) {

					Helpcenter_Util.setBreadcrumbPath();
				}
			});

			//Fetching groups collections
			App_Helpcenter.categoriesCollection.collection.fetch();

			//Rendering template
			$('#helpcenter-container').html(App_Helpcenter.categoriesCollection.el);
		});
	},

	categorieSections: function(categorie_id){

		App_Helpcenter.renderHomeTemplate(function(){

			var categorieView = new Base_Model_View({
				isNew : false,
				template : "categorie",
				url : "/helpcenterapi/api/knowledgebase/categorie/" + categorie_id,
		        postRenderCallback: function(el, data){

		        	Helpcenter_Util.setBreadcrumbPath('categorie-sections-breadcrumb', data);

		        	//Initializing base collection with groups URL
					App_Helpcenter.sectionsCollection = new Base_Collection_View({
						url : '/helpcenterapi/api/knowledgebase/section/categorie/' + categorie_id,
						templateKey : "helpcenter-sections",
						individual_tag_name : 'div'
					});

					//Fetching groups collections
					App_Helpcenter.sectionsCollection.collection.fetch();

					//Rendering template
					$('#sections-collection', el).html(App_Helpcenter.sectionsCollection.el);
		        }
			});

	 		$('#helpcenter-container').html(categorieView.render().el);
	 	});
	},

	sectionArticles: function(categorie_id, section_id){

		App_Helpcenter.renderHomeTemplate(function(){

			var sectionView = new Base_Model_View({
				isNew : false,
				template : "section",
				url : "/helpcenterapi/api/knowledgebase/section?id=" + section_id,
		        postRenderCallback: function(el, data){

		        	Helpcenter_Util.setBreadcrumbPath('section-articles-breadcrumb', data);

		        	//Initializing base collection with groups URL
					App_Helpcenter.articlesCollection = new Base_Collection_View({
						url : '/helpcenterapi/api/knowledgebase/article?section_id=' + section_id + '&categorie_id=' + categorie_id,
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

	viewArticle:function(categorie_id, section_id, article_id){

		App_Helpcenter.renderHomeTemplate(function(){

			var articleView = new Base_Model_View({
				isNew : false,
				template : "article",
				url : "/helpcenterapi/api/knowledgebase/article/" + article_id,
		        postRenderCallback: function(el, data){

		        	Helpcenter_Util.setBreadcrumbPath('article-breadcrumb', data);
				}
			});

	 		$('#helpcenter-container').html(articleView.render().el);
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
	},

	searchArticle: function(search_term){

		App_Helpcenter.renderHomeTemplate(function(){

			//Initializing base collection with groups URL
			App_Helpcenter.articlesCollection = new Base_Collection_View({
				url : '/helpcenterapi/api/knowledgebase/article/search/' + search_term,
				templateKey : "helpcenter-search-articles",
				individual_tag_name : 'div',
				slateKey : 'articles',
				postRenderCallback : function(el, collection) {

					Helpcenter_Util.setBreadcrumbPath();
				}
			});

			//Fetching groups collections
			App_Helpcenter.articlesCollection.collection.fetch();

			//Rendering template
			$('#helpcenter-container').html(App_Helpcenter.articlesCollection.el);
		});
	}
});