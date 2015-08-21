/**
 * Creates backbone router for Case create, read and update operations
 */
var CasesRouter = Backbone.Router.extend({

	routes : { "cases" : "listCases", },

	/**
	 * Fetches all the case and shows them as a list.
	 * 
	 */
	listCases : function()
	{
		 $('#content').html("<div id='cases-listners'>&nbsp;</div>");
		this.casesCollectionView = new Base_Collection_View({ url : 'core/api/cases', sort_collection : false, restKey : "case", templateKey : "cases",
			cursor : true, page_size : 25, individual_tag_name : 'tr', postRenderCallback : function(el)
			{
				includeTimeAgo(el);
				initializeCasesListeners(el);
			}, appendItemCallback : function(el)
			{
				includeTimeAgo(el);
			} });

		this.casesCollectionView.collection.fetch();

		$('#cases-listners').html(this.casesCollectionView.render().el);

		$(".active").removeClass("active");
		$("#casesmenu").addClass("active");
	}

});
