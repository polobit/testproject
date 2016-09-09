/**
 * Creates backbone router for Documents create, read and update operations
 */
var DocumentsRouter = Backbone.Router.extend({

	routes : {

	/* Documents */
	"documents" : "documents", },

	/**
	 * Fetches all the documents as list. Fetching makes easy to add/get
	 * document to the list.
	 */
	documents : function()
	{
		getTemplate('documents-static-container', {}, undefined, function(template_ui) {
					$("#content").html(getTemplate("documents-static-container"));

					// Add top view
					var sortKey = _agile_get_prefs("Documentssort_Key");
					if(sortKey == undefined || sortKey == null){
						sortKey = "dummy_name";
						_agile_set_prefs("Documentssort_Key", sortKey);
					}

					var that = this;
					var documentsStaticModelview = new Document_Model_Events({
						template : 'documents-top-header',
						isNew : true,
						model : new Backbone.Model({"sortKey" : sortKey}),
						postRenderCallback : function(el){
							// Add collection view
							console.log("Load collection");
							App_Documents.loadDocuments($("#content"));
						}
					});

					$("#content").find("#documents-top-view").html(documentsStaticModelview.render().el);

				}, $("#content"));

	},

	loadDocuments : function(el)
	{
		var that  = this ;
		var sortKey = _agile_get_prefs("Documentssort_Key");
				if (App_Documents.DocumentCollectionView && App_Documents.DocumentCollectionView.options.global_sort_key == sortKey && App_Documents.DocumentCollectionView.collection && App_Documents.DocumentCollectionView.collection.length > 0)
				{
					$(el).find("#documents_collection_container").html(App_Documents.DocumentCollectionView.render(true).el);
					return;
				}

				// Loading icon
				$("#content").find("#documents_collection_container").html(LOADING_HTML);

				

				App_Documents.DocumentCollectionView = new Document_Collection_Events({ 
					url : 'core/api/documents', 
					sort_collection : false,
					templateKey : "documents", 
					individual_tag_name : 'tr', 
					cursor : true, 
					customLoader : true,
					customLoaderTemplate : 'agile-app-collection-loader',
					page_size : 20, 
					global_sort_key : sortKey, 
					postRenderCallback : function(col_el)
					{
					//includeTimeAgo(el);
					//updateSortKeyTemplate(sortField, el);
					$(".active").removeClass("active");
					$("#documentsmenu").addClass("active");
					}});
					App_Documents.DocumentCollectionView.collection.fetch();
					// Shows deals as list view
					$("#content").find("#documents_collection_container").html(App_Documents.DocumentCollectionView.el);

	
	}

});
