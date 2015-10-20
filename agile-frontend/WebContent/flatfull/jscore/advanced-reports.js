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
	head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js' + '?_=' + _AGILE_VERSION, function()
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
				Date.today().getMonth() < 3 ? new Date(Date.today().setMonth(0)).moveToFirstDayOfMonth() : 
				(Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().setMonth(3)).moveToFirstDayOfMonth() :
				(Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().setMonth(6)).moveToFirstDayOfMonth() : new Date(Date.today().setMonth(9)).moveToFirstDayOfMonth(), 
				Date.today().getMonth() < 3 ? new Date(Date.today().setMonth(2).moveToLastDayOfMonth()) : 
				(Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().setMonth(5)).moveToLastDayOfMonth() :
				(Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().setMonth(8)).moveToLastDayOfMonth() : new Date(Date.today().setMonth(11)).moveToLastDayOfMonth()
		], 'Last Quarter' : [
				Date.today().getMonth() < 3 ? new Date(Date.today().add({ years : -1 }).setMonth(9)).moveToFirstDayOfMonth() : 
				(Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().setMonth(0)).moveToFirstDayOfMonth() :
				(Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().setMonth(3)).moveToFirstDayOfMonth() : new Date(Date.today().setMonth(6)).moveToFirstDayOfMonth(), 
				Date.today().getMonth() < 3 ? new Date(Date.today().add({ years : -1 }).setMonth(11)).moveToLastDayOfMonth() : 
				(Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().setMonth(2)).moveToLastDayOfMonth() :
				(Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().setMonth(5)).moveToLastDayOfMonth() : new Date(Date.today().setMonth(8)).moveToLastDayOfMonth()
		], 'This Year' : [
				new Date(Date.today().setMonth(0)).moveToFirstDayOfMonth(), new Date(Date.today().setMonth(11)).moveToLastDayOfMonth()
		], 'Last Year' : [
				new Date(Date.today().setMonth(0)).add({ years : -1 }).moveToFirstDayOfMonth(), new Date(Date.today().setMonth(11)).add({ years : -1 }).moveToLastDayOfMonth()
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

	if ($('#type').length > 0)
	{
		// Get Frequency
		
		$('#type').change(function()
		{
			callback();
		});
	}
	fillSelect("owner", "core/api/users", undefined, function()
			{
				$('#owner').change(function()
				{

					callback();
				});

	}, '<option class="default-select" value="{{id}}">{{name}}</option>', false, undefined, "All Owners");

	callback();
}


/** .
* 
* @param callback -
*            callback method if any.
*/
function initReportsForCalls(callback){
	

	head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', function()
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
		] }, locale : { applyLabel : 'Apply', cancelLabel : 'Cancel', fromLabel : 'From', toLabel : 'To', customRangeLabel : 'Custom', daysOfWeek : [
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
	});
	
	callback();
	
	$('#typeCall').change(function()
		{
			callback();
		});
	
	fillSelect("users", "core/api/users", undefined, function()
			{
				$('#users').change(function()
				{

					callback();
				});

			}, '<option class="default-select" value="{{id}}">{{name}}</option>', false, undefined, "All Users");
	
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
  function showDealsGrowthReport()
{
// Options
    var options = "";

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
    var d = new Date();
    start_time=start_time+(d.getTimezoneOffset()*60*1000);
    start_time=start_time/1000;
    var end_value = $.trim(range[1]);

    // To make end value as end time of day
    if (end_value)
        end_value = end_value + " 23:59:59";

    // Returns milliseconds from end date.
    //var end_time = Date.parse(end_value).valueOf();
    //Get the GMT end time
    var end_time = getUTCMidNightEpochFromDate(new Date(end_value));

    end_time += (((23*60*60)+(59*60)+59)*1000);
    end_time=end_time+(d.getTimezoneOffset()*60*1000);
    end_time=end_time/1000;

    if ($('#owner').length > 0)
	{
		// Get User
		var owner_id=0;
		if ($("#owner").val() != "" && $("#owner").val() != "All Owners")
			owner_id=$("#owner").val();
			options += owner_id;
	}
    // Adds start_time, end_time to params.
    options += ("?min=" + start_time + "&max=" + end_time);
        if ($('#frequency').length > 0)
    {
        // Get Frequency
        var frequency = $("#frequency").val();
        options += ("&frequency=" + frequency);
    }
        if ($('#type').length > 0)
        {
            // Get Frequency
            var type = $("#type").val();
            options += ("&type=" + type);
        }


    showDealsGrowthgraph('core/api/opportunity/details/' + options, 'deals-chart', '', '',true);

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
