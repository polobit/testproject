/** Closing the datepicker on back and forward button **/
$(function(){
window.onhashchange = function (e) {
	
	$('.daterangepicker').hide();
	$('.contact_popover').remove();
	$('.contact_popover').hide();
}
});
/**
 * Initializes the date-range-picker and other filters. Calls the callback when
 * the date range is selected.
 * 
 * @param campaign_id -
 *            to show charts w.r.t campaign-id.
 * @param callback -
 *            callback method if any.
 */
function initFunnelCharts(callback)
{

	// Init the callback for daterange
	initDateRange(callback);
	
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

	}, '<option class="default-select" value="{{id}}">{{name}}</option>', false, undefined, "{{agile_lng_translate 'portlets' 'all-contacts'}}");

    fillSelect("track", "/core/api/milestone/pipelines", undefined, function()
		{
			$('#track').change(function()
			{
				callback();
			});
	}, '<option class="default-select" value="{{id}}">{{name}}</option>', false, undefined, "{{agile_lng_translate 'report-add' 'all-tracks'}}");


	if ($('#type').length > 0)
	{
		// Get Frequency
		
		$('#type').change(function()
		{
			callback();
		});
	}
	fillSelect("owner", "core/api/users/partial", undefined, function()
			{
				$('#owner').change(function()
				{

					callback();
				});

	}, '<option class="default-select" value="{{id}}">{{name}}</option>', false, undefined, "{{agile_lng_translate 'report-add' 'all-owners'}}");
    
    var sources = new Base_Collection_View({url : '/core/api/categories?entity_type=DEAL_SOURCE', sort_collection: false});
		sources.collection.fetch({
			success: function(data){
				var jsonModel = data.toJSON();
				var html =  '<option class="default-select" value="">'+_agile_get_translated_val('report-add','all-sources')+'</option>' + 
							'<option class="default-select" value="1">'+_agile_get_translated_val('report-add','unknown')+'</option>';
				
				$.each(jsonModel,function(index,dealSource){
					html+='<option class="default-select" value="'+dealSource.id+'">'+dealSource.label+'</option>';
				});
				$('#source', $('#content')).html(html);

				// Hide loading bar
				hideTransitionBar();

				$('#source').change(function()
				{
					callback();
				});
			}
		});
	
	callback();
}


/** .
* 
* @param callback -
*            callback method if any.
*/
function initReportsForCalls(callback){
	

	initDateRange(callback);

	callback();
	
	if ($('#frequency').length > 0)
	{
		// Get Frequency
		$('#frequency').change(function()
		{
			callback();
		});
	}
	
	$('#typeCall').change(function()
		{
			callback();
		});
	
	fillSelect("users", "core/api/users/partial", undefined, function()
			{
				$('#users').change(function()
				{

					callback();
				});

			}, '<option class="default-select" value="{{id}}">{{name}}</option>', false, undefined, "{{agile_lng_translate 'report-view' 'all-users'}}");
	
}

/**
 * Shows Funnel Graphs based on the tags
 */
function showFunnelGraphs(tags)
{
	console.log("Showing funnel logs");
	showFunnel('core/api/reports/funnel/' + tags + getOptions(), 'funnel-chart', _agile_get_translated_val('report-add','funnel-reports') , true);
}

/**
 * Shows Growth Graphs based on the tags
 */
function showGrowthGraphs(tags)
{
	showAreaSpline('core/api/reports/growth/' + tags + getOptions(), 'growth-chart', '', '', true);
}

/**
 * Shows Ratio Graphs based on the tags
 */
