
var ACTIVITY_FILTER="activity-filters-cookie";

var ACTIVITY_FILTER_JSON={};

function includeTimeAgo(element)
{
	agileTimeAgoWithLngConversion($("time", element));
}


function buildActivityFilters(name,valueid,clickedFrom){
   
   		console.log("name = "+name);
		if(clickedFrom=='entityDropDown'){
			var dashboard_name = _agile_get_prefs("dashboard_"+CURRENT_DOMAIN_USER.id);
			var dashboard = dashboard_name;
			var entities = {entity:name,entityId:valueid};
			if(!ACTIVITY_FILTER_JSON.hasOwnProperty(dashboard_name)){

				ACTIVITY_FILTER_JSON[dashboard] = entities;
			}
			if(ACTIVITY_FILTER_JSON[dashboard_name].entity != name){
				ACTIVITY_FILTER_JSON[dashboard] = entities;
			}
		/*ACTIVITY_FILTER_JSON.entity=name;
		ACTIVITY_FILTER_JSON.entityId=valueid;*/
		}
		else if(clickedFrom=='userDropDown'){
		ACTIVITY_FILTER_JSON.user=name;
		ACTIVITY_FILTER_JSON.userId=valueid;
		}

		_agile_set_prefs(ACTIVITY_FILTER,JSON.stringify(ACTIVITY_FILTER_JSON));


}
/**
 * To show the dates or time in words of time-ago plugin.
 * 
 * @param element
 * 
 * 
 * 
 * updateData() method updates chat sessions on page for different query's from
 * user
 * 
 * @param params
 *            query string contains date, agentId & widgetId
 */
function renderActivityView(params)
{
	// Creates backbone collection view

	this.activitiesview = new Base_Collection_View({ url : '/core/api/activitylog/getActivitiesOnSelectedCondition' + params, sortKey : 'time',

		descending : true, templateKey : "activity-list-log", sort_collection : false, cursor : true, scroll_symbol : 'scroll', page_size : getMaximumPageSize(),
		individual_tag_name : 'li', postRenderCallback : function(el)
		{
			includeTimeAgo(el);
			initializeActivitiesListner(el);
			initializeEventListners(el);
			contactListener(el);

			initializeWorkflowBackupListener(el);
		}, appendItemCallback : function(el)
		{
			includeTimeAgo(el);
			initializeWorkflowBackupListener(el);
		}

	});
	activitiesview.appendItem = append_activity_log;
	// Fetches data from server
	this.activitiesview.collection.fetch();

	// Renders data to activity list page.
	$('#activity-list-based-condition').html(this.activitiesview.render().el);

}

/**
 * getParameters() method returns a string(used as query param string) contains
 * user selected type and entity type
 * 
 * @returns {String} query string
 */
