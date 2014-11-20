/**
 * calendar.js is a script file having a route to show calendar
 * 
 * @module Activities
 */
var CalendarRouter = Backbone.Router.extend({

	routes : {
	/* Shows fullCalendar page */
	"calendar" : "calendar", "tasks" : "tasks_new", "tasks-new" : "tasks_new" },
	/**
	 * Activates the calendar menu and loads minified fullcalendar and jquery-ui
	 * to show calendar view. Also shows tasks list in separate section.
	 */
	calendar : function()
	{

		$(".active").removeClass("active");
		$("#calendarmenu").addClass("active");

		$('#content').html(getTemplate("calendar", {}));

		// Typahead also uses jqueryui - if you are changing the version here,
		// change it there too
		head.js(LIB_PATH + 'lib/jquery-ui.min.js', 'lib/fullcalendar.min.js', function()
		{
			showCalendar();
			
			
		});

		
		this.tasksListView = new Base_Collection_View({ url : '/core/api/tasks', restKey : "task", templateKey : "tasks", individual_tag_name : 'tr',
			postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$(".task-due-time", el).timeago();
				});

			} });

		// Tasks has its own appendItem function to show the status (overdue,
		// today, tomorrow and next-week)
		this.tasksListView.appendItem = append_tasks;
		this.tasksListView.collection.fetch();

		$('#tasks').html(this.tasksListView.el);
		$('#event-list-filters').html(getTemplate('event-filter'));
	},

	/* Show tasks list when All Tasks clicked under calendar page. */
	tasks : function()
	{

		$('#content').html(getTemplate("tasks-list-header", {}));

		fillSelect("owner-tasks", '/core/api/users/current-user', 'domainUser', function fillOwner()
		{

			$('#content').find("#owner-tasks").prepend("<li><a href=''>All Tasks</a></li>");
			$('#content').find("#owner-tasks").append("<li><a href='my-pending-tasks'>My Pending Tasks</a></li>");

			// To Updated task list based on user selection of type and owner
			initOwnerslist();
		}, "<li><a href='{{id}}'>My Tasks</a></li>", true);

		$(".active").removeClass("active");
		$("#calendarmenu").addClass("active");
	},

	/* Show new view of tasks. */
	tasks_new : function()
	{
		$('#content').html(getTemplate("new-tasks-list-header", {}));
		
		fillSelect("new-owner-tasks", '/core/api/users/current-user', 'domainUser', function fillOwner()
		{			
			$('#content').find("#new-owner-tasks").prepend("<li><a href=''>All Tasks</a></li>");
			$('#content').find("#new-owner-tasks").append("<li><a href='all-pending-tasks' class='hide-on-status'>All Pending Tasks</a></li>");
			$('#content').find("#new-owner-tasks").append("<li><a href='my-pending-tasks' class='hide-on-owner hide-on-status'>My Pending Tasks</a></li>");
			
			// Read stored selections from cookie and Creates nested collection
			readDetailsFromCookie();

		}, "<li><a href='{{id}}' class='hide-on-owner'>My Tasks</a></li>", true);

		$('.loading').remove();
		
		$(".active").removeClass("active");
		$("#calendarmenu").addClass("active");

		// Hide owner's and status task selection options from dropdown
		$(".hide-on-pending").hide();		
	} });
