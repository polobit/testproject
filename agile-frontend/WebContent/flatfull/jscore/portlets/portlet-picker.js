
/*
 * Appends the model (portlet) to its specific div, based on the portlet_type
 * as div id (div defined in portlet-add.html)
 */
function organize_portlets(base_model) {


	var itemView = new Base_List_View({
		model : base_model,
		template : this.options.templateKey + "-model",
		tagName : 'div',
		className : 'col-md-4 col-sm-6 col-xs'
	});

	// Get portlet type from model (portlet object)
	var portlet_type = base_model.get('portlet_type');

	/*
	 * Appends the model (portlet) to its specific div, based on the
	 * portlet_type as div id (div defined in portlet-add.html)
	 */

	var containerJSON = {
		"CONTACTS" : "contacts",
		"MARKETING":"marketing",
		"DEALS" : "deals",
		"TASKSANDEVENTS" : "taksAndEvents",
		"USERACTIVITY" : "userActivity",
		"RSS" : "rssFeed",
		"ACCOUNT" : "accountInfo",
		"WEBSTATS" : "webstats"
	};

	// Append Item View
	$('#' + containerJSON[portlet_type], this.el).append(
			$(itemView.render().el));
}

/*
 * Appends the outer view and inner view of each portlet.
 */
function set_p_portlets(base_model,model_list_element_fragment_portlets) {
	console.log("collection----" + Portlets_View.collection.length);
	var routeJSON = {
		"Contacts" : "contacts",
		"Marketing":"marketing",
		"Deals" : "deals",
		"Tasks" : "tasks",
		"Events" : "calendar",
		"DashBoard" : "dashboard"
	};
/*	if(Current_Route!=undefined && routeJSON[base_model.toJSON().portlet_route].toUpperCase()!=Current_Route.toUpperCase())
{	
	Portlets_View.collection.remove(base_model);
	console.log("Removed");
	return;
}	*/
	if((base_model.toJSON().column_position == -1 && base_model.toJSON().row_position == -1) && isNaN(base_model.toJSON().portlet_route)){
		App_Portlets.RoutePortlets.push(base_model);
		return;
	}

	if(base_model.toJSON().isForAll)
	{
		App_Portlets.adminPortlets.push(base_model);
		return;
	}

	//If portlet is user defined dashboards portlet, we can add that portlet to DashboardPortlets
	if(base_model.toJSON().portlet_route!='DashBoard' && !isNaN(base_model.toJSON().portlet_route) && 
		base_model.get("row_position") == -1 && base_model.get("column_position") == -1){
		App_Portlets.DashboardPortlets.push(base_model);
		return;
	}

	if(Current_Route!=undefined && Current_Route.toUpperCase()!=('DashBoard').toUpperCase() && Portlets_View.collection.length!=0 && ! $('.route_Portlet').is(':visible'))
	{
		$('#portlets').parents('.route_Portlet').show();
	}
	var that = this;
	portlet_utility.getOuterViewOfPortlet(base_model, this.el,model_list_element_fragment_portlets, function() {
		portlet_utility.getInnerViewOfPortlet(base_model, that.el,model_list_element_fragment_portlets);
		
	});


}

/*
 * Sets the portlet content height based on it's size-y attribute.
 */
function setPortletContentHeight(base_model) {
	if (base_model.get("name") == "Stats Report" || base_model.get("name") == "Deal Goals") {
		var $resize_ele;
		if(this.Portlets_View.model_list_element_fragment.childElementCount>0)
					$resize_ele = $(this.Portlets_View.model_list_element_fragment.querySelector('[id="'+base_model.get("id")+'"]'))
					.parent().find('.stats_report_portlet');
		else
		$resize_ele = $('#' + base_model.get("id")).parent().find(
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
		var $resize_ele;
		if(this.Portlets_View.model_list_element_fragment.childElementCount>0)
					$resize_ele = $(this.Portlets_View.model_list_element_fragment.querySelector('[id="'+base_model.get("id")+'"]'))
					.parent().find('.portlet_body_calendar');
		else $resize_ele = $('#' + base_model.get("id")).parent().find(
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
 		var $resize_ele;
		if(this.Portlets_View.model_list_element_fragment.childElementCount>0)
					$resize_ele = $(this.Portlets_View.model_list_element_fragment.querySelector('[id="'+base_model.get("id")+'"]'))
					.parent().find('.portlet_body');
		else 
			$resize_ele= $('#' + base_model.get("id")).parent().find(
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



var Portlets_Collection_View = Base_Collection_View.extend({

	appendItem : function(base_model, append)
			{

				if (append)
				{
					$(this.model_list_element).append(this.createListView(base_model).render().el);
					return;
				}

				console.log("appendItem");
				set_p_portlets(base_model,this.model_list_element_fragment);
				//this.model_list_element_fragment.appendChild(this.createListView(base_model).render().el);
			},

	buildCollectionUI : function(result)
{
				$(this.el).html(result);
				// If collection is Empty show some help slate
				if (this.collection.models.length == 0)
				{
					// Add element slate element in collection template send
					// collection template to show slate pad
					fill_slate("slate", this.el, this.options.slateKey);
				}

				// Used to store all elements as document fragment
				this.model_list_element_fragment = document.createDocumentFragment();

				
				/*
				 * Iterates through each model in the collection and creates a
				 * view for each model and adds it to model-list
				 */
				_(this.collection.models).each(function(item)
				{ // in case collection is not empty

					this.appendItem(item);
				}, this);

				this.model_list_element = $('.gridster > div:visible', this.el)
				$(this.model_list_element).append(this.model_list_element_fragment);

				var callback = this.options.postRenderCallback;

				/*
				 * If callback is available for the view, callback functions is
				 * called by sending el(current view html element) as parameters
				 */
				if (callback && typeof (callback) === "function")
				{
					// startFunctionTimer("postRenderCallback");
					// execute the callback, passing parameters as necessary
					callback($(this.el), this.collection);
				}
				
				hideTransitionBar();

				// Add checkboxes to specified tables by triggering view event
				$('body').trigger('agile_collection_loaded', [
					this.el
				]);

				// $(this.el).trigger('agile_collection_loaded', [this.el]);

				// For the first time fetch, disable Scroll bar if results are
				// lesser
				if (callback && typeof (callback) === "function"){}
					// endFunctionTimer("postRenderCallback");

				// printCurrentDateMillis("render end");

				return this;
}

    });