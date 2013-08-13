var contacts_count, deals_count, tasks_count, workflow_count

function setupDashboard(el)
{	
	setup_subscription_details(el);
	/*setupDashboardTimeline();
	setUpDashboardNavtabs(el);*/
	set_profile_meter();
	setup_dashboard_entities(el);
}

function setup_dashboard_entities(el) {
	
			/*var profileMeter = new Base_Model_View({
				url : 'core/api/profile-status',		
		        template: "profile-meter"
			})
			
			$("#profile-meter").html(profileMeter.render().el);
			*/
			
			
			var my_recent_contacts = new Base_Collection_View({
				url: 'core/api/contacts/recent?page_size=5' ,
		        restKey: "contacts",
		        templateKey: "dashboard-contacts",
		        individual_tag_name: 'tr',
		        sort_collection: false,
		    });
			my_recent_contacts.collection.fetch();
			
		    $('#recent-contacts', el).html(my_recent_contacts.render().el);
		
			var task_dashboard_list_view = new Base_Collection_View({
				url : '/core/api/tasks/my/dashboardtasks',
				restKey : "task",
				sortKey : "due",
				templateKey : "dashboard1-tasks",
				individual_tag_name : 'tr',
				postRenderCallback: function(el) {
					head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
		       		 	$(".task-due-time", el).timeago();
		       		});
				}
			});
			
			task_dashboard_list_view.appendItem = append_tasks_dashboard;
			task_dashboard_list_view.collection.fetch();
		    $('#my-tasks').html(task_dashboard_list_view.el);
		    
		        
			var my_deals = new Base_Collection_View({
				url: 'core/api/opportunity/my/upcoming-deals',
		        restKey: "opportunity",
		        templateKey: "dashboard-opportunities",
		        individual_tag_name: 'tr',
		        page_size : 5,
		        sortKey:"created_time",
		        descending: true,
		        postRenderCallback: function(el) {
		        	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
		        		 $(".deal-close-time", el).timeago();
		        	})
		        }
		    });
			my_deals.collection.fetch();
		    $('#my-deals').html(my_deals.el);
		    	
		    var workflow_list_view = new Base_Collection_View({
				url : '/core/api/campaigns/logs/recent?page_size=5',
				restKey : "workflow",
				templateKey : "dashboard-campaign-logs",
				individual_tag_name : 'tr',
				page_size : 10,
				postRenderCallback : function(el) {
					head.js(LIB_PATH + 'lib/jquery.timeago.js', function() {
						$("time.log-created-time", el).timeago();
					});
				}
			});
		    
		
			workflow_list_view.collection.fetch();
			$('#my-logs').html(workflow_list_view.el);
}

function setup_subscription_details(el)
{					
		var view = new Base_Model_View({
			url : 'core/api/subscription',
			template : "dashboard-account-info",
		});

		view.model.fetch({success: function(data){
			if(!$.isEmptyObject(data.toJSON())) {
				$("#subscription-stats").html(view.render(true).el);
				return;
			}
			
			$.get('core/api/users/count', function(count) {
				var plandata = {};
				plandata.users_count = count;
				plandata.plan = "free";
				
				console.log(plandata);
				
				$("#subscription-stats").html(getTemplate('user-billing', plandata));
			});
		}})
}

$(function(){
	$('#dashboard-contacts-model-list > tr').live('click', function(e) {
		var id = $(this).find(".data").attr("data");
		App_Contacts.navigate("contact/" + id , {
			trigger : true
		});
	});
	
});
