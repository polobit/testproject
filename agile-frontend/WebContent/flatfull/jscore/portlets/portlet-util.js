var portlet_utility = {

  	addTracks: function(tracks, base_model, elData){
  		var options = '';
		$.each(tracks,function(index,trackObj){
			if(base_model.get('settings').track==0 && trackObj.name=="Default")
				options+="<option value="+trackObj.id+" selected='selected'>"+trackObj.name+"</option>";
			else if(base_model.get('settings').track==trackObj.id)
				options+="<option value="+trackObj.id+" selected='selected'>"+trackObj.name+"</option>";
			else
				options+="<option value="+trackObj.id+">"+trackObj.name+"</option>";
		});
		
		$('#track', elData).html(options);
		$('.loading-img').hide();
		$("#deals", elData).find('option[value='+ base_model.get("settings").deals +']').attr("selected", "selected");
  	},

  	/**
	 * getting flitered contact portlet header name
	 */
  	get_filtered_contact_header : function(base_model, callback){

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
		else
		{

			var contactFilter = $.ajax({ type : 'GET', url : '/core/api/filters/' + base_model.get("settings").filter, dataType : 'json', success : function(data)
			{
				var header_name = '';
				if (data != null && data != undefined)
					header_name = "" + data.name;

				if (!header_name){
					header_name = "Contact List";
				}
					
				return callback(header_name);

			} });
		}

  	}, 

  	/**
	 * getting flitered contact portlet header name
	 */
  	get_deals_funnel_portlet_header : function(base_model, callback){

  		var track_id = base_model.get("settings").track;

  		App_Portlets.track_length = 0;
		$.ajax({ type : 'GET', url : '/core/api/milestone/pipelines', dataType : 'json', success : function(data)
		{
			App_Portlets.track_length = data.length;
			App_Portlets.deal_tracks = data;

			if (App_Portlets.track_length > 1)
			{
				if (track_id == 0)
					return callback("Default");
				else
				{
					var milestone = $.ajax({ type : 'GET', url : '/core/api/milestone/' + track_id, dataType : 'json', success : function(data)
					{
						if (data != null && data != undefined)
							return callback("" + data.name + "");
					} });
				}
			}

		} });
	
 	},

 	/**
	 * getting default portlet settings for all portlets
	 */
	getDefaultPortletSettings : function(portlet_type, p_name){
		var json={};
		if(portlet_type=="CONTACTS" && p_name=="Filter Based")
			json['filter']="myContacts";
		else if(portlet_type=="CONTACTS" && p_name=="Emails Opened")
			json['duration']="2-days";
		else if(portlet_type=="USERACTIVITY" && p_name=="Emails Sent")
			json['duration']="1-day";
		else if(portlet_type=="CONTACTS" && p_name=="Growth Graph"){
			json['tags']="";
			json['frequency']='daily';
			json['duration']="1-week";
		}
		else if(portlet_type=="DEALS" && p_name=="Pending Deals"){
			json['deals']="my-deals";
		}
		else if(portlet_type=="DEALS" && (p_name=="Deals By Milestone" || p_name=="Deals Funnel")){
			json['deals']="my-deals";
			json['track']=0;
		}else if(portlet_type=="DEALS" && p_name=="Closures Per Person"){
			json['group-by']="number-of-deals";
			json['due-date']=Math.round((new Date()).getTime()/1000);
		}else if(portlet_type=="DEALS" && p_name=="Deals Won")
			json['duration']="1-week";
		else if(portlet_type=="DEALS" && p_name=="Deals Assigned")
			json['duration']="1-day";
		else if(portlet_type=="USERACTIVITY" && p_name=="Calls Per Person"){
			json['group-by']="number-of-calls";
			json['duration']="1-day";
		}else if(portlet_type=="TASKSANDEVENTS" && p_name=="Task Report"){
			json['group-by']="user";
			json['split-by']="category";
			json['duration']="1-week";
			json['tasks']="all-tasks";
		}else if(portlet_type=="USERACTIVITY" && p_name=="Stats Report"){
			json['duration']="yesterday";
		}else if(portlet_type=="TASKSANDEVENTS" && p_name=="Agenda")
			json['duration']="today-and-tomorrow";
		else if(portlet_type=="TASKSANDEVENTS" && p_name=="Today Tasks")
			json['duration']="today-and-tomorrow";
		else if(portlet_type=="ACCOUNT" && p_name=="Account Details"){
      		//json['account']="account";
		}else if(portlet_type=="USERACTIVITY" && p_name=="Leaderboard"){
			json['duration']="this-month";
			var categoryJson={};
			categoryJson['revenue']=true;
			categoryJson['dealsWon']=true;
			categoryJson['calls']=true;
			categoryJson['tasks']=true;
			json['category']=categoryJson;
		}else if(portlet_type=="DEALS" && p_name=="Revenue Graph"){
			json['duration']="this-quarter";
			json['track']="anyTrack";
		}
		else if(portlet_type=="USERACTIVITY" && p_name=="Campaign stats"){
			json['duration']="yesterday";
			json['campaign_type']="All";
		}
		return json;
	},

	getStartAndEndDurations : function(base_model, callback){
		var durationJson = {};
		if(base_model.get('settings').duration=='yesterday'){
			durationJson['start_date_str'] = ''+base_model.get('settings').duration;
			durationJson['end_date_str'] = 'today';
		}else if(base_model.get('settings').duration=='this-week'){
			durationJson['start_date_str'] = ''+base_model.get('settings').duration;
			durationJson['end_date_str'] = 'this-week-end';
		}else if(base_model.get('settings').duration=='this-month'){
			durationJson['start_date_str'] = ''+base_model.get('settings').duration;
			durationJson['end_date_str'] = 'this-month-end';
		}else if(base_model.get('settings').duration=='next-7-days'){
			durationJson['start_date_str'] = 'TOMORROW';
			durationJson['end_date_str'] = ''+base_model.get('settings').duration;
		}else if(base_model.get('settings').duration=='today-and-tomorrow'){
			durationJson['start_date_str'] = 'today';
			durationJson['end_date_str'] = ''+base_model.get('settings').duration;
		}else if(base_model.get('settings').duration=='last-week'){
			durationJson['start_date_str'] = ''+base_model.get('settings').duration;
			durationJson['end_date_str'] = 'last-week-end';
		}else if(base_model.get('settings').duration=='last-month'){
			durationJson['start_date_str'] = ''+base_model.get('settings').duration;
			durationJson['end_date_str'] = 'last-month-end';
		}else if(base_model.get('settings').duration=='24-hours'){
			durationJson['start_date_str'] = ''+base_model.get('settings').duration;
			durationJson['end_date_str'] = 'now';
		}else{
			durationJson['start_date_str'] = ''+base_model.get('settings').duration;
			durationJson['end_date_str'] = 'TOMORROW';
		}

		return callback(durationJson);
	},

	getDurationForPortlets : function(duration, callback){
		var time_period = 'Today';
		if (duration == 'yesterday'){
			time_period = 'Yesterday';
		}else if (duration == '1-day' || duration == 'today'){
			time_period = 'Today';
		}else if (duration == '2-days'){
			time_period = 'Last 2 Days';
		}else if (duration == 'this-week'){
			time_period = 'This Week';
		}else if (duration == 'last-week'){
			time_period = 'Last Week';
		}else if (duration == '1-week'){
			time_period = 'Last 7 Days';
		}else if (duration == 'this-month'){
			time_period = 'This Month';
		}else if (duration == 'last-month'){
			time_period = 'Last Month';
		}else if (duration == '1-month'){
			time_period = 'Last 30 Days';
		}else if (duration == 'this-quarter'){
			time_period = 'This Quarter';
		}else if (duration == 'last-quarter'){
			time_period = 'Last Quarter';
		}else if (duration == '3-months'){
			time_period = 'Last 3 Months';
		}else if (duration == '6-months'){
			time_period = 'Last 6 Months';
		}else if (duration == '12-months'){
			time_period = 'Last 12 Months';
		}else if (duration == 'today-and-tomorrow'){
			time_period = 'Today and Tomorrow';
		}else if (duration == 'all-over-due'){
			time_period = 'All Over Due';
		}else if (duration == 'next-7-days'){
			time_period = 'Next 7 Days';
		}else if (duration == '24-hours'){
			time_period = 'Last 24 Hours';
		}
		
		return callback(time_period);
	},

	getOuterViewOfPortlet : function(base_model, el){
		var templates_json = {"Filter Based" : "portlets-contacts-filterbased",
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
								"Campaign stats" : "portlets-campaign-stats-report"};
		var templateKey = templates_json[base_model.get('name')];
		if(CURRENT_DOMAIN_USER.is_admin && base_model.get('name') == "Onboarding"){
			templateKey = "portlets-admin-onboarding";
		}
		var that = this;
		App_Portlets.portletOuterView = new Base_Model_View({ model : base_model, template : templateKey+'-model', tagName : 'div', postRenderCallback: function(ele){
			that.invokeOuterViewCallback(base_model , ele); 
		} });
		
		if($('.gridster > div:visible > div', el).length==0)
			$('.gridster > div:visible',el).html($(App_Portlets.portletOuterView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w panel panel-default'));
		else
			$('.gridster > div:visible > div:last', el).after($(App_Portlets.portletOuterView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w panel panel-default'));
		
	},

	invokeOuterViewCallback : function(base_model, el){
		var that = this;
		switch (base_model.get('name')) {
    		case "Filter Based":
        		that.get_filtered_contact_header(base_model, function(header_name){
			     	$(el).find(".flitered_contact_portlet_header").html(header_name);	
			    });
			    break;
    		case "Deals By Milestone":
        		that.get_deals_funnel_portlet_header(base_model, function(header_name){
			     	$(el).find(".deals_funnel_portlet_header").html(header_name);	
			    });
			    break;
			case "Deals Funnel":
        		that.get_deals_funnel_portlet_header(base_model, function(header_name){
			     		$(el).find(".deals_funnel_portlet_header").html(header_name);	
			    });
			    break;
		}
	},

	getInnerViewOfPortlet : function(base_model, el){
		var column_position = base_model.get('column_position');
		var row_position = base_model.get('row_position');
		var pos = ''+column_position+''+row_position;
		var portlet_name = base_model.get('name');
		var portlet_ele = $('#ui-id-'+column_position+'-'+row_position, el).find('.portlet_body');
		var start_date_str = '';
		var end_date_str = '';
		portlet_utility.getStartAndEndDurations(base_model, function(durationJson){
			start_date_str = durationJson['start_date_str'];
			end_date_str = durationJson['end_date_str'];
		});
		var users = '';
		if(base_model.get('settings').user!=undefined){
			users = JSON.stringify(base_model.get('settings').user);
		}
		portlet_ele.attr('id','p-body-'+column_position+'-'+row_position);
		var selector=portlet_ele.attr('id');

		switch(portlet_name) {
			case "Filter Based":
				App_Portlets.filteredContacts[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletContacts?filter='+base_model.get('settings').filter+'&sortKey=-created_time', templateKey : "portlets-contacts", sort_collection : false, individual_tag_name : 'tr', sortKey : "-created_time",
					postRenderCallback : function(p_el){
						addWidgetToGridster(base_model);
					} });
				App_Portlets.filteredContacts[parseInt(pos)].collection.fetch();
				portlet_ele.html(getRandomLoadingImg());
				portlet_ele.html($(App_Portlets.filteredContacts[parseInt(pos)].render().el));
				setPortletContentHeight(base_model);
				break;
			case "Emails Opened":
				App_Portlets.emailsOpened[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletEmailsOpened?duration='+base_model.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str), templateKey : 'portlets-contacts-email-opens', sort_collection : false, individual_tag_name : 'tr',
					postRenderCallback : function(p_el){
						displayTimeAgo(p_el);
						addWidgetToGridster(base_model);
					} });
				App_Portlets.emailsOpened[parseInt(pos)].collection.fetch();
				portlet_ele.find('#emails-opened-contacts-list').attr('id','emails-opened-contacts-list-'+column_position+'-'+row_position);
				portlet_ele.find('#emails-opened-contacts-list-'+column_position+'-'+row_position).html(getRandomLoadingImg());
				portlet_ele.find('#emails-opened-contacts-list-'+column_position+'-'+row_position).html($(App_Portlets.emailsOpened[parseInt(pos)].render().el));
				portlet_ele.find('#emails-opened-pie-chart').attr('id','emails-opened-pie-chart-'+column_position+'-'+row_position);
				selector='emails-opened-pie-chart-'+column_position+'-'+row_position;
				var url='/core/api/portlets/portletEmailsOpenedPie?duration='+base_model.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str);
				portlet_graph_data_utility.emailsOpenedGraphData(base_model, selector, url);
				setPortletContentHeight(base_model);
				break;
			case "Pending Deals":
				App_Portlets.pendingDeals[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletPendingDeals?deals='+base_model.get('settings').deals, templateKey : 'portlets-opportunities', sort_collection : false, individual_tag_name : 'tr',
					postRenderCallback : function(p_el){
						displayTimeAgo(p_el);
						addWidgetToGridster(base_model);
					} });
				App_Portlets.pendingDeals[parseInt(pos)].collection.fetch();
				portlet_ele.html(getRandomLoadingImg());
				portlet_ele.html($(App_Portlets.pendingDeals[parseInt(pos)].render().el));
				setPortletContentHeight(base_model);
				break;
			case "Deals Won":
				App_Portlets.dealsWon[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletDealsWon?duration='+base_model.get('settings').duration, templateKey : 'portlets-opportunities', individual_tag_name : 'tr',
					postRenderCallback : function(p_el){
						displayTimeAgo(p_el);
						addWidgetToGridster(base_model);
					} });
				App_Portlets.dealsWon[parseInt(pos)].collection.fetch();
				portlet_ele.html(getRandomLoadingImg());
				portlet_ele.html($(App_Portlets.dealsWon[parseInt(pos)].render().el));
				setPortletContentHeight(base_model);
				break;
			case "Agenda":
				App_Portlets.todayEventsCollection[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletAgenda?duration='+base_model.get('settings').duration+'&start_time='+getStartAndEndDatesOnDue(start_date_str)+'&end_time='+getStartAndEndDatesOnDue(end_date_str), templateKey : 'portlets-events', sort_collection : false, individual_tag_name : 'tr',
					postRenderCallback : function(p_el){
						addWidgetToGridster(base_model);
						loadGoogleEventsForPortlets(p_el,getStartAndEndDatesOnDue(start_date_str),getStartAndEndDatesOnDue(end_date_str));
					} });
				App_Portlets.todayEventsCollection[parseInt(pos)].collection.fetch();
				portlet_ele.find('#normal-events').html(getRandomLoadingImg());
				portlet_ele.find('#normal-events').html($(App_Portlets.todayEventsCollection[parseInt(pos)].render().el));
				setPortletContentHeight(base_model);
				break;
			case "Agenda":
				App_Portlets.todayEventsCollection[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletAgenda?duration='+base_model.get('settings').duration+'&start_time='+getStartAndEndDatesOnDue(start_date_str)+'&end_time='+getStartAndEndDatesOnDue(end_date_str), templateKey : 'portlets-events', sort_collection : false, individual_tag_name : 'tr',
					postRenderCallback : function(p_el){
						addWidgetToGridster(base_model);
						loadGoogleEventsForPortlets(p_el,getStartAndEndDatesOnDue(start_date_str),getStartAndEndDatesOnDue(end_date_str));
					} });
				App_Portlets.todayEventsCollection[parseInt(pos)].collection.fetch();
				portlet_ele.find('#normal-events').html(getRandomLoadingImg());
				portlet_ele.find('#normal-events').html($(App_Portlets.todayEventsCollection[parseInt(pos)].render().el));
				setPortletContentHeight(base_model);
				break;
			case "Today Tasks":
				App_Portlets.tasksCollection[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletTodayTasks?duration='+base_model.get('settings').duration+'&start_time='+getStartAndEndDatesOnDue(start_date_str)+'&end_time='+getStartAndEndDatesOnDue(end_date_str), templateKey : 'portlets-tasks', sort_collection : false, individual_tag_name : 'tr',
					postRenderCallback : function(p_el){
						addWidgetToGridster(base_model);
				} });
				App_Portlets.tasksCollection[parseInt(pos)].collection.fetch();
				portlet_ele.html(getRandomLoadingImg());
				portlet_ele.html($(App_Portlets.tasksCollection[parseInt(pos)].render().el));
				setPortletContentHeight(base_model);
				break;
			case "Leaderboard":
				App_Portlets.leaderboard[parseInt(pos)] = new Base_Model_View({ url : '/core/api/portlets/portletLeaderboard?duration='+base_model.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str)+'&revenue='+base_model.get('settings').category.revenue+'&dealsWon='+base_model.get('settings').category.dealsWon+'&calls='+base_model.get('settings').category.calls+'&tasks='+base_model.get('settings').category.tasks+'&user='+users, template : 'portlets-leader-board-body-model', tagName : 'div',
					portletSizeX : base_model.get('size_x'), portletSizeY : base_model.get('size_y'), postRenderCallback : function(p_el){
						addWidgetToGridster(base_model);
						$('#ui-id-'+column_position+'-'+row_position+' > .portlet_header').find('ul').width(($('#ui-id-'+column_position+'-'+row_position+' > .portlet_body').find('ul').width()/$('#ui-id-'+column_position+'-'+row_position+' > .portlet_body').width()*100)+'%');
				} });
				portlet_ele.html($(App_Portlets.leaderboard[parseInt(pos)].render().el));
				setPortletContentHeight(base_model);
				break;
			case "Account Details":
				App_Portlets.accountInfo[parseInt(pos)] = new Base_Model_View({ url : '/core/api/portlets/portletAccount', template : "portlets-account-body-model", 
					postRenderCallback : function(p_el){
						addWidgetToGridster(base_model);
				} });
				portlet_ele.html(getRandomLoadingImg());
				portlet_ele.html($(App_Portlets.accountInfo[parseInt(pos)].render().el));
				setPortletContentHeight(base_model);
				break;
			case "User Activities":
				App_Portlets.activity[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletCustomerActivity', sortKey : 'time', descending : true,
					templateKey : "portlets-activities-list-log", cursor : true, page_size : 20, individual_tag_name:'div',
					postRenderCallback : function(p_el){
						addWidgetToGridster(base_model);
				
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
						{
							$("time", p_el).timeago();
									
						});
						contact_detail_page_infi_scroll($('.activity_body',App_Portlets.activitiesView[parseInt(pos)].el),App_Portlets.activity[parseInt(pos)])
					}, appendItemCallback : function(p_el)
					{
						includeTimeAgo(p_el);
					}});
				App_Portlets.activity[parseInt(pos)].appendItem = append_activity;
				App_Portlets.activity[parseInt(pos)].collection.fetch();
				portlet_ele.html(getRandomLoadingImg());
				portlet_ele.html($(App_Portlets.activity[parseInt(pos)].render().el));
				setPortletContentHeight(base_model);
				break;
			case "Campaign stats":
				var emailsSentCount;
				var emailsOpenedCount;
				var emailsClickedCount;
				var emailsUnsubscribed;
				var that = portlet_ele;
				var url = '/core/api/portlets/portletCampaignstats?duration='+base_model.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str)+'&time_zone='+(new Date().getTimezoneOffset())+'&campaign_type='+base_model.get('settings').campaign_type; 
				setTimeout(function(){
						if(that.find('#emails-sent-count').text().trim()=="")
							that.find('#emails-sent-count').html("<img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' />");
					},1000);
				portlet_graph_data_utility.fetchPortletsGraphData(url,function(data){
					emailsSentCount=data["emailsent"];
					emailsOpenedCount=data["emailopened"];
					emailsClickedCount=data["emailclicked"];
					emailsUnsubscribed=data["emailunsubscribed"];
					if(emailsSentCount==0){
						that.find('#emails-sent').css('width','100%').css('height','100%');
						that.find('#emails-sent').html('<div class="portlet-error-message">No Email activity</div>');
					}
					else{
						var selector1=that.find('#emails-opened');
						var selector2=that.find('#emails-clicked');
						var selector3=that.find('#emails-unsubscribed');
						selector1.css('display','block');
						selector2.css('display','block');
						selector3.css('display','block');
						that.find('#emails-sent').addClass('pull-left p-xs b-b b-r b-light w-half overflow-hidden');
						selector1.addClass('pull-left p-xs b-b b-light w-half');
						selector2.addClass('pull-left p-xs b-r b-light w-half');
						selector3.addClass('pull-left p-xs w-half');
						
						that.find('#emails-sent-count').text(getNumberWithCommasForPortlets(emailsSentCount));
						that.find('#emails-sent-label').text("Emails sent");
						that.find('#emails-opened').html('<div class="pull-left text-light stats_text"><div class="text-sm text-ellipsis">Opened</div><div class="text-count text-center" style="color:rgb(250, 215, 51);">'+getNumberWithCommasForPortlets(emailsOpenedCount)+'</div></div>');
						that.find('#emails-clicked').html('<div class="pull-left text-light stats_text"><div class="text-sm text-ellipsis">Clicked</div><div class="text-count text-center" style="color:rgb(18, 209, 18);">'+getNumberWithCommasForPortlets(emailsClickedCount)+'</div></div>');
						that.find('#emails-unsubscribed').html('<div class="pull-left text-light stats_text"><div class="text-sm text-ellipsis">Unsubscribed</div><div class="text-count text-center" style="color:rgb(240, 80, 80);">'+getNumberWithCommasForPortlets(emailsUnsubscribed)+'</div>');
					}
					
					addWidgetToGridster(base_model);
				});
				setPortletContentHeight(base_model);
				break;
			case "Deals By Milestone":
				var url='/core/api/portlets/portletDealsByMilestone?deals='+base_model.get('settings').deals+'&track='+base_model.get('settings').track;
				portlet_graph_data_utility.dealsByMilestoneGraphData(base_model, selector, url);
				setPortletContentHeight(base_model);
				break;
			case "Closures Per Person":
				var url='/core/api/portlets/portletClosuresPerPerson?due-date='+base_model.get('settings')["due-date"];
				portlet_graph_data_utility.closuresPerPersonGraphData(base_model, selector, url);
				setPortletContentHeight(base_model);
				break;
			case "Deals Funnel":
				var url='/core/api/portlets/portletDealsFunnel?deals='+base_model.get('settings').deals+'&track='+base_model.get('settings').track;
				portlet_graph_data_utility.dealsFunnelGraphData(base_model, selector, url);
				setPortletContentHeight(base_model);
				break;
			case "Emails Sent":
				var url='/core/api/portlets/portletEmailsSent?duration='+base_model.get('settings').duration;
				portlet_graph_data_utility.emailsSentGrapgData(base_model, selector, url);
				setPortletContentHeight(base_model);
				break;
			case "Growth Graph":
				var url='/core/api/portlets/portletGrowthGraph?tags='+base_model.get('settings').tags+'&frequency='+base_model.get('settings').frequency+'&duration='+base_model.get('settings').duration+'&start-date='+getUTCMidNightEpochFromDate(new Date(getStartAndEndDatesOnDue(base_model.get('settings').duration)*1000))+'&end-date='+getUTCMidNightEpochFromDate(new Date(getStartAndEndDatesOnDue("TOMORROW")*1000));
				portlet_graph_data_utility.growthGraphData(base_model, selector, url);
				setPortletContentHeight(base_model);
				//Saved tags are appended
				var p_settings=base_model.get('settings');
				var p_tags=p_settings.tags;
				var tags=p_tags.split(",");
				var li='';
				$.each(tags,function(index,tagName){
					if(tagName!="")
						li += "<li data='"+tagName+"' class='tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block'>"+tagName+"<a id='remove_tag' class='close m-l-xs'>&times</a></li>";
				});
				$('#'+base_model.get("id")+'-portlet-ul-tags').append(li);
			
				//enable tags properties
				setup_tags_typeahead();
				break;
			case "Deals Assigned":
				var url='/core/api/portlets/portletDealsAssigned?duration='+base_model.get('settings').duration;
				portlet_graph_data_utility.dealsAssignedGraphData(base_model, selector, url);
				setPortletContentHeight(base_model);
				break;
			case "Calls Per Person":
				if(base_model.get('settings')["calls-user-list"]!=undefined){
					users = JSON.stringify(base_model.get('settings')["calls-user-list"]);
				}
				var url='/core/api/portlets/portletCallsPerPerson?duration='+base_model.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str)+'&user='+users;
				portlet_graph_data_utility.callsPerPersonGraphData(base_model, selector, url);
				setPortletContentHeight(base_model);
				break;
			case "Agile CRM Blog":
				portlet_ele.find('div').html(getRandomLoadingImg());
				initBlogPortletSync(portlet_ele);
				setPortletContentHeight(base_model);
				break;
			case "Task Report":
				if(base_model.get('settings')["task-report-user-list"]!=undefined){
					users = JSON.stringify(base_model.get('settings')["task-report-user-list"]);
				}
				var url='/core/api/portlets/portletTaskReport?group-by='+base_model.get('settings')["group-by"]+'&split-by='+base_model.get('settings')["split-by"]+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str)+'&tasks='+base_model.get('settings').tasks+'&user='+users;
				portlet_graph_data_utility.taskReportGraphData(base_model, selector, url);
				setPortletContentHeight(base_model);
				break;
			case "Revenue Graph":
				var pipeline_id = 0;
				if(base_model.get('settings').track!=undefined && base_model.get('settings').track!="anyTrack"){
					pipeline_id = base_model.get('settings').track;
				}
				var url='core/api/opportunity/stats/details/'+pipeline_id+'?min='+getStartAndEndDatesOnDue(start_date_str)+'&max='+(getStartAndEndDatesOnDue(end_date_str)-1)+'';
				portlet_graph_data_utility.revenueGraphData(base_model, selector, url);
				setPortletContentHeight(base_model);
				break;
			case "Stats Report":
				portlet_ele = $('#ui-id-'+column_position+'-'+row_position, el).find('.stats_report_portlet_body');
				var that = portlet_ele;
				var newContactsurl='/core/api/portlets/portletStatsReport?reportType=newContacts&duration='+base_model.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str)+'&time_zone='+(new Date().getTimezoneOffset());
				setTimeout(function(){
					if(that.find('#new-contacts-count').text().trim()=="")
						that.find('#new-contacts-count').html("<img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' />");
				},1000);
				portlet_graph_data_utility.fetchPortletsGraphData(newContactsurl,function(data){
					that.find('#new-contacts-count').text(getNumberWithCommasForPortlets(data["newContactsCount"]));
					that.find('#new-contacts-label').text("New contacts");
				});
				
				var wonDealsurl='/core/api/portlets/portletStatsReport?reportType=wonDeals&duration='+base_model.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str)+'&time_zone='+(new Date().getTimezoneOffset());
				setTimeout(function(){
					if(that.find('#won-deal-value').text().trim()=="")
						that.find('#won-deal-value').html("<img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' />");
				},1000);
				portlet_graph_data_utility.fetchPortletsGraphData(wonDealsurl,function(data){
					that.find('#won-deal-value').text(getPortletsCurrencySymbol()+''+getNumberWithCommasForPortlets(data["wonDealValue"]));
					that.find('#won-deal-count').text("Won from "+getNumberWithCommasForPortlets(data['wonDealsCount'])+" deals");
				});
				
				var newDealsurl='/core/api/portlets/portletStatsReport?reportType=newDeals&duration='+base_model.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str)+'&time_zone='+(new Date().getTimezoneOffset());
				setTimeout(function(){
					if(that.find('#new-deal-value').text().trim()=="")
						that.find('#new-deal-value').html("<img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' />");
				},1000);
				portlet_graph_data_utility.fetchPortletsGraphData(newDealsurl,function(data){
					that.find('#new-deal-value').text(getNumberWithCommasForPortlets(data["newDealsCount"]));
					that.find('#new-deal-count').text("New deals worth "+getPortletsCurrencySymbol()+''+getNumberWithCommasForPortlets(data['newDealValue'])+"");
				});
				
				var campaignEmailsSentsurl='/core/api/portlets/portletStatsReport?reportType=campaignEmailsSent&duration='+base_model.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str)+'&time_zone='+(new Date().getTimezoneOffset());
				setTimeout(function(){
					if(that.find('#emails-sent-count').text().trim()=="")
						that.find('#emails-sent-count').html("<img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' />");
				},1000);
				portlet_graph_data_utility.fetchPortletsGraphData(campaignEmailsSentsurl,function(data){
					that.find('#emails-sent-count').text(getNumberWithCommasForPortlets(data["emailsSentCount"]));
					that.find('#emails-sent-label').text("Campaign emails sent");
				});
				setPortletContentHeight(base_model);
				break;
			case "Mini Calendar":
				head.js(LIB_PATH + 'lib/jquery-ui.min.js', 'lib/fullcalendar.min.js', function()
				{
					$('.portlet_body_calendar', $('#portlet-res')).attr('id', 'p-body-calendar'+column_position+'-'+row_position)
					$('#p-body-calendar'+column_position+'-'+row_position, $('#portlet-res')).each(function(){
						$(this).find('.events_show').html(getRandomLoadingImg());
						setPortletContentHeight(base_model);
						App_Portlets.refetchEvents = false;
						minicalendar($(this));
					});			
				});

		}
	},

	showPortletSettings : function(el){
		var elData;
		var base_model = Portlets_View.collection.get(el.split("-settings")[0]);
		//Hide previous error messages
		$('.help-inline').hide();
		var portlet_name = base_model.get('name');
		var that = this;
		switch(portlet_name) {
			case "Filter Based":
				that.addPortletSettingsModalContent(base_model, "portletsContactsFilterBasedSettingsModal");
				elData = $('#portletsContactsFilterBasedSettingsForm');
				var options ='<option value="">Select...</option>'
					+'<option value="contacts">All Contacts</option>'
					+'<option value="myContacts">My Contacts</option>';
				$.ajax({ type : 'GET', url : '/core/api/filters?type=PERSON', dataType : 'json',
					success: function(data){
						$.each(data,function(index,contactFilter){
							options+="<option value="+contactFilter.id+">"+contactFilter.name+"</option>";
						});
						$('#filter', elData).html(options);
						$("#filter", elData).find('option[value='+ base_model.get("settings").filter +']').attr("selected", "selected");
						$('.loading-img').hide();
					} });
				break;
			case "Emails Opened":
				that.addPortletSettingsModalContent(base_model, "portletsContactsEmailsOpenedSettingsModal");
				elData = $('#portletsContactsEmailsOpenedSettingsModal');
				$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
				break;
			case "Emails Sent":
				that.addPortletSettingsModalContent(base_model, "portletsContactsEmailsSentSettingsModal");
				elData = $('#portletsContactsEmailsSentSettingsModal');
				$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
				break;
			case "Growth Graph":
				$('#portlet-ul-tags > li').remove();
				$('#cancel-modal').attr('disabled',false);
				that.addPortletSettingsModalContent(base_model, "portletsContactsGrowthGraphSettingsModal");
				elData = $('#portletsContactsGrowthGraphSettingsModal');
				//Saved tags are appended
				var tags=base_model.get('settings').tags.split(",");
				var li='';
				$.each(tags,function(index,tagName){
					if(tagName!="")
						li += "<li data='"+tagName+"' class='tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block'>"+tagName+"<a id='remove_tag' class='close m-l-xs'>&times</a></li>";
				});
				$('#portlet-ul-tags').append(li);
				
				//enable tags properties
				setup_tags_typeahead();
				
				$("#frequency", elData).find('option[value='+ base_model.get("settings").frequency +']').attr("selected", "selected");
				$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
				break;
			case "Pending Deals":
				that.addPortletSettingsModalContent(base_model, "portletsPendingDealsSettingsModal");
				elData = $('#portletsPendingDealsSettingsModal');
				$("#deals", elData).find('option[value='+ base_model.get("settings").deals +']').attr("selected", "selected");
				break;
			case "Deals By Milestone":
				that.addPortletSettingsModalContent(base_model, "portletsDealsByMilestoneSettingsModal");
				elData = $('#portletsDealsByMilestoneSettingsModal');
				var that = this;
				var url='/core/api/portlets/portletDealsByMilestone?deals='+base_model.get('settings').deals+'&track='+base_model.get('settings').track;
				if(App_Portlets.track_length!=undefined && App_Portlets.track_length>1)
					$('#portletsDealsByMilestoneTrack',elData).show();
				
				var tracks = [];
				if(App_Portlets.deal_tracks!=undefined && App_Portlets.deal_tracks!=null)
					tracks = App_Portlets.deal_tracks;
				else{
					$.ajax({ type : 'GET', url : '/core/api/milestone/pipelines', dataType : 'json',
						success: function(data){
							App_Portlets.track_length = data.length;
							App_Portlets.deal_tracks = data;
							tracks = App_Portlets.deal_tracks;

							that.addTracks(tracks, base_model, elData);
						} });

					return;
				}
				that.addTracks(tracks, base_model, elData);
				break;
			case "Closures Per Person":
				that.addPortletSettingsModalContent(base_model, "portletsDealsClosuresPerPersonSettingsModal");
				elData = $('#portletsDealsClosuresPerPersonSettingsModal');
				$("#group-by", elData).find('option[value='+ base_model.get("settings")["group-by"] +']').attr("selected", "selected");
				$("#due-date", elData).val(getDateInFormatFromEpoc(base_model.get("settings")["due-date"]));
				break;
			case "Deals Won":
				that.addPortletSettingsModalContent(base_model, "portletsDealsWonSettingsModal");
				elData = $('#portletsDealsWonSettingsModal');
				$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
				break;
			case "Deals Funnel":
				that.addPortletSettingsModalContent(base_model, "portletsDealsFunnelSettingsModal");
				elData = $('#portletsDealsFunnelSettingsModal');
				var that = this;
				var url='/core/api/portlets/portletDealsFunnel?deals='+base_model.get('settings').deals+'&track='+base_model.get('settings').track;
				if(App_Portlets.track_length!=undefined && App_Portlets.track_length>1)
					$('#portletsDealsFunnelTrack',elData).show();
				
				var tracks = [];
				if(App_Portlets.deal_tracks!=undefined && App_Portlets.deal_tracks!=null)
					tracks = App_Portlets.deal_tracks;
				else{
					$.ajax({ type : 'GET', url : '/core/api/milestone/pipelines', dataType : 'json',
						success: function(data){
							App_Portlets.track_length = data.length;
							App_Portlets.deal_tracks = data;
							tracks = App_Portlets.deal_tracks;

							that.addTracks(tracks, base_model, elData);
							
						} });

					 return;
				}
				that.addTracks(tracks, base_model, elData);
				break;
			case "Deals Assigned":
				that.addPortletSettingsModalContent(base_model, "portletsDealsAssignedSettingsModal");
				elData = $('#portletsDealsAssignedSettingsModal');
				$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
				break;
			case "Calls Per Person":
				that.addPortletSettingsModalContent(base_model, "portletsCallsPerPersonSettingsModal");
				elData = $('#portletsCallsPerPersonSettingsModal');
				$("#group-by", elData).find('option[value='+ base_model.get("settings")["group-by"] +']').attr("selected", "selected");
				$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
				
				if(base_model.get("settings")["calls-user-list"]!=undefined){
					var options ='';
					$.ajax({ type : 'GET', url : '/core/api/users', dataType : 'json',
						success: function(data){
							$.each(data,function(index,domainUser){
								if(!domainUser.is_disabled)
									options+="<option value="+domainUser.id+">"+domainUser.name+"</option>";
							});
							$('#calls-user-list', elData).html(options);
							$.each(base_model.get("settings")["calls-user-list"], function(){
								$("#calls-user-list", elData).find('option[value='+ this +']').attr("selected", "selected");
							});
							$('.loading-img').hide();
						} });
				}else{
					var options ='';
					$.ajax({ type : 'GET', url : '/core/api/users', dataType : 'json',
						success: function(data){
							$.each(data,function(index,domainUser){
								if(!domainUser.is_disabled)
									options+="<option value="+domainUser.id+" selected='selected'>"+domainUser.name+"</option>";
							});
							$('#calls-user-list', elData).html(options);
							$('.loading-img').hide();
						} });
				}
				$('#ms-calls-user-list', elData).remove();
				head.js(LIB_PATH + 'lib/jquery.multi-select.js', function(){
					$('#calls-user-list',elData).multiSelect();
					$('#ms-calls-user-list .ms-selection', elData).children('ul').addClass('multiSelect').attr("name", "calls-user-list").attr("id", "calls-user");
					$('#ms-calls-user-list .ms-selectable .ms-list', elData).css("height","130px");
					$('#ms-calls-user-list .ms-selection .ms-list', elData).css("height","130px");
					$('#ms-calls-user-list', elData).addClass('portlet-user-ms-container');					
				});
				break;
			case "Task Report":
				that.addPortletSettingsModalContent(base_model, "portletsTaskReportSettingsModal");
				elData = $('#portletsTaskReportSettingsModal');
				$("#group-by-task-report", elData).find('option[value='+ base_model.get("settings")["group-by"] +']').attr("selected", "selected");
				if(base_model.get("settings").tasks!=undefined)
					$("#tasks-task-report", elData).find('option[value='+ base_model.get("settings").tasks +']').attr("selected", "selected");
				$("#split-by-task-report", elData).find('option[value='+ base_model.get("settings")["split-by"] +']').attr("selected", "selected");
				$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
				$('#'+base_model.get("settings")["group-by"]+'', elData).hide();
				if(base_model.get("settings")["group-by"]=="status")
					$('#tasks-control-group').hide();
				if(base_model.get("settings").tasks=="completed-tasks")
					$('#split-by-task-report > option#status').hide();

				if(base_model.get("settings")["task-report-user-list"]!=undefined){
					var options ='';
					$.ajax({ type : 'GET', url : '/core/api/users', dataType : 'json',
						success: function(data){
							$.each(data,function(index,domainUser){
								if(!domainUser.is_disabled)
									options+="<option value="+domainUser.id+">"+domainUser.name+"</option>";
							});
							$('#task-report-user-list', elData).html(options);
							$.each(base_model.get("settings")["task-report-user-list"], function(){
								$("#task-report-user-list", elData).find('option[value='+ this +']').attr("selected", "selected");
							});
							$('.loading-img').hide();
						} });
				}else{
					var options ='';
					$.ajax({ type : 'GET', url : '/core/api/users', dataType : 'json',
						success: function(data){
							$.each(data,function(index,domainUser){
								if(!domainUser.is_disabled)
									options+="<option value="+domainUser.id+" selected='selected'>"+domainUser.name+"</option>";
							});
							$('#task-report-user-list', elData).html(options);
							$('.loading-img').hide();
						} });
				}
				$('#ms-task-report-user-list', elData).remove();
				head.js(LIB_PATH + 'lib/jquery.multi-select.js', function(){
					$('#task-report-user-list',elData).multiSelect();
					$('#ms-task-report-user-list .ms-selection', elData).children('ul').addClass('multiSelect').attr("name", "task-report-user-list").attr("id", "task-report-user");
					$('#ms-task-report-user-list .ms-selectable .ms-list', elData).css("height","130px");
					$('#ms-task-report-user-list .ms-selection .ms-list', elData).css("height","130px");
					$('#ms-task-report-user-list', elData).addClass('portlet-user-ms-container');					
				});
				break;
			case "Stats Report":
				that.addPortletSettingsModalContent(base_model, "portletsStatsReportSettingsModal");
				elData = $('#portletsStatsReportSettingsModal');
				$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
				break;
			case "Agenda":
				that.addPortletSettingsModalContent(base_model, "portletsAgendaSettingsModal");
				elData = $('#portletsAgendaSettingsModal');
				$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
				break;
			case "Today Tasks":
				that.addPortletSettingsModalContent(base_model, "portletsTodayTasksSettingsModal");
				elData = $('#portletsTodayTasksSettingsModal');
				$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
				break;
			case "Leaderboard":
				that.addPortletSettingsModalContent(base_model, "portletsLeaderboardSettingsModal");
				elData = $('#portletsLeaderboardSettingsModal');
				$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
				if(base_model.get("settings").category!=undefined && base_model.get("settings").category.revenue)
					$("#category-list", elData).find('option[value=revenue]').attr("selected", "selected");
				if(base_model.get("settings").category!=undefined && base_model.get("settings").category.dealsWon)
					$("#category-list", elData).find('option[value=dealsWon]').attr("selected", "selected");
				if(base_model.get("settings").category!=undefined && base_model.get("settings").category.calls)
					$("#category-list", elData).find('option[value=calls]').attr("selected", "selected");
				if(base_model.get("settings").category!=undefined && base_model.get("settings").category.tasks)
					$("#category-list", elData).find('option[value=tasks]').attr("selected", "selected");

				if(base_model.get("settings").user!=undefined){
					var options ='';
					$.ajax({ type : 'GET', url : '/core/api/portlets/portletUsers', dataType : 'json',
						success: function(data){
							$.each(data,function(index,domainUser){
								if(!domainUser.is_disabled)
									options+="<option value="+domainUser.id+">"+domainUser.name+"</option>";
							});
							$('#user-list', elData).html(options);
							$.each(base_model.get("settings").user, function(){
								$("#user-list", elData).find('option[value='+ this +']').attr("selected", "selected");
							});
							$('.loading-img').hide();
						} });
				}else{
					var options ='';
					$.ajax({ type : 'GET', url : '/core/api/portlets/portletUsers', dataType : 'json',
						success: function(data){
							$.each(data,function(index,domainUser){
								if(!domainUser.is_disabled)
									options+="<option value="+domainUser.id+" selected='selected'>"+domainUser.name+"</option>";
							});
							$('#user-list', elData).html(options);
							$('.loading-img').hide();
						} });
				}
				$('#ms-category-list', elData).remove();
				$('#ms-user-list', elData).remove();
				head.js(LIB_PATH + 'lib/jquery.multi-select.js', function(){
					$('#category-list, #user-list',elData).multiSelect();
					$('#ms-category-list .ms-selection', elData).children('ul').addClass('multiSelect').attr("name", "category-list").attr("id", "category");
					$('#ms-user-list .ms-selection', elData).children('ul').addClass('multiSelect').attr("name", "user-list").attr("id", "user");
					$('#ms-user-list .ms-selectable .ms-list', elData).css("height","130px");
					$('#ms-user-list .ms-selection .ms-list', elData).css("height","130px");
					$('#ms-category-list .ms-selectable .ms-list', elData).css("height","105px");
					$('#ms-category-list .ms-selection .ms-list', elData).css("height","105px");
					$('#ms-user-list', elData).addClass('portlet-user-ms-container');
					$('#ms-category-list', elData).addClass('portlet-category-ms-container');					
				});
				break;
			case "Revenue Graph":
				that.addPortletSettingsModalContent(base_model, "portletsDealsRevenueGraphSettingsModal");
				elData = $('#portletsDealsRevenueGraphSettingsModal');
				var options = '';
				if(base_model.get('settings').track=="anyTrack"){
					options += '<option value="anyTrack" selected="selected">Any</option>';
				}else{
					options += '<option value="anyTrack">Any</option>';
				}
				$.ajax({ type : 'GET', url : '/core/api/milestone/pipelines', dataType : 'json',
						success: function(data){
							$.each(data,function(index,trackObj){
								if(base_model.get('settings').track==trackObj.id)
									options+="<option value="+trackObj.id+" selected='selected'>"+trackObj.name+"</option>";
								else
									options+="<option value="+trackObj.id+">"+trackObj.name+"</option>";
							});
						} });
				$('#track', elData).html(options);
				$('.loading-img').hide();
				$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
				break;
			case "Campaign stats":
				that.addPortletSettingsModalContent(base_model, "portletsCampaignStatsSettingsModal");
				elData = $('#portletsCampaignStatsSettingsModal');
				$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
				var options="<option value='All'>All Campaigns</option>" ;
				$.ajax({ type : 'GET', url : '/core/api/workflows', async : false, dataType : 'json',
					success: function(data){
						$.each(data,function(index,campaignfilter){
							options+="<option value="+campaignfilter.id+">"+campaignfilter.name+"</option>";
						});
						$('#campaign_type', elData).html(options);
						$("#campaign_type", elData).find('option[value='+ base_model.get("settings").campaign_type +']').attr("selected", "selected");
						$('.loading-img').hide();
					}
				});
				break;
		}
		if(base_model.get('name')=="Pending Deals" || base_model.get('name')=="Deals By Milestone" || base_model.get('name')=="Closures Per Person" || base_model.get('name')=="Deals Funnel"){
			$('#due-date', elData).datepicker({
				format : CURRENT_USER_PREFS.dateFormat
			});
		}	
	},

	addPortletSettingsModalContent: function(base_model, modal_id){
		$('#'+modal_id).modal('show');
		$('#'+modal_id+' > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#'+modal_id)).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#'+modal_id)).val(base_model.get('name'));
	},

};