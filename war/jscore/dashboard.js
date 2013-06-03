var contacts_count, deals_count, tasks_count, workflow_count

function setupDashboard(el)
{
	/*
	 * There variables should be made undefined before setting dashboard,
	 *  which are used to check whether any entities are available
	 */
	contacts_count = undefined;
	deals_count = undefined;
	tasks_count = undefined;
	workflow_count = undefined;
	
	setupSubscriptionDetails(el);
	/*setupDashboardTimeline();
	setUpDashboardNavtabs(el);*/
	setUpDashboardEntities(el);
}

function setUpDashboardEntities(el) {
	
	var myRecentContacts = new Base_Collection_View({
		url: 'core/api/contacts/recent?page_size=5' ,
        restKey: "contacts",
        templateKey: "dashboard-contacts",
        individual_tag_name: 'tr',
        sort_collection: false,
        postRenderCallback: function(el) {
        	contacts_count = myRecentContacts.collection.length;
        	showPadContentIfNoActivity();
        }
    });
	myRecentContacts.collection.fetch();
	
    	$('#recent-contacts', el).html(myRecentContacts.render().el);

    	var tasksListView = new Base_Collection_View({
			url : '/core/api/tasks/my/tasks',
			restKey : "task",
			templateKey : "dashboard1-tasks",
			individual_tag_name : 'tr',
			postRenderCallback: function(el) {
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
           		 $(".task-due-time", el).timeago();
           			tasks_count = tasksListView.collection.length;
           			showPadContentIfNoActivity();
             	});
			}
		});
    	//tasksListView.appendItem = append_tasks;
		tasksListView.collection.fetch();

		$('#my-tasks').html(tasksListView.el);
		
			var myDeals = new Base_Collection_View({
				url: 'core/api/opportunity/my/upcoming-deals' ,
	            restKey: "opportunity",
	            templateKey: "dashboard-opportunities",
	            individual_tag_name: 'tr',
	            page_size : 5,
	            sortKey:"created_time",
	            descending: true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".deal-created-time", el).timeago();
	            		 deals_count = myDeals.collection.length;
	            		 showPadContentIfNoActivity();
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
						workflow_count = workflowsListView.collection.length;
						console.log(workflow_count);
						showPadContentIfNoActivity();
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

/**
 * Show pad content in dashboard if no entities are available
 */

function showPadContentIfNoActivity()
{
	if((contacts_count + deals_count + tasks_count + workflow_count) == 0)
		{
		$("#dashboard-entities").html(
				getTemplate("empty-collection-model",
						CONTENT_JSON["dashboard"]));
		}
}

