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
$(function() {

	$('.agile-edit-row > tr').live('click', function(e) {
		e.preventDefault();
		var route = $('.agile-edit-row').attr('route')
		var data = $(this).find('.data').attr('data');

		// Customize table edit
		customize_table_edit(this, route);

		console.log(data);
		if (data) {
			Backbone.history.navigate(route + data, {
				trigger : true
			});
		}
	});
});

/**
 * Customizes the edit functionality based on route value. For example in deals
 * the popover should be hidden
 * 
 * @param {Object}
 *            that html object of clicked row.
 * @param {String} route
 * 				value of the route.
 * 			
 */
function customize_table_edit(that, route) {

	// Hide deals popover
	if (route == 'deals/')
		$(that).popover('hide');
}