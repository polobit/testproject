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
				if(sortKey == undefined || sortKey == null)
				{
					sortKey = "name";
					_agile_set_prefs("Documentssort_Key", sortKey);
				}
		var documentsStaticModelview = new Document_Model_Events({url : 'core/api/documents',template : "documents-static", data : {}, isNew : true,order_by : sortKey , postRenderCallback : function(el)
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

				
			}})
		$('#content').html(documentsStaticModelview.render().el);

		 // Fetches documents as list
		documentsCollection (sortKey);
	} });
