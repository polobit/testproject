function setupDashboard(el)
{
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
        	console.log($(el).context);
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
	$.getJSON('core/api/subscription', function(data){
		console.log(data);
		if(data)
			{
				head.js(LIB_PATH + 'lib/prettify-min.js', function() {
					var view = new Base_Model_View({
					url : '/core/api/api-key',
					template : "dashboard-api-key-model",
					postRenderCallback : function(el) {
						prettyPrint();
					}
				});

					$("#subscription-stats").html(view.el);
				});
				return;
			}
		$("#subscription-stats").html(getTemplate('user-billing', data));
	});
	
}


function setUpDashboardNavtabs(el)
{
	var myRecentContacts = new Base_Collection_View({
		url: 'core/api/contacts/recent?page_size=10' ,
        restKey: "contacts",
        templateKey: "dashboard-contacts",
        individual_tag_name: 'tr',
        sort_collection: false,
    });
	myRecentContacts.collection.fetch();
	$('#recentContacts', el).addClass('active');
	console.log(myRecentContacts.el);
    	$('#recentContacts', el).html(myRecentContacts.el);
	
	$('.dashboard-timeline-filter').live('click', function(e){
		e.preventDefault();
		$("#my-timeline").empty();
		console.log($(this).attr('url'));
		setupDashboardTimeline($(this).attr('url'));
	});
	
	$('#dashboardTabs a[href="#notes"]').live('click', function (e){
		e.preventDefault();
		var myNotes = new Base_Collection_View({
			url: 'core/api/notes/my/notes' ,
            restKey: "opportunity",
            templateKey: "dashboard-notes",
            individual_tag_name: 'tr',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
            		 $(".deal-created-time", el).timeago();
            	})
            }
        });
		myNotes.collection.fetch();
        	$('#notes').html(myNotes.el);
	});
	$('#dashboardTabs a[href="#deals"]').live('click', function (e){
		e.preventDefault();
		var myDeals = new Base_Collection_View({
			url: 'core/api/opportunity/my/deals' ,
            restKey: "opportunity",
            templateKey: "dashboard-opportunities",
            individual_tag_name: 'tr',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
            		 $(".deal-created-time", el).timeago();
            	})
            }
        });
		myDeals.collection.fetch();
        	$('#deals').html(myDeals.el);
	});
	$('#dashboardTabs a[href="#tasks"]').live('click', function (e){
		e.preventDefault();
		var tasksListView = new Base_Collection_View({
			url : '/core/api/tasks/my/tasks',
			restKey : "task",
			templateKey : "dashboard-tasks",
			individual_tag_name : 'tr'
		});
		tasksListView.collection.fetch();

		$('#tasks').html(tasksListView.el);
	});
	$('#dashboardTabs a[href="#campaigns"]').live('click', function (e) {
		e.preventDefault();
			var workflowsListView = new Base_Collection_View({
				url : '/core/api/workflows/my/workflows',
				restKey : "workflow",
				templateKey : "dashboard-workflows",
				individual_tag_name : 'tr',
				cursor: true,
				page_size : 10
			});

			workflowsListView.collection.fetch();
			$('#campaigns').html(workflowsListView.el);

	});
	
	$('#dashboardTabs a[href="#recentContacts"]').live('click', function (e) {
		e.preventDefault();
		var myRecentContacts = new Base_Collection_View({
			url: 'core/api/contacts/recent?page_size=10' ,
            restKey: "contacts",
            templateKey: "dashboard-contacts",
            individual_tag_name: 'tr',
            sort_collection: false,
        });
		myRecentContacts.collection.fetch();
        	$('#recentContacts').html(myRecentContacts.el);
	});
}

