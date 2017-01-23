var portlet_utility = {

	/**
	 * Adding deal tracks to Track option in deals funnel and deals by milestone
	 * portlets.
	 */
	addTracks : function(tracks, base_model, elData) {
		var options = '';
		var deal_track = base_model.get('settings').track;
		$.each(tracks,
				function(index, trackObj) {
					if (deal_track == 0 && trackObj.name == "Default")
						options += "<option value=" + trackObj.id
								+ " selected='selected'>{{agile_lng_translate 'companies-view' 'default'}}"
								+ "</option>";
					else if (deal_track == trackObj.id)
						options += "<option value=" + trackObj.id
								+ " selected='selected'>" + trackObj.name
								+ "</option>";
					else
						options += "<option value=" + trackObj.id + ">"
								+ trackObj.name + "</option>";
				});

		$('#track', elData).html(options);
		$('.loading-img').hide();
		$("#deals", elData).find(
				'option[value=' + base_model.get("settings").deals + ']').attr(
				"selected", "selected");
		if(base_model.get("name") == "Deals Funnel" && base_model.get("settings")["split-by"]) {
			$("#deals-funnel-split-by", elData).find(
					'option[value=' + base_model.get("settings")["split-by"] + ']').attr(
					"selected", "selected");
		}
		else if(base_model.get("name") == "Deals Funnel") {
			$("#deals-funnel-split-by", elData).find(
					'option[value=revenue]').attr(
					"selected", "selected");
		}
	},

	/**
	 * getting filtered contact portlet header name
	 */
	get_filtered_contact_header : function(base_model, callback) {

		if (base_model.get("settings").filter == 'contacts')
			return callback("{{agile_lng_translate 'portlets' 'all-contacts'}}");
		else if (base_model.get("settings").filter == 'companies')
			return callback("{{agile_lng_translate 'portlets' 'all-companies'}}");
		else if (base_model.get("settings").filter == 'recent')
			return callback = "{{agile_lng_translate 'portlets' 'recent-contacts'}}";
		else if (base_model.get("settings").filter == 'myContacts')
			return callback("{{agile_lng_translate 'contacts-view' 'my-contacts'}}");
		else if (base_model.get("settings").filter == 'leads')
			return callback("{{agile_lng_translate 'portlets' 'leads'}}");
		else {

			var contactFilter = $.ajax({
				type : 'GET',
				url : '/core/api/filters/' + base_model.get("settings").filter,
				dataType : 'json',
				success : function(data) {
					var header_name = '';
					if (data != null && data != undefined)
						header_name = "" + data.name;

					if (!header_name) {
						header_name = "{{agile_lng_translate 'portlets' 'contact-list'}}";
					}

					return callback(header_name);

				}
			});
		}

	},

	/**
	 * getting deals funnel portlet header name
	 */
	get_deals_funnel_portlet_header : function(base_model, callback) {

		var track_id = base_model.get("settings").track;

		App_Portlets.track_length = 0;
		$.ajax({
			type : 'GET',
			url : '/core/api/milestone/pipelines',
			dataType : 'json',
			success : function(data) {
				App_Portlets.track_length = data.length;
				App_Portlets.deal_tracks = data;

				if (App_Portlets.track_length > 1) {
					if (track_id == 0)
						return callback("{{agile_lng_translate 'companies-view' 'default'}}");
					else {
						var milestone = $.ajax({
							type : 'GET',
							url : '/core/api/milestone/' + track_id,
							dataType : 'json',
							success : function(data) {
								if (data != null && data != undefined)
									return callback("" + data.name + "");
							}
						});
					}
				}

			}
		});

	},

	/**
	 * getting campaign_type for campaign portlet header
	 */
	get_campaign_stats_portlet_header : function(base_model, callback) {
		var campaign_id = base_model.get("settings").campaign_type;

		if (campaign_id == 'All'){
			if(base_model.attributes.name=="Campaign stats")
				return callback('{{agile_lng_translate "campaigns" "all-campaigns-stats"}}');
			else
				return callback('{{agile_lng_translate "campaigns" "all-campaigns"}}');
		}
			
		else {
			var campaign = $.ajax({
				type : 'GET',
				url : '/core/api/workflows/' + campaign_id,
				dataType : 'json',
				success : function(data) {
					if (data)
						return callback("" + data.name);
				}
			});
		}
	},


	/**
	 * getting default portlet settings for all portlets
	 */
	getDefaultPortletSettings : function(portlet_type, p_name) {

		var json = {};
		if (portlet_type == "CONTACTS" && p_name == "Filter Based")
			json['filter'] = "myContacts";
		else if (portlet_type == "CONTACTS" && p_name == "Emails Opened")
			json['duration'] = "2-days";
		else if (portlet_type == "USERACTIVITY" && p_name == "Emails Sent")
			json['duration'] = "1-day";
		else if (portlet_type == "CONTACTS" && p_name == "Growth Graph") {
			json['tags'] = "";
			json['frequency'] = 'daily';
			json['duration'] = "1-week";
		} else if (portlet_type == "DEALS" && p_name == "Pending Deals") {
			json['deals'] = "my-deals";
		} else if (portlet_type == "DEALS"
				&& (p_name == "Deals By Milestone" || p_name == "Deals Funnel")) {
			json['deals'] = "my-deals";
			json['track'] = 0;
		} else if (portlet_type == "DEALS" && p_name == "Closures Per Person") {
			json['group-by'] = "number-of-deals";
			json['due-date'] = Math.round((new Date()).getTime() / 1000);
		} else if (portlet_type == "DEALS" && p_name == "Deals Won")
			json['duration'] = "1-week";
		else if (portlet_type == "DEALS" && p_name == "Deals Assigned")
			json['duration'] = "1-day";
		else if (portlet_type == "USERACTIVITY" && p_name == "Calls Per Person") {
			json['group-by'] = "number-of-calls";
			json['duration'] = "1-day";
		} else if (portlet_type == "TASKSANDEVENTS" && p_name == "Task Report") {
			json['group-by'] = "user";
			json['split-by'] = "category";
			json['duration'] = "1-week";
			json['tasks'] = "all-tasks";
		} else if (portlet_type == "USERACTIVITY" && p_name == "Stats Report") {
			json['duration'] = "yesterday";
		} else if (portlet_type == "TASKSANDEVENTS"
				&& (p_name == "Agenda" || p_name == "Today Tasks"))
			json['duration'] = "today-and-tomorrow";
		else if (portlet_type == "USERACTIVITY" && p_name == "Leaderboard") {
			json['duration'] = "this-month";
			var categoryJson = {};
			categoryJson['revenue'] = true;
			categoryJson['dealsWon'] = true;
			categoryJson['calls'] = true;
			categoryJson['tasks'] = true;
			json['category'] = categoryJson;
		} else if (portlet_type == "DEALS" && p_name == "Revenue Graph") {
			json['duration'] = "this-quarter";
			json['track'] = "anyTrack";
		} else if (portlet_type == "USERACTIVITY" && p_name == "Campaign stats") {
			json['duration'] = "yesterday";
			json['campaign_type'] = "All";
		}else if (portlet_type == "USERACTIVITY" && p_name == "Campaign graph") {
			json['duration'] = "1-month";
			json['campaign_type'] = "All";
		}
		else if (portlet_type == "DEALS" && p_name == "Deal Goals") {
			json['duration'] = "this-month";
		} else if (portlet_type == "DEALS" && p_name == "Incoming Deals") {
			json['type'] = "deals";
			json['frequency'] = "daily";
			json['duration'] = "1-week";
		} else if (portlet_type == "DEALS" && p_name == "Lost Deal Analysis") {
			json['duration'] = "1-week";
		}
		else if (portlet_type == "TASKSANDEVENTS" && p_name == "Average Deviation") {
			json['duration'] = "1-day";
		}
		else if (portlet_type == "USERACTIVITY" && p_name == "User Activities") {	
			json['activity_type'] = "ALL";
			json['duration'] = "this-quarter";
		}
		else if (portlet_type == "USERACTIVITY" && p_name == "Referralurl stats") {
			json['duration'] = "yesterday";
		}	
		return json;
	
	},

	/**
	 * Getting start and end dates as string to get start and end epoch times
	 */
	getStartAndEndDurations : function(base_model, callback) {
		var durationJson = {};
		if (!base_model.get('settings')) {
			return;
		}
		var duration = base_model.get('settings').duration;

		durationJson['start_date_str'] = ''
				+ base_model.get('settings').duration;
		durationJson['end_date_str'] = '' + base_model.get('settings').duration;

		if (duration == 'yesterday') {
			durationJson['end_date_str'] = 'today';
		} else if (duration == 'this-week') {
			durationJson['end_date_str'] = 'this-week-end';
		} else if (duration == 'this-month') {
			durationJson['end_date_str'] = 'this-month-end';
		} else if (duration == 'next-7-days') {
			durationJson['start_date_str'] = 'TOMORROW';
		} else if (duration == 'today-and-tomorrow') {
			durationJson['start_date_str'] = 'today';
		} else if (duration == 'last-week') {
			durationJson['end_date_str'] = 'last-week-end';
		} else if (duration == 'last-month') {
			durationJson['end_date_str'] = 'last-month-end';
		} else if (duration == '24-hours') {
			durationJson['end_date_str'] = 'now';
		} else if (duration == 'today' || duration == '1-day' || duration == '2-days' || duration == '1-week' || duration == '1-month' || duration == 'all-over-due') {
			durationJson['end_date_str'] = 'TOMORROW';
		}
		else if(duration=='Custom'){
			if(base_model.get('name')=='Deal Goals')
			{
				durationJson['start_date_str'] = 'custom-start-goals'
				durationJson['end_date_str'] = 'custom-end-goals';
			}
			else{
			durationJson['start_date_str'] = 'custom-start'
				durationJson['end_date_str'] = 'custom-end';
			}
		} 
		else {
			durationJson['start_date_str'] = ''
				+ base_model.get('settings').duration + '-start';
			durationJson['end_date_str'] = '' + base_model.get('settings').duration + '-end';
		}
		

		return callback(durationJson);
	},

	/**
	 * To format portlet duration (ex: last-week as Last Week)
	 */
	getDurationForPortlets : function(duration, callback) {
		var time_period = 'Today';
		if (duration == 'yesterday') {
			time_period = 'Yesterday';
		} else if (duration == '1-day' || duration == 'today') {
			time_period = 'Today';
		} else if (duration == '2-days') {
			time_period = 'Last 2 Days';
		} else if (duration == 'this-week') {
			time_period = 'This Week';
		} else if (duration == 'last-week') {
			time_period = 'Last Week';
		} else if (duration == '1-week') {
			time_period = 'Last 7 Days';
		} else if (duration == 'this-month') {
			time_period = 'This Month';
		} else if (duration == 'last-month') {
			time_period = 'Last Month';
		} else if (duration == '1-month') {
			time_period = 'Last 30 Days';
		} else if (duration == 'this-quarter') {
			time_period = 'This Quarter';
		} else if (duration == 'last-quarter') {
			time_period = 'Last Quarter';
		} else if (duration == '3-months') {
			time_period = 'Last 3 Months';
		} else if (duration == '6-months') {
			time_period = 'Last 6 Months';
		} else if (duration == '12-months') {
			time_period = 'Last 12 Months';
		} else if (duration == 'today-and-tomorrow') {
			time_period = 'Today and Tomorrow';
		} else if (duration == 'all-over-due') {
			time_period = 'All Over Due';
		} else if (duration == 'next-7-days') {
			time_period = 'Next 7 Days';
		} else if (duration == '24-hours') {
			time_period = 'Last 24 Hours';
		}

		return callback(time_period);
	},

	/**
	 * To get outer view of each portlet, it is calling from set_p_portlets()
	 */
	getOuterViewOfPortlet : function(base_model, el, model_list_element_fragment_portlets,callback) {
		var templates_json = {
			"Filter Based" : "portlets-contacts-filterbased",
			"Emails Opened" : "portlets-contacts-emails-opened",
			"Emails Sent" : "portlets-contacts-emails-sent",
			"Growth Graph" : "portlets-contacts-growth-graph",
			"Pending Deals" : "portlets-deals-pending-deals",
			"Deals By Milestone" : "portlets-deals-deals-by-milestone",
			"Closures Per Person" : "portlets-deals-closures-per-person",
			"Deals Won" : "portlets-deals-deals-won",
			"Deals Funnel" : "portlets-deals-deals-funnel",
			"Deals Assigned" : "portlets-deals-deals-assigned",
			"Agenda" : "portlets-tasksandevents-agenda",
			"Today Tasks" : "portlets-tasksandevents-today-tasks",
			"Calls Per Person" : "portlets-contacts-calls-per-person",
			"Agile CRM Blog" : "portlets-useractivity-blog",
			"Task Report" : "portlets-tasksandevents-task-report",
			"Stats Report" : "portlets-status-report",
			"Onboarding" : "portlets-user-onboarding",
			"Leaderboard" : "portlets-leader-board",
			"Revenue Graph" : "portlets-deals-revenue-graph",
			"Account Details" : "portlets-account",
			"Mini Calendar" : "portlets-minicalendar",
			"User Activities" : "portlets-activites",
			"Campaign stats" : "portlets-campaign-stats-report",
			"Campaign graph" : "portlets-campaign-graph-report",
			"Deal Goals" : "portlets-deal-goals",
			"Incoming Deals" : "portlets-incoming-deals",
			"Lost Deal Analysis" : "portlets-lost-deal-analysis",
			"Average Deviation" : "portlets-Tasks-Deviation",
			"Webstat Visits" : "portlets-webstat-visits",
			"Referralurl stats" : "portlets-Referralurl-stats-report",
			"Marketing Onboarding" : "portlets-marketing-onboarding",
		};
		var templateKey = templates_json[base_model.get('name')];
		if (CURRENT_DOMAIN_USER.is_admin
				&& base_model.get('name') == "Onboarding") {
			templateKey = "portlets-admin-onboarding";
		}
		var that = this;
		App_Portlets.portletOuterView = new Base_Model_View({
			model : base_model,
			template : templateKey + '-model',
			tagName : 'div',
			postRenderCallback : function(ele) {
				that.invokeOuterViewCallback(base_model, ele);
			}
		});

		var column_position = base_model.get("column_position");
		var row_position = base_model.get("row_position");
		var size_x = base_model.get("size_x");
		var size_y = base_model.get("size_y");

		if ($('.gridster > div:visible > div', el).length == 0){
			model_list_element_fragment_portlets.appendChild($(App_Portlets.portletOuterView.render().el).attr(
							"id",
							"ui-id-" + column_position + "-"
									+ row_position).attr(
							"data-sizey", size_y).attr(
							"data-sizex", size_x).attr(
							"data-col", column_position)
							.attr("data-row", row_position)
							.addClass('gs-w panel panel-default')[0]);
			
		}
		else
		{
			
				model_list_element_fragment_portlets.appendChild($(App_Portlets.portletOuterView.render().el).attr(
							"id",
							"ui-id-" + column_position + "-"
									+ row_position).attr(
							"data-sizey", size_y).attr(
							"data-sizex", size_x).attr(
							"data-col", column_position)
							.attr("data-row", row_position)
							.addClass('gs-w panel panel-default')[0]);
				//$('.gridster > div:visible > div:last', el).after(model_list_element_fragment);
			}

		return callback();

	},

	/**
	 * To invoke outer view of post render call back method of each portlet
	 */
	invokeOuterViewCallback : function(base_model, el) {
		var that = this;
		switch (base_model.get('name')) {
		case "Filter Based": {
			that.get_filtered_contact_header(base_model, function(header_name) {
				$(el).find(".flitered_contact_portlet_header")
						.html(header_name);
			});
			break;
		}
		case "Deals By Milestone": {
			that.get_deals_funnel_portlet_header(base_model, function(
					header_name) {
				$(el).find(".deals_funnel_portlet_header").html(header_name);
			});
			break;
		}
		case "Deals Funnel": {
			that.get_deals_funnel_portlet_header(base_model, function(
					header_name) {
				$(el).find(".deals_funnel_portlet_header").html(header_name);
			});
			break;
		}
		case "Campaign stats": {
			that.get_campaign_stats_portlet_header(base_model, function(
					header_name) {
				$(el).find(".campaign_stats_header").html(header_name);
			});
			break;
		}
		case "Campaign graph": {
			that.get_campaign_stats_portlet_header(base_model, function(
					header_name) {
				$(el).find(".campaign_graph_header").html(header_name);
			});
			break;
		}

		case "Deal Goals": {
			$(el).find('.portlet_body').parent().css('background',
					'#f0f3f4');
			break;
		}
		case "Stats Report": {
			$(el).find('.stats_report_portlet_body').parent().css('background',
					'#f0f3f4');
			break;
		}
		case "User Activities" : {
			var pos = base_model.get("column_position")+''+base_model.get("row_position");
			App_Portlets.activitiesView[parseInt(pos)] = el;
			break;
		}
		}
	},

	/**
	 * To get inner view of each portlet, it is calling from set_p_portlets()
	 */
	getInnerViewOfPortlet : function(base_model, el,model_list_element_fragment_portlets) {
		var column_position = base_model.get('column_position'), row_position = base_model
				.get('row_position');
		var pos = '' + column_position + '' + row_position;
		var portlet_name = base_model.get('name');
		var portlet_ele;
		if(model_list_element_fragment_portlets)
		 portlet_ele= $(model_list_element_fragment_portlets.querySelector('#ui-id-' + column_position + '-' + row_position)).find(
				'.portlet_body');
		else
			 portlet_ele=$('#ui-id-' + column_position + '-' + row_position,el).find(
				'.portlet_body');
		portlet_ele
				.attr('id', 'p-body-' + column_position + '-' + row_position);
		var start_date_str = '', end_date_str = '', users = '', selector = portlet_ele
				.attr('id');
		;

		portlet_utility.getStartAndEndDurations(base_model, function(
				durationJson) {
			start_date_str = durationJson['start_date_str'];
			end_date_str = durationJson['end_date_str'];
		});

		if (base_model.get('settings') && base_model.get('settings').user != undefined) {
			users = JSON.stringify(base_model.get('settings').user);
		}

		switch (portlet_name) {
		case "Filter Based": {
			App_Portlets.filteredContacts[parseInt(pos)] = new Base_Collection_View(
					{
						url : '/core/api/portlets/contacts?filter='
								+ base_model.get('settings').filter
								+ '&sortKey=-created_time',
						templateKey : "portlets-contacts",
						sort_collection : false,
						individual_tag_name : 'tr',
						sortKey : "-created_time",
						postRenderCallback : function(p_el) {
							portlet_utility.addWidgetToGridster(base_model);
							contactListener(p_el);
						}
					});
			portlet_utility.renderPortletsInnerCollection(
					App_Portlets.filteredContacts[parseInt(pos)], portlet_ele,
					base_model);
			break;
		}
		case "Emails Opened": {
			App_Portlets.emailsOpened[parseInt(pos)] = new Base_Collection_View(
					{
						url : '/core/api/portlets/emails-opened?duration='
								+ base_model.get('settings').duration
								+ '&start-date='
								+ portlet_utility
										.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
								+ '&end-date='
								+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"]),
						templateKey : 'portlets-contacts-email-opens',
						descending:true,
						sortKey : "openedTime",
						individual_tag_name : 'tr',
						postRenderCallback : function(p_el) {
							agileTimeAgoWithLngConversion($(".time-ago", p_el));
							initializePortletsListeners();
							
							portlet_utility.addWidgetToGridster(base_model);
						}
					});
			App_Portlets.emailsOpened[parseInt(pos)].collection.fetch();
			portlet_ele.find('#emails-opened-contacts-list').attr(
					'id',
					'emails-opened-contacts-list-' + column_position + '-'
							+ row_position);
			portlet_ele.find(
					'#emails-opened-contacts-list-' + column_position + '-'
							+ row_position).html(getRandomLoadingImg());
			portlet_ele.find(
					'#emails-opened-contacts-list-' + column_position + '-'
							+ row_position).html(
					$(App_Portlets.emailsOpened[parseInt(pos)].render().el));
			portlet_ele.find('#emails-opened-pie-chart').attr(
					'id',
					'emails-opened-pie-chart-' + column_position + '-'
							+ row_position);
			selector = 'emails-opened-pie-chart-' + column_position + '-'
					+ row_position;
			var url = '/core/api/portlets/emails-opened-pie-chart?duration='
					+ base_model.get('settings').duration + '&start-date='
					+ portlet_utility
										.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
					+ '&end-date='
					+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"])
			portlet_graph_data_utility.emailsOpenedGraphData(base_model,
					selector, url);
			setPortletContentHeight(base_model);
			break;
		}
		case "Pending Deals": {
			var options="";
			if (base_model.get('settings').track != undefined
					&& base_model.get('settings').track != "anyTrack") 
				options+='&track='+base_model.get('settings').track;
			if (base_model.get('settings').milestone != undefined
					&& base_model.get('settings').milestone != "anyMilestone")
				options+='&milestone='+base_model.get('settings').milestone;
			App_Portlets.pendingDeals[parseInt(pos)] = new Base_Collection_View(
					{
						url : '/core/api/portlets/pending-deals?deals='
								+ base_model.get('settings').deals+options,
						templateKey : 'portlets-opportunities',
						sort_collection : false,
						individual_tag_name : 'tr',
						postRenderCallback : function(p_el) {
							agileTimeAgoWithLngConversion($(".time-ago", p_el));
							initializePortletsListeners();
							
							portlet_utility.addWidgetToGridster(base_model);
						}
					});
			portlet_utility.renderPortletsInnerCollection(
					App_Portlets.pendingDeals[parseInt(pos)], portlet_ele,
					base_model);
			break;
		}
		case "Deals Won": {
			App_Portlets.dealsWon[parseInt(pos)] = new Base_Collection_View({
				url : '/core/api/portlets/deals-won?duration='
						+ base_model.get('settings').duration,
				templateKey : 'portlets-opportunities',
				individual_tag_name : 'tr',
				postRenderCallback : function(p_el) {
					agileTimeAgoWithLngConversion($(".time-ago", p_el));
					
					portlet_utility.addWidgetToGridster(base_model);
				}
			});
			portlet_utility.renderPortletsInnerCollection(
					App_Portlets.dealsWon[parseInt(pos)], portlet_ele,
					base_model);
			break;
		}
		case "Agenda": {
			App_Portlets.todayEventsCollection[parseInt(pos)] = new Base_Collection_View(
					{
						url : '/core/api/portlets/agenda?duration='
								+ base_model.get('settings').duration
								+ '&start_time='
								+ portlet_utility
										.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
								+ '&end_time='
								+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"]),
						templateKey : 'portlets-events',
						sort_collection : false,
						individual_tag_name : 'tr',
						postRenderCallback : function(p_el) {
							portlet_utility.addWidgetToGridster(base_model);
							loadGoogleEventsForPortlets(
									p_el,
									portlet_utility
										.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"]),
									portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"]));
							initializePortletsListeners();
						}
					});
			portlet_utility.renderPortletsInnerCollection(
					App_Portlets.todayEventsCollection[parseInt(pos)],
					portlet_ele.find('#normal-events'), base_model);
			break;
		}
		case "Today Tasks": {
			App_Portlets.tasksCollection[parseInt(pos)] = new Base_Collection_View(
					{
						url : '/core/api/portlets/today-tasks?duration='
								+ base_model.get('settings').duration
								+ '&start_time='
								+ portlet_utility
										.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
								+ '&end_time='
								+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"]),
						templateKey : 'portlets-tasks',
						sort_collection : false,
						individual_tag_name : 'tr',
						postRenderCallback : function(p_el) {
							portlet_utility.addWidgetToGridster(base_model);
							initializePortletsListeners();
						}
					});
			portlet_utility.renderPortletsInnerCollection(
					App_Portlets.tasksCollection[parseInt(pos)], portlet_ele,
					base_model);
			break;
		}
		case "Leaderboard": {
			var leaderboardCate = base_model.get('settings').category;

			App_Portlets.leaderboard[parseInt(pos)] = new Base_Model_View(
					{
						url : '/core/api/portlets/leaderboard?duration='
								+ base_model.get('settings').duration
								+ '&start-date='
								+ portlet_utility
										.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
								+ '&end-date='
								+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"])
								+ '&revenue='
								+ leaderboardCate.revenue
								+ '&dealsWon='
								+ leaderboardCate.dealsWon
								+ '&calls='
								+ leaderboardCate.calls
								+ '&tasks='
								+ leaderboardCate.tasks
								+ '&user=' + users,
						template : 'portlets-leader-board-body-model',
						tagName : 'div',
						portletSizeX : base_model.get('size_x'),
						portletSizeY : base_model.get('size_y'),
						postRenderCallback : function(p_el) {
							portlet_utility.addWidgetToGridster(base_model);
							$(
									'#ui-id-' + column_position + '-'
											+ row_position
											+ ' > .portlet_header')
									.find('ul')
									.width(
											($(
													'#ui-id-'
															+ column_position
															+ '-'
															+ row_position
															+ ' > .portlet_body')
													.find('ul').width()
													/ $(
															'#ui-id-'
																	+ column_position
																	+ '-'
																	+ row_position
																	+ ' > .portlet_body')
															.width() * 100)
													+ '%');
							 $('.calls_popover',('#p-body-' + base_model.get('column_position') + '-'
											+ base_model.get('row_position'))).tooltip(
								{
									
									"html" : "true",
									"placement" : "right",
									"container" : "body",
									"template": '<div class="tooltip leaderboard_calls"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'

								});
							
						}
					});
			portlet_ele
					.html($(App_Portlets.leaderboard[parseInt(pos)].render().el));
			setPortletContentHeight(base_model);
			break;
		}
		case "Account Details": {
			App_Portlets.accountInfo[parseInt(pos)] = new Base_Model_View({
				url : '/core/api/portlets/account-details',
				template : "portlets-account-body-model",
				postRenderCallback : function(p_el) {
					portlet_utility.addWidgetToGridster(base_model);
				}
			});
			portlet_ele.html(getRandomLoadingImg());
			portlet_ele
					.html($(App_Portlets.accountInfo[parseInt(pos)].render().el));
			setPortletContentHeight(base_model);
			break;
		}
		case "User Activities": {
			var options="?";
			if(base_model.get('settings').activity_type == undefined)
					options+='&entity_type=ALL';
				else
				options+='&entity_type='+base_model.get('settings').activity_type;
			if(base_model.get('settings').duration == undefined){
				start_date_str="this-quarter-start";
				end_date_str="this-quarter-end";
				base_model.get('settings').duration='this-quarter';
			}
			if (base_model.get('settings').owner != undefined
					&& base_model.get('settings').owner != "") 
				options+='&user_id='+base_model.get('settings').owner;

			App_Portlets.activity[parseInt(pos)] = new Base_Collection_View({
				url : '/core/api/portlets/customer-activity'+options
				+ '&start_time='
				+ portlet_utility
										.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
					+ '&end_time='
					+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"]),
				sortKey : 'time',
				descending : true,
				templateKey : "portlets-activities-list-log",
				cursor : true,
				page_size : getMaximumPageSize(),
				individual_tag_name : 'div',
				postRenderCallback : function(p_el) {
					portlet_utility.addWidgetToGridster(base_model);
					agileTimeAgoWithLngConversion($("time", p_el));
					
					contact_detail_page_infi_scroll($('.activity_body',
							App_Portlets.activitiesView[parseInt(pos)].el),
							App_Portlets.activity[parseInt(pos)])
				},
				appendItemCallback : function(p_el) {
					includeTimeAgo(p_el);
				}
			});
			App_Portlets.activity[parseInt(pos)].appendItem = append_activity;
			portlet_utility.renderPortletsInnerCollection(
					App_Portlets.activity[parseInt(pos)], portlet_ele,
					base_model);
			break;
		}
		case "Campaign stats": {
			var emailsSentCount, emailsOpenedCount, emailsClickedCount, emailsUnsubscribed,
			emailsSpamCount, emailsSkippedCount, emailsHardBounceCount, emailsSoftBounceCount, that = portlet_ele;
			var url = '/core/api/portlets/campaign-stats?duration='
					+ base_model.get('settings').duration + '&start-date='
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
					+ '&end-date='
					+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"])
					+ '&time_zone=' + (new Date().getTimezoneOffset())
					+ '&campaign_type='
					+ base_model.get('settings').campaign_type;

			setTimeout(
					function() {
						if (that.find('#emails-sent-count').text().trim() == "")
							that
									.find('#emails-sent-count')
									.html(LOADING_HTML);
					}, 1000);

			portlet_graph_data_utility
					.fetchPortletsGraphData(
							url,
							function(data) {
								emailsSentCount = data["emailsent"];
								emailsOpenedCount = data["emailopened"];
								emailsClickedCount = data["emailclicked"];
								emailsUnsubscribed = data["emailunsubscribed"];
								emailsSpamCount = data["emailSpam"];
								emailsSkippedCount = data["emailSkipped"];
								emailsHardBounceCount = data["hardBounce"];
								emailsSoftBounceCount = data["softBounce"];
				
									that
											.find('#emails-opened')
											.css('display', 'block')
											.addClass(
													'pull-left p-xs b-b b-r b-light w-half');
									that
											.find('#emails-clicked')
											.css('display', 'block')
											.addClass(
													'pull-left p-xs b-b b-light w-half');

									that.find('#emails-hard-bounce').css('display', 'block').addClass('pull-left p-xs b-r b-light w-half');

									that.find('#emails-soft-bounce').css('display', 'block').addClass('pull-left p-xs b-r b-light w-half');

									that.find('#emails-unsubscribed').css(
											'display', 'block').addClass(
											'pull-left p-xs b-r b-light w-half');
									that
											.find('#emails-sent')
											.addClass(
													'pull-left p-xs b-r b-b b-light w-half overflow-hidden');

									that
											.find('#emails-sent-count')
											.text(
													portlet_utility
															.getNumberWithCommasForPortlets(emailsSentCount));
											that.find('#emails-sent-label').text(
											"Emails sent");

									that.find('#emails-skipped')
											.addClass('pull-left p-xs b-b b-r b-light w-half overflow-hidden');

									that.find('#emails-skipped-count')
											.text(portlet_utility.getNumberWithCommasForPortlets(emailsSkippedCount));

									that.find('#emails-skipped-label').text("Skipped");

									that.find('#emails-spam')
											.addClass('pull-left p-xs b-r b-light w-half overflow-hidden');

									that.find('#emails-spam-count')
											.text(portlet_utility.getNumberWithCommasForPortlets(emailsSpamCount));

									that.find('#emails-spam-label').text("Spam");

									that
											.find('#emails-opened')
											.html(
													'<div class="pull-left text-light stats_text"><div class="text-sm text-ellipsis">Opened</div><div class="text-count text-center" style="color:#08C;">'
															+ portlet_utility
																	.getNumberWithCommasForPortlets(emailsOpenedCount)
															+ '</div></div>');
									that
											.find('#emails-clicked')
											.html(
													'<div class="pull-left text-light stats_text"><div class="text-sm text-ellipsis">Clicked</div><div class="text-count text-center" style="color:rgb(18, 209, 18);">'
															+ portlet_utility
																	.getNumberWithCommasForPortlets(emailsClickedCount)
															+ '</div></div>');

									that.find('#emails-hard-bounce')
											.html('<div class="pull-left text-light stats_text"><div class="text-sm text-ellipsis">Hard Bounced</div><div class="text-count text-center" style="color:#009688;">'
															+ portlet_utility
																	.getNumberWithCommasForPortlets(emailsHardBounceCount)
															+ '</div></div>');

									that.find('#emails-soft-bounce')
											.html('<div class="pull-left text-light stats_text"><div class="text-sm text-ellipsis">Soft Bounced</div><div class="text-count text-center" style="color:#9C27B0;">'
															+ portlet_utility
																	.getNumberWithCommasForPortlets(emailsSoftBounceCount)
															+ '</div></div>');
									that
											.find('#emails-unsubscribed')
											.html(
													'<div class="pull-left text-light stats_text"><div class="text-sm text-ellipsis">Unsubscribed</div><div class="text-count text-center" style="color:rgb(205,15,0);">'
															+ portlet_utility
																	.getNumberWithCommasForPortlets(emailsUnsubscribed)
															+ '</div></div>');

								portlet_utility.addWidgetToGridster(base_model);
							});
			setPortletContentHeight(base_model);
			break;
		}
		case "Campaign graph": {
			var url = '/core/api/portlets/campaign-graph?start-date='
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str)
					+ '&campaign_type='
					+ base_model.get('settings').campaign_type;
			portlet_graph_data_utility.campaignStatsGraphData(base_model,
					selector, url);
			setPortletContentHeight(base_model);
			break;
		}
		case "Deals By Milestone": {
			var url = '/core/api/portlets/deals-by-milestone?deals='
					+ base_model.get('settings').deals + '&track='
					+ base_model.get('settings').track;
			portlet_graph_data_utility.dealsByMilestoneGraphData(base_model,
					selector, url);
			setPortletContentHeight(base_model);
			break;
		}
		case "Closures Per Person": {
			var url = '/core/api/portlets/deals-closed-per-person?due-date='
					+ base_model.get('settings')["due-date"];
			portlet_graph_data_utility.closuresPerPersonGraphData(base_model,
					selector, url);
			setPortletContentHeight(base_model);
			break;
		}
		case "Deals Funnel": {
			var url = '/core/api/portlets/deals-funnel?deals='
					+ base_model.get('settings').deals + '&track='
					+ base_model.get('settings').track;
			portlet_graph_data_utility.dealsFunnelGraphData(base_model,
					selector, url);
			setPortletContentHeight(base_model);
			break;
		}
		case "Emails Sent": {
			var url = '/core/api/portlets/emails-sent?duration='
					+ base_model.get('settings').duration;
			portlet_graph_data_utility.emailsSentGrapgData(base_model,
					selector, url);
			setPortletContentHeight(base_model);
			break;
		}
		case "Growth Graph": {
			var url = '/core/api/portlets/growth-graph?tags='
					+ base_model.get('settings').tags
					+ '&frequency='
					+ base_model.get('settings').frequency
					+ '&duration='
					+ base_model.get('settings').duration
					+ '&start-date='
					+ getUTCMidNightEpochFromDate(new Date(portlet_utility
										.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"]) * 1000))
					+ '&end-date='
					+ getUTCMidNightEpochFromDate(new Date(portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"]) * 1000));
			portlet_graph_data_utility.growthGraphData(base_model, selector,
					url);
			setPortletContentHeight(base_model);
			// Saved tags are appended
			var p_settings = base_model.get('settings');
			var p_tags = p_settings.tags;
			var tags = p_tags.split(",");
			var li = '';
			$
					.each(
							tags,
							function(index, tagName) {
								if (tagName != "")
									li += "<li data='"
											+ tagName
											+ "' class='tag btn btn-xs btn-default m-r-xs m-b-xs inline-block'>"
											+ tagName
											+ "<a id='remove_tag' class='close m-l-xs' style='color: #363f44; top: -1px'>&times</a></li>";
							});
			$('#' + base_model.get("id") + '-portlet-ul-tags').append(li);

			// enable tags properties
			setup_tags_typeahead();
			break;
		}
		case "Deals Assigned": {
			var url = '/core/api/portlets/deals-assigned?duration='
					+ base_model.get('settings').duration;
			portlet_graph_data_utility.dealsAssignedGraphData(base_model,
					selector, url);
			setPortletContentHeight(base_model);
			break;
		}
		case "Calls Per Person": {
			if (base_model.get('settings')["calls-user-list"] != undefined) {
				users = JSON
						.stringify(base_model.get('settings')["calls-user-list"]);
			}
			var url = '/core/api/portlets/calls-per-person?duration='
					+ base_model.get('settings').duration + '&start-date='
					+ portlet_utility
										.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
					+ '&end-date='
					+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"])
					+ '&user=' + users;
			portlet_graph_data_utility.callsPerPersonGraphData(base_model,
					selector, url);
			setPortletContentHeight(base_model);
			break;
		}
		case "Agile CRM Blog": {
			portlet_ele.find('div').html(getRandomLoadingImg());
			initBlogPortletSync(portlet_ele);
			setPortletContentHeight(base_model);
			break;
		}
		case "Task Report": {
			if (base_model.get('settings')["task-report-user-list"] != undefined) {
				users = JSON
						.stringify(base_model.get('settings')["task-report-user-list"]);
			}
			var url = '/core/api/portlets/task-report?group-by='
					+ base_model.get('settings')["group-by"] + '&split-by='
					+ base_model.get('settings')["split-by"] + '&start-date='
					+ portlet_utility
										.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
					+ '&end-date='
					+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"])
					+ '&tasks=' + base_model.get('settings').tasks + '&user='
					+ users;
			portlet_graph_data_utility.taskReportGraphData(base_model,
					selector, url);
			setPortletContentHeight(base_model);
			break;
		}
		case "Revenue Graph": {
			var pipeline_id = 0;
			if (base_model.get('settings').track != undefined
					&& base_model.get('settings').track != "anyTrack") {
				pipeline_id = base_model.get('settings').track;
			}
			var url = 'core/api/opportunity/stats/details/'
					+ pipeline_id
					+ '?min='
					+ portlet_utility
										.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
					+ '&max='
					+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"])
					+ '';
			portlet_graph_data_utility.revenueGraphData(base_model, selector,
					url);
			setPortletContentHeight(base_model);
			break;
		}
		case "Stats Report": {
			if(model_list_element_fragment_portlets)
					portlet_ele = $(model_list_element_fragment_portlets.querySelector('#ui-id-' + column_position + '-' + row_position))
					.find('.stats_report_portlet_body');
					else
						portlet_ele =('#ui-id-' + column_position + '-' + row_position,el)
					.find('.stats_report_portlet_body');
			var that = portlet_ele;
			var newContactsurl = '/core/api/portlets/activity-overview-report?reportType=newContacts&duration='
					+ base_model.get('settings').duration
					+ '&start-date='
					+ portlet_utility
										.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
					+ '&end-date='
					+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"])
					+ '&time_zone=' + (new Date().getTimezoneOffset());
			setTimeout(
					function() {
						if (that.find('#new-contacts-count').text().trim() == "")
							that
									.find('#new-contacts-count')
									.html(LOADING_HTML);
					}, 1000);
			portlet_graph_data_utility
					.fetchPortletsGraphData(
							newContactsurl,
							function(data) {
								that
										.find('#new-contacts-count')
										.text(
												portlet_utility
														.getNumberWithCommasForPortlets(data["newContactsCount"]));
								that.find('#new-contacts-label').text(
										"{{agile_lng_translate 'portlets' 'new-contacts'}}");
							});

			var wonDealsurl = '/core/api/portlets/activity-overview-report?reportType=wonDeals&duration='
					+ base_model.get('settings').duration
					+ '&start-date='
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
					+ '&end-date='
					+ portlet_utility.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"])
					+ '&time_zone=' + (new Date().getTimezoneOffset());
			setTimeout(
					function() {
						if (that.find('#won-deal-value').text().trim() == "")
							that
									.find('#won-deal-value')
									.html(LOADING_HTML);
					}, 1000);
			portlet_graph_data_utility
					.fetchPortletsGraphData(
							wonDealsurl,
							function(data) {
								that
										.find('#won-deal-value')
										.text(
												portlet_utility
														.getPortletsCurrencySymbol()
														+ ''
														+ portlet_utility
																.getNumberWithCommasForPortlets(data["wonDealValue"]));
								that
										.find('#won-deal-count')
										.text(
												"{{agile_lng_translate 'portlets' 'won-from'}} "
														+ portlet_utility
																.getNumberWithCommasForPortlets(data['wonDealsCount'])
														+ " {{agile_lng_translate 'deals' 'deals-sm'}}");
							});

			var newDealsurl = '/core/api/portlets/activity-overview-report?reportType=newDeals&duration='
					+ base_model.get('settings').duration
					+ '&start-date='
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
					+ '&end-date='
					+ portlet_utility.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"])
					+ '&time_zone=' + (new Date().getTimezoneOffset());
			setTimeout(
					function() {
						if (that.find('#new-deal-value').text().trim() == "")
							that
									.find('#new-deal-value')
									.html(LOADING_HTML);
					}, 1000);
			portlet_graph_data_utility
					.fetchPortletsGraphData(
							newDealsurl,
							function(data) {
								that
										.find('#new-deal-value')
										.text(
												portlet_utility
														.getNumberWithCommasForPortlets(data["newDealsCount"]));
								that
										.find('#new-deal-count')
										.text(
												"{{agile_lng_translate 'portlets' 'new-deals-worth'}} "
														+ portlet_utility
																.getPortletsCurrencySymbol()
														+ ''
														+ portlet_utility
																.getNumberWithCommasForPortlets(data['newDealValue'])
														+ "");
							});

			var campaignEmailsSentsurl = '/core/api/portlets/activity-overview-report?reportType=campaignEmailsSent&duration='
					+ base_model.get('settings').duration
					+ '&start-date='
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
					+ '&end-date='
					+ portlet_utility.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"])
					+ '&time_zone=' + (new Date().getTimezoneOffset());
			setTimeout(
					function() {
						if (that.find('#emails-sent-count').text().trim() == "")
							that
									.find('#emails-sent-count')
									.html(LOADING_HTML);
					}, 1000);
			var emailsSentCount = 0;
			if (_agile_get_prefs('dashboard_campaign_count_'+CURRENT_DOMAIN_USER.id)) {
				emailsSentCount = _agile_get_prefs('dashboard_campaign_count_'+CURRENT_DOMAIN_USER.id);
			}
			that.find('#emails-sent-count').text(portlet_utility.getNumberWithCommasForPortlets(emailsSentCount));
			that.find('#emails-sent-label').text("{{agile_lng_translate 'portlets' 'campaign-emails-sent'}}");
			portlet_graph_data_utility
					.fetchPortletsGraphData(
							campaignEmailsSentsurl,
							function(data) {
								if(emailsSentCount > data["emailsSentCount"]) {
									that
										.find('#emails-sent-count')
										.text(
												portlet_utility
														.getNumberWithCommasForPortlets(data["emailsSentCount"]));
								}
								else {
									that.find('#emails-sent-count')
									  .prop('number', emailsSentCount)
									  .animateNumber(
									    {
									      number: data["emailsSentCount"]
									    },
									    2000
									  );
								}
								that.find('#emails-sent-label').text(
										"{{agile_lng_translate 'portlets' 'campaign-emails-sent'}}");
								_agile_set_prefs('dashboard_campaign_count_'+CURRENT_DOMAIN_USER.id, data["emailsSentCount"]);
							});
			setPortletContentHeight(base_model);
			break;
		}
		case "Mini Calendar": {

						$('.gridster-portlets').load(".portlet_body_calendar",function() {
                console.log("hi")
           
								$('.portlet_body_calendar', $("#ui-id-"+column_position+"-"+row_position))
										.attr(
												'id',
												'p-body-calendar'
														+ column_position + '-'
														+ row_position)
								$(
										'#p-body-calendar' + column_position
												+ '-' + row_position,
										$('#portlet-res'))
										.each(
												function() {
													$(this)
															.find(
																	'.events_show')
															.html(
																	getRandomLoadingImg());
													setPortletContentHeight(base_model);
													App_Portlets.refetchEvents = false;
													App_Portlets.eventCalendar=$(this);
													var that=$(this);

					_agile_library_loader.load_fullcalendar_libs(function(){
								minicalendar(that);
					});

							});
 }
            );
			break;
		}
		case "Onboarding" : {
			setPortletContentHeight(base_model);
			break;
		}

		case "Marketing Onboarding" : {
			setPortletContentHeight(base_model);
			break;
		}

		case "Deal Goals" : {
					if(model_list_element_fragment_portlets)
					portlet_ele = $(model_list_element_fragment_portlets.querySelector('#ui-id-' + column_position + '-' + row_position))
					.find('.goals_portlet_body');
					else
						portlet_ele =('#ui-id-' + column_position + '-' + row_position,el)
					.find('.goals_portlet_body');
					portlet_ele
						.attr('id', 'p-body-' + column_position + '-' + row_position);
					var that=portlet_ele;
			   selector= portlet_ele.attr('id');
			var url = '/core/api/portlets/goals/'+CURRENT_DOMAIN_USER.id
						+ '?start-date='
								+ portlet_utility
										.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
								+ '&end-date='
								+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"])
										+ '&time_zone=' + (new Date().getTimezoneOffset());
			portlet_graph_data_utility
					.fetchPortletsGraphData(
							url,
							function(data) {
								that.find('.deal_count').html(
									portlet_utility.getNumberWithCommasForPortlets(data["dealcount"]));
								that.find('.goal_count').html('{{agile_lng_translate "portlets" "won-deals"}} <br> {{agile_lng_translate "widgets" "from"}} '+
										portlet_utility.getNumberWithCommasForPortlets(data["goalCount"])+' {{agile_lng_translate "portlets" "goals"}}');
								that.find('.deal_amount').html(portlet_utility.getPortletsCurrencySymbol()+
									'' +
									portlet_utility.getNumberWithCommasForPortlets(data["dealAmount"]));
								that.find('.goal_amount').html('{{agile_lng_translate "portlets" "revenue"}} <br> {{agile_lng_translate "widgets" "from"}} '+portlet_utility.getPortletsCurrencySymbol()+
									'' +
									portlet_utility.getNumberWithCommasForPortlets(data["goalAmount"])+' {{agile_lng_translate "portlets" "goals"}}');
									portlet_graph_data_utility.dealGoalsGraphData(selector,data,column_position,row_position);
							});
			setPortletContentHeight(base_model);
			break;
		}
		case "Incoming Deals": {
			var owner_id = 0;
			if (base_model.get('settings').owner) {
				owner_id = base_model.get('settings').owner;
			}
			var url = 'core/api/portlets/incomingDeals/'
					+ owner_id
					+ '?min='
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
					+ '&max='
					+ portlet_utility.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"])					+ '&frequency='
					+ base_model.get('settings').frequency
					+ '&type='
					+ base_model.get('settings').type;
			portlet_graph_data_utility.incomingDealsGraphData(base_model, selector, url);
			setPortletContentHeight(base_model);
			break;
		}
		case "Lost Deal Analysis": {
			var owner_id = 0;
			var track_id = 0;
			var source_id = 0;
			if (base_model.get('settings').owner) {
				owner_id = base_model.get('settings').owner;
			}
			if (base_model.get('settings').track) {
				track_id = base_model.get('settings').track;
			}
			if (base_model.get('settings').source) {
				source_id = base_model.get('settings').source;
			}
			var url = 'core/api/portlets/lossReason/'
					+ owner_id + '/'
					+ track_id + '/'
					+ source_id
					+ '?min='
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
					+ '&max='
					+ portlet_utility.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"])

			var sizey = parseInt($('#' + selector).parent().attr("data-sizey"));
			var topPos = 50 * sizey;
			if (sizey == 2 || sizey == 3)
				topPos += 50;
			$('#' + selector)
					.html(
							"<div class='text-center v-middle opa-half' style='margin-top:"
									+ topPos
									+ "px'>"+LOADING_HTML+"</div>");
			$("#"+selector).addClass("lost-deal-analysis-portlet-pie");
			pieforReports(url, selector, '', undefined, true);
				setPortletContentHeight(base_model);
			break;
		}
			case "Average Deviation": {
			var url = '/core/api/portlets/averageDeviation?start-date='
								+ portlet_utility
										.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])
								+ '&end-date='
								+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"]);
			portlet_graph_data_utility.taskDeviationGraphData(base_model,
					selector, url);
			setPortletContentHeight(base_model);
			break;
		}
		case "Webstat Visits": {
			var url = '/core/api/web-stats/reports?start_time='
								+ portlet_utility
										.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])*1000
								+ '&end_time='
								+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"])*1000;
			portlet_graph_data_utility.webstatVisitsGraphData(base_model,
					selector, url);
			setPortletContentHeight(base_model);
			break;
		}
		case "Referralurl stats": {
			var ref_url,count;
			selector='referralurl-stats-portlet-body-'+ column_position + '-'
					+ row_position;
			var sizey = parseInt($('.' + selector).parent().attr("data-sizey"));
			var topPos = 50 * sizey;
			if (sizey == 2 || sizey == 3)
				topPos += 50;
			$('.'+selector).html("<div class='text-center v-middle opa-half' style='margin-top:"+ topPos
								+ "px'>"+LOADING_HTML+"</div>");
			var url = '/core/api/web-stats/refurl-stats?start_time='
								+ portlet_utility
										.getStartAndEndDatesOnDue(start_date_str,base_model.get('settings')["start-date"])*1000
								+ '&end_time='
								+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str,base_model.get('settings')["end-date"])*1000
					+ '&time_zone=' + (new Date().getTimezoneOffset());
			portlet_graph_data_utility.fetchPortletsGraphData(url,function(data) {
				if(data.length==0){
						$('.'+selector).html('<div class="portlet-error-message">{{agile_lng_translate "visitors" "no-ref-found"}}</div>');
								return;
					}
				var span;
				var element_list=$("<div style=' padding-top: 2px;'></div>");
				$.each( data, function(e) {					
					var width;
					if(e==0)
						width=75;
					else
						width=(data[e].count/data[0].count)*100;
					if(e!=0 && width >75){
						width=100-width;
						width=75-width;
					}

					span = $("<div style='margin: 0px 20px -21px 15px; padding-bottom: 1px;'/>");
					var url_name=data[e].ref_url.substring(data[e].ref_url.indexOf('/')+2,data[e].ref_url.lastIndexOf('/'));
					if(url_name.startsWith("www"))
						url_name= url_name.substring(url_name.indexOf("www")+4);
					span.append("<a data-toggle='popover' class='text-ellipsis' title="+ data[e].ref_url +" style='font-size: 14px; position: absolute;width: 75%;'>" + url_name + "</a>");
		            span.append("<div  style='margin-left: 90%;width: 15%;'>" + data[e].count + "</div>");
		            span.append("<div class='bar' style='width: "+width+"%; margin: 1px;height: .8rem; background: #03A9F4;'></div>");
		            span.append("<br/>");
		            element_list.append(span);
				});
				$('.'+selector).html(element_list);
			});
			
			setPortletContentHeight(base_model);
			break;
		}
		}
	},

	/**
	 * To render collection view of each portlet
	 */
	renderPortletsInnerCollection : function(collectionView, portlet_ele,
			base_model) {
		collectionView.collection.fetch();
		portlet_ele.html(getRandomLoadingImg());
		portlet_ele.html($(collectionView.render().el));
		setPortletContentHeight(base_model);
	},

	/**
	 * It should open settings modal of each portlet with filled or deafult
	 * data.
	 */
	showPortletSettings : function(el) {
		var elData, base_model = Portlets_View.collection.get(el
				.split("-settings")[0]);
		var portlet_name = base_model.get('name'), that = this;

		// Hide previous error messages
		$('.help-inline').hide();
		switch (portlet_name) {
		case "Filter Based": {
			$('#filter', elData).find('option').remove();
			$('.loading-img', elData).show();
			
			elData = $('#portletsContactsFilterBasedSettingsForm');
			removeSelectedData(elData);
			var existed_filter = base_model.get("settings").filter;
			var options = '<option value="">{{agile_lng_translate "contact-details" "select"}}</option>';
			if (existed_filter == "contacts") {
				options += "<option selected='selected' value='contacts'>{{agile_lng_translate 'portlets' 'all-contacts'}}</option>";
			}
			else {
				options += "<option value='contacts'>{{agile_lng_translate 'portlets' 'all-contacts'}}</option>";
			}
			if (existed_filter == "myContacts") {
				options += "<option selected='selected' value='myContacts'>{{agile_lng_translate 'contacts-view' 'my-contacts'}}</option>";
			}
			else {
				options += "<option value='myContacts'>{{agile_lng_translate 'contacts-view' 'my-contacts'}}</option>";
			}
			$.ajax({
				type : 'GET',
				url : '/core/api/filters?type=PERSON',
				dataType : 'json',
				success : function(data) {
					$.each(data, function(index, contactFilter) {
						if (contactFilter.id == existed_filter) {
							options += "<option selected='selected' value=" + contactFilter.id + ">"
								+ contactFilter.name + "</option>";
						}
						else {
							options += "<option value=" + contactFilter.id + ">"
								+ contactFilter.name + "</option>";
						}
						
					});
					$('#filter', elData).html(options);
					$('.loading-img').hide();
				}
			});
			that.addPortletSettingsModalContent(base_model,
					"portletsContactsFilterBasedSettingsModal");
			break;
		}
		case "Emails Opened": {
			elData = $('#portletsContactsEmailsOpenedSettingsModal');
			removeSelectedData(elData);
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			that.addPortletSettingsModalContent(base_model,
					"portletsContactsEmailsOpenedSettingsModal");
					initializeCustomRangeInModal(base_model,elData);
			break;
		}
		case "Emails Sent": {
			elData = $('#portletsContactsEmailsSentSettingsModal');
			removeSelectedData(elData);
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
				that.addPortletSettingsModalContent(base_model,
					"portletsContactsEmailsSentSettingsModal");
					initializeCustomRangeInModal(base_model,elData);
			break;
		}
		case "Growth Graph": {
			$('#portlet-ul-tags > li').remove();
			$('#cancel-modal').attr('disabled', false);
			elData = $('#portletsContactsGrowthGraphSettingsModal');
			removeSelectedData(elData);
			// Saved tags are appended
			var tags = base_model.get('settings').tags.split(",");
			var li = '';
			$
					.each(
							tags,
							function(index, tagName) {
								if (tagName != "")
									li += "<li data='"
											+ tagName
											+ "' class='tag btn btn-xs btn-default m-r-xs m-b-xs inline-block'>"
											+ tagName
											+ "<a id='remove_tag' class='close m-l-xs' style='color: #363f44; top: -1px'>&times</a></li>";
							});
			$('#portlet-ul-tags').append(li);

			// enable tags properties
			setup_tags_typeahead();

			$("#frequency", elData).find(
					'option[value=' + base_model.get("settings").frequency
							+ ']').attr("selected", "selected");
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
								that.addPortletSettingsModalContent(base_model,
					"portletsContactsGrowthGraphSettingsModal");
					initializeCustomRangeInModal(base_model,elData);

			break;
		}
		case "Pending Deals": {
			elData = $('#portletsPendingDealsSettingsModal');
			removeSelectedData(elData);
			$("#deals", elData).find(
					'option[value=' + base_model.get("settings").deals + ']')
					.attr("selected", "selected");
			if (base_model.get('settings').track == "anyTrack") {
				options += '<option value="anyTrack" selected="selected">{{agile_lng_translate "portlets" "any"}}</option>';
			} else {
				options += '<option value="anyTrack">{{agile_lng_translate "portlets" "any"}}</option>';
			}
			$.ajax({
				type : 'GET',
				url : '/core/api/milestone/pipelines',
				dataType : 'json',
				success : function(data) {
					$.each(data, function(index, trackObj) {
						if (base_model.get('settings').track == trackObj.id)
							options += "<option value=" + trackObj.id
									+ " selected='selected'>" + trackObj.name
									+ "</option>";
						else
							options += "<option value=" + trackObj.id + ">"
									+ trackObj.name + "</option>";
					});
					$('#track', elData).html(options);
					$('.loading-img').hide();
					var track = $('#track', elData).val();
		if (track!='anyTrack')
		{
			
			$.ajax({
				type : 'GET',
				url : '/core/api/milestone/'+track,
				dataType : 'json',
				success : function(data) {
					var milestonesList=data.milestones.split(",");
					var lost=data.lost_milestone;
					var won= data.won_milestone;
					$('#milestone').html('');
					if(milestonesList.length > 1)
					{
						$('#milestone', elData).html('<option value="anyMilestone">{{agile_lng_translate "portlets" "any"}}</option>');
					}
					$.each(milestonesList, function(index, milestone){
						if(lost!=null && won!=null){
							if(!(milestone==lost) && !(milestone==won) )
							
						$('#milestone', elData).append('<option value="'+milestone+'">'+milestone+'</option>');
					}
						else
						{
							if(!(milestone=='Won') && !(milestone=='Lost') )
							
						$('#milestone', elData).append('<option value="'+milestone+'">'+milestone+'</option>');
						}
					});
					if(base_model.get('settings').milestone && track == base_model.get('settings').track)
									{
										$('#milestone',elData).find('option[value="'+base_model.get('settings').milestone+'"]').attr("selected", "selected");
									}
				}
			});
		}
		else
		{
			$('#milestone', elData).html('<option value="anyMilestone">{{agile_lng_translate "portlets" "any"}}</option>');
		}

				}
			});
	
			/*if (base_model.get('settings').milestone == "anyMilestone") {
				options += '<option value="anyMilestone" selected="selected">{{agile_lng_translate "portlets" "any"}}</option>';
			} else {
				options += '<option value="anyMilestone">{{agile_lng_translate "portlets" "any"}}</option>';
			}
			$("#milestone", elData).find(
					'option[value=' + base_model.get("settings").milestone + ']')
					.attr("selected", "selected");*/
								that.addPortletSettingsModalContent(base_model,
					"portletsPendingDealsSettingsModal");
			break;
		}
		//campaign pie chart
		case "Campaign graph": {
			elData = $('#portletsCampaignGraphSettingsModal');
			removeSelectedData(elData);
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			var options = "<option value='All'>{{agile_lng_translate 'campaigns' 'all-campaigns'}}</option>";
			$.ajax({
				type : 'GET',
				url : '/core/api/workflows/partial',
				dataType : 'json',
				success : function(data) {
					$.each(data, function(index, campaignfilter) {
						options += "<option value=" + campaignfilter.id + ">"
								+ campaignfilter.name + "</option>";
					});
					$('#campaign_type', elData).html(options);
					$("#campaign_type", elData).find(
							'option[value='
									+ base_model.get("settings").campaign_type
									+ ']').attr("selected", "selected");
					$('.loading-img').hide();
				}
			});
						that.addPortletSettingsModalContent(base_model,
					"portletsCampaignGraphSettingsModal");
			break;
		}

		case "Deals By Milestone": {
			elData = $('#portletsDealsByMilestoneSettingsModal');
			removeSelectedData(elData);
			var that = this;
			var url = '/core/api/portlets/deals-by-milestone?deals='
					+ base_model.get('settings').deals + '&track='
					+ base_model.get('settings').track;
			if (App_Portlets.track_length != undefined
					&& App_Portlets.track_length > 1)
				$('#portletsDealsByMilestoneTrack', elData).show();

			var tracks = [];
			if (App_Portlets.deal_tracks != undefined
					&& App_Portlets.deal_tracks != null)
				tracks = App_Portlets.deal_tracks;
			else {
				$.ajax({
					type : 'GET',
					url : '/core/api/milestone/pipelines',
					dataType : 'json',
					success : function(data) {
						App_Portlets.track_length = data.length;
						App_Portlets.deal_tracks = data;
						tracks = App_Portlets.deal_tracks;

						that.addTracks(tracks, base_model, elData);
					}
				});

				return;
			}
			that.addTracks(tracks, base_model, elData);
			that.addPortletSettingsModalContent(base_model,
					"portletsDealsByMilestoneSettingsModal");
			break;
		}
		case "Closures Per Person": {
			elData = $('#portletsDealsClosuresPerPersonSettingsModal');
			removeSelectedData(elData);
			$("#group-by", elData).find(
					'option[value=' + base_model.get("settings")["group-by"]
							+ ']').attr("selected", "selected");
			$("#due-date", elData)
					.val(
							getDateInFormatFromEpoc(base_model.get("settings")["due-date"]));
			that.addPortletSettingsModalContent(base_model,
					"portletsDealsClosuresPerPersonSettingsModal");
			break;
		}
		case "Deals Won": {
			elData = $('#portletsDealsWonSettingsModal');
			removeSelectedData(elData);
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			that.addPortletSettingsModalContent(base_model,
					"portletsDealsWonSettingsModal");
					initializeCustomRangeInModal(base_model,elData);
			break;
		}
		case "Deals Funnel": {
			elData = $('#portletsDealsFunnelSettingsModal');
			removeSelectedData(elData);
			var that = this;
			var url = '/core/api/portlets/deals-funnel?deals='
					+ base_model.get('settings').deals + '&track='
					+ base_model.get('settings').track;
			if (App_Portlets.track_length != undefined
					&& App_Portlets.track_length > 1)
				$('#portletsDealsFunnelTrack', elData).show();

			var tracks = [];
			if (App_Portlets.deal_tracks != undefined
					&& App_Portlets.deal_tracks != null)
				tracks = App_Portlets.deal_tracks;
			else {
				$.ajax({
					type : 'GET',
					url : '/core/api/milestone/pipelines',
					dataType : 'json',
					success : function(data) {
						App_Portlets.track_length = data.length;
						App_Portlets.deal_tracks = data;
						tracks = App_Portlets.deal_tracks;

						that.addTracks(tracks, base_model, elData);

					}
				});

				return;
			}
			that.addPortletSettingsModalContent(base_model,
					"portletsDealsFunnelSettingsModal");
			that.addTracks(tracks, base_model, elData);
			break;
		}
		case "Deals Assigned": {
			elData = $('#portletsDealsAssignedSettingsModal');
			removeSelectedData(elData);
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			that.addPortletSettingsModalContent(base_model,
					"portletsDealsAssignedSettingsModal");
					initializeCustomRangeInModal(base_model,elData);
			break;
		}
		case "Calls Per Person": {
			elData = $('#portletsCallsPerPersonSettingsModal');
			removeSelectedData(elData);
			$("#group-by", elData).find(
					'option[value=' + base_model.get("settings")["group-by"]
							+ ']').attr("selected", "selected");
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");

			portlet_utility.setUsersInPortletSettings("calls-user-list",
					base_model, "calls-user-list", "calls-user", elData, function(){
						that.addPortletSettingsModalContent(base_model, "portletsCallsPerPersonSettingsModal");
					});
				initializeCustomRangeInModal(base_model,elData);
			break;
		}
		case "Task Report": {
			elData = $('#portletsTaskReportSettingsModal');
			removeSelectedData(elData);
			$("#group-by-task-report", elData).find(
					'option[value=' + base_model.get("settings")["group-by"]
							+ ']').attr("selected", "selected");
			if (base_model.get("settings").tasks != undefined)
				$("#tasks-task-report", elData).find(
						'option[value=' + base_model.get("settings").tasks
								+ ']').attr("selected", "selected");
			$("#split-by-task-report", elData).find(
					'option[value=' + base_model.get("settings")["split-by"]
							+ ']').attr("selected", "selected");
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			$('#' + base_model.get("settings")["group-by"] + '', elData).hide();
			if (base_model.get("settings")["group-by"] == "status")
				$('#tasks-control-group').hide();
			if (base_model.get("settings").tasks == "completed-tasks")
				$('#split-by-task-report > option#status').hide();

			portlet_utility.setUsersInPortletSettings("task-report-user-list",
					base_model, "task-report-user-list", "task-report-user",
					elData, function(){
						that.addPortletSettingsModalContent(base_model, "portletsTaskReportSettingsModal");
					});
					initializeCustomRangeInModal(base_model,elData);
			break;
		}
		case "Stats Report": {
			elData = $('#portletsStatsReportSettingsModal');
			removeSelectedData(elData);
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
				that.addPortletSettingsModalContent(base_model,
					"portletsStatsReportSettingsModal");
				initializeCustomRangeInModal(base_model,elData);
			break;
		}
		case "Agenda": {
			elData = $('#portletsAgendaSettingsModal');
			removeSelectedData(elData);
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
				that.addPortletSettingsModalContent(base_model,
					"portletsAgendaSettingsModal");
				initializeCustomRangeInModal(base_model,elData);
			break;
		}
		case "Today Tasks": {
			elData = $('#portletsTodayTasksSettingsModal');
			removeSelectedData(elData);
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
				that.addPortletSettingsModalContent(base_model,
					"portletsTodayTasksSettingsModal");				
				initializeCustomRangeInModal(base_model,elData);
			break;
		}
		case "Leaderboard": {
			elData = $('#portletsLeaderboardSettingsModal');
			removeSelectedData(elData);
			var leaderboardCate = base_model.get("settings").category;
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
				
			if (leaderboardCate && leaderboardCate.revenue)
				$("#category-list", elData).find('option[value=revenue]').attr(
						"selected", "selected");

			if (leaderboardCate && leaderboardCate.dealsWon)
				$("#category-list", elData).find('option[value=dealsWon]')
						.attr("selected", "selected");

			if (leaderboardCate && leaderboardCate.calls)
				$("#category-list", elData).find('option[value=calls]').attr(
						"selected", "selected");

			if (leaderboardCate && leaderboardCate.tasks)
				$("#category-list", elData).find('option[value=tasks]').attr(
						"selected", "selected");

			portlet_utility.setUsersInPortletSettings("user-list", base_model,
					"user-list", "user", elData, function(){
						that.addPortletSettingsModalContent(base_model, "portletsLeaderboardSettingsModal");
					});

			$('#ms-category-list', elData).remove();
			head.js(LIB_PATH + 'lib/jquery.multi-select.js', function() {
				$('#category-list', elData).multiSelect();
				$('#ms-category-list .ms-selection', elData).children('ul')
						.addClass('multiSelect').attr("name", "category-list")
						.attr("id", "category");
				$('#ms-category-list .ms-selectable .ms-list', elData).css(
						"height", "105px");
				$('#ms-category-list .ms-selection .ms-list', elData).css(
						"height", "105px");
				$('#ms-category-list', elData).addClass(
						'portlet-category-ms-container');
			});
				initializeCustomRangeInModal(base_model,elData);
			break;
		}
		case "Revenue Graph": {
			elData = $('#portletsDealsRevenueGraphSettingsModal');
			removeSelectedData(elData);
			var options = '';
			if (base_model.get('settings').track == "anyTrack") {
				options += '<option value="anyTrack" selected="selected">{{agile_lng_translate "portlets" "any"}}</option>';
			} else {
				options += '<option value="anyTrack">{{agile_lng_translate "portlets" "any"}}</option>';
			}
			$.ajax({
				type : 'GET',
				url : '/core/api/milestone/pipelines',
				dataType : 'json',
				success : function(data) {
					$.each(data, function(index, trackObj) {
						if (base_model.get('settings').track == trackObj.id)
							options += "<option value=" + trackObj.id
									+ " selected='selected'>" + trackObj.name
									+ "</option>";
						else
							options += "<option value=" + trackObj.id + ">"
									+ trackObj.name + "</option>";
					});
					$('#track', elData).html(options);
					$('.loading-img').hide();
				}
			});
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
				that.addPortletSettingsModalContent(base_model,
					"portletsDealsRevenueGraphSettingsModal");
					initializeCustomRangeInModal(base_model,elData);
			break;
		}
		case "Campaign stats": {
			elData = $('#portletsCampaignStatsSettingsModal');
			removeSelectedData(elData);
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			var options = "<option value='All'>{{agile_lng_translate 'campaigns' 'all-campaigns'}}</option>";
			$.ajax({
				type : 'GET',
				url : '/core/api/workflows/partial',
				dataType : 'json',
				success : function(data) {
					$.each(data, function(index, campaignfilter) {
						options += "<option value=" + campaignfilter.id + ">"
								+ campaignfilter.name + "</option>";
					});
					$('#campaign_type', elData).html(options);
					$("#campaign_type", elData).find(
							'option[value='
									+ base_model.get("settings").campaign_type
									+ ']').attr("selected", "selected");
					$('.loading-img').hide();
				}
			});
			that.addPortletSettingsModalContent(base_model,
					"portletsCampaignStatsSettingsModal");
			initializeCustomRangeInModal(base_model,elData);
			break;
		}

		case "Deal Goals": {
			elData = $('#portletsGoalsSettingsModal');
			removeSelectedData(elData);
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			that.addPortletSettingsModalContent(base_model,
					"portletsGoalsSettingsModal");
					initializeCustomRangeInModal(base_model,elData);
			break;
		}
		case "Incoming Deals": {
			elData = $('#portletsIncomingDealsSettingsModal');
			removeSelectedData(elData);
			$("#duration-incoming-deals", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			$("#split-by-incoming-deals", elData).find('option[value='+ base_model.get("settings")["type"] + ']').attr("selected", "selected");
			$("#frequency-incoming-deals", elData).find('option[value='+ base_model.get("settings")["frequency"] + ']').attr("selected", "selected");
			that.addPortletSettingsModalContent(base_model,
					"portletsIncomingDealsSettingsModal");
			portlet_utility.setOwners("owner", base_model, elData);
			initializeCustomRangeInModal(base_model,elData);
			break;
		}
		case "Lost Deal Analysis": {
			elData = $('#portletsLostDealAnalysisSettingsModal');
			removeSelectedData(elData);

			$("#duration-lost-deal-analysis", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			portlet_utility.setOwners("owner-lost-deal-analysis", base_model, elData);
			portlet_utility.setTracks("track-lost-deal-analysis", base_model, elData);
			portlet_utility.setSources("source-lost-deal-analysis", base_model, elData);
			that.addPortletSettingsModalContent(base_model,
					"portletsLostDealAnalysisSettingsModal");
			initializeCustomRangeInModal(base_model,elData);
			break;
		}

		case "Average Deviation": {
			elData = $('#portletsTaskClosureSettingsModal');
			removeSelectedData(elData);
			$("#duration", elData).find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			that.addPortletSettingsModalContent(base_model,
					"portletsTaskClosureSettingsModal");
					initializeCustomRangeInModal(base_model,elData);
						break;
		}

		case "User Activities" : {
			elData = $("#portletsUserActivitiesSettingsModal");
			removeSelectedData(elData);
			portlet_utility.setOwners("owner-user-activities", base_model, elData);
			$("#duration-user-activities", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			that.addPortletSettingsModalContent(base_model,"portletsUserActivitiesSettingsModal");
					initializeCustomRangeInModal(base_model,elData);
					break;
		}
		case "Webstat Visits": {
			elData = $('#portletsWebstatVisitsSettingsModal');
			removeSelectedData(elData);
			$("#duration", elData).find(
				               'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			that.addPortletSettingsModalContent(base_model,
					"portletsWebstatVisitsSettingsModal");		
					initializeCustomRangeInModal(base_model,elData);
			break;
		}
		case "Referralurl stats": {
			elData = $('#portletsReferralurlStatsSettingsModal');
			removeSelectedData(elData);
			$("#duration", elData).find(
				               'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			that.addPortletSettingsModalContent(base_model,"portletsReferralurlStatsSettingsModal");
					initializeCustomRangeInModal(base_model,elData);
			break;		
			
		}
		}
		if (base_model.get('name') == "Pending Deals"
				|| base_model.get('name') == "Deals By Milestone"
				|| base_model.get('name') == "Closures Per Person"
				|| base_model.get('name') == "Deals Funnel") {
			$('#due-date', elData).datepicker({
				format : CURRENT_USER_PREFS.dateFormat,
				autoclose: true
			});
		}
	},

	/**
	 * Set portlet type and name in settings modal of each portlet and modal
	 * should be open.
	 */
	addPortletSettingsModalContent : function(base_model, modal_id) {
		$('#' + modal_id).find('form')[0].reset();
		$('#' + modal_id).modal('show');
		$('#' + modal_id).on('shown.bs.modal', function(){		   
		   if($("#start_date", $('#' + modal_id)).is(":focus")){		    
		    $("#start_date", $('#' + modal_id)).datepicker("hide");
		    $("#start_date", $('#' + modal_id)).blur();		    
		   }
		});

		$('.datepicker').hide();
		$('#'+ modal_id+ ' > .modal-dialog > .modal-content > .modal-footer > .save-modal')
				.attr('id', base_model.get("id") + '-save-modal');
		$("#portlet-type", $('#' + modal_id)).val(base_model.get('portlet_type'));
		$("#portlet-name", $('#' + modal_id)).val(base_model.get('name'));
	},

	/**
	 * Set multiselected users data in calls, task report, leaderboard portlet
	 * settings.
	 */
	setUsersInPortletSettings : function(ele_id, base_model, ele_name, ele,
			elData, callback) {

		head.js(LIB_PATH + 'lib/jquery.multi-select.js', function() {
			var user_ele = base_model.get("settings")[ele_id];

			if (user_ele) {
				var options = '';
				$.ajax({
					type : 'GET',
					url : '/core/api/users/partial',
					dataType : 'json',
					success : function(data) {
						$.each(data, function(index, domainUser) {
							if (!domainUser.is_disabled)
								options += "<option value=" + domainUser.id + ">"
										+ domainUser.name + "</option>";
						});
						$('#' + ele_id, elData).html(options);
						$.each(user_ele, function() {
							$("#" + ele_id, elData).find(
									'option[value=' + this + ']').attr("selected",
									"selected");
						});
						$('.loading-img').hide();

						$('#ms-' + ele_id, elData).remove();
						$('#' + ele_id, elData).multiSelect();
						$('#ms-' + ele_id + ' .ms-selection', elData).children('ul')
								.addClass('multiSelect').attr("name", ele_name).attr("id",
										ele);
						$('#ms-' + ele_id + ' .ms-selectable .ms-list', elData).css(
								"height", "130px");
						$('#ms-' + ele_id + ' .ms-selection .ms-list', elData).css(
								"height", "130px");
						$('#ms-' + ele_id, elData).addClass('portlet-user-ms-container');
					}
				});
			} else {
				var options = '';
				$.ajax({
					type : 'GET',
					url : '/core/api/users/partial',
					dataType : 'json',
					success : function(data) {
						$.each(data, function(index, domainUser) {
							if (!domainUser.is_disabled)
								options += "<option value=" + domainUser.id
										+ " selected='selected'>" + domainUser.name
										+ "</option>";
						});
						$('#' + ele_id, elData).html(options);
						$('.loading-img').hide();

						$('#ms-' + ele_id, elData).remove();
						$('#' + ele_id, elData).multiSelect();
						$('#ms-' + ele_id + ' .ms-selection', elData).children('ul')
								.addClass('multiSelect').attr("name", ele_name).attr("id",
										ele);
						$('#ms-' + ele_id + ' .ms-selectable .ms-list', elData).css(
								"height", "130px");
						$('#ms-' + ele_id + ' .ms-selection .ms-list', elData).css(
								"height", "130px");
						$('#ms-' + ele_id, elData).addClass('portlet-user-ms-container');
					}
				});
			}
		});	
		return callback();
	},

	/**
	 * Get the currency symbol based on user's currency
	 */
	getPortletsCurrencySymbol : function() {

		var value = ((CURRENT_USER_PREFS.currency != null) ? CURRENT_USER_PREFS.currency
				: "USD-$");
		var symbol = ((value.length < 4) ? "$" : value.substring(4,
				value.length));
		if(symbol=='Rs')
			symbol='Rs.';
		return symbol;
	},

	/**
	 * Get the number with english number format (ex : 782,345,32)
	 */
	getNumberWithCommasForPortlets : function(value) {

		value = parseFloat(value);
		value = Math.round(value);
		if (value == 0)
			return value;

		if (value)
			return value.toFixed(2).toString().replace(
					/\B(?=(?:\d{3})+(?!\d))/g, ",").replace('.00', '');
	},
	/**
	 * Get the number with english number format (ex : 782,345,32.32)
	 */
	getNumberWithCommasAndDecimalsForPortlets : function(value) {

		value = parseFloat(value);
		if (value == 0)
			return value;

		if (value)
			return value.toFixed(2).toString().replace(
					/\B(?=(?:\d{3})+(?!\d))/g, ",").replace('.00', '');
	},

	/**
	 * Get the time format in (h m s) by passing seconds
	 */
	getPortletsTimeConversion : function(diffInSeconds) {
		if (!diffInSeconds)
			return 0;

		var duration = '';

		var days = Math.floor(diffInSeconds / (24 * 60 * 60));
		var hrs = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
		var mins = Math
				.floor(((diffInSeconds % (24 * 60 * 60)) % (60 * 60)) / 60);
		var secs = Math
				.floor(((diffInSeconds % (24 * 60 * 60)) % (60 * 60)) % 60);

		if(days!=0)
			duration += ' ' + days + 'd';
		if (hrs != 0)
			duration += ' ' + hrs + 'h';
		if (mins != 0)
			duration += ' ' + mins + 'm';
		if (secs != 0)
			duration += ' ' + secs + 's';

		return duration;
	},

	/**
	 * Get the priorities for Events and Tasks portlets.
	 */
	getPortletNormalName : function(name) {

		if (!name)
			return;

		return getTranslatedPortletName(name);
	},

	/**
	 * Get the start and end dates epoch based on duration.
	 */
	getStartAndEndDatesOnDue : function(duration,custom_date) {

		var d = new Date();
		if(duration=="custom-start" || duration=="custom-start-goals")
			return custom_date;
		if(duration=="custom-end")
		{
			custom_date=custom_date+(24*60*60)-1;
			return custom_date;
		}
		if(duration=="custom-end-goals")
		{
			var month_end=new Date(custom_date*1000);
			month_end.setMonth(month_end.getMonth()+1);
			custom_date=(month_end.setMilliseconds(0)/1000)-1;
			return custom_date;
		}

		// Last 24 Hrs
		if (duration == "24-hours") {
			var hrs = (d.setMilliseconds(0) / 1000) - (24 * 60 * 60);
			return hrs;
		}
		// Current time
		if (duration == "now")
			return (d.setMilliseconds(0) / 1000);
		// Today
		if (duration == "1-day" || duration == "today") {
			getGMTTimeFromDate(d) / 1000;
		}

		// This week
		if (duration == "this-week" || duration == "this-week-start") {
			if (new Date().getDay() != 0)
				d.setDate(d.getDate() - (new Date().getDay() - 1));
			else
				d.setDate(d.getDate() - (new Date().getDay() + 6));
		}
		// This week end
		if (duration == "this-week-end") {
			if (new Date().getDay() != 0)
				d.setDate((d.getDate() - (new Date().getDay() - 1)) + 7);
			else
				d.setDate((d.getDate() - (new Date().getDay() + 6)) + 7);
		}
		// Last week start
		if (duration == "last-week" || duration == "last-week-start")
			d.setDate(d.getDate() - d.getDay() - 6);

		// Lats week end
		if (duration == "last-week-end")
			d.setDate((d.getDate() - d.getDay()) + 1);

		// 1 Week ago
		if (duration == "1-week")
			d.setDate(d.getDate() - 6);

		// 1 Month ago
		if (duration == "1-month")
			d.setDate(d.getDate() - 29);

		// This month
		if (duration == "this-month" || duration == "this-month-start")
			d.setDate(1);

		// Last month start
		if (duration == "last-month" || duration == "last-month-start") {
			d.setDate(1);
			d.setMonth(d.getMonth() - 1);
		}

		// Lats month end
		if (duration == "last-month-end") {
			d.setDate((d.getDate() - d.getDate()) + 1);
			d.setMonth(d.getMonth());
		}

		// Tomorrow
		if (duration == "TOMORROW")
			d.setDate(d.getDate() + 1);

		// Yesterday
		if (duration == "yesterday")
			d.setDate(d.getDate() - 1);

		// Last 2 days
		if (duration == "2-days")
			d.setDate(d.getDate() - 1);

		// next 7 days
		if (duration == "next-7-days")
			d.setDate(d.getDate() + 8);

		// next 7 days
		if (duration == "today-and-tomorrow")
			d.setDate(d.getDate() + 2);

		// this quarter start
		if (duration == "this-quarter-start"
				|| duration == "this-and-next-quarter-start") {
			var currentMonth = d.getMonth();
			if (currentMonth < 3)
				d.setMonth(0);
			else if (currentMonth >= 3 && currentMonth < 6)
				d.setMonth(3);
			else if (currentMonth >= 6 && currentMonth < 9)
				d.setMonth(6);
			else if (currentMonth >= 9 && currentMonth < 12)
				d.setMonth(9);
			d.setDate(1);
		}

		// this quarter end
		if (duration == "this-quarter-end") {
			var currentMonth = d.getMonth();
			if (currentMonth < 3)
				d.setMonth(3);
			else if (currentMonth >= 3 && currentMonth < 6)
				d.setMonth(6);
			else if (currentMonth >= 6 && currentMonth < 9)
				d.setMonth(9);
			else if (currentMonth >= 9 && currentMonth < 12) {
				d.setFullYear(d.getFullYear() + 1);
				d.setMonth(0);
			}
			d.setDate(1);
		}

		// last quarter start
		if (duration == "last-quarter-start") {
			var currentMonth = d.getMonth();
			if (currentMonth < 3) {
				d.setFullYear(d.getFullYear() - 1);
				d.setMonth(9);
			} else if (currentMonth >= 3 && currentMonth < 6)
				d.setMonth(0);
			else if (currentMonth >= 6 && currentMonth < 9)
				d.setMonth(3);
			else if (currentMonth >= 9 && currentMonth < 12)
				d.setMonth(6);
			d.setDate(1);
		}

		// last quarter end
		if (duration == "last-quarter-end") {
			var currentMonth = d.getMonth();
			if (currentMonth < 3)
				d.setMonth(0);
			else if (currentMonth >= 3 && currentMonth < 6)
				d.setMonth(3);
			else if (currentMonth >= 6 && currentMonth < 9)
				d.setMonth(6);
			else if (currentMonth >= 9 && currentMonth < 12)
				d.setMonth(9);
			d.setDate(1);
		}

		// This month end
		if (duration == "this-month-end") {
			d.setDate(1);
			d.setMonth(d.getMonth() + 1);
		}

		// next quarter start
		if (duration == "next-quarter-start") {
			var currentMonth = d.getMonth();
			if (currentMonth < 3)
				d.setMonth(3);
			else if (currentMonth >= 3 && currentMonth < 6)
				d.setMonth(6);
			else if (currentMonth >= 6 && currentMonth < 9)
				d.setMonth(9);
			else if (currentMonth >= 9 && currentMonth < 12) {
				d.setFullYear(d.getFullYear() + 1);
				d.setMonth(0);
			}
			d.setDate(1);
		}

		// next quarter end
		if (duration == "next-quarter-end"
				|| duration == "this-and-next-quarter-end") {
			var currentMonth = d.getMonth();
			if (currentMonth < 3)
				d.setMonth(6);
			else if (currentMonth >= 3 && currentMonth < 6)
				d.setMonth(9);
			else if (currentMonth >= 6 && currentMonth < 9) {
				d.setFullYear(d.getFullYear() + 1);
				d.setMonth(0);
			} else if (currentMonth >= 9 && currentMonth < 12) {
				d.setFullYear(d.getFullYear() + 1);
				d.setMonth(3);
			}
			d.setDate(1);
		}

		// this year start
		if (duration == "this-year-start") {
			d.setMonth(d.getMonth() - d.getMonth());
			d.setDate(1);
		}

		// this year end
		if (duration == "this-year-end") {
			d.setFullYear(d.getFullYear() + 1);
			d.setMonth(d.getMonth() - d.getMonth());
			d.setDate(1);
		}

		// next year start
		if (duration == "next-year-start") {
			d.setFullYear(d.getFullYear() + 1);
			d.setMonth(d.getMonth() - d.getMonth());
			d.setDate(1);
		}

		// next year end
		if (duration == "next-year-end") {
			d.setFullYear(d.getFullYear() + 2);
			d.setMonth(d.getMonth() - d.getMonth());
			d.setDate(1);
		}

		// last year start
		if (duration == "last-year-start") {
			d.setFullYear(d.getFullYear() - 1);
			d.setMonth(d.getMonth() - d.getMonth());
			d.setDate(1);
		}

		// last year end
		if (duration == "last-year-end") {
			d.setFullYear(d.getFullYear());
			d.setMonth(d.getMonth() - d.getMonth());
			d.setDate(1);
		}


		return (getGMTTimeFromDate(d) / 1000);
	},

	/**
	 * To add newly added portlet to gridster.
	 */
	addWidgetToGridster : function(base_model) {

		if (!gridster)
			return;

		var add_flag = true;
		var portletId = 'ui-id-' + base_model.get("column_position") + '-'
				+ base_model.get("row_position") + '';

		gridster.$widgets.each(function(index, widget) {
			if (widget.id == portletId)
				add_flag = false;
		});

		if (!add_flag)
			return;

		if(Portlets_View.model_list_element_fragment.childElementCount>0)
		{
			gridster.add_widget($(Portlets_View.model_list_element_fragment.querySelector('[id="'+portletId+'"]'))
			, base_model.get("size_x"),
				base_model.get("size_y"), base_model.get("column_position"),
				base_model.get("row_position"));
		}
		gridster.add_widget($('#' + portletId), base_model.get("size_x"),
				base_model.get("size_y"), base_model.get("column_position"),
				base_model.get("row_position"));

		/*gridster.set_dom_grid_height();
		window
				.scrollTo(
						0,
						((parseInt($('#' + portletId).attr('data-row')) - 1) * 200) + 5);*/

	},

	getActivityObject : function(id, callback) {
		
		$.ajax({ 
			type : "GET", 
			url : 'core/api/activitylog/' + id,
			success : function(data) {
				return callback(data);
			}
		});
	

	},

	is_legend_enable_in_desktop : function(base_model){
	        
	        if(!base_model.get("size_x") || base_model.get("size_x") > 1)
	        		return true;	

	        return false;
	},

	is_legend_enable : function(base_model){
		return (!agile_is_mobile_browser()) ? true : false;
	},

	toggle_chart_legends: function(chart, base_model){
		if(!chart.series)
			  return;

		var items = chart.series; 
		for (var i = 0; i < items.length; i++) {
			this.toggle_legend_item(chart, items[i], base_model);
		};

	},
	toggle_legend_item : function(chart, item, base_model){
		if(this.is_legend_enable_in_desktop(base_model))
		{
			item.options.showInLegend = true;
			try{
				chart.legend.renderItem(item);	
			}catch(e){}
			try{
				chart.legend.render();	
			}catch(e){}
    		
		}else {
			item.options.showInLegend = false;
    		item.legendItem = null;
    		try{
				chart.legend.destroyItem(item);	
			}catch(e){}
			try{
				chart.legend.render();	
			}catch(e){}
		}
	},

	/**
	 * Set owners data in incoming deals and lost deal analysis portlet
	 * settings.
	 */
	setOwners : function(ele_id, base_model, elData) {
		var options = '<option value="">{{agile_lng_translate "subscriber_type" "all"}}</option>';
		$.ajax({
			type : 'GET',
			url : '/core/api/users/partial',
			dataType : 'json',
			success : function(data) {
				$.each(data, function(index, domainUser) {
					options += "<option value=" + domainUser.id + ">"
								+ domainUser.name + "</option>";
				});
				$('#' + ele_id, elData).html(options);
				$('#' + ele_id, elData).find("option[value="+base_model.get("settings")["owner"]+"]").attr("selected", "selected");
				$('.loading-img').hide();
			}
		});
	},

	setSources : function(ele_id, base_model, elData) {
		var sources = new Base_Collection_View({url : '/core/api/categories?entity_type=DEAL_SOURCE', sort_collection: false});
		sources.collection.fetch({
			success: function(data){
				var jsonModel = data.toJSON();
				var html =  '<option class="default-select" value="">'+_agile_get_translated_val('report-add','all-sources')+'</option>' + 
							'<option class="default-select" value="1">'+_agile_get_translated_val('report-add','unknown')+'</option>';
				
				$.each(jsonModel,function(index,dealSource){
					html+='<option class="default-select" value="'+dealSource.id+'">'+dealSource.label+'</option>';
				});
				$('#'+ele_id, elData).html(html);
				$('#'+ele_id, elData).find('option[value='+base_model.get("settings")["source"]+']').attr("selected", "selected");

				// Hide loading bar
				hideTransitionBar();
			}
		});
	},

	setTracks : function(ele_id, base_model, elData) {
		fillSelect(ele_id, "/core/api/milestone/pipelines", undefined, function()
		{
			$('#'+ele_id, elData).find('option[value='+base_model.get("settings")["track"]+']').attr("selected", "selected");
		}, '<option class="default-select" value="{{id}}">{{name}}</option>', false, undefined, "{{agile_lng_translate 'report-add' 'all-tracks'}}");
	}
};

function initializeCustomRangeInModal(base_model,elData){
	if(base_model.get("settings").duration=='Custom'){
		$('.daterange',elData).removeClass('hide');					
		if(base_model.get('name')=='Deal Goals'){			
			$("#start_date", elData).val(stringToDate(base_model.get("settings")["start-date"]*1000,'mmm yyyy')).blur();
			$("#end_date", elData).val(stringToDate(base_model.get("settings")["end-date"]*1000,'mmm yyyy')).blur();
			$('#start_date',elData).datepicker('remove');
			$('#end_date',elData).datepicker('remove');

			$('#start_date',elData).datepicker({ 
				format :"MM yyyy", minViewMode:"months", 
				weekStart : CALENDAR_WEEK_START_DAY, 
				autoclose : true,
				focusOnShow: false
			});

			$('#end_date',elData).datepicker({ 
				format :"MM yyyy", 
				minViewMode:"months", 
				weekStart : CALENDAR_WEEK_START_DAY, 
				autoclose : true,
				focusOnShow: false 
			});
		}else{
			$("#start_date", elData).val(getDateInFormatFromEpoc(base_model.get("settings")["start-date"]));
			$("#end_date", elData).val(getDateInFormatFromEpoc(base_model.get("settings")["end-date"]));
			$('#start_date',elData).datepicker('remove');
			$('#end_date',elData).datepicker('remove');

			var eventDate = $('#start_date',elData).datepicker({ 
				format : CURRENT_USER_PREFS.dateFormat, 
				weekStart : CALENDAR_WEEK_START_DAY, 
				autoclose: true,
				focusOnShow: false
			}).on('changeDate', function(ev){
				// If event start date is changed and end date is less than start date,
				// change the value of the end date to start date.
				var eventDate2;
				if(CURRENT_USER_PREFS.dateFormat.indexOf("dd/mm/yy") != -1 || CURRENT_USER_PREFS.dateFormat.indexOf("dd.mm.yy") != -1){
					eventDate2 = new Date(convertDateFromUKtoUS($('#end_date',elData).val()));
				}else{
					console.log('New');
				 	eventDate2 = new Date($('#end_date',elData).val());
				}
				
				if (ev.date.valueOf() > eventDate2.valueOf()){
					//var en_value=ev.date.valueOf();
					$('#end_date',elData).val($('#start_date', elData).val());
				}
			});

			$('#end_date',elData).datepicker({ 
				format : CURRENT_USER_PREFS.dateFormat, 
				weekStart : CALENDAR_WEEK_START_DAY, 
				autoclose: true,
				focusOnShow: false
			},'hide');
		}
	}else{
		$(elData).find('.daterange').addClass('hide');
		$(elData).find(".invalid-range").parents('.form-group').hide();
	}
}

function stringToDate(date,format)
{
	return new Date(date).format(format);
}


function getTranslatedPortletName(name){
	var name_json = {
		"HIGH": "{{agile_lng_translate 'tasks' 'High'}}",
        "LOW": "{{agile_lng_translate 'tasks' 'Low'}}",
        "NORMAL": "{{agile_lng_translate 'tasks' 'Normal'}}",
        "EMAIL": "{{agile_lng_translate 'tasks' 'Email'}}",
        "CALL": "{{agile_lng_translate 'tasks' 'Call'}}",
        "SEND": "{{agile_lng_translate 'tasks' 'Send'}}",
        "TWEET": "{{agile_lng_translate 'tasks' 'Tweet'}}",
        "FOLLOW_UP": "{{agile_lng_translate 'tasks' 'Follow Up'}}",
        "MEETING": "{{agile_lng_translate 'tasks' 'Meeting'}}",
        "MILESTONE": "{{agile_lng_translate 'tasks' 'Milestone'}}",
        "OTHER": "{{agile_lng_translate 'tasks' 'Other'}}",
        "YET_TO_START": "{{agile_lng_translate 'tasks' 'Yet To Start'}}",
        "IN_PROGRESS": "{{agile_lng_translate 'tasks' 'In Progress'}}",
        "COMPLETED": "{{agile_lng_translate 'tasks' 'Completed'}}",
        "TODAY": "{{agile_lng_translate 'tasks' 'Today'}}",
        "TOMORROW": "{{agile_lng_translate 'tasks' 'Tomorrow'}}",
        "OVERDUE": "{{agile_lng_translate 'tasks' 'Overdue'}}",
        "LATER": "{{agile_lng_translate 'tasks' 'Later'}}",
	};

	name = name.trim();
	return (name_json[name] ? name_json[name].replace(/&#39;/gi,"'") : ucfirst(name));
}

function removeSelectedData(elData)
{
	$('select option',elData).each(function(){
				if($(this).attr('selected'))
					$(this).removeAttr('selected');
			});
}