function showRatioGraphs(tag1, tag2)
{
	showLine('core/api/reports/ratio/' + tag1 + "/" + tag2 + "/" + getOptions(), 'ratio-chart', _agile_get_translated_val('reports','ratio-analysis'), tag1 + ' vs ' + tag2, true);
}
function initSalesCharts(callback){

	initDateRange(callback);
		// Init the callback when the frequency selector changes too
		if ($('#frequency').length > 0)
			{
		// Get Frequency
			$('#frequency').change(function()
			{
			callback();
			});
		}
			// Init the callback when the track selector changes too
		fillSelect("track", "/core/api/milestone/pipelines", undefined, function()
		{
			$('#track').change(function()
			{
				callback();
			});
		}, '<option class="default-select" value="{{id}}">{{name}}</option>', false, undefined, "{{agile_lng_translate 'report-add' 'all-tracks'}}");

		fillSelect("owner", "core/api/users/partial", undefined, function()
		{
			$('#owner').change(function()
			{
				callback();
			});

		}, '<option class="default-select" value="{{id}}">{{name}}</option>', false, undefined, "{{agile_lng_translate 'report-add' 'all-owners'}}");

		/*fillSelect("source", "/core/api/categories?entity_type=DEAL_SOURCE", undefined, function()
		{
			
			$('#source option').eq(0).after($('<option class="default-select" value="1">Unknown</option>'));
			$('#source').change(function()
			{
				callback();
			});

		}, '<option class="default-select" value="{{id}}">{{label}}</option>', false, undefined, "All Sources");*/

		var sources = new Base_Collection_View({url : '/core/api/categories?entity_type=DEAL_SOURCE', sort_collection: false});
		sources.collection.fetch({
			success: function(data){
				var jsonModel = data.toJSON();
				var html =  '<option class="default-select" value="">'+_agile_get_translated_val('report-add','all-sources')+'</option>' + 
							'<option class="default-select" value="1">'+_agile_get_translated_val('report-add','unknown')+'</option>';
				
				$.each(jsonModel,function(index,dealSource){
					html+='<option class="default-select" value="'+dealSource.id+'">'+dealSource.label+'</option>';
				});
				$('#source', $('#content')).html(html);

				// Hide loading bar
				hideTransitionBar();

				$('#source').change(function()
				{
					callback();
				});
			}
		});
		
		callback();

		
		
	}

