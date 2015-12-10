function append_contact_activities_log(base_model)
{

	var itemView = new Base_List_View({ model : base_model, "view" : "inline", template : this.options.templateKey + "-model", tagName : 'li', });

	// add to the right box - overdue, today, tomorrow etc.
	var createdtime = get_activity_created_time(base_model.get('time'));

	// Today
	if (createdtime == 0)
	{
		$('#earllier').show();
		$('#earlier-heading').addClass("ref-head");

		var heading = $('#today-heading', this.el);

		$('#contact-activity-today-list-log-model-list', this.el).append(itemView.render().el);
		$('#contact-activity-today-list-log-model-list', this.el).parent('table').css("display", "block");
		$('#contact-activity-today-list-log-model-list', this.el).show();
		$('#today-heading', this.el).show();
	}

	if (createdtime == -1)
	{ 
		$('#earllier').show();
		$('#earlier-heading').addClass("ref-head");

		var heading = $('#tomorrow-heading', this.el);

		$('#contact-activity-yesterday-list-log-model-list', this.el).append(itemView.render().el);
		$('#contact-activity-yesterday-list-log-model-list', this.el).parent('table').css("display", "block");
		$('#contact-activity-yesterday-list-log-model-list', this.el).show();
		$('#yesterday-heading', this.el).show();
	}
	if (createdtime < -1)
	{

		var heading = $('#next-week-heading', this.el);

		$('#contact-activity-earlier-list-log-model-list', this.el).append(itemView.render().el);
		$('#contact-activity-earlier-list-log-model-list', this.el).parent('table').css("display", "block");
		$('#contact-activity-earlier-list-log-model-list', this.el).show();
		$('#earlier-heading', this.el).show();
	}

}