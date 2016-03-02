/*
 * Appends the model (portlet) to its specific div, based on the portlet_type
 * as div id (div defined in portlet-add.html)
 */
function organize_portlets(base_model) {


	var itemView = new Base_List_View({
		model : base_model,
		template : this.options.templateKey + "-model",
		tagName : 'div',
		className : 'col-md-3 col-sm-6 col-xs'
	});

	// Get portlet type from model (portlet object)
	var portlet_type = base_model.get('portlet_type');

	/*
	 * Appends the model (portlet) to its specific div, based on the
	 * portlet_type as div id (div defined in portlet-add.html)
	 */

	var containerJSON = {
		"CONTACTS" : "contacts",
		"DEALS" : "deals",
		"TASKSANDEVENTS" : "taksAndEvents",
		"USERACTIVITY" : "userActivity",
		"RSS" : "rssFeed",
		"ACCOUNT" : "accountInfo"
	};

	// Append Item View
	$('#' + containerJSON[portlet_type], this.el).append(
			$(itemView.render().el));
}

/*
 * Appends the outer view and inner view of each portlet.
 */
function set_p_portlets(base_model) {
	console.log(Portlets_View.collection);
	var routeJSON = {
		"Contacts" : "contacts",
		"Deals" : "deals",
		"Tasks" : "tasks",
		"Events" : "calendar"
	};

	if(base_model.toJSON().portlet_route!='DashBoard' && Current_Route.toUpperCase()==routeJSON[base_model.toJSON().portlet_route].toUpperCase()){
		App_Portlets.RoutePortlets.push(base_model);
		return;
	}

	if(base_model.toJSON().isForAll)
	{
		App_Portlets.adminPortlets.push(base_model);
		return;
	}
	
	var that = this;
	portlet_utility.getOuterViewOfPortlet(base_model, this.el, function() {
		portlet_utility.getInnerViewOfPortlet(base_model, that.el);
	});

}

/*
 * Sets the portlet content height based on it's size-y attribute.
 */
function setPortletContentHeight(base_model) {
	if (base_model.get("name") == "Stats Report" || base_model.get("name") == "Deal Goals") {

		var $resize_ele = $('#' + base_model.get("id")).parent().find(
				'.stats_report_portlet');
		var size_y = base_model.get("size_y"), resized_val = 0;

		if (size_y == 1) {
			resized_val = (size_y * 200);
		} else if (size_y == 2) {
			resized_val = (size_y * 200) + 10;
		} else if (size_y == 3) {
			resized_val = (size_y * 200) + 20;
		}

		var css = {
			"overflow-x" : "hidden",
			"overflow-y" : "hidden",
			"height" : resized_val + "px",
			"max-height" : resized_val + "px"
		}

		$resize_ele.css(css);

	} else if (base_model.get("name") == "Mini Calendar") {

		var $resize_ele = $('#' + base_model.get("id")).parent().find(
				'.portlet_body_calendar');
		var size_y = base_model.get("size_y"), resized_val = 0;

		if (size_y == 1) {
			resized_val = (size_y * 200);
		} else if (size_y == 2) {
			resized_val = (size_y * 200) + 25;
		} else if (size_y == 3) {
			resized_val = (size_y * 200) + 50;
		}

		var css = {
			"height" : resized_val + "px",
			"max-height" : resized_val + "px"
		}

		$resize_ele.css(css);
	} else {

		var $resize_ele = $('#' + base_model.get("id")).parent().find(
				'.portlet_body');
		var size_y = base_model.get("size_y"), resized_val = 0;

		if (size_y == 1) {
			resized_val = (size_y * 200) - 45;
		} else if (size_y == 2) {
			resized_val = (size_y * 200) + 25 - 45;
		} else if (size_y == 3) {
			resized_val = (size_y * 200) + 50 - 45;
		}

		var css = {
			"overflow-x" : "hidden",
			"overflow-y" : "auto",
			"height" : resized_val + "px",
			"max-height" : resized_val + "px"
		}

		$resize_ele.css(css);
	}

}

/*
 * Appends the activity to activity portlet.
 */
function append_activity(base_model) {

	var itemView = new Base_List_View({
		model : base_model,
		"view" : "inline",
		template : this.options.templateKey + "-model"
	});

	// add to the right box - overdue, today, tomorrow etc.
	var createdtime = get_activity_created_time(base_model.get('time'));

	// Today
	if (createdtime == 0) {
		$('#earllier', this.el).show();

		var $todayActivityEle = $('#today-activity', this.el);

		$todayActivityEle.append(itemView.render().el);
		$todayActivityEle.parent('table').css("display", "block");
		$todayActivityEle.show();

		$('#today-heading', this.el).show();
	}

	if (createdtime == -1) {
		$('#earllier', this.el).show();

		var heading = $('#tomorrow-heading', this.el);
		var $tomorrowActivityEle = $('#tomorrow-activity', this.el);

		$tomorrowActivityEle.append(itemView.render().el);
		$tomorrowActivityEle.parent('table').css("display", "block");
		$tomorrowActivityEle.show();

		heading.show();
	}

	if (createdtime < -1) {
		var $nextWeekActivityEle = $('#next-week-activity', this.el);

		$nextWeekActivityEle.append(itemView.render().el);
		$nextWeekActivityEle.parent('table').css("display", "block");
		$nextWeekActivityEle.show();
		$('#next-week-heading', this.el).show();

	}

	if($('#tomorrow-heading', this.el).css('display')=="none" && $('#today-heading', this.el).css('display')=="none")
		$('#next-week-heading', this.el).hide();
}