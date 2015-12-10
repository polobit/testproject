/**
 * Handles the click event of any row of any table (whose 'tbody' has the class
 * 'agile-edit-row').
 * 
 * The class 'agile-edit-row' is added to the tbody (in the custom event
 * 'agile_collection_loaded', which is triggered while loading the collection),
 * when only the tbody has an attribute 'route' (specifies the path where to
 * navigate on clicking the row)
 * 
 */

// For scrolling to recently edited contact in the list
var SCROLL_POSITION;

$(function() {

	$("body").on('click', '.agile-edit-row > tr > td:not(":first-child")',
			function(e) {
		e.preventDefault();
		
		var route = $('.agile-edit-row').attr('route');
		
		// Newly added code for displaying contacts and companies in same table with different routes.
		if($(this).closest('tr').find('[route]').length != 0)
			route = $(this).closest('tr').find('[route]').attr('route');
		
		var data = $(this).closest('tr').find('.data').attr('data');

		if(route == "contact/" || route == "company/")
			SCROLL_POSITION = window.pageYOffset;

				if (route == "contact/")
					SCROLL_POSITION = window.pageYOffset;

				console.log(data);

				if (data) {
					Backbone.history.navigate(route + data, {
						trigger : true
					});
				}
			});
});
