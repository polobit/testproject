/**
 * Sorts the colons of each table It is called from the event
 * 'agile_collection_loaded', which is triggered form base-collection.js render
 * event
 * 
 * @param {Object} table html as object
 */
function sort_tables(table) {

	head.js(LIB_PATH + "lib/jquery.tablesorter.min.js", function() {

		$(table).tablesorter({

			// pass the headers argument and assing a object
			headers : {
				0 : {
					// disable it by setting the property sorter to false
					sorter : false
				},

			}

		});
	});
}