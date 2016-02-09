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
								+ " selected='selected'>" + trackObj.name
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
			return callback("All Contacts");
		else if (base_model.get("settings").filter == 'companies')
			return callback("All Companies");
		else if (base_model.get("settings").filter == 'recent')
			return callback = "Recent Contacts";
		else if (base_model.get("settings").filter == 'myContacts')
			return callback("My Contacts");
		else if (base_model.get("settings").filter == 'leads')
			return callback("Leads");
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
						header_name = "Contact List";
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
						return callback("Default");
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

		if (campaign_id == 'All')
			return callback('All Campaigns');
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
		} else {
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
	getOuterViewOfPortlet : function(base_model, el, callback) {
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
			"Deal Goals" : "portlets-deal-goals",
			"Incoming Deals" : "portlets-incoming-deals",
			"Lost Deal Analysis" : "portlets-lost-deal-analysis",
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

		if ($('.gridster > div:visible > div', el).length == 0)
			$('.gridster > div:visible', el).html(
					$(App_Portlets.portletOuterView.render().el).attr(
							"id",
							"ui-id-" + column_position + "-"
									+ row_position).attr(
							"data-sizey", size_y).attr(
							"data-sizex", size_x).attr(
							"data-col", column_position)
							.attr("data-row", row_position)
							.addClass('gs-w panel panel-default'));
		else
			$('.gridster > div:visible > div:last', el).after(
					$(App_Portlets.portletOuterView.render().el).attr(
							"id",
							"ui-id-" + column_position + "-"
									+ row_position).attr(
							"data-sizey", size_y).attr(
							"data-sizex", size_x).attr(
							"data-col", column_position)
							.attr("data-row", row_position)
							.addClass('gs-w panel panel-default'));

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
	getInnerViewOfPortlet : function(base_model, el) {
		var column_position = base_model.get('column_position'), row_position = base_model
				.get('row_position');
		var pos = '' + column_position + '' + row_position;
		var portlet_name = base_model.get('name'), portlet_ele = $(
				'#ui-id-' + column_position + '-' + row_position, el).find(
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
										.getStartAndEndDatesOnDue(start_date_str)
								+ '&end-date='
								+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str),
						templateKey : 'portlets-contacts-email-opens',
						sort_collection : false,
						individual_tag_name : 'tr',
						postRenderCallback : function(p_el) {
							head.js(LIB_PATH + 'lib/jquery.timeago.js', function() {
								$(".time-ago", p_el).timeago();
								initializePortletsListeners();
							});
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
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str)
					+ '&end-date='
					+ portlet_utility.getStartAndEndDatesOnDue(end_date_str);
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
							head.js(LIB_PATH + 'lib/jquery.timeago.js', function() {
								$(".time-ago", p_el).timeago();
								initializePortletsListeners();
							});
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
					head.js(LIB_PATH + 'lib/jquery.timeago.js', function() {
						$(".time-ago", p_el).timeago();
					});
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
										.getStartAndEndDatesOnDue(start_date_str)
								+ '&end_time='
								+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str),
						templateKey : 'portlets-events',
						sort_collection : false,
						individual_tag_name : 'tr',
						postRenderCallback : function(p_el) {
							portlet_utility.addWidgetToGridster(base_model);
							loadGoogleEventsForPortlets(
									p_el,
									portlet_utility
											.getStartAndEndDatesOnDue(start_date_str),
									portlet_utility
											.getStartAndEndDatesOnDue(end_date_str));
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
										.getStartAndEndDatesOnDue(start_date_str)
								+ '&end_time='
								+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str),
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
										.getStartAndEndDatesOnDue(start_date_str)
								+ '&end-date='
								+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str)
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
			App_Portlets.activity[parseInt(pos)] = new Base_Collection_View({
				url : '/core/api/portlets/customer-activity',
				sortKey : 'time',
				descending : true,
				templateKey : "portlets-activities-list-log",
				cursor : true,
				page_size : 20,
				individual_tag_name : 'div',
				postRenderCallback : function(p_el) {
					portlet_utility.addWidgetToGridster(base_model);

					head.js(LIB_PATH + 'lib/jquery.timeago.js', function() {
						$("time", p_el).timeago();

					});
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
			var emailsSentCount, emailsOpenedCount, emailsClickedCount, emailsUnsubscribed, that = portlet_ele;
			var url = '/core/api/portlets/campaign-stats?duration='
					+ base_model.get('settings').duration + '&start-date='
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str)
					+ '&end-date='
					+ portlet_utility.getStartAndEndDatesOnDue(end_date_str)
					+ '&time_zone=' + (new Date().getTimezoneOffset())
					+ '&campaign_type='
					+ base_model.get('settings').campaign_type;

			setTimeout(
					function() {
						if (that.find('#emails-sent-count').text().trim() == "")
							that
									.find('#emails-sent-count')
									.html(
											"<img src='"+updateImageS3Path('../flatfull/img/ajax-loader-cursor.gif')+"' style='width:12px;height:10px;opacity:0.5;' />");
					}, 1000);

			portlet_graph_data_utility
					.fetchPortletsGraphData(
							url,
							function(data) {
								emailsSentCount = data["emailsent"];
								emailsOpenedCount = data["emailopened"];
								emailsClickedCount = data["emailclicked"];
								emailsUnsubscribed = data["emailunsubscribed"];
								if (emailsSentCount == 0) {
									that.find('#emails-sent').css('width',
											'100%').css('height', '100%');
									that
											.find('#emails-sent')
											.html(
													'<div class="portlet-error-message">No Email activity</div>');
								} else {
									that
											.find('#emails-opened')
											.css('display', 'block')
											.addClass(
													'pull-left p-xs b-b b-light w-half');
									that
											.find('#emails-clicked')
											.css('display', 'block')
											.addClass(
													'pull-left p-xs b-r b-light w-half');
									that.find('#emails-unsubscribed').css(
											'display', 'block').addClass(
											'pull-left p-xs w-half');
									that
											.find('#emails-sent')
											.addClass(
													'pull-left p-xs b-b b-r b-light w-half overflow-hidden');

									that
											.find('#emails-sent-count')
											.text(
													portlet_utility
															.getNumberWithCommasForPortlets(emailsSentCount));
									that.find('#emails-sent-label').text(
											"Emails sent");
									that
											.find('#emails-opened')
											.html(
													'<div class="pull-left text-light stats_text"><div class="text-sm text-ellipsis">Opened</div><div class="text-count text-center" style="color:rgb(250, 215, 51);">'
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
									that
											.find('#emails-unsubscribed')
											.html(
													'<div class="pull-left text-light stats_text"><div class="text-sm text-ellipsis">Unsubscribed</div><div class="text-count text-center" style="color:rgb(240, 80, 80);">'
															+ portlet_utility
																	.getNumberWithCommasForPortlets(emailsUnsubscribed)
															+ '</div>');
								}

								portlet_utility.addWidgetToGridster(base_model);
							});
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
							.getStartAndEndDatesOnDue(base_model
									.get('settings').duration) * 1000))
					+ '&end-date='
					+ getUTCMidNightEpochFromDate(new Date(portlet_utility
							.getStartAndEndDatesOnDue("TOMORROW") * 1000));
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
											+ "' class='tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block'>"
											+ tagName
											+ "<a id='remove_tag' class='close m-l-xs'>&times</a></li>";
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
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str)
					+ '&end-date='
					+ portlet_utility.getStartAndEndDatesOnDue(end_date_str)
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
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str)
					+ '&end-date='
					+ portlet_utility.getStartAndEndDatesOnDue(end_date_str)
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
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str)
					+ '&max='
					+ (portlet_utility.getStartAndEndDatesOnDue(end_date_str) - 1)
					+ '';
			portlet_graph_data_utility.revenueGraphData(base_model, selector,
					url);
			setPortletContentHeight(base_model);
			break;
		}
		case "Stats Report": {
			portlet_ele = $('#ui-id-' + column_position + '-' + row_position,
					el).find('.stats_report_portlet_body');
			var that = portlet_ele;
			var newContactsurl = '/core/api/portlets/activity-overview-report?reportType=newContacts&duration='
					+ base_model.get('settings').duration
					+ '&start-date='
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str)
					+ '&end-date='
					+ portlet_utility.getStartAndEndDatesOnDue(end_date_str)
					+ '&time_zone=' + (new Date().getTimezoneOffset());
			setTimeout(
					function() {
						if (that.find('#new-contacts-count').text().trim() == "")
							that
									.find('#new-contacts-count')
									.html(
											"<img src='"+updateImageS3Path('../flatfull/img/ajax-loader-cursor.gif')+"' style='width:12px;height:10px;opacity:0.5;' />");
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
										"New contacts");
							});

			var wonDealsurl = '/core/api/portlets/activity-overview-report?reportType=wonDeals&duration='
					+ base_model.get('settings').duration
					+ '&start-date='
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str)
					+ '&end-date='
					+ portlet_utility.getStartAndEndDatesOnDue(end_date_str)
					+ '&time_zone=' + (new Date().getTimezoneOffset());
			setTimeout(
					function() {
						if (that.find('#won-deal-value').text().trim() == "")
							that
									.find('#won-deal-value')
									.html(
											"<img src='"+updateImageS3Path('../flatfull/img/ajax-loader-cursor.gif')+"' style='width:12px;height:10px;opacity:0.5;' />");
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
												"Won from "
														+ portlet_utility
																.getNumberWithCommasForPortlets(data['wonDealsCount'])
														+ " deals");
							});

			var newDealsurl = '/core/api/portlets/activity-overview-report?reportType=newDeals&duration='
					+ base_model.get('settings').duration
					+ '&start-date='
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str)
					+ '&end-date='
					+ portlet_utility.getStartAndEndDatesOnDue(end_date_str)
					+ '&time_zone=' + (new Date().getTimezoneOffset());
			setTimeout(
					function() {
						if (that.find('#new-deal-value').text().trim() == "")
							that
									.find('#new-deal-value')
									.html(
											"<img src='"+updateImageS3Path('../flatfull/img/ajax-loader-cursor.gif')+"' style='width:12px;height:10px;opacity:0.5;' />");
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
												"New deals worth "
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
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str)
					+ '&end-date='
					+ portlet_utility.getStartAndEndDatesOnDue(end_date_str)
					+ '&time_zone=' + (new Date().getTimezoneOffset());
			setTimeout(
					function() {
						if (that.find('#emails-sent-count').text().trim() == "")
							that
									.find('#emails-sent-count')
									.html(
											"<img src='"+updateImageS3Path('../flatfull/img/ajax-loader-cursor.gif')+"' style='width:12px;height:10px;opacity:0.5;' />");
					}, 1000);
			var emailsSentCount = 0;
			if (_agile_get_prefs('dashboard_campaign_count_'+CURRENT_DOMAIN_USER.id)) {
				emailsSentCount = _agile_get_prefs('dashboard_campaign_count_'+CURRENT_DOMAIN_USER.id);
			}
			that.find('#emails-sent-count').text(portlet_utility.getNumberWithCommasForPortlets(emailsSentCount));
			that.find('#emails-sent-label').text("Campaign emails sent");
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
										"Campaign emails sent");
								_agile_set_prefs('dashboard_campaign_count_'+CURRENT_DOMAIN_USER.id, data["emailsSentCount"]);
							});
			setPortletContentHeight(base_model);
			break;
		}
		case "Mini Calendar": {
			head
					.js(
							LIB_PATH + 'lib/jquery-ui.min.js',
							'lib/fullcalendar.min.js',
							function() {
								$('.portlet_body_calendar', $('#portlet-res'))
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
													minicalendar($(this));
												});
							});
			break;
		}
		case "Onboarding" : {
			setPortletContentHeight(base_model);
			break;
		}

		case "Deal Goals" : {

					portlet_ele = $('#ui-id-' + column_position + '-' + row_position,
					el).find('.goals_portlet_body');
					portlet_ele
						.attr('id', 'p-body-' + column_position + '-' + row_position);
					var that=portlet_ele;
			   selector= portlet_ele.attr('id');
			var url = '/core/api/portlets/goals/'+CURRENT_DOMAIN_USER.id
						+ '?start-date='
								+ portlet_utility
										.getStartAndEndDatesOnDue(start_date_str)
								+ '&end-date='
								+ portlet_utility
										.getStartAndEndDatesOnDue(end_date_str);
			portlet_graph_data_utility
					.fetchPortletsGraphData(
							url,
							function(data) {
								that.find('.deal_count').html(
									portlet_utility.getNumberWithCommasForPortlets(data["dealcount"]));
								that.find('.goal_count').html('Won Deals <br> from '+
										portlet_utility.getNumberWithCommasForPortlets(data["goalCount"])+' Goals');
								that.find('.deal_amount').html(portlet_utility.getPortletsCurrencySymbol()+
									'' +
									portlet_utility.getNumberWithCommasForPortlets(data["dealAmount"]));
								that.find('.goal_amount').html('Revenue <br> from '+portlet_utility.getPortletsCurrencySymbol()+
									'' +
									portlet_utility.getNumberWithCommasForPortlets(data["goalAmount"])+' Goals');
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
			var url = 'core/api/opportunity/details/'
					+ owner_id
					+ '?min='
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str)
					+ '&max='
					+ (portlet_utility.getStartAndEndDatesOnDue(end_date_str) - 1)
					+ '&frequency='
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
			var url = 'core/api/opportunity/details/'
					+ owner_id + '/'
					+ track_id + '/'
					+ source_id
					+ '?min='
					+ portlet_utility.getStartAndEndDatesOnDue(start_date_str)
					+ '&max='
					+ (portlet_utility.getStartAndEndDatesOnDue(end_date_str) - 1);

			var sizey = parseInt($('#' + selector).parent().attr("data-sizey"));
			var topPos = 50 * sizey;
			if (sizey == 2 || sizey == 3)
				topPos += 50;
			$('#' + selector)
					.html(
							"<div class='text-center v-middle opa-half' style='margin-top:"
									+ topPos
									+ "px'><img src='"+updateImageS3Path('../flatfull/img/ajax-loader-cursor.gif')+"' style='width:12px;height:10px;opacity:0.5;' /></div>");
			$("#"+selector).addClass("lost-deal-analysis-portlet-pie");
			pieforReports(url, selector, '', undefined, true);
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
			that.addPortletSettingsModalContent(base_model,
					"portletsContactsFilterBasedSettingsModal");
			elData = $('#portletsContactsFilterBasedSettingsForm');
			var existed_filter = base_model.get("settings").filter;
			var options = '<option value="">Select...</option>';
			if (existed_filter == "contacts") {
				options += "<option selected='selected' value='contacts'>All Contacts</option>";
			}
			else {
				options += "<option value='contacts'>All Contacts</option>";
			}
			if (existed_filter == "myContacts") {
				options += "<option selected='selected' value='myContacts'>My Contacts</option>";
			}
			else {
				options += "<option value='myContacts'>My Contacts</option>";
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
			break;
		}
		case "Emails Opened": {
			that.addPortletSettingsModalContent(base_model,
					"portletsContactsEmailsOpenedSettingsModal");
			elData = $('#portletsContactsEmailsOpenedSettingsModal');
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			break;
		}
		case "Emails Sent": {
			that.addPortletSettingsModalContent(base_model,
					"portletsContactsEmailsSentSettingsModal");
			elData = $('#portletsContactsEmailsSentSettingsModal');
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			break;
		}
		case "Growth Graph": {
			$('#portlet-ul-tags > li').remove();
			$('#cancel-modal').attr('disabled', false);
			that.addPortletSettingsModalContent(base_model,
					"portletsContactsGrowthGraphSettingsModal");
			elData = $('#portletsContactsGrowthGraphSettingsModal');
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
											+ "' class='tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block'>"
											+ tagName
											+ "<a id='remove_tag' class='close m-l-xs'>&times</a></li>";
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
			break;
		}
		case "Pending Deals": {
			that.addPortletSettingsModalContent(base_model,
					"portletsPendingDealsSettingsModal");
			elData = $('#portletsPendingDealsSettingsModal');
			$("#deals", elData).find(
					'option[value=' + base_model.get("settings").deals + ']')
					.attr("selected", "selected");
			if (base_model.get('settings').track == "anyTrack") {
				options += '<option value="anyTrack" selected="selected">Any</option>';
			} else {
				options += '<option value="anyTrack">Any</option>';
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
						$('#milestone', elData).html('<option value="anyMilestone">Any</option>');
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
			$('#milestone', elData).html('<option value="anyMilestone">Any</option>');
		}

				}
			});
	
			/*if (base_model.get('settings').milestone == "anyMilestone") {
				options += '<option value="anyMilestone" selected="selected">Any</option>';
			} else {
				options += '<option value="anyMilestone">Any</option>';
			}
			$("#milestone", elData).find(
					'option[value=' + base_model.get("settings").milestone + ']')
					.attr("selected", "selected");*/
			break;
		}
		case "Deals By Milestone": {
			that.addPortletSettingsModalContent(base_model,
					"portletsDealsByMilestoneSettingsModal");
			elData = $('#portletsDealsByMilestoneSettingsModal');
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
			break;
		}
		case "Closures Per Person": {
			that.addPortletSettingsModalContent(base_model,
					"portletsDealsClosuresPerPersonSettingsModal");
			elData = $('#portletsDealsClosuresPerPersonSettingsModal');
			$("#group-by", elData).find(
					'option[value=' + base_model.get("settings")["group-by"]
							+ ']').attr("selected", "selected");
			$("#due-date", elData)
					.val(
							getDateInFormatFromEpoc(base_model.get("settings")["due-date"]));
			break;
		}
		case "Deals Won": {
			that.addPortletSettingsModalContent(base_model,
					"portletsDealsWonSettingsModal");
			elData = $('#portletsDealsWonSettingsModal');
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			break;
		}
		case "Deals Funnel": {
			that.addPortletSettingsModalContent(base_model,
					"portletsDealsFunnelSettingsModal");
			elData = $('#portletsDealsFunnelSettingsModal');
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
			that.addTracks(tracks, base_model, elData);
			break;
		}
		case "Deals Assigned": {
			that.addPortletSettingsModalContent(base_model,
					"portletsDealsAssignedSettingsModal");
			elData = $('#portletsDealsAssignedSettingsModal');
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			break;
		}
		case "Calls Per Person": {
			elData = $('#portletsCallsPerPersonSettingsModal');
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
			break;
		}
		case "Task Report": {
			elData = $('#portletsTaskReportSettingsModal');
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
			break;
		}
		case "Stats Report": {
			that.addPortletSettingsModalContent(base_model,
					"portletsStatsReportSettingsModal");
			elData = $('#portletsStatsReportSettingsModal');
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			break;
		}
		case "Agenda": {
			that.addPortletSettingsModalContent(base_model,
					"portletsAgendaSettingsModal");
			elData = $('#portletsAgendaSettingsModal');
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			break;
		}
		case "Today Tasks": {
			that.addPortletSettingsModalContent(base_model,
					"portletsTodayTasksSettingsModal");
			elData = $('#portletsTodayTasksSettingsModal');
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			break;
		}
		case "Leaderboard": {
			elData = $('#portletsLeaderboardSettingsModal');
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
				$('#category-list, #user-list', elData).multiSelect();
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
			break;
		}
		case "Revenue Graph": {
			that.addPortletSettingsModalContent(base_model,
					"portletsDealsRevenueGraphSettingsModal");
			elData = $('#portletsDealsRevenueGraphSettingsModal');
			var options = '';
			if (base_model.get('settings').track == "anyTrack") {
				options += '<option value="anyTrack" selected="selected">Any</option>';
			} else {
				options += '<option value="anyTrack">Any</option>';
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
			break;
		}
		case "Campaign stats": {
			that.addPortletSettingsModalContent(base_model,
					"portletsCampaignStatsSettingsModal");
			elData = $('#portletsCampaignStatsSettingsModal');
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			var options = "<option value='All'>All Campaigns</option>";
			$.ajax({
				type : 'GET',
				url : '/core/api/workflows',
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
			break;
		}

		case "Deal Goals": {
			that.addPortletSettingsModalContent(base_model,
					"portletsGoalsSettingsModal");
			elData = $('#portletsGoalsSettingsModal');
			$("#duration", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			break;
		}
		case "Incoming Deals": {
			that.addPortletSettingsModalContent(base_model,
					"portletsIncomingDealsSettingsModal");
			elData = $('#portletsIncomingDealsSettingsModal');
			$("#duration-incoming-deals", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			$("#split-by-incoming-deals", elData).find('option[value='+ base_model.get("settings")["type"] + ']').attr("selected", "selected");
			$("#frequency-incoming-deals", elData).find('option[value='+ base_model.get("settings")["frequency"] + ']').attr("selected", "selected");
			portlet_utility.setOwners("owner", base_model, elData);
			break;
		}
		case "Lost Deal Analysis": {
			that.addPortletSettingsModalContent(base_model,
					"portletsLostDealAnalysisSettingsModal");
			elData = $('#portletsLostDealAnalysisSettingsModal');
			$("#duration-lost-deal-analysis", elData)
					.find(
							'option[value='
									+ base_model.get("settings").duration + ']')
					.attr("selected", "selected");
			portlet_utility.setOwners("owner-lost-deal-analysis", base_model, elData);
			portlet_utility.setTracks("track-lost-deal-analysis", base_model, elData);
			portlet_utility.setSources("source-lost-deal-analysis", base_model, elData);
			break;
		}
		}
		if (base_model.get('name') == "Pending Deals"
				|| base_model.get('name') == "Deals By Milestone"
				|| base_model.get('name') == "Closures Per Person"
				|| base_model.get('name') == "Deals Funnel") {
			$('#due-date', elData).datepicker({
				format : CURRENT_USER_PREFS.dateFormat
			});
		}
	},

	/**
	 * Set portlet type and name in settings modal of each portlet and modal
	 * should be open.
	 */
	addPortletSettingsModalContent : function(base_model, modal_id) {
		$('#' + modal_id).modal('show');
		$(
				'#'
						+ modal_id
						+ ' > .modal-dialog > .modal-content > .modal-footer > .save-modal')
				.attr('id', base_model.get("id") + '-save-modal');
		$("#portlet-type", $('#' + modal_id)).val(
				base_model.get('portlet_type'));
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
					url : '/core/api/users',
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
					url : '/core/api/users',
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

		if (hrs != 0)
			duration += '' + ((days * 24) + hrs) + 'h';
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

		var name_json = {
			"HIGH" : "High",
			"LOW" : "Low",
			"NORMAL" : "Normal",
			"EMAIL" : "Email",
			"CALL" : "Call",
			"SEND" : "Send",
			"TWEET" : "Tweet",
			"FOLLOW_UP" : "Follow Up",
			"MEETING" : "Meeting",
			"MILESTONE" : "Milestone",
			"OTHER" : "Other",
			"YET_TO_START" : "Yet To Start",
			"IN_PROGRESS" : "In Progress",
			"COMPLETED" : "Completed",
			"TODAY" : "Today",
			"TOMORROW" : "Tomorrow",
			"OVERDUE" : "Overdue",
			"LATER" : "Later"
		};

		name = name.trim();

		return (name_json[name] ? name_json[name] : name);

	},

	/**
	 * Get the start and end dates epoch based on duration.
	 */
	getStartAndEndDatesOnDue : function(duration) {

		var d = new Date();

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

		gridster.add_widget($('#' + portletId), base_model.get("size_x"),
				base_model.get("size_y"), base_model.get("column_position"),
				base_model.get("row_position"));

		gridster.set_dom_grid_height();
		window
				.scrollTo(
						0,
						((parseInt($('#' + portletId).attr('data-row')) - 1) * 200) + 5);

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
		var options = '<option value="">All</option>';
		$.ajax({
			type : 'GET',
			url : '/core/api/users',
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
				var html =  '<option class="default-select" value="">All Sources</option>' + 
							'<option class="default-select" value="1">Unknown</option>';
				
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
		}, '<option class="default-select" value="{{id}}">{{name}}</option>', false, undefined, "All Tracks");
	}
};