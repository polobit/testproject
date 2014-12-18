
function includeTimeAgo(element){
	head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$("time", element).timeago();
			});
}

/**
 * To show the dates or time in words of time-ago plugin.
 * @param element
 

 * 
 * updateData() method updates chat sessions on page for different query's from
 * user
 * 
 * @param params
 *            query string contains date, agentId & widgetId
 */
function updateActivty(params)
{

	// Creates backbone collection view
	this.activitiesview = new Base_Collection_View({ url : '/core/api/activitylog/getActivitiesOnSelectedCondition' + params, sortKey : 'time', descending : true, templateKey : "activity-list-log",
		sort_collection : false,cursor : true,scroll_symbol:'scroll', page_size : 20, individual_tag_name : 'li',
		postRenderCallback : function(el) {
			includeTimeAgo(el);
		},
		appendItemCallback : function(el)
		{
			includeTimeAgo(el);
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
function getParameters()
{

	var params = "?";

	// Get task type and append it to params
	var user = $('#user-select').data("selected_item");

	var entitytype = $('#entity_type').data("selected_item");
	if (user)
		params += ("user_id=" + user);
	// Get owner name and append it to params

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

