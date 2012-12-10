/**
 * Sorts the table based on its column values. For each table the sort_tables
 * function is called from the custom event 'agile_collection_loaded', which is
 * triggered form base-collection render function.
 * 
 * When the table is loaded, it is in its default order and no arrow marks
 * appeared at column headings. When the mouse is hovered on any heading of the
 * column an arrow mark (bright color) will be shown to indicate that the table
 * can be sorted on that column values. When the heading is clicked, the table
 * will get sorted on that particular column values and a permanent arrow mark
 * (shaded color) will be shown to indicate, the table is sorted on that
 * particular column values (up-arrow -> ascending order, down-arrow ->
 * descending order)
 * 
 * @method sort_tables
 * @param {Object}
 *            table as html object
 */
function sort_tables(table) {

	head.js(LIB_PATH + "lib/jquery.tablesorter.min.js", function() {

		$(table).tablesorter({

			// Disable the sorting property to the first column of the table
			// (first colon contains check-boxes)
			// pass the headers argument and assign a object
			headers : {
				0 : {
					// disable it by setting the property sorter to false
					sorter : false
				},

			}

		});
	});
}