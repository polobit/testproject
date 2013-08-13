var contacts_count, deals_count, tasks_count, workflow_count

function setupDashboard(el)
{	
	setupSubscriptionDetails(el);
	/*setupDashboardTimeline();
	setUpDashboardNavtabs(el);*/
	setProfileMeter();
	setUpDashboardEntities(el);
}

function setUpDashboardEntities(el) {
	
			/*var profileMeter = new Base_Model_View({
				url : 'core/api/profile-status',		
		        template: "profile-meter"
			})
			
			$("#profile-meter").html(profileMeter.render().el);
			*/
			
			
			var myRecentContacts = new Base_Collection_View({
				url: 'core/api/contacts/recent?page_size=5' ,
		        restKey: "contacts",
		        templateKey: "dashboard-contacts",
		        individual_tag_name: 'tr',
		        sort_collection: false,
		    });
			myRecentContacts.collection.fetch();
			
		    $('#recent-contacts', el).html(myRecentContacts.render().el);
		
			var tasksDashboardListView = new Base_Collection_View({
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
			
			tasksDashboardListView.appendItem = append_tasks_dashboard;
			tasksDashboardListView.collection.fetch();
		    $('#my-tasks').html(tasksDashboardListView.el);
		    
		        
			var myDeals = new Base_Collection_View({
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
			myDeals.collection.fetch();
		    $('#my-deals').html(myDeals.el);
		    	
		    var workflowsListView = new Base_Collection_View({
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
		    
		
			workflowsListView.collection.fetch();
			$('#my-logs').html(workflowsListView.el);
}

function setupSubscriptionDetails(el)
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
