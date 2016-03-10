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
		 // Fetches documents as list
		this.DocumentCollectionView = new Document_Collection_Events({ url : 'core/api/documents', templateKey : "documents", cursor : true, page_size : 20,
			individual_tag_name : 'tr', postRenderCallback : function(el)
			{
				includeTimeAgo(el);
				
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
