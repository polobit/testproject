/**
 * email-charts.js - It handles campaign's hourly, weekly or date email-charts. It
 * initializes the date-range-picker and HighChart's bar graphs. It also handles
 * to fetch timezone offset.
 */

/**
 * Initializes the date-range-picker. Calls showEmailGraphs based on the date
 * range seleted.
 * 
 * @param campaign_id -
 *            to show charts w.r.t campaign-id.
 * @param callback -
 *            callback method if any.
 */
function initChartsUI(campaign_id, callback)
{
	head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css", function()
	{

		// Bootstrap date range picker.
		$('#reportrange').daterangepicker({ ranges : { 'Today' : [
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
			var months_diff = Math.abs(start.getMonth() - end.getMonth() + (12 * (start.getFullYear() - end.getFullYear())));
			$('#reportrange span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
			$("#week-range").html(end.add({ days : -6 }).toString('MMMM d, yyyy') + ' - ' + end.add({ days : 6 }).toString('MMMM d, yyyy'));

			//Updates table data
			get_email_table_reports(campaign_id);
			
			// Updates bar graphs on date change.
			showEmailGraphs(campaign_id);
			
		});
	});

	//Updates table data
	get_email_table_reports(campaign_id);
	
	// shows graphs by default week date range.
	showEmailGraphs(campaign_id);
}

/**
 * Shows date-wise, hourly and weekly reports of a campaign. Calls showBar
 * function which uses HighCharts plugin to show bar charts.
 */
function showEmailGraphs(campaign_id)
{

	// Daily
	showBar('core/api/campaign-stats/email/reports/' + campaign_id + getOptions() + "&type=date", 'line-daily-chart', 'Daily Reports', 'Count', null);

	// Hourly
	showBar('core/api/campaign-stats/email/reports/' + campaign_id + getOptions() + "&type=hour", 'line-hourly-chart', 'Hourly Reports', 'Count', null);

	// Weekly
	showBar('core/api/campaign-stats/email/reports/' + campaign_id + getOptions() + "&type=day", 'line-weekly-chart', 'Weekly Reports', 'Count', null);
}

/**
 * Returns start_time, end_time and time_zone (timezone offset like -330) as
 * query params. Splits date range based on '-' to get start and end time in
 * milliseconds. Fetches timezone offset using Date function.
 */
function getOptions()
{
	// Options
	var options = "?";

	// Get Date Range
	var range = $('#range').html().split("-");

	// Returns milliseconds from start date. For e.g., August 6, 2013 converts
	// to 1375727400000
	var start_time = Date.parse($.trim(range[0])).valueOf();

	var end_value = $.trim(range[1]);
	
	// To make end value as end time of day
	if(end_value)
		end_value = end_value + " 23:59:59";
	
	// Returns milliseconds from end date.
	var end_time = Date.parse(end_value).valueOf();

	// Adds start_time, end_time and timezone offset to params.
	options += ("start_time=" + start_time + "&end_time=" + end_time);

	// Add Timezone offset
	var d = new Date();
	options += ("&time_zone=" + d.getTimezoneOffset());
	
	// If Frequency is present - send frequency too
	if($('#frequency').length > 0)
	{
		// Get Frequency
		var frequency = $( "#frequency").val();
		options += ("&frequency=" + frequency);
	}
	
	// If Frequency is present - send frequency too
	if($('#filter').length > 0)
	{
		// Get Frequency
		var filter_id = $( "#filter").val();
		if(filter_id !="" && filter_id != "ALL")
		options += ("&filter=" + filter_id);
	}
	
	// console.log("options " + options);
	return options;
}

/**
 * Returns data required for table
 **/
function get_email_table_reports(campaign_id)
{
	$("#email-table-reports").html(getRandomLoadingImg());
	
	$.getJSON('core/api/campaign-stats/email/table-reports/'+ campaign_id + getOptions(), function(data){
	
		console.log(data);
		
		// Load Reports Template
		$("#email-table-reports").html(getTemplate("campaign-email-table-reports", data));

	});
}
