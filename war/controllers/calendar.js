var CalendarRouter = Backbone.Router.extend({

    routes: {
        "calendar": "calendar"
    },
    calendar: function () {

        $(".active").removeClass("active");
        $("#calendarmenu").addClass("active");

        $('#content').html(getTemplate("calendar", {}));
        
        // Typahead also uses jqueryui - if you are changing the version here, change it there too
        head.js(LIB_PATH + 'lib/jquery-ui.min.js', 'lib/fullcalendar.min.js',
        		function(){showCalendar()});


        this.tasksListView = new Base_Collection_View({
            url: '/core/api/tasks',
            restKey: "task",
            templateKey: "tasks",
            individual_tag_name: 'tr'
        });

        this.tasksListView.appendItem = appendTasks;
        this.tasksListView.collection.fetch();

        $('#tasks').html(this.tasksListView.el);

    }
});
    