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

		var sortKey = _agile_get_prefs("Documentssort_Key");
				if(sortKey == undefined || sortKey == null){
					sortKey = "name";
					_agile_set_prefs("Documentssort_Key", sortKey);
				}
		 // Fetches documents as list
		this.DocumentCollectionView = new Document_Collection_Events({ url : 'core/api/documents', sort_collection : false ,templateKey : "documents", cursor : true, page_size : 20,
			individual_tag_name : 'tr', order_by : sortKey ,  postRenderCallback : function(el)
			{
				includeTimeAgo(el);
				updateSortKeyTemplate(sortKey, el);
				var title = sortKey; 
				if(title == "uploaded_time" || title == "-uploaded_time")
				{
					printSortByName("Uploaded Time",el);
					return;
				}
				else
					printSortByName("Name",el);

				
			}, appendItemCallback : function(el)
			{
				// To show timeago for models appended by infini scroll
				includeTimeAgo(el);
			} });

		this.DocumentCollectionView.collection.fetch();

		// Shows deals as list view
		$('#content').html(this.DocumentCollectionView.render().el);

		$(".active").removeClass("active");
		$("#documentsmenu").addClass("active");
	} });
