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
	
	// head.js(LIB_PATH + "lib/jquery.tablesorter.min.js", function() {

	    // add parser through the tablesorter addParser method to sort tasks based on priority
	    $.tablesorter.addParser({ 
	        // set a unique id 
	        id: 'priority', 
	        is: function(s) { 
	            // return false so this parser is not auto detected 
	            return false; 
	        }, 
	        format: function(s) { 
	            // format your data for normalization 
	            return s.toLowerCase().replace(/high/,2).replace(/normal/,1).replace(/low/,0); 
	        }, 
	        // set type, either numeric or text 
	        type: 'numeric' 
	    }); 
	    
	    // add parser through the tablesorter addParser method to sort based on date
	    $.tablesorter.addParser({ 
	        // set a unique id 
	        id: 'time-ago', 
	        is: function(s) { 
	            // return false so this parser is not auto detected 
	            return false; 
	        }, 
	        format: function(s, table, cell, cellIndex) { 
	        	// format your data for normalization
	        	var time = cell.getElementsByTagName("time");
	        	if(time)
	              return $(time).attr("value"); 
	        }, 
	        // set type, either numeric or text 
	        type: 'numeric' 
	    });
	    
	    // add parser through the tablesorter addParser method to sort deal based on value
	    $.tablesorter.addParser({ 
	        // set a unique id 
	        id: 'money', 
	        is: function(s) { 
	            // return false so this parser is not auto detected 
	            return false; 
	        }, 
	        format: function(s, table, cell) { 
	            // format your data for normalization 
	            return cell.getAttribute("value"); 
	        }, 
	        // set type, either numeric or text 
	        type: 'numeric' 
	    }); 
	 
		
	    var table_id = $(table).attr('id');
	    if(table_id == 'deal-list')
	    	{
	    		sort_deals(table);
	    		return;
	    	}
/*	    if(table_id == "task-list")
	    	{
	    		sort_tasks(table);
	    		return;
	    	}*/
	    if(table_id == "document-list")
    	{
    		sort_documents(table);
    		return;
    	}
	    if(table_id == "case-list")
    	{
    		sort_cases (table);
    		return;
    	}
	    if(table_id == "schedule-updates")
    	{
    		sort_schedule_updates(table);
    		return;
    	} 
	    if(table_id == "contact-filter-list")
    	{
	    	sort_filters(table);
    		return;
    	}
	    
    	basic_table_sort(table);

	// });
}

function basic_table_sort(table)
{
	   
	$(table).tablesorter({
		// Disable the sorting property to the first column of the table
		// (first colon contains check-boxes)
		// pass the headers argument and assign a object
		headers : {
			0 : {
				// disable it by setting the property sorter to false
				sorter : false
			}
		}
	});
}

function sort_tasks(table)
{
	$(table).tablesorter({ 
        headers: {
        	0 : {sorter : false},
        	1 : {sorter : false},
        	2 : {sorter : 'text'},
        	3 : {sorter : 'text'},
            4: {sorter:'priority'},
			5 : {sorter : 'time-ago'},
			6 : {sorter : false}
        } 
    }); 
}

function sort_deals(table)
{
	$(table).tablesorter({ 
        headers: { 
        	0 : {sorter : false	},
        	1 : {sorter : 'text'},
        	2 : {sorter : false},
        	3 : {sorter : 'money'},
        	4 : {sorter : 'text'},
			5 : {sorter : 'time-ago'},
        	6 : {sorter : false}
        }
    });
}

function sort_documents(table)
{
	$(table).tablesorter({ 
        headers: { 
        	0 : {sorter : false	},
        	1 : {sorter : 'text'},
        	2 : {sorter : false},
			3 : {sorter : 'time-ago'},
			4 : {sorter : false	}
        }
    });
}

function sort_cases(table)
{
	$(table).tablesorter({ 
        headers: { 
        	0 : {sorter : false	},
        	1 : {sorter : false},
        	2 : {sorter : 'text'},
			3 : {sorter : 'time-ago'},
			4 : {sorter : false	},
			5 : {sorter : 'text'}
        }
    });
}

function sort_schedule_updates(table)
{
	$(table).tablesorter({ 
        headers: {
        	0 : {sorter : false},
        	1 : {sorter : 'text'},
        	2 : {sorter : 'text'},
        	3 : {sorter : 'time-ago'},
            4 : {sorter:'text'}			
        } 
    }); 
}

function sort_filters(table)
{
	$(table).tablesorter({ 
        headers: {
        	0 : {sorter : false},
        	1 : {sorter : 'text'},
        	2 : {sorter : false},        	    	
        } 
    }); 
}
