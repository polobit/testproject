
/**
 * calendar.js is a script file having a route to show calendar
 * 
 * @module Activities
 */
var ActivitylogRouter = Backbone.Router.extend({

	routes : {
	/* Shows page */
	"activities" : "activities",
	"contact-activities" : "contactActivities",
	"contact-activities/:type" : "contactActivities"
 	},

	activities : function(id)
	{
		if(!tight_acl.checkPermission('ACTIVITY'))
			return;
		DEAL_TRACKS_COUNT=getTracksCount();
		head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css", function()
				{ 
		$('#content').html(getTemplate("activity-list-header", {}));
		/*if(IS_FLUID){
			$('#activity_header').removeClass('row').addClass('row-fluid');
		}
		else{
			$('#activity_header').removeClass('row-fluid').addClass('row');
		}*/
		
		initActivitiesDateRange();
		$(".activity-log-button").hide();
		var selecteduser = readCookie("selecteduser");
		var selectedentity = readCookie("selectedentity");

		console.log("values read from activity cookie  selected user " + selecteduser + "  selected entityname " + selectedentity);

		var optionsTemplate = "<li><a  href='{{id}}'>{{name}}</li>";

		// fill workflows
		fillSelect('user-select', 'core/api/users', 'domainuser', function fillActivities()
		{
			$('#content').find("#user-select").append("<li><a href=''>All Users</a></li>");

			var selected_start_time= readCookie("selectedStartTime");
			var selected_end_time=readCookie("selectedEndTime");
			
			if (selecteduser || selectedentity||(selected_start_time&&selected_end_time))
			{

				$('ul#user-select li a').closest("ul").data("selected_item", selecteduser);
				$('ul#entity_type li a').closest("ul").data("selected_item", selectedentity);
				if(selected_start_time&&selected_end_time){
					$('#activities_date_range #range').html(selected_start_time + ' - ' + selected_end_time);
				}
				console.log("activites function called  "+new Date().getTime()+"  time with milliseconds "+new Date())
				updateActivty(getParameters());
				
				console.log("activites function ended rendering  "+new Date().getTime()+"  time with milliseconds "+new Date())

				var username_value = readCookie("selecteduser_value");
				var entity_value = readCookie("selectedentity_value");
				
				
				if (username_value)
				{
					$('#selectedusername').html(username_value);

					
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
					templateKey : "activity-list-log", cursor : true,scroll_symbol:'scroll', page_size : 20, individual_tag_name : 'li', postRenderCallback : function(el)
					{
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
						{
							$("time", el).timeago();
									
						});

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
			
		/*	if(IS_FLUID){
				$('#activity_model').removeClass('row').addClass('row-fluid');
			}
			else{
				$('#activity_model').removeClass('row-fluid').addClass('row');
			}
*/
		}, optionsTemplate, true);
		$(".active").removeClass("active");
		$("#activitiesmenu").addClass("active");
	})
	},
	contactActivities : function(id)
	{ //begin contact activities
	
		head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css", function()
				{
			
					var urlPath = "core/api/campaigns/logs/ContactActivities";
			
					$('#content').html(getTemplate("contact-activity-header", {}));
			
					if(id==undefined || id=="All Activities")
						$('#log-filter-title').text("All Activities");
					else
						$('#log-filter-title').text(id.replace(/_/g," "));
			
				    
					if(id != undefined){
						if(id=='Spam_Reports')
					    	id='Email_Spam';
						urlPath = urlPath +"?log_type=" + id;
					}
						
			
					var collectionList = new Base_Collection_View({
						url : urlPath,
						templateKey: 'contact-activity-list-log',
						individual_tag_name: 'tr',
						cursor : true, 
						page_size : 20, sort_collection : false, postRenderCallback : function(el){
							//initDateRangePicker("contact_activities_date_range",el);
							head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
									{
										$("time", el).timeago();
										console.log(id);
										if(IS_FLUID){
											$('#contact_activity_header').removeClass('row').addClass('row-fluid');
											$('#contact_activity_model').removeClass('row').addClass('row-fluid');
											
										}
										else{
											$('#contact_activity_header').removeClass('row-fluid').addClass('row');
											$('#contact_activity_model').removeClass('row-fluid').addClass('row');
										}
									});
							
						},appendItemCallback : function(el)
						{
							includeTimeAgo(el);
						}  
					});
					
					collectionList.collection.fetch();
					
					$('#contact-activity-list-based-condition').html(collectionList.render().el);
					
					console.log("========contact activities ==========");
					console.log(collectionList.render().el);
					
				});
		
	}//end contact activities
	
});
$(function()
{
	
	
	// Click events to agents dropdown and department
	$("ul#user-select li a, ul#entity_type li a").die().live("click", function(e)
	{
		e.preventDefault();

		// Show selected name
		var name = $(this).html(), id = $(this).attr("href");

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

	});
});
