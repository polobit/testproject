



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
	this.activitiesview = new Base_Collection_View({ url : '/core/api/activitylog/getActivitiesOnSelectedCondition' + params, sort_collection : false, templateKey : "activity-list-log",
		cursor : true, page_size : 25, individual_tag_name : 'li',
		postRenderCallback : function(el) {
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
	else
	{
		params += ("&entity_type=ALL");
		return params;
	}

	return params;
}

// this section is not needed now when activity based filterung is enabled that
// time we need this
// --------------------------------------------------------------------
$("ul#activity li a").die().live(
		"click",
		function(e)
		{

			e.preventDefault();
			var name = $(this).html(), id = $(this).attr("href");

			$(this).closest("ul").data("selected_item", id);
			$(this).closest(".btn-group").find(".selected_name").text(name);

			var user = $('#user-select').data("selected_item");

			if (user == undefined)
			{
				user = CURRENT_DOMAIN_USER.id;
				console.log(user);
			}

			var entitytype = $('#entity_type').data("selected_item");

			var activitytype = $('#activity').data("selected_item");

			$('.activity-sub-heading').html($(this).html() + '&nbsp');
			var queryparam = getParameterUrl(user, entitytype, activitytype);

			this.activitiesview = new Base_Collection_View({ url : '/core/api/activitylog/getAct' + queryparam, sort_collection : false,
				templateKey : "activity-list", cursor : true, page_size : 25, individual_tag_name : 'li', postRenderCallback : function(el)
				{
					if (entitytype == "TASK")
					{
						$('#content').find('#activity').html(getTemplate("task-activity"));
					}
					if (entitytype == "DEAL")
					{
						$('#content').find('#activity').html(getTemplate("deal-activity"));
					}
					if (entitytype == "EVENT")
					{
						$('#content').find('#activity').html(getTemplate("event-activity"));
					}
					if (entitytype == "CONTACT")
					{
						$('#content').find('#activity').html(getTemplate("contact-activity"));
					}
					if (entitytype == "DOCUMENT")
					{
						$('#content').find('#activity').html(getTemplate("document-activity"));
					}
					if (entitytype == "")
					{
						$('#content').find('#activity').html(getTemplate("all-activity"));
					}
				}, appendItemCallback : function(el)
				{

				}

			});

			// Fetches data from server
			this.activitiesview.collection.fetch();
			// Renders data to activity list page.
			$('#activity-list-based-condition').html(this.activitiesview.render().el);

		});

// this method is use full when we need activity based filtering

function getParameterUrl(userid, entitytype, activitytype)
{

	var params = "?";

	// Get task type and append it to params
	var user = $('#user-select').data("selected_item");

	if (user)
		params += ("user_id=" + user);
	// Get owner name and append it to params

	if (entitytype == 'TASK')
	{

		params += ("&entity_type=" + entitytype);
		if (activitytype != '')
			params += ("&activity_type=" + activitytype);
		else
			params += ("&activity_type=ALL");
		return params;
	}

	else if (entitytype == 'DEAL')
	{
		params += ("&entity_type=" + entitytype);
		if (activitytype != '')
			params += ("&activity_type=" + activitytype);
		else
			params += ("&activity_type=ALL");
		return params;
	}

	else if (entitytype == 'EVENT')
	{
		params += ("&entity_type=" + entitytype);
		if (activitytype != '')
			params += ("&activity_type=" + activitytype);
		else
			params += ("&activity_type=ALL");
		return params;
	}
	else if (entitytype == 'CONTACT')
	{
		params += ("&entity_type=" + entitytype);
		if (activitytype != '')
			params += ("&activity_type=" + activitytype);
		else
			params += ("&activity_type=ALL");
		return params;
	}
	else if (entitytype == 'DOCUMENT')
	{
		params += ("&entity_type=" + entitytype);
		if (activitytype != '')
			params += ("&activity_type=" + activitytype);
		else
			params += ("&activity_type=ALL");
		return params;
	}
	else
	{
		params += ("&entity_type=ALL");
		if (activitytype != '')
			params += ("&activity_type=" + activitytype);
		else
			params += ("&activity_type=ALL");
		return params;
	}

	return params;
}
