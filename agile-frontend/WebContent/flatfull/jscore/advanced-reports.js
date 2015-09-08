/**
 * Initializes the date-range-picker. Calls the callback when the date range is
 * selected.
 * 
 * @param campaign_id -
 *            to show charts w.r.t campaign-id.
 * @param callback -
 *            callback method if any.
 */
function initFunnelCharts(callback)
{
	head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css", function()
	{
		$('.daterangepicker').remove();
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
		], 'This Quarter' : [
				Date.today().getMonth() < 3 ? new Date(Date.today().moveToFirstDayOfMonth().setMonth(0)) : 
				(Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().moveToFirstDayOfMonth().setMonth(3)) :
				(Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().moveToFirstDayOfMonth().setMonth(6)) : new Date(Date.today().moveToFirstDayOfMonth().setMonth(9)), 
				Date.today().getMonth() < 3 ? new Date(Date.today().moveToLastDayOfMonth().setMonth(2)) : 
				(Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().moveToLastDayOfMonth().setMonth(5)) :
				(Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().moveToLastDayOfMonth().setMonth(8)) : new Date(Date.today().moveToLastDayOfMonth().setMonth(11))
		], 'Last Quarter' : [
				Date.today().getMonth() < 3 ? new Date(Date.today().add({ years : -1 }).moveToFirstDayOfMonth().setMonth(9)) : 
				(Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().moveToFirstDayOfMonth().setMonth(0)) :
				(Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().moveToFirstDayOfMonth().setMonth(3)) : new Date(Date.today().moveToFirstDayOfMonth().setMonth(6)), 
				Date.today().getMonth() < 3 ? new Date(Date.today().add({ years : -1 }).moveToLastDayOfMonth().setMonth(11)) : 
				(Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().moveToLastDayOfMonth().setMonth(2)) :
				(Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().moveToLastDayOfMonth().setMonth(5)) : new Date(Date.today().moveToLastDayOfMonth().setMonth(8))
		], 'This Year' : [
				new Date(Date.today().moveToFirstDayOfMonth().setMonth(0)), new Date(Date.today().moveToLastDayOfMonth().setMonth(11))
		], 'Last Year' : [
				new Date(Date.today().moveToFirstDayOfMonth().add({ years : -1 }).setMonth(0)), new Date(Date.today().moveToLastDayOfMonth().add({ years : -1 }).setMonth(11))
		] }, locale : { applyLabel : 'Apply', cancelLabel : 'Cancel', customRangeLabel : 'Custom', daysOfWeek : [
				'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'
		], monthNames : [
				'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
		], firstDay : parseInt(CALENDAR_WEEK_START_DAY) } }, function(start, end)
		{
			var months_diff = Math.abs(start.getMonth() - end.getMonth() + (12 * (start.getFullYear() - end.getFullYear())));
			$('#reportrange span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
			$("#week-range").html(end.add({ days : -6 }).toString('MMMM d, yyyy') + ' - ' + end.add({ days : 6 }).toString('MMMM d, yyyy'));
			
			callback();
		});
		$('.daterangepicker > .ranges > ul').on("click", "li", function(e)
		{
			$('.daterangepicker > .ranges > ul > li').each(function(){
				$(this).removeClass("active");
			});
			$(this).addClass("active");
		});
	});

	// Init the callback when the frequency selector changes too
	if ($('#frequency').length > 0)
	{
		// Get Frequency
		callback();
		$('#frequency').change(function()
		{
			callback();
		});
	}

	fillSelect("filter", "core/api/filters", undefined, function()
	{
		$('#filter').change(function()
		{
			callback();
		});

	}, '<option class="default-select" value="{{id}}">{{name}}</option>', false, undefined, "All Contacts");

	callback();
}

/**
 * Shows Funnel Graphs based on the tags
 */
function showFunnelGraphs(tags)
{
	console.log("Showing funnel logs");
	showFunnel('core/api/reports/funnel/' + tags + getOptions(), 'funnel-chart', 'Funnel Reports', true);
}

/**
 * Shows Grwoth Graphs based on the tags
 */
function showGrowthGraphs(tags)
{
	showAreaSpline('core/api/reports/growth/' + tags + getOptions(), 'growth-chart', '', '', true);
}

/**
 * Shows Grwoth Graphs based on the tags
 */
function showCohortsGraphs(tag1, tag2)
{
	showCohorts('core/api/reports/cohorts/' + tag1 + "/" + tag2 + "/" + getOptions(), 'cohorts-chart', 'Cohort Analysis', tag1 + ' vs ' + tag2, true);
}

/**
 * Shows Ratio Graphs based on the tags
 */
function showRatioGraphs(tag1, tag2)
{
	showLine('core/api/reports/ratio/' + tag1 + "/" + tag2 + "/" + getOptions(), 'ratio-chart', 'Ratio Analysis', tag1 + ' vs ' + tag2, true);
}
/**
 * Highlight the default option in date picker
 */
function highlightDatepickerOption()
{
	var hasActive = false;
	$('.daterangepicker > .ranges > ul').each(function()
	{
		if ($(this).hasClass("active"))
		{
			hasActive = true;
		}
	});
	if (!hasActive)
	{
		$('.daterangepicker > .ranges > ul > li').eq(2).addClass("active");
	}
}
