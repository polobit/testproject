/**
 * calendar.js is a script file having a route to show calendar
 * 
 * @module Activities
 */
var CalendarRouter = Backbone.Router.extend({

	routes : {
		/* Shows fullCalendar page */
		"calendar" : "calendar"
	},
	/**
	 * Activates the calendar menu and loads minified fullcalendar and jquery-ui
	 * to show calendar view. Also shows tasks list in separate section.
	 */
	calendar : function() {

		$(".active").removeClass("active");
		$("#calendarmenu").addClass("active");

		$('#content').html(getTemplate("calendar", {}));

		// Typahead also uses jqueryui - if you are changing the version here,
		// change it there too
		head.js(LIB_PATH + 'lib/jquery-ui.min.js', 'lib/fullcalendar.min.js',
				function() {
					showCalendar()
				});

		this.tasksListView = new Base_Collection_View({
			url : '/core/api/tasks',
			restKey : "task",
			templateKey : "tasks",
			individual_tag_name : 'tr'
		});

		// Tasks has its own appendItem function to show the status (overdue,
		// today, tomorrow and next-week)
		this.tasksListView.appendItem = append_tasks;
		this.tasksListView.collection.fetch();

		$('#tasks').html(this.tasksListView.el);

	}
});
