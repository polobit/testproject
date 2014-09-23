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
		$(".activity-log-button").hide();
		var selecteduser = readCookie("selecteduser");
		var selectedentity = readCookie("selectedentity");

		console.log("values read from activity cookie  selected user " + selecteduser + "  selected entityname " + selectedentity);

		var optionsTemplate = "<li><a  href='{{id}}'>{{name}}</li>";

		// fill workflows
		fillSelect('user-select', 'core/api/users', 'domainuser', function fillActivities()
		{
			$('#content').find("#user-select").append("<li><a href=''>All Users</a></li>");

			if (selecteduser || selectedentity)
			{

				$('ul#user-select li a').closest("ul").data("selected_item", selecteduser);
				$('ul#entity_type li a').closest("ul").data("selected_item", selectedentity);

				updateActivty(getParameters());

				var username_value = readCookie("selecteduser_value");
				var entity_value = readCookie("selectedentity_value");
				if (username_value)
				{
					$('#selectedusername').html(username_value);

					$('.activity-user').html("(" + username_value + ")");
				}
				if (entity_value)
				{
					$('#selectedentity_type').html(entity_value);
					$('.activity-sub-heading').html(entity_value);
				}
			}
			else
			{

				var activitiesview = new Base_Collection_View({ url : '/core/api/activitylog/getAllActivities', sortKey : 'time', descending : true,
					templateKey : "activity-list-log", cursor : true, page_size : 25, individual_tag_name : 'li', postRenderCallback : function(el)
					{
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
						{
							$("time", el).timeago();
						});

						$('.activity-user').html("(All users)");

					}, appendItemCallback : function(el)
					{
						includeTimeAgo(el);
					} });

				activitiesview.appendItem = append_activity_log;

				activitiesview.collection.fetch();
				// Renders data to tasks list page.
				$('#activity-list-based-condition').html(activitiesview.el);

			}
			$(".activity-log-button").show();

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

		console.log(name + "  idlllllllllllllll " + id);

		$(this).closest("ul").data("selected_item", id);
		$(this).closest(".btn-group").find(".selected_name").text(name);
		var url = getParameters();

		updateActivty(url);

	});
	$("ul#entity_type li a").die().live("click", function()
	{
		var entitytype = $(this).html();

		var entity_attribute = $(this).attr("href");
		createCookie("selectedentity", entity_attribute, 90);
		createCookie("selectedentity_value", entitytype, 90);
		$('.activity-sub-heading').html(entitytype);

	});
	$("ul#user-select li a").die().live("click", function()
	{

		var user = $(this).html();
		var user_attribute = $(this).attr("href");
		createCookie("selecteduser", user_attribute, 90);
		createCookie("selecteduser_value", user, 90);

		$('.activity-user').html("(" + user + ")");

	});

});
