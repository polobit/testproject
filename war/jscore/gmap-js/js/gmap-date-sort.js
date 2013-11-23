

function gmap_date_range(el, callback){
	

		// Bootstrap date range picker.
		$('#gmap_date_range', el).daterangepicker({ ranges : { 'Today' : [
				'today', 'today'
		], 'Yesterday' : [
				'yesterday', 'yesterday'
		], 'Last 7 Days' : [
				Date.today().add({ days : -6 }), 'today'
		], 'Last 30 Days' : [
				Date.today().add({ days : -29 }), 'today'
		], 'This Month' : [
				Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()
		], 'Last Month' : [
				Date.today().moveToFirstDayOfMonth().add({ months : -1 }), Date.today().moveToFirstDayOfMonth().add({ days : -1 })
		] } }, function(start, end)
		{
			$('#gmap_date_range span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
			gmap_search_by_date($('#gmap_date_range span').text());
		});
		
		if(callback && typeof(callback) == "function"){
			callback();
		}
}

function gmap_search_by_date(DateRange){
	console.clear();
	console.log(DateRange);
	
//	var User_Domain = agile_id.getNamespace();
	var User_Domain = "our";
	var options = "&";
	
	// Get Date Range
	var range = DateRange.split("-");

	// Returns milliseconds from start date. For e.g., August 6, 2013 converts
	// to 1375727400000
	var start_date = Date.parse($.trim(range[0])).valueOf();

	// Returns milliseconds from end date.
	var end_date = Date.parse($.trim(range[1])).valueOf();
	
	// Adds start_time, end_time and timezone offset to params.
	options += ("start_date=" + start_date + "&end_date=" + end_date);

	// Add Timezone offset
	var d = new Date();
	options += ("&time_zone=" + d.getTimezoneOffset());

	var DateRangeUrl = "core/api/gmap/daterange?user_domain=" + encodeURIComponent(User_Domain) + options;
	
	console.log("url: " + DateRangeUrl);
	
	$("#map-tab-waiting").fadeIn();
	$.getJSON( DateRangeUrl, function( Response ) {
	    
		console.log("Response: ", Response);
		$("#map-tab-waiting").fadeOut();
		if(Response != null) {
			for(var Key in Response){
				Response[Key].z_index = parseInt(Key);
			}
			gmap_add_marker(Response);
			gmap_create_table_view("", Response);
		}
		
		else {
			console.log("No recent visitors available for this date range.")
		}
	});
}

