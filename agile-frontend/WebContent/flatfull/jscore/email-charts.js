/**
 * email-charts.js - It handles campaign's hourly, weekly or date email-charts. It
 * initializes the date-range-picker and HighChart's bar graphs. It also handles
 * to fetch timezone offset.
 */

/**
 * Initializes the date-range-picker. Calls showEmailGraphs based on the date
 * range seleted.
 * 
 * @param callback -
 *            callback method if any.
 */
function initChartsUI(callback)
{
	//Loads the date range 
	initDateRange(callback);
	callback();

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

	// Get Date Range January 22, 2015 - January 28, 2015
	var range = $('#range').html().split("-");
	/*
	 * var temp = "January 22, 2015 - January 28, 2015"; var range =
	 * temp.split("-");
	 */
	// Returns milliseconds from start date. For e.g., August 6, 2013 converts
	// to 1375727400000
	//var start_time = Date.parse($.trim(range[0])).valueOf();
	//Get the GMT start time
	var start_time = getUTCMidNightEpochFromDate(new Date(range[0]));

	var end_value = $.trim(range[1]);

	// To make end value as end time of day
	if (end_value)
		end_value = end_value + " 23:59:59";

	// Returns milliseconds from end date.
	//var end_time = Date.parse(end_value).valueOf();
	//Get the GMT end time
	var end_time = getUTCMidNightEpochFromDate(new Date(end_value));

	end_time += (((23*60*60)+(59*60)+59)*1000);

	// Adds start_time, end_time and timezone offset to params.
	options += ("start_time=" + start_time + "&end_time=" + end_time);

	// Add Timezone offset
	var d = new Date();
	options += ("&time_zone=" + d.getTimezoneOffset());

	// If Frequency is present - send frequency too
	if ($('#frequency').length > 0)
	{
		// Get Frequency
		var frequency = $("#frequency").val();
		options += ("&frequency=" + frequency);
	}

	// If Frequency is present - send frequency too
	if ($('#filter').length > 0)
	{
		// Get Frequency
		var filter_id = $("#filter").val();
		if (filter_id != "" && filter_id != "ALL")
			options += ("&filter=" + filter_id);
	}

	// console.log("options " + options);
	return options;
}

/**
 * Returns data required for table
 */
function get_email_table_reports(campaign_id)
{
	$("#email-table-reports").html(getRandomLoadingImg());

	$.getJSON('core/api/campaign-stats/email/table-reports/' + campaign_id + getOptions(), function(data)
	{

		console.log(data);

		// Load Reports Template
		getTemplate("campaign-email-table-reports", data, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$("#email-table-reports").html($(template_ui));	
		}, "#email-table-reports");

	});
}
