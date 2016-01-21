/**
* This is just like an abstract class, doesn't
contain all implementation; it is responsibility of child views to extend
*/
(function(contact_sort_configuration, $, undefined) {
	
contact_sort_configuration.SORT_FIELDS_VIEW = function()
{
	return Base_Collection_View.extend({
		events : {
			"click .sort" : "sort_collection_config"
		},
		resetLocalStorage : function(e)
		{
			// Can be implemented in child views. 
			//This is left blank to make this class re-usable for both contacts and companies listing

		},
		updateLocalStorage : function(sort_by)
		{
			// abstract method;
		},
		sort_collection_config : function(e)
		{
			e.preventDefault();
			this.resetLocalStorage();
			$('.sort', this.el).removeClass('bold-text');

			sort_by = $(e.currentTarget).attr('data');
			//$(this).addClass('bold-text');
			this.updateLocalStorage(sort_by);

			this.sort_collection();

			$('.sort', this.el).removeClass('bold-text');
		},
		sort_collection : function()
		{
			// Can be implemented in child views. 
			//This is left blank to make this class re-usable for both contacts and companies listing
		}
	});
}

}(window.contact_sort_configuration = window.contact_sort_configuration || {}, $));

function getSortFieldsConfig()
{
	return SORT_FIELDS_VIEW;
}