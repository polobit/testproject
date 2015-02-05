function includeTimeAgo(element)
{
	head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
	{
		$("time", element).timeago();
	});
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
function updateActivty(params)
{
	console.log("entered into update activity function  "+new Date().getTime()+"  time with milliseconds "+new Date())
	// Creates backbone collection view
	this.activitiesview = new Base_Collection_View({ url : '/core/api/activitylog/getActivitiesOnSelectedCondition' + params, sortKey : 'time',
		descending : true, templateKey : "activity-list-log", sort_collection : false, cursor : true, scroll_symbol : 'scroll', page_size : 20,
		individual_tag_name : 'li', postRenderCallback : function(el)
		{
			includeTimeAgo(el);
		}, appendItemCallback : function(el)
		{
			includeTimeAgo(el);
		}

	});
	activitiesview.appendItem = append_activity_log;
	// Fetches data from server
	this.activitiesview.collection.fetch();

	// Renders data to activity list page.
	$('#activity-list-based-condition').html(this.activitiesview.render().el);
	
	console.log("completed update activity function  "+new Date().getTime()+"  time with milliseconds "+new Date())

}

/**
 * getParameters() method returns a string(used as query param string) contains
 * user selected type and entity type
 * 
 * @returns {String} query string
 */
function getParameters()
{
	var params = "?";

	// Get Date Range
	var range = $('#activities_date_range #range').html().split("-");

	// Returns milliseconds from start date. For e.g., August 6, 2013 converts
	// to 1375727400000

	// Get task type and append it to params
	var user = $('#user-select').data("selected_item");

	var entitytype = $('#entity_type').data("selected_item");
	if (user)
		params += ("user_id=" + user);
	// Get owner name and append it to params

	if (range && range != "Filter by date")
	{
		var start_time = Date.parse($.trim(range[0])).valueOf();

		var end_value = $.trim(range[1]);

		// To make end value as end time of day
		if (end_value)
			end_value = end_value + " 23:59:59";

		// Returns milliseconds from end date.
		var end_time = Date.parse(end_value).valueOf();

		// Adds start_time, end_time and timezone offset to params.
		params += ("&start_time=" + start_time + "&end_time=" + end_time);
	}
	if (entitytype == 'TASK')
	{
		params += ("&entity_type=" + entitytype);
		return params;
	}

	else if (entitytype == 'DEAL')
	{
		params += ("&entity_type=" + entitytype);
		return params;
	}

	else if (entitytype == 'EVENT')
	{
		params += ("&entity_type=" + entitytype);
		return params;
	}
	else if (entitytype == 'CONTACT')
	{
		params += ("&entity_type=" + entitytype);
		return params;
	}
	else if (entitytype == 'DOCUMENT')
	{
		params += ("&entity_type=" + entitytype);
		return params;
	}
	else if (entitytype == 'CALL')
	{
		params += ("&entity_type=" + entitytype);
		return params;
	}
	else
	{
		params += ("&entity_type=ALL");
		return params;
	}

	return params;
}

function initActivitiesDateRange()
{
	$('#activities_date_range').daterangepicker({ ranges : { 'Today' : [
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
		if (start && end)
		{
			createCookie("selectedStartTime", start.toString('MMMM d, yyyy'), 90);
			createCookie("selectedEndTime", end.toString('MMMM d, yyyy'), 90);
			$('#activities_date_range #range').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));

			updateActivty(getParameters());
		}
		else
		{
			eraseCookie("selectedStartTime");
			eraseCookie("selectedEndTime");
			$('#activities_date_range #range').html('Filter by date');
			updateActivty(getParameters());
		}
	});
}
