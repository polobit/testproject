/**
 * calendar.js is a script file having a route to show calendar
 * 
 * @module Activities
 */
var ActivitylogRouter = Backbone.Router.extend({

	routes : {
	/* Shows page */
	"activities" : "activities" },

	activities : function(id)
	{
		$('#content').html(getTemplate("activity-list-header", {}));

		var optionsTemplate = "<li><a  href='{{id}}'>{{name}}</li>";

		// fill workflows
		fillSelect('user-select', 'core/api/users', 'domainuser', function fillActivities()
		{
			$('#content').find("#user-select").append("<li><a href=''>All Users</a></li>");

			var activitiesview = new Base_Collection_View({ url : '/core/api/activitylog/getActivitiesofcurrentdomainuser', sortKey : 'time', descending : true,
				templateKey : "activity-list-log", cursor : true, page_size : 25, individual_tag_name : 'li', postRenderCallback : function(el)
				{
					head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
							{
								$("time", el).timeago();
							});
				} });

			activitiesview.appendItem = append_activity_log;

			activitiesview.collection.fetch();
			// Renders data to tasks list page.
			$('#activity-list-based-condition').html(activitiesview.el);

			// updateActivty(getParameters());

		}, optionsTemplate, true);

	}

});

$(function()
{
	// Click events to agents dropdown and department
	$("ul#user-select li a, ul#entity_type li a").die().live("click", function(e)
	{
		e.preventDefault();

		// Show selected name
		var name = $(this).html(), id = $(this).attr("href");

		console.log(name);

		$(this).closest("ul").data("selected_item", id);
		$(this).closest(".btn-group").find(".selected_name").text(name);
		var url = getParameters();

		updateActivty(url);

	});
	$("ul#entity_type li a").die().live("click", function()
	{

		$('.activity-sub-heading').html($(this).html());

	});
	$("ul#user-select li a").die().live("click", function()
			{

		var user=$(this).html();
		
				$('.activity-user').html("("+user+")");

			});
});
