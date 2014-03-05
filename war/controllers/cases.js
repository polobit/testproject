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
	this.casesCollectionView = new Base_Collection_View({ url : 'core/api/cases', restKey : "case", templateKey : "cases", individual_tag_name : 'tr' });

	this.casesCollectionView.collection.fetch();

	$('#content').html(this.casesCollectionView.render().el);

	$(".active").removeClass("active");
	$("#casesmenu").addClass("active");
}

});
