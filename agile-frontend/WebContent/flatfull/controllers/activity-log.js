/**
 * calendar.js is a script file having a route to show calendar
 * 
 * @module Activities
 */
var ActivitylogRouter = Backbone.Router.extend({

	routes : {
	/* Shows page */
	"activities" : "activities", "contact-activities" : "contactActivities", "contact-activities/:type" : "contactActivities" },



	activities : function(id)
	{
		if (!tight_acl.checkPermission('ACTIVITY'))
			return;
		
		$('#content').html(LOADING_ON_CURSOR);
		head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', function()
		{

			$('#content').html("<div id='activities-listners'>&nbsp;</div>");
			getTemplate('activity-list-header', {}, undefined, function(template_ui){

				if(!template_ui)
					  return;
					
					getTracksCount(function(count){

					//fetches the deal track count sothat if more than one track found we have to show deal actiivity along with track also.

					DEAL_TRACKS_COUNT = count;

					$('#activities-listners').html($(template_ui));
					initActivitiesDateRange();
					$(".activity-log-button").hide();

					//selected user and entyty type will be retrived from cookie
					var selecteduser = readCookie("selecteduser");
					var selectedentity = readCookie("selectedentity");

					var optionsTemplate = "<li><a  href='{{id}}'>{{name}}</li>";

					// fill workflows
					fillSelect('user-select', 'core/api/users', 'domainuser', function fillActivities()
					{
						$('#activities-listners').find("#user-select").append("<li><a href=''>All Users</a></li>");

						var request_params = "";
						var selected_start_time = readCookie("selectedStartTime");
						var selected_end_time = readCookie("selectedEndTime");

						if (selecteduser || selectedentity || (selected_start_time && selected_end_time))
						{

							$('ul#user-select li a').closest("ul").data("selected_item", selecteduser);
							$('ul#entity_type li a').closest("ul").data("selected_item", selectedentity);
							if (selected_start_time && selected_end_time)
							{
								$('#activities_date_range #range').html(selected_start_time + ' - ' + selected_end_time);
							}
							
							var username_value = readCookie("selecteduser_value");
							var entity_value = readCookie("selectedentity_value");

							if (username_value)
							{
								//sets the value to user name if it is found in cookie
								$('#selectedusername').html(username_value);

							}
							if (entity_value)
							{
								//sets the value to entity type from cookie
								$('#selectedentity_type').html(entity_value);

								//sets the value to activity subheading
								$('.activity-sub-heading').html(entity_value);
							}
							//constructs request query parameters
							request_params = getParameters();
						}
						

						//function will render activity table
						updateActivty(request_params);

						$(".activity-log-button").show();

						
					}, optionsTemplate, true);


				});

			}, "#activities-listners");
			
			$(".active").removeClass("active");
			$("#activitiesmenu").addClass("active");
		})
	},

	/**
	*
	*/
	contactActivities : function(id)
	{ 

		$('#content').html(LOADING_ON_CURSOR);
		// Begin contact activities
		head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js',  function()
		{

			getTemplate('contact-activity-header', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;

				$('#content').html($(template_ui));	

				var urlPath = "core/api/campaigns/logs/ContactActivities";

				var keyword = "";
				var uiKeyword = "";
				switch (id) {
				case "all":
					keyword = "?log_type=All_Activities";
					uiKeyword = "All Activities";
					break;
				case "page-views":
					keyword = "?log_type=Page_Views";
					uiKeyword = "Page Views";
					break;
				case "email-opens":
					keyword = "?log_type=Email_Opened";
					uiKeyword = "Email Opens";
					break;
				case "email-clicks":
					keyword = "?log_type=Email_Clicked";
					uiKeyword = "Email Clicks";
					break;
				case "unsubscriptions":
					keyword = "?log_type=Unsubscribed";
					uiKeyword = "Unsubscriptions";
					break;
				case "spam-reports":
					keyword = "?log_type=Email_Spam";
					uiKeyword = "Spam Reports";
					break;
				case "hard-bounces":
					keyword = "?log_type=Email_Hard_Bounced";
					uiKeyword = "Hard Bounces";
					break;
				case "soft-bounces":
					keyword = "?log_type=Email_Soft_Bounced";
					uiKeyword = "Soft Bounces";
					break;
				default:
					keyword = "?log_type=All_Activities";
					uiKeyword = "All Activities";
				}

				urlPath = urlPath + keyword;
				if (id != undefined && id != "all")
					$('.contact-activity-sub-heading').text(uiKeyword);
				$('#log-filter-title').text(uiKeyword);

				/*
				 * if(IS_FLUID){
				 * $('#contact_activity_header').removeClass('row').addClass('row-fluid');
				 * $('#contact_activity_model').removeClass('row').addClass('row-fluid'); }
				 * else{
				 * $('#contact_activity_header').removeClass('row-fluid').addClass('row');
				 * $('#contact_activity_model').removeClass('row-fluid').addClass('row'); }
				 */
				var collectionList = new Base_Collection_View({ url : urlPath, templateKey : 'contact-activity-list-log', individual_tag_name : 'li',
					cursor : true, scroll_symbol : 'scroll', page_size : 20, sort_collection : false, postRenderCallback : function(el)
					{
						// initDateRangePicker("contact_activities_date_range",el);
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
						{
							$("time", el).timeago();
							console.log(id);

						});

					}, appendItemCallback : function(el)
					{
						includeTimeAgo(el);
					} });
				collectionList.appendItem = append_contact_activities_log;
				collectionList.collection.fetch();

				$('#contact-activity-list-based-condition').html(collectionList.render().el);

				console.log("========contact activities ==========");


			}, "#content");

		});

	}// end contact activities

});