function getActivityFilterParameters(loadingFirstTime,campaignHistory)
{
	$("#activities_date_range").show();
	var params = "?";


	var user =null;
	var entitytype=null;
	// Get Date Range
	var range = $('#activities_date_range #range').html().split("-");
	var dashboard_name = _agile_get_prefs("dashboard_"+CURRENT_DOMAIN_USER.id);

	if (range)
	{
		//var start_time = Date.parse($.trim(range[0])).valueOf();
		//Get the GMT start time
		var start_time = getUTCMidNightEpochFromDate(_agile_date_utility.get_date_from_string($.trim(range[0])));

		var end_value = $.trim(range[1]);

		// To make end value as end time of day
		if (end_value)
			end_value = end_value + " 23:59:59";

		// Returns milliseconds from end date.
		//var end_time = Date.parse(end_value).valueOf();
		var end_time = getUTCMidNightEpochFromDate(_agile_date_utility.get_date_from_string(end_value));
		
		end_time += (((23*60*60)+(59*60)+59)*1000);

		// Adds start_time, end_time and timezone offset to params.
		params += ("start_time=" + start_time + "&end_time=" + end_time);

	}
	

	if(loadingFirstTime){
		var activityFilters=JSON.parse(_agile_get_prefs(ACTIVITY_FILTER));
		if(activityFilters)
		{
			var entityId;
			var entitytype_dashboard;
			user=activityFilters.userId;
			if(activityFilters[dashboard_name] != undefined){
				entityId = activityFilters[dashboard_name].entityId;
				entitytype_dashboard = activityFilters[dashboard_name].entity;
				console.log("saddfasda");
			}
			if(entityId)
			{
				entitytype=entityId;
				if(campaignHistory)
				{
					entitytype='ALL';
					$("#activities_date_range").hide();
				}
			}
			else if(campaignHistory)
			{
				entitytype='ALL';
				$("#activities_date_range").hide();
			}
			else
				entitytype='ALL';
		}

		else{
			if(campaignHistory)
			  {
				entitytype='ALL';
				$("#activities_date_range").hide();
			   }
			entitytype="ALL";
		}
		if(user)
		params += ("&user_id=" + user);
		params += ("&entity_type=" + entitytype);
		var dashboard_name = _agile_get_prefs("dashboard_"+CURRENT_DOMAIN_USER.id);
		 if(!dashboard_name || dashboard_name == undefined ){
		    dashboard_name = "SalesDashboard";
		 }
		
		var b =[];
		var listItems= "";

			if(entitytype == "ALL"){
				$(".dashboard-activities li").each(function( index ) {
					var eachLi = $(".dashboard-activities li");
					b.push($(eachLi[index]).attr("data-type"));
				});
				var indexofall = b.indexOf("ALL");
				b.splice(indexofall,1);	
				listItems = b.join(',');
			}
			else{
				b.push(entitytype);
				listItems = b.join(',');
			}


		params += ("&activityTypeArray=" +listItems );

		return params;
	}

	// Returns milliseconds from start date. For e.g., August 6, 2013 converts
	// to 1375727400000

	// Get task type and append it to params
	 user = $('#user-select').data("selected_item");

	 entitytype = $('#entity_type').data("selected_item");

	 //For change campaign activity url to activity url
	 document.location.hash = "activities";
	
	 var dashboard_name = _agile_get_prefs("dashboard_"+CURRENT_DOMAIN_USER.id);
     if(!dashboard_name || dashboard_name == undefined ){
        dashboard_name = "SalesDashboard";
     }
    

	var allListItemsinDropdown =  $(".dashboard-activities li");




	if (user)
		params += ("&user_id=" + user);
	// Get owner name and append it to params

	var b= [];
	var listItems= "";
	if (entitytype == 'TASK')
	{
		params += ("&entity_type=" + entitytype);
		b.push(entitytype);
		listItems = b.join(",");
		params += ("&activityTypeArray=" +listItems);
		return params;
	}

	else if (entitytype == 'DEAL')
	{
		params += ("&entity_type=" + entitytype);
		b.push(entitytype);
		listItems = b.join(",");
		params += ("&activityTypeArray=" +listItems);
		return params;
	}
	else if (entitytype == 'USER')
	{
		params += ("&entity_type=" + entitytype);
		b.push(entitytype);
		listItems = b.join(",");
		params += ("&activityTypeArray=" +listItems);
		return params;
	}

	else if (entitytype == 'EVENT')
	{
		params += ("&entity_type=" + entitytype);
		b.push(entitytype);
		listItems = b.join(",");
		params += ("&activityTypeArray=" +listItems);
		return params;
	}
	else if (entitytype == 'EMAIL_SENT')
	{
		params += ("&entity_type=" + entitytype);
		b.push(entitytype);
		listItems = b.join(",");
		params += ("&activityTypeArray=" +listItems);
		return params;
	}
    else if (entitytype == 'EMAIL_SENT')
	{
		params += ("&entity_type=" + entitytype);
		return params;
	}

	else if (entitytype == 'CONTACT')
	{
		params += ("&entity_type=" + entitytype);
		b.push(entitytype);
		listItems = b.join(",");
		params += ("&activityTypeArray=" +listItems);
		return params;
	}
	else if (entitytype == 'DOCUMENT')
	{
		params += ("&entity_type=" + entitytype);
		b.push(entitytype);
		listItems = b.join(",");
		params += ("&activityTypeArray=" +listItems);
		return params;
	}
	else if (entitytype == 'CALL')
	{
		params += ("&entity_type=" + entitytype);
		b.push(entitytype);
		listItems = b.join(",");
		params += ("&activityTypeArray=" +listItems);
		return params;
	}
	else if (entitytype == 'TICKET')
	{
		params += ("&entity_type=" + entitytype);
		b.push(entitytype);
		listItems = b.join(",");
		params += ("&activityTypeArray=" +listItems);
		return params;
	}
	else if (entitytype == 'CAMPAIGN')
	{
		params += ("&entity_type=" + entitytype);
		b.push(entitytype);
		listItems = b.join(",");
		params += ("&activityTypeArray=" +listItems);
		return params;
	}
	else if (entitytype == 'SMS_SENT')
	{
		params += ("&entity_type=" + entitytype);
		b.push(entitytype);
		listItems = b.join(",");
		params += ("&activityTypeArray=" +listItems);
		return params;
	}
	else 
	{
		params += ("&entity_type=ALL");
		$(".dashboard-activities li").each(function( index ) {
			var eachLi = $(".dashboard-activities li");
			b.push($(eachLi[index]).attr("data-type"));
		});
		var indexofall = b.indexOf("ALL");
		b.splice(indexofall,1);	
		listItems = b.join(',');
		params += ("&activityTypeArray=" + listItems);
		return params;
	}
	
	
	return params;
}

function initActivitiesDateRange() {
    $('#activities_date_range').daterangepicker({
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
            $('#activities_date_range #range').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));

            renderActivityView(getActivityFilterParameters());
        } else {
            var from_date = Date.parse('today');
            var to_date = Date.today().add({
                days: parseInt(-6)
            });
            $('#activities_date_range #range').html(to_date.toString('MMMM d, yyyy') + " - " + from_date.toString('MMMM d, yyyy'));
            renderActivityView(getActivityFilterParameters());

            $('.daterangepicker > .ranges > ul > li.active').removeClass("active");
        }
    });
    $('.daterangepicker > .ranges > ul').on("click", "li", function(e) {
        $('.daterangepicker > .ranges > ul > li').each(function() {
            $(this).removeClass("active");
        });
        $(this).addClass("active");
    });
}

function initializeWorkflowBackupListener(el)
{
	var time = new Date().getTime();
	var activities = $('[class^="campaign-history-block"]', el);
	console.log('Time taken ' + (new Date().getTime()) - time);

	var campaign_ids = [];

	$.each(activities, function (index, ele) {
		
			var id = $(ele).data('entity-id');

			if(campaign_ids.indexOf(id) !== -1)
				return true;

			campaign_ids.push(id);

			$(ele).show();
	});
 }
