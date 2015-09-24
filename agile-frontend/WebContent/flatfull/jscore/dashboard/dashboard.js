/**
 * Sets dashboard. call methods to fetch contact, deals, tasks, workflows and
 * subscription details
 * 
 * @param el
 */
function setup_dashboard(el)
{
	// Sets up subscription details
	show_dashboard_subscription_details(el);

	// Show recently view contacts by current user
	show_dashboard_contacts(el);

	// Shows deals, tasks, workflows
	show_dashboard_tasks(el);
	show_dashboard_deals(el);
	show_dashboard_workflows(el);
	initBlogSync();
}

/*
 * Gets the Blog posts
 */
function initBlogSync()
{
	head
			.js(
					LIB_PATH + 'lib/jquery.feeds.min.js',
					function()
					{

						$('#blog_sync_container')
								.feeds(
										{
											feeds : { blog : "https://www.agilecrm.com/blog/feed/" },
											max : 3,
											entryTemplate : function(entry)
											{
												return '<strong>' + '<a href="' + entry.link + '" title = "' + entry.title + '" target="_blank" >' + entry.title + '</a></strong><div class="text-xs l-h-xs m-b-xs text-light">' 
												+ new Date(entry.publishedDate).format('mmm d, yyyy') + '</div><p class="p-t-xs m-b">' 
												+ entry.contentSnippet.replace('<a', '<a target="_blank"') + '</p>';
											} });
					});

}

/**
 * Fetches recently viewed contacts bu current user. It fetches last viewed 5
 * contacts
 * 
 * @param el
 */
function show_dashboard_contacts(el)
{
	var my_recent_contacts = new Base_Collection_View({ url : 'core/api/contacts/recent?page_size=5', restKey : "contacts", templateKey : "dashboard-contacts",
		individual_tag_name : 'tr', sort_collection : false, });
	my_recent_contacts.collection.fetch();

	$('#recent-contacts', el).html(my_recent_contacts.render().el);
}

/**
 * Fetches tasks due tasks
 * 
 * @param el
 */
function show_dashboard_tasks(el)
{
	var task_dashboard_list_view = new Base_Collection_View({ url : '/core/api/tasks/my/dashboardtasks', restKey : "task", sortKey : "due",
		templateKey : "dashboard1-tasks", individual_tag_name : 'tr', postRenderCallback : function(el)
		{
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".task-due-time", el).timeago();
			});
		} });

	task_dashboard_list_view.appendItem = append_tasks_dashboard;
	task_dashboard_list_view.collection.fetch();
	$('#my-tasks').html(task_dashboard_list_view.el);
}

/**
 * Fetches upcomming deals related to current user
 * 
 * @param el
 */
function show_dashboard_deals(el)
{
	var my_deals = new Base_Collection_View({ url : 'core/api/opportunity/my/upcoming-deals', restKey : "opportunity", templateKey : "dashboard-opportunities",
		individual_tag_name : 'tr', page_size : 5, sortKey : "created_time", descending : true, postRenderCallback : function(el)
		{
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".deal-close-time", el).timeago();
			})
		} });
	my_deals.collection.fetch();
	$('#my-deals').html(my_deals.el);
}

/**
 * Fetches recent workflow logs
 * 
 * @param el
 */
function show_dashboard_workflows(el)
{
	var workflow_list_view = new Base_Collection_View({ url : '/core/api/campaigns/logs/recent?page_size=5', restKey : "workflow",
		templateKey : "dashboard-campaign-logs", individual_tag_name : 'tr', page_size : 10, sortKey : 'time', descending : true,
		postRenderCallback : function(el)
		{
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$("time.log-created-time", el).timeago();
			});
		} });

	workflow_list_view.collection.fetch();
	$('#my-logs').html(workflow_list_view.el);
}

/**
 * Shows subscription details. It fetches subscription object, checks number of
 * users registered and number of users allowed according to subscription and
 * shows message accordingly
 * 
 * @param el
 */

function show_dashboard_subscription_details(el)
{
	/**
	 * Fetches subscription object
	 */
	var view = new Base_Model_View({ url : 'core/api/subscription', template : "dashboard-account-info", });

	view.model.fetch({ success : function(data)
	{
		if (!$.isEmptyObject(data.toJSON()))
		{
			$("#subscription-stats").html(view.render(true).el);
			return;
		}

		/**
		 * Fetches number of users present in current domain
		 */
		$.get('core/api/users/count', function(count)
		{
			var plandata = {};
			plandata.users_count = count;
			plandata.plan = "free";

			console.log(plandata);
			getTemplate('user-billing', plandata, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$("#subscription-stats").html($(template_ui));	
			}, "#subscription-stats");

		});
	} })
}

$(function()
{
	$('body').on('click', '#dashboard-contacts-model-list > tr, #dashboard-campaign-logs-model-list > tr', function(e)
	{

		var id = $(this).find(".data").attr("data");

		App_Contacts.navigate("contact/" + id, { trigger : true });
	});

});
