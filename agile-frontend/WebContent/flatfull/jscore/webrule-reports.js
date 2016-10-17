/**
 * Initializes the date-range-picker. Calls showWebruleGraphs based on the date
 * range seleted.
 * 
 * @param callback -
 *            callback method if any.
 */
function initWebruleChartsUI(callback)
{
	//Loads the date range 
	initDateRange(callback);
	callback();

}
/**
 * Shows date-wise, hourly and weekly reports of a webrule. Calls showBar
 * function which uses HighCharts plugin to show bar charts.
 */
function showWebruleGraphs(webruleid)
{

	// Daily
	showBar('core/api/webrule-analytics/web/graphreports/' + webruleid + getOptions() + "&type=date", 'line-daily-chart', _agile_get_translated_val('reports','daily') , 'Count', null);

	// Hourly
	showBar('core/api/webrule-analytics/web/graphreports/' + webruleid + getOptions() + "&type=hour", 'line-hourly-chart', _agile_get_translated_val('reports','hourly'), 'Count', null);

	// Weekly
	showBar('core/api/webrule-analytics/web/graphreports/' + webruleid + getOptions() + "&type=day", 'line-weekly-chart', _agile_get_translated_val('reports','weekly'), 'Count', null);
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
function get_webrule_table_reports(webruleid)
{
	$("#web-table-reports").html(getRandomLoadingImg());

	$.getJSON('core/api/webrule-analytics/web/table-reports/' + webruleid + getOptions(), function(data)
	{

		console.log(data);

		// Load Reports Template
		getTemplate("webrule-table-reports", data, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$("#web-table-reports").html($(template_ui));	
		}, "#web-table-reports");

	});
}

function render_email_reports_select_ui(id, callback){

				 // Fetches webrules if not filled
				if (!$('#webrule-reports-select').html())
				{
					getTemplate('webrule-analysis', {}, undefined, function(template_ui){
				 		if(!template_ui)
				    		return;

						$('#content').html($(template_ui)); 
						var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";

						// fill webrules
						fillSelect('webrule-reports-select', '/core/api/webrule', 'webrule', function fillwebrule()
						{
							if(id)
							$('#webrule-reports-select').find('option[value=' + id + ']').attr('selected', 'selected');

							if(callback)
							  callback();

							$('#content').on('change', '#webrule-reports-select', function (e) {
								e.preventDefault();
					             var targetEl = $(e.currentTarget);
					             Backbone.history.navigate("webrule-report/"+$(targetEl).val() , 
					             {
					              trigger: true
					              });

					              //  get_webrule_table_reports($(this).val());
					                //showWebruleGraphs($(this).val());

					        });

						}, optionsTemplate);

						//initializeLogReportHandlers();
						
					}, "#content");

					return;
				}

				if(callback)
					callback(); 		

}