function showDealsGrowthReport()
{
// Options
    var options = "";

    // Get Date Range January 22, 2015 - January 28, 2015
    var range = $('#range').html().split("-");
    
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

function showWonDealsReport()
{
// Options
    var options = "";

    // Get Date Range January 22, 2015 - January 28, 2015
    var range = $('#range').html().split("-");
    
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
    var owner_id=0;
        if ($("#owner").val() != "" && $("#owner").val() != "All Owners")
            owner_id=$("#owner").val();
            options += owner_id;
    }

    if ($('#track').length > 0)
	{
		// Get track
		var track = 0;
		if($("#track").val() != "" &&  $("#track").val() != "All Tracks")
			track=$("#track").val();
			options +=('/'+ track);

	}
	if ($('#source').length > 0)
	{
		// Get source
		var source = 0;
		if($("#source").val() != "" &&  $("#source").val() != "All Sources")
		source=$("#source").val();
		options += ("/" + source);
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
    showDealsGrowthgraph('core/api/opportunity/won_deals/'+options, 'won-deals-chart', '', '',true);

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
function showsalesReportGraphs()
{
	var options='';
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

	//end_time += (((23*60*60)+(59*60)+59)*1000);

	// Adds start_time, end_time and timezone offset to params.
	var d = new Date();
	start_time=start_time+(d.getTimezoneOffset()*60*1000);
	 end_time += (((23*60*60)+(59*60)+59)*1000);
	end_time=end_time+(d.getTimezoneOffset()*60*1000);


	if ($('#owner').length > 0)
	{

		// Get User
		var owner_id=0;
		if ($("#owner").val() != "" && $("#owner").val() != "All Owners")
			owner_id=$("#owner").val();
			options += owner_id;
	}
	
	if ($('#track').length > 0)
	{
		// Get Frequency
		var track = 0;
		if($("#track").val() != "" &&  $("#track").val() != "All Tracks")
			track=$("#track").val();
			options +=('/'+ track);

	}

	if ($('#source').length > 0)
	{
		// Get source
		var source = 0;
		if($("#source").val() != "" &&  $("#source").val() != "All Sources")
			source=$("#source").val();
			options +=('/'+ source);

	}
	options += ("?min=" + start_time/1000 + "&max=" + end_time/1000);
	if ($('#frequency').length > 0)
	{
		// Get Frequency
		var frequency = $("#frequency").val();
		options += ("&frequency=" + frequency);
	}
	// If Frequency is present - send frequency too
	var frequency = $( "#frequency:visible").val();

	showDealAreaSpline('core/api/opportunity/stats/details/'+options,'revenue-chart','','',true,frequency);

}


function initUserReports(callback){
	
	initDateRange(callback);

	callback();	

		fillSelect("owner", "core/api/users/partial", undefined, function()
		{
			$('#owner').change(function()
			{
				callback();
			});

		}, '<option class="default-select" value="{{id}}">{{name}}</option>', false, undefined, "{{agile_lng_translate 'report-add' 'all-owners'}}");
		
	}


   
function showLossReasonGraphs()


{
	var options='';

	// Get Date Range January 22, 2015 - January 28, 2015
	var range = $('#range').html().split("-");
	var start_time = getUTCMidNightEpochFromDate(new Date(range[0]));

	var end_value = $.trim(range[1]);

	// To make end value as end time of day
	if (end_value)
		end_value = end_value + " 23:59:59";

	var end_time = getUTCMidNightEpochFromDate(new Date(end_value));

	// Adds start_time, end_time and timezone offset to params.
	var d = new Date();
	start_time=start_time+(d.getTimezoneOffset()*60*1000);
	 end_time += (((23*60*60)+(59*60)+59)*1000);
	end_time=end_time+(d.getTimezoneOffset()*60*1000);


	if ($('#owner').length > 0)
	{
		// Get owner
		var owner_id=0;
		if ($("#owner").val() != "" && $("#owner").val() != "All Owners")
			owner_id=$("#owner").val();
			options += owner_id;
	}
	
	if ($('#track').length > 0)
	{
		// Get track
		var track = 0;
		if($("#track").val() != "" &&  $("#track").val() != "All Tracks")
			track=$("#track").val();
			options +=('/'+ track);

	}
	if ($('#source').length > 0)
	{
		// Get source
		var source = 0;
		if($("#source").val() != "" &&  $("#source").val() != "All Sources")
		source=$("#source").val();
		options += ("/" + source);
	}
	options += ("?min=" + start_time/1000 + "&max=" + end_time/1000);
	
	
	pieforReports('core/api/opportunity/details/'+options,'lossreasonpie-chart','',true);
}

function showLossReasonGraphForUserReports(){
	

	var options='';

	// Get Date Range January 22, 2015 - January 28, 2015
	var range = $('#range').html().split("-");
	var start_time = getUTCMidNightEpochFromDate(new Date(range[0]));

	var end_value = $.trim(range[1]);

	// To make end value as end time of day
	if (end_value)
		end_value = end_value + " 23:59:59";

	var end_time = getUTCMidNightEpochFromDate(new Date(end_value));

	// Adds start_time, end_time and timezone offset to params.
	var d = new Date();
	start_time=start_time+(d.getTimezoneOffset()*60*1000);
	 end_time += (((23*60*60)+(59*60)+59)*1000);
	end_time=end_time+(d.getTimezoneOffset()*60*1000);


	if ($('#owner').length > 0)
	{
		// Get owner
		var owner_id=0;
		if ($("#owner").val() != "" && $("#owner").val() != "All Owners")
			owner_id=$("#owner").val();
			options += owner_id;
	}
	//options += CURRENT_DOMAIN_USER.id;
	
		// Get track
		var track = 0;
		options +=('/'+ track);
	
		// Get source
		var source = 0;
		options += ("/" + source);
	
	options += ("?min=" + start_time/1000 + "&max=" + end_time/1000);
	
	
	pieforReports('core/api/opportunity/details/'+options,'lossreasonpie-chart-users','',true);

	
}

function salesReportGraphForUserReports(){
	
	

	var options='';
	// Get Date Range January 22, 2015 - January 28, 2015
	var range = $('#range').html().split("-");

	var start_time = getUTCMidNightEpochFromDate(new Date(range[0]));

	var end_value = $.trim(range[1]);

	// To make end value as end time of day
	if (end_value)
		end_value = end_value + " 23:59:59";

	var end_time = getUTCMidNightEpochFromDate(new Date(end_value));

	var d = new Date();
	start_time=start_time+(d.getTimezoneOffset()*60*1000);
	 end_time += (((23*60*60)+(59*60)+59)*1000);
	end_time=end_time+(d.getTimezoneOffset()*60*1000);


	if ($('#owner').length > 0)
	{
		// Get Frequency
		var owner_id=0;
		if ($("#owner").val() != "" && $("#owner").val() != "All Owners")
			owner_id=$("#owner").val();
			options += owner_id;
	}
	
	
		// Get Frequency
		var track = 0;
		options +=('/'+ track);
		
			// Get source
		var source = 0;
		options +=('/'+ source);


	   options += ("?min=" + start_time/1000 + "&max=" + end_time/1000);
	
		// Default frequency for the user report is set to weekly
		var frequency = "monthly";
		//options += ("&frequency=" + frequency);

	showDealAreaSpline('core/api/opportunity/stats/details/'+options,'revenue-chart-users','','',true,undefined);

	
}

function showWonPieChart()
{
var options='';

	// Get Date Range January 22, 2015 - January 28, 2015
	var range = $('#range').html().split("-");
	var start_time = getUTCMidNightEpochFromDate(new Date(range[0]));

	var end_value = $.trim(range[1]);

	// To make end value as end time of day
	if (end_value)
		end_value = end_value + " 23:59:59";


	var end_time = getUTCMidNightEpochFromDate(new Date(end_value));

	// Adds start_time, end_time and timezone offset to params.
	var d = new Date();
	start_time=start_time+(d.getTimezoneOffset()*60*1000);
	 end_time += (((23*60*60)+(59*60)+59)*1000);
	end_time=end_time+(d.getTimezoneOffset()*60*1000);


	if ($('#owner').length > 0)
	{
		// Get owner
		var owner_id=0;
		if ($("#owner").val() != "" && $("#owner").val() != "All Owners")
			owner_id=$("#owner").val();
			options += owner_id;
	}
	
	options += ("?min=" + start_time/1000 + "&max=" + end_time/1000);
	
	
	pieforReports('core/api/opportunity/wonDetails/'+options,'wonpie-chart','',true);
}

/** Initialising date range for various report* */
function initDateRange(callback) {
    initReportLibs(function() {

        $('.daterangepicker').remove();
        // Bootstrap date range picker.
        $('#reportrange').daterangepicker({
            ranges: {
                '{{agile_lng_translate "calendar" "Today"}}': [
                    'today', 'today'
                ],
                '{{agile_lng_translate "calendar" "Yesterday"}}': [
                    'yesterday', 'yesterday'
                ],
                '{{agile_lng_translate "portlets" "last-7-days"}}': [
                    Date.today().add({
                        days: -6
                    }), 'today'
                ],
                '{{agile_lng_translate "portlets" "last-30-days"}}': [
                    Date.today().add({
                        days: -29
                    }), 'today'
                ],
                '{{agile_lng_translate "portlets" "this-month"}}': [
                    Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()
                ],
                '{{agile_lng_translate "portlets" "last-month"}}': [
                    Date.today().moveToFirstDayOfMonth().add({
                        months: -1
                    }), Date.today().moveToFirstDayOfMonth().add({
                        days: -1
                    })
                ],
                '{{agile_lng_translate "portlets" "this-quarter"}}': [
                    Date.today().getMonth() < 3 ? new Date(Date.today().setMonth(0)).moveToFirstDayOfMonth() :
                    (Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().setMonth(3)).moveToFirstDayOfMonth() :
                    (Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().setMonth(6)).moveToFirstDayOfMonth() : new Date(Date.today().setMonth(9)).moveToFirstDayOfMonth(),
                    Date.today().getMonth() < 3 ? new Date(Date.today().setMonth(2)).moveToLastDayOfMonth() :
                    (Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().setMonth(5)).moveToLastDayOfMonth() :
                    (Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().setMonth(8)).moveToLastDayOfMonth() : new Date(Date.today().setMonth(11)).moveToLastDayOfMonth()
                ],
                '{{agile_lng_translate "portlets" "last-quarter"}}': [
                    Date.today().getMonth() < 3 ? new Date(Date.today().add({
                        years: -1
                    }).setMonth(9)).moveToFirstDayOfMonth() :
                    (Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().setMonth(0)).moveToFirstDayOfMonth() :
                    (Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().setMonth(3)).moveToFirstDayOfMonth() : new Date(Date.today().setMonth(6)).moveToFirstDayOfMonth(),
                    Date.today().getMonth() < 3 ? new Date(Date.today().add({
                        years: -1
                    }).setMonth(11)).moveToLastDayOfMonth() :
                    (Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().setMonth(2)).moveToLastDayOfMonth() :
                    (Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().setMonth(5)).moveToLastDayOfMonth() : new Date(Date.today().setMonth(8)).moveToLastDayOfMonth()
                ],
                '{{agile_lng_translate "portlets" "this-year"}}': [
                    new Date(Date.today().setMonth(0)).moveToFirstDayOfMonth(), new Date(Date.today().setMonth(11)).moveToLastDayOfMonth()
                ],
                '{{agile_lng_translate "portlets" "last-year"}}': [
                    new Date(Date.today().setMonth(0)).add({
                        years: -1
                    }).moveToFirstDayOfMonth(), new Date(Date.today().setMonth(11)).add({
                        years: -1
                    }).moveToLastDayOfMonth()
                ]
            },
            locale: {
                applyLabel: '{{agile_lng_translate "calendar" "Apply"}}',
	            clearLabel: '{{agile_lng_translate "deal-view" "clear"}}',
	            fromLabel: '{{agile_lng_translate "calendar" "from"}}',
	            toLabel: '{{agile_lng_translate "calendar" "to"}}',
	            customRangeLabel: '{{agile_lng_translate "campaigns" "custom"}}',
                daysOfWeek: $.fn.datepicker.dates['en'].daysExactMin,
                monthNames: $.fn.datepicker.dates['en'].months,
                firstDay: parseInt(CALENDAR_WEEK_START_DAY)
            }
        }, function(start, end) {
            if (start && end) {
                var months_diff = Math.abs(start.getMonth() - end.getMonth() + (12 * (start.getFullYear() - end.getFullYear())));
                $('#reportrange span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
                $("#week-range").html(end.add({
                    days: -6
                }).toString('MMMM d, yyyy') + ' - ' + end.add({
                    days: 6
                }).toString('MMMM d, yyyy'));
            } else {
                $('#reportrange span').html(Date.today().add({
                    days: -6
                }).toString('MMMM d, yyyy') + '-' + Date.today().toString('MMMM d, yyyy'));
                $('.daterangepicker > .ranges > ul > li').each(function() {
                    $(this).removeClass("active");
                });
            }
            callback();
        });
        $('.daterangepicker > .ranges > ul').on("click", "li", function(e) {
            $('.daterangepicker > .ranges > ul > li').each(function() {
                $(this).removeClass("active");
            });
            $(this).addClass("active");
        });

    });

}


function showRepPerformanceReport()
{

	var options='';

	// Get Date Range January 22, 2015 - January 28, 2015
	var range = $('#range').html().split("-");
	var start_time = getUTCMidNightEpochFromDate(new Date(range[0]));

	var end_value = $.trim(range[1]);

	// To make end value as end time of day
	if (end_value)
		end_value = end_value + " 23:59:59";


	var end_time = getUTCMidNightEpochFromDate(new Date(end_value));

	// Adds start_time, end_time and timezone offset to params.
	var d = new Date();
	start_time=start_time+(d.getTimezoneOffset()*60*1000);
	 end_time += (((23*60*60)+(59*60)+59)*1000);
	end_time=end_time+(d.getTimezoneOffset()*60*1000);

	if ($('#owner').length > 0)
	{
		// Get owner
		var owner_id=0;
		if ($("#owner").val() != "")
			owner_id=$("#owner").val();
			options += owner_id;
	}

	//options += CURRENT_DOMAIN_USER.id;
	options += ("?min=" + start_time/1000 + "&max=" + end_time/1000);
		report_utility.getRepPerformanceLog('core/api/reports/repPerformance/' + options);

			//console.log(resp);
		

}

function initRepReports(callback) {
    initReportLibs(function() {

        $('.daterangepicker').remove();
        // Bootstrap date range picker.
        $('#reportrange').daterangepicker({
            ranges: {
                '{{agile_lng_translate "portlets" "this-month"}}': [
                    Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()
                ],
                '{{agile_lng_translate "portlets" "last-month"}}': [
                    Date.today().moveToFirstDayOfMonth().add({
                        months: -1
                    }), Date.today().moveToFirstDayOfMonth().add({
                        days: -1
                    })
                ],
                '{{agile_lng_translate "portlets" "this-quarter"}}': [
                    Date.today().getMonth() < 3 ? new Date(Date.today().setMonth(0)).moveToFirstDayOfMonth() :
                    (Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().setMonth(3)).moveToFirstDayOfMonth() :
                    (Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().setMonth(6)).moveToFirstDayOfMonth() : new Date(Date.today().setMonth(9)).moveToFirstDayOfMonth(),
                    Date.today().getMonth() < 3 ? new Date(Date.today().setMonth(2)).moveToLastDayOfMonth() :
                    (Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().setMonth(5)).moveToLastDayOfMonth() :
                    (Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().setMonth(8)).moveToLastDayOfMonth() : new Date(Date.today().setMonth(11)).moveToLastDayOfMonth()
                ],
                '{{agile_lng_translate "portlets" "last-quarter"}}': [
                    Date.today().getMonth() < 3 ? new Date(Date.today().add({
                        years: -1
                    }).setMonth(9)).moveToFirstDayOfMonth() :
                    (Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().setMonth(0)).moveToFirstDayOfMonth() :
                    (Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().setMonth(3)).moveToFirstDayOfMonth() : new Date(Date.today().setMonth(6)).moveToFirstDayOfMonth(),
                    Date.today().getMonth() < 3 ? new Date(Date.today().add({
                        years: -1
                    }).setMonth(11)).moveToLastDayOfMonth() :
                    (Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().setMonth(2)).moveToLastDayOfMonth() :
                    (Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().setMonth(5)).moveToLastDayOfMonth() : new Date(Date.today().setMonth(8)).moveToLastDayOfMonth()
                ],
                '{{agile_lng_translate "portlets" "this-year"}}': [
                    new Date(Date.today().setMonth(0)).moveToFirstDayOfMonth(), new Date(Date.today().setMonth(11)).moveToLastDayOfMonth()
                ],
                '{{agile_lng_translate "portlets" "last-year"}}': [
                    new Date(Date.today().setMonth(0)).add({
                        years: -1
                    }).moveToFirstDayOfMonth(), new Date(Date.today().setMonth(11)).add({
                        years: -1
                    }).moveToLastDayOfMonth()
                ]
            },
            locale: {
                applyLabel: '{{agile_lng_translate "calendar" "Apply"}}',     
	            clearLabel: '{{agile_lng_translate "deal-view" "clear"}}',
	            fromLabel: '{{agile_lng_translate "calendar" "from"}}',
	            toLabel: '{{agile_lng_translate "calendar" "to"}}',
	            customRangeLabel: '{{agile_lng_translate "campaigns" "custom"}}',
                minViewMode: 'month',
                dateLimit: 'month',
                startDate: Date.today().moveToFirstDayOfMonth(),
                endDate: Date.today().moveToLastDayOfMonth(),
                daysOfWeek: $.fn.datepicker.dates['en'].daysExactMin,
                monthNames: $.fn.datepicker.dates['en'].months,
                firstDay: parseInt(CALENDAR_WEEK_START_DAY)
            }
        }, function(start, end) {
            if (start && end) {
                var months_diff = Math.abs(start.getMonth() - end.getMonth() + (12 * (start.getFullYear() - end.getFullYear())));
                $('#reportrange span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
                $("#week-range").html(end.add({
                    days: -6
                }).toString('MMMM d, yyyy') + ' - ' + end.add({
                    days: 6
                }).toString('MMMM d, yyyy'));
            } else {
                $('#reportrange span').html(Date.today().moveToFirstDayOfMonth().toString('MMMM d, yyyy') + '-' + Date.today().moveToLastDayOfMonth().toString('MMMM d, yyyy'));
                $('.daterangepicker > .ranges > ul > li').each(function() {
                    $(this).removeClass("active");
                });
            }
            callback();
        });
        $('.daterangepicker > .ranges > ul').on("click", "li", function(e) {
            $('.daterangepicker > .ranges > ul > li').each(function() {
                $(this).removeClass("active");
            });
            $(this).addClass("active");
        });
        $('.daterangepicker > .ranges > ul li:last-child').hide();
        $('.daterangepicker  .range_inputs').hide();
        $('.daterangepicker > .ranges > ul li:last-child').prev().removeClass('b-b');

    });


    fillSelect("owner", "core/api/users/partial", undefined, function() {
        $('select[id="owner"]').find('option[value="' + CURRENT_DOMAIN_USER.id + '"]').attr("selected", true);
        callback();
        $('#owner').change(function() {
            callback();
        });

    }, '<option class="default-select" value="{{id}}">{{name}}</option>', false, undefined);
}

function initComparisonReports(callback){
	
	initDateRange(callback);

	
	// Init the callback when the track selector changes too
		fillSelect("pipeline_track", "/core/api/milestone/pipelines", undefined, function()
		{
			//if (_agile_get_prefs("agile_deal_track"))
           // pipeline_id = _agile_get_prefs("agile_deal_track");

			$('select[id="pipeline_track"]').find('option[value=""]').remove();
			        	callback();
			$('#pipeline_track').change(function()
			{
				callback();
			});
		}, '<option class="default-select" value="{{id}}">{{name}}</option>', false, undefined, "");

	}
function showComparisonReportGraph()
{
		url='/core/api/opportunity/conversionRate/0';
		url=url+getSelectedDates();
		if ($('#pipeline_track').length > 0)
	{
		// Get owner
		var track_id=0;
		if ($("#pipeline_track").val() != ""){
			track_id=$("#pipeline_track").val();
			url += '&track-id='+track_id;
			BubbleChart(url,'comparison-chart','',true);
		}
	}
	
}

