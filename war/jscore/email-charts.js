function initChartsUI(campaign_id,callback) {
	head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH
			+ 'lib/date-range-picker.js', function() {
		
		// Date Selector
		$('#reportrange').daterangepicker(
				{
					ranges : {
						'Today' : [ 'today', 'today' ],
						'Yesterday' : [ 'yesterday', 'yesterday' ],
						'Last 7 Days' : [ Date.today().add({
							days : -6
						}), 'today' ],
						'Last 30 Days' : [ Date.today().add({
							days : -29
						}), 'today' ],
						'This Month' : [ Date.today().moveToFirstDayOfMonth(),
								Date.today().moveToLastDayOfMonth() ],
						'Last Month' : [
								Date.today().moveToFirstDayOfMonth().add({
									months : -1
								}), Date.today().moveToFirstDayOfMonth().add({
									days : -1
								}) ]
					}
				},
				function(start, end) {
					var months_diff = Math.abs(start.getMonth() - end.getMonth() + (12 * (start.getFullYear() - end.getFullYear())));
					$('#reportrange span').html(
							start.toString('MMMM d, yyyy') + ' - '
									+ end.toString('MMMM d, yyyy'));
					$("#week-range").html(end.add({
						days : -6
					}).toString('MMMM d, yyyy') + ' - ' + end.add({
						days : 6
					}).toString('MMMM d, yyyy'));
					
					showEmailGraphs(campaign_id);
				    });
  });
	showEmailGraphs(campaign_id);
}
	

function showEmailGraphs(campaign_id) {
	
	showBar('core/api/campaign-stats/email/reports/' + campaign_id + getOptions() + "&type=date",
			'line-daily-chart', 'Daily Reports', 'Count',null);

	showBar('core/api/campaign-stats/email/reports/' + campaign_id + getOptions() + "&type=hour",
			'line-hourly-chart', 'Hourly Reports', 'Count',null);

	showBar('core/api/campaign-stats/email/reports/' + campaign_id + getOptions() + "&type=day",
			'line-weekly-chart', 'Weekly Reports', 'Count',null);
}

function getOptions() {
	// Options
	var options = "?";

	// console.log($('#range').html(), $("#context"));

	// Get Date Range
	var range = $('#range').html().split("-");

	var start_time = Date.parse($.trim(range[0])).valueOf();

	var end_time = Date.parse($.trim(range[1])).valueOf();
	options += ("start_time=" + start_time + "&end_time=" + end_time);

	// Add Timezone offset
	var d = new Date();
	options += ("&time_zone=" + d.getTimezoneOffset());

	//console.log("options " + options);

	return options;
}
		
