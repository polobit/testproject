// Stores month names with their maximum days to get time stamp (milliseconds)
var monthArray = ['January 31', 'February 28', 'March 31', 'April 30', 'May 31', 'June 30',
                  'July 31', 'August 31', 'September 30', 'October 31', 'November 30', 'December 31'];

// Stores "monthIndex-year" of timeline initiating entities
var MONTH_YEARS;

/**
 * Removes loading image from timeline view
 * 
 * @param el
 * 			html object of contact detail view
 */
function remove_loading_img(el){
	$('#time-line', el).find('.loading-img').remove();
}

/**
 * Returns month index and full year of the given entity as "-" separated.
 * @param model
 * @returns {String}
 */
function entity_created_month_year(model){
	if(model.created_time)
		return month_year = new Date(model.created_time * 1000).getMonth() + '-' + new Date(model.created_time * 1000).getFullYear();
	if(model.createdTime)
		return month_year = new Date(model.createdTime).getMonth() + '-' + new Date(model.createdTime).getFullYear();
	else if(model.time)
		return month_year = new Date(model.time * 1000).getMonth() + '-' + new Date(model.time * 1000).getFullYear();
	else if(model.date_secs)
		return month_year = new Date(model.date_secs).getMonth() + '-' + new Date(model.date_secs).getFullYear();
}


/**
 * Get the timestamp (milliseconds) given month of the year.
 */
function getTimestamp(month_index, year){
	if((year % 4) == 0)
		monthArray[1] = 'February 29';
	return Date.parse(monthArray[month_index] + ', ' + year) + 86400000 - 1; 
}

