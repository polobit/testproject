
var itemCollection;
var itemCollection1;
var tasksCollection;
function organize_portlets(base_model){
	var itemView = new Base_List_View({ model : base_model, template : this.options.templateKey + "-model", tagName : 'div', });

	// Get portlet type from model (portlet object)
	var portlet_type = base_model.get('portlet_type');
	var is_added = base_model.get('is_added');
	var portlet_name = base_model.get('name');

	/*
	 * Appends the model (portlet) to its specific div, based on the portlet_type
	 * as div id (div defined in portlet-add.html)
	 */
	if (portlet_type == "CONTACTS")
		$('#contacts', this.el).append($(itemView.render().el));
	else if (portlet_type == "DEALS")
		$('#deals', this.el).append($(itemView.render().el));
	else if (portlet_type == "TASKSANDEVENTS")
		$('#taksAndEvents', this.el).append($(itemView.render().el));
	else if (portlet_type == "USERACTIVITY" && portlet_name!="Stats Report")
		$('#userActivity', this.el).append($(itemView.render().el));
	else if (portlet_type == "RSS")
		$('#rssFeed', this.el).append($(itemView.render().el));
}
function set_p_portlets(base_model){
	var itemView;
	if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Filter Based"){
		App_Portlets.filteredContactsView = new Base_Model_View({ model : base_model, template : "portlets-contacts-filterbased-model", tagName : 'div' });
		
		if($('.gridster > div:visible > div',this.el).length==0)
			$('.gridster > div:visible',this.el).html($(App_Portlets.filteredContactsView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		else
			$('.gridster > div:visible > div:last',this.el).after($(App_Portlets.filteredContactsView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		
	}else if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Emails Opened"){
		App_Portlets.emailsOpenedView = new Base_Model_View({ model : base_model, template : "portlets-contacts-emails-opened-model", tagName : 'div' });
		
		if($('.gridster > div:visible > div',this.el).length==0)
			$('.gridster > div:visible',this.el).html($(App_Portlets.emailsOpenedView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		else
			$('.gridster > div:visible > div:last',this.el).after($(App_Portlets.emailsOpenedView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		
	}else if(base_model.get('portlet_type')=="USERACTIVITY" && base_model.get('name')=="Emails Sent"){
		App_Portlets.emailsSentView = new Base_Model_View({ model : base_model, template : "portlets-contacts-emails-sent-model", tagName : 'div' });
		if($('.gridster > div:visible > div',this.el).length==0)
			$('.gridster > div:visible',this.el).html($(App_Portlets.emailsSentView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		else
			$('.gridster > div:visible > div:last',this.el).after($(App_Portlets.emailsSentView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	}else if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Growth Graph"){
		App_Portlets.growthGraphView = new Base_Model_View({ model : base_model, template : "portlets-contacts-growth-graph-model", tagName : 'div' });
		if($('.gridster > div:visible > div',this.el).length==0)
			$('.gridster > div:visible',this.el).html($(App_Portlets.growthGraphView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		else
			$('.gridster > div:visible > div:last',this.el).after($(App_Portlets.growthGraphView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Pending Deals"){
		App_Portlets.pendingDealsView = new Base_Model_View({ model : base_model, template : "portlets-deals-pending-deals-model", tagName : 'div' });
		if($('.gridster > div:visible > div',this.el).length==0)
			$('.gridster > div:visible',this.el).html($(App_Portlets.pendingDealsView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		else
			$('.gridster > div:visible > div:last',this.el).after($(App_Portlets.pendingDealsView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals By Milestone"){
		App_Portlets.dealsByMilestoneView = new Base_Model_View({ model : base_model, template : "portlets-deals-deals-by-milestone-model", tagName : 'div' });
		if($('.gridster > div:visible > div',this.el).length==0)
			$('.gridster > div:visible',this.el).html($(App_Portlets.dealsByMilestoneView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		else
			$('.gridster > div:visible > div:last',this.el).after($(App_Portlets.dealsByMilestoneView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Closures Per Person"){
		App_Portlets.closuresPerPersonView = new Base_Model_View({ model : base_model, template : "portlets-deals-closures-per-person-model", tagName : 'div' });
		if($('.gridster > div:visible > div',this.el).length==0)
			$('.gridster > div:visible',this.el).html($(App_Portlets.emailsOpenedView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		else
			$('.gridster > div:visible > div:last',this.el).after($(App_Portlets.emailsOpenedView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals Won"){
		App_Portlets.dealsWonView = new Base_Model_View({ model : base_model, template : "portlets-deals-deals-won-model", tagName : 'div' });
		if($('.gridster > div:visible > div',this.el).length==0)
			$('.gridster > div:visible',this.el).html($(App_Portlets.dealsWonView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		else
			$('.gridster > div:visible > div:last',this.el).after($(App_Portlets.dealsWonView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals Funnel"){
		App_Portlets.dealsFunnelView = new Base_Model_View({ model : base_model, template : "portlets-deals-deals-funnel-model", tagName : 'div' });
		if($('.gridster > div:visible > div',this.el).length==0)
			$('.gridster > div:visible',this.el).html($(App_Portlets.dealsFunnelView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		else
			$('.gridster > div:visible > div:last',this.el).after($(App_Portlets.dealsFunnelView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals Assigned"){
		App_Portlets.dealsAssignedView = new Base_Model_View({ model : base_model, template : "portlets-deals-deals-assigned-model", tagName : 'div' });
		if($('.gridster > div:visible > div',this.el).length==0)
			$('.gridster > div:visible',this.el).html($(App_Portlets.dealsAssignedView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		else
			$('.gridster > div:visible > div:last',this.el).after($(App_Portlets.dealsAssignedView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	}else if(base_model.get('portlet_type')=="TASKSANDEVENTS" && base_model.get('name')=="Agenda"){
		App_Portlets.agendaView = new Base_Model_View({ model : base_model, template : "portlets-tasksandevents-agenda-model", tagName : 'div' });
		if($('.gridster > div:visible > div',this.el).length==0)
			$('.gridster > div:visible',this.el).html($(App_Portlets.agendaView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		else
			$('.gridster > div:visible > div:last',this.el).after($(App_Portlets.agendaView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	}else if(base_model.get('portlet_type')=="TASKSANDEVENTS" && base_model.get('name')=="Today Tasks"){
		App_Portlets.todayTasksView = new Base_Model_View({ model : base_model, template : "portlets-tasksandevents-today-tasks-model", tagName : 'div' });
		if($('.gridster > div:visible > div',this.el).length==0)
			$('.gridster > div:visible',this.el).html($(App_Portlets.todayTasksView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		else
			$('.gridster > div:visible > div:last',this.el).after($(App_Portlets.todayTasksView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	}else if(base_model.get('portlet_type')=="USERACTIVITY" && base_model.get('name')=="Calls Per Person"){
		App_Portlets.callsPerPersonView = new Base_Model_View({ model : base_model, template : "portlets-contacts-calls-per-person-model", tagName : 'div' });
		if($('.gridster > div:visible > div',this.el).length==0)
			$('.gridster > div:visible',this.el).html($(App_Portlets.callsPerPersonView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		else
			$('.gridster > div:visible > div:last',this.el).after($(App_Portlets.callsPerPersonView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	}else if(base_model.get('portlet_type')=="RSS" && base_model.get('name')=="Agile CRM Blog"){
		App_Portlets.agileCRMBlogView = new Base_Model_View({ model : base_model, template : "portlets-useractivity-blog-model", tagName : 'div' });
		if($('.gridster > div:visible > div',this.el).length==0)
			$('.gridster > div:visible',this.el).html($(App_Portlets.agileCRMBlogView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		else
			$('.gridster > div:visible > div:last',this.el).after($(App_Portlets.agileCRMBlogView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	}else if(base_model.get('portlet_type')=="TASKSANDEVENTS" && base_model.get('name')=="Task Report"){
		App_Portlets.taskReportView = new Base_Model_View({ model : base_model, template : "portlets-tasksandevents-task-report-model", tagName : 'div' });
		if($('.gridster > div:visible > div',this.el).length==0)
			$('.gridster > div:visible',this.el).html($(App_Portlets.taskReportView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
		else
			$('.gridster > div:visible > div:last',this.el).after($(App_Portlets.taskReportView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	}
	//var itemView = new Base_Model_View({ model : base_model, template : "portlets-model", tagName : 'div', });

	// Get portlet type from model (portlet object)
	var column_position = base_model.get('column_position');
	var row_position = base_model.get('row_position');
	var portlet_settings=base_model.get('settings');
	var pos = ''+column_position+''+row_position;
	/*if(column_position==1){
		if($('#col-0').children().length==0){
			$('#col-0',this.el).html(getRandomLoadingImg());
			$('#col-0',this.el).html($(itemView.render().el).attr('id','ui-id-'+column_position+'-'+row_position).addClass('portlet_container').css("z-index","0").css("opacity","1"));
		}else{
			$('#col-0',this.el).children(':last').after($(itemView.render().el).attr('id','ui-id-'+column_position+'-'+row_position).addClass('portlet_container').css("z-index","0").css("opacity","1"));
		}
	}else if(column_position==2){
		if($('#col-1').children().length==0){
			$('#col-1',this.el).html(getRandomLoadingImg());
			$('#col-1',this.el).html($(itemView.render().el).attr('id','ui-id-'+column_position+'-'+row_position).addClass('portlet_container').css("z-index","0").css("opacity","1"));
		}else{
			$('#col-1',this.el).children(':last').after($(itemView.render().el).attr('id','ui-id-'+column_position+'-'+row_position).addClass('portlet_container').css("z-index","0").css("opacity","1"));
		}
	}else if(column_position==3){
		if($('#col-2').children().length==0){
			$('#col-2',this.el).html(getRandomLoadingImg());
			$('#col-2',this.el).html($(itemView.render().el).attr('id','ui-id-'+column_position+'-'+row_position).addClass('portlet_container').css("z-index","0").css("opacity","1"));
		}else{
			$('#col-2',this.el).children(':last').after($(itemView.render().el).attr('id','ui-id-'+column_position+'-'+row_position).addClass('portlet_container').css("z-index","0").css("opacity","1"));
		}
	}*/
	/*if($('.gridster > div:visible > div',this.el).length==0)
		$('.gridster > div:visible',this.el).html($(itemView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	else
		$('.gridster > div:visible > div:last',this.el).after($(itemView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	*/
	if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Filter Based"){
		if(base_model.get('settings').filter=="companies")
			App_Portlets.filteredCompanies[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletContacts?filter='+base_model.get('settings').filter+'&sortKey=-created_time', templateKey : "portlets-companies", sort_collection : false, individual_tag_name : 'tr', sortKey : "-created_time" });
		else
			App_Portlets.filteredContacts[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletContacts?filter='+base_model.get('settings').filter+'&sortKey=-created_time', templateKey : "portlets-contacts", sort_collection : false, individual_tag_name : 'tr', sortKey : "-created_time",
				postRenderCallback : function(p_el){
					addWidgetToGridster(base_model);
				} });
	}else if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Emails Opened"){
		var start_date_str = '';
		var end_date_str = '';
		if(base_model.get('settings').duration=='yesterday'){
			start_date_str = ''+base_model.get('settings').duration;
			end_date_str = 'today';
		}else{
			start_date_str = ''+base_model.get('settings').duration;
			end_date_str = 'TOMORROW';
		}
		
		App_Portlets.emailsOpened[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletEmailsOpened?duration='+base_model.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str), templateKey : 'portlets-contacts-email-opens', sort_collection : false, individual_tag_name : 'tr',
			postRenderCallback : function(p_el){
				displayTimeAgo(p_el);
				addWidgetToGridster(base_model);
			} });
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Pending Deals"){
		App_Portlets.pendingDeals[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletPendingDeals?deals='+base_model.get('settings').deals, templateKey : 'portlets-opportunities', individual_tag_name : 'tr',
			postRenderCallback : function(p_el){
				displayTimeAgo(p_el);
				addWidgetToGridster(base_model);
			} });
		App_Portlets.pendingDeals[parseInt(pos)].collection.fetch();
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals Won"){
		App_Portlets.dealsWon[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletDealsWon?duration='+base_model.get('settings').duration, templateKey : 'portlets-opportunities', individual_tag_name : 'tr',
			postRenderCallback : function(p_el){
				displayTimeAgo(p_el);
				addWidgetToGridster(base_model);
			} });
		App_Portlets.dealsWon[parseInt(pos)].collection.fetch();
	}else if(base_model.get('portlet_type')=="TASKSANDEVENTS" && base_model.get('name')=="Agenda"){
		App_Portlets.todayEventsCollection[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletAgenda?start_time='+getNewDueDate("TODAY")+'&end_time='+getNewDueDate("TOMORROW"), templateKey : 'portlets-events', individual_tag_name : 'tr',
			postRenderCallback : function(p_el){
				addWidgetToGridster(base_model);
			} });
		App_Portlets.todayEventsCollection[parseInt(pos)].collection.fetch();
	}else if(base_model.get('portlet_type')=="TASKSANDEVENTS" && base_model.get('name')=="Today Tasks"){
		App_Portlets.tasksCollection[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletTodayTasks?start_time='+getNewDueDate("TODAY")+'&end_time='+getNewDueDate("TOMORROW"), templateKey : 'portlets-tasks', individual_tag_name : 'tr',
			postRenderCallback : function(p_el){
				addWidgetToGridster(base_model);
			} });
		App_Portlets.tasksCollection[parseInt(pos)].collection.fetch();
	}
	if(itemCollection!=undefined)
		itemCollection.collection.fetch();
	$('.portlet_body',this.el).each(function(){
		if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')!="Deals By Milestone" 
			&& base_model.get('name')!="Closures Per Person" && base_model.get('name')!="Deals Funnel" && base_model.get('name')!="Emails Sent"
				&& base_model.get('name')!="Growth Graph" && base_model.get('name')!="Today Tasks" && base_model.get('name')!="Deals Assigned"
					&& base_model.get('name')!="Calls Per Person" && base_model.get('name')!="Agile CRM Blog" && base_model.get('name')!="Agenda" 
						&& base_model.get('name')!="Pending Deals" && base_model.get('name')!="Deals Won" && base_model.get('name')!="Filter Based" 
							&& base_model.get('name')!="Emails Opened" && base_model.get('name')!="Task Report"){
			$(this).html(getRandomLoadingImg());
			$(this).html($(itemCollection.render().el));
			setPortletContentHeight(base_model);
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Filter Based"){
			if(base_model.get('settings').filter=="companies"){
				App_Portlets.filteredCompanies[parseInt(pos)].collection.fetch();
				$(this).html(getRandomLoadingImg());
				$(this).html($(App_Portlets.filteredCompanies[parseInt(pos)].render().el));
			}else{
				App_Portlets.filteredContacts[parseInt(pos)].collection.fetch();
				$(this).html(getRandomLoadingImg());
				$(this).html($(App_Portlets.filteredContacts[parseInt(pos)].render().el));
			}
			setPortletContentHeight(base_model);
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Emails Opened"){
			App_Portlets.emailsOpened[parseInt(pos)].collection.fetch();
			$(this).html(getRandomLoadingImg());
			$(this).html($(App_Portlets.emailsOpened[parseInt(pos)].render().el));
			setPortletContentHeight(base_model);
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Pending Deals"){
			$(this).html(getRandomLoadingImg());
			$(this).html($(App_Portlets.pendingDeals[parseInt(pos)].render().el));
			setPortletContentHeight(base_model);
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Deals Won"){
			$(this).html(getRandomLoadingImg());
			$(this).html($(App_Portlets.dealsWon[parseInt(pos)].render().el));
			setPortletContentHeight(base_model);
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Agenda"){
			$(this).html(getRandomLoadingImg());
			$(this).html($(App_Portlets.todayEventsCollection[parseInt(pos)].render().el));
			setPortletContentHeight(base_model);
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Today Tasks"){
			$(this).html(getRandomLoadingImg());
			$(this).html($(App_Portlets.tasksCollection[parseInt(pos)].render().el));
			setPortletContentHeight(base_model);
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Deals By Milestone"){
			$(this).attr('id','p-body-'+column_position+'-'+row_position);

			var selector=$(this).attr('id');
			var url='/core/api/portlets/portletDealsByMilestone?deals='+base_model.get('settings').deals+'&track='+base_model.get('settings').track;
			var milestonesList=[];
			var milestoneValuesList=[];
			var milestoneNumbersList=[];
			
			var milestoneMap=[];
			$('#'+selector).html(getRandomLoadingImg());
			fetchPortletsGraphData(url,function(data){
				if(data.status==403){
					$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
					return;
				}
				milestonesList=data["milestonesList"];
				milestoneValuesList=data["milestoneValuesList"];
				milestoneNumbersList=data["milestoneNumbersList"];
				milestoneMap=data["milestoneMap"];
				dealsByMilestoneBarGraph(selector,milestonesList,milestoneValuesList,milestoneNumbersList);
				
				addWidgetToGridster(base_model);
				
				//Added track options
				/*var options='';
				$.each(milestoneMap,function(milestoneId,milestoneName){
					if(base_model.get('settings').track==0 && milestoneName=="Default")
						options+="<option value="+milestoneId+" selected='selected'>"+milestoneName+"</option>";
					else if(base_model.get('settings').track==milestoneId)
						options+="<option value="+milestoneId+" selected='selected'>"+milestoneName+"</option>";
					else
						options+="<option value="+milestoneId+">"+milestoneName+"</option>";
				});
				$('#'+base_model.get("id")+'-track-options').append(options);*/
			});
			
			
			if(base_model.get('is_minimized'))
				$(this).hide();
			
			setPortletContentHeight(base_model);
			
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Closures Per Person"){
			$(this).attr('id','p-body-'+column_position+'-'+row_position);
			
			var selector=$(this).attr('id');
			var url='/core/api/portlets/portletClosuresPerPerson?due-date='+base_model.get('settings')["due-date"];
			
			var milestoneNumbersList=[];
			var milestoneValuesList=[];
			var domainUsersList=[];
			$('#'+selector).html(getRandomLoadingImg());
			fetchPortletsGraphData(url,function(data){
				if(data.status==403){
					$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
					return;
				}
				milestoneNumbersList=data["milestoneNumbersList"];
				milestoneValuesList=data["milestoneValuesList"];
				domainUsersList=data["domainUsersList"];
				
				var catges=[];
				
				$.each(domainUsersList,function(index,domainUser){
					catges.push(domainUser);
				});
				
				var data2=[];
				var text='';
				var name='';
				
				if(base_model.get('settings')["group-by"]=="number-of-deals"){
					$.each(milestoneNumbersList,function(index,mNumber){
						data2.push(mNumber);
					});
					text="No. of Deals Won";
					name="Deals Won";
				}else{
					$.each(milestoneValuesList,function(index,mValue){
						data2.push(mValue);
					});
					text="Deals Won Value";
					name="Won Deal Value";
				}
				
				closuresPerPersonBarGraph(selector,catges,data2,text,name);
				
				addWidgetToGridster(base_model);
			});
			
			if(base_model.get('is_minimized'))
				$(this).hide();
			
			setPortletContentHeight(base_model);
			
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Deals Funnel"){
			$(this).attr('id','p-body-'+column_position+'-'+row_position);
			
			var selector=$(this).attr('id');
			var url='/core/api/portlets/portletDealsFunnel?deals='+base_model.get('settings').deals+'&track='+base_model.get('settings').track;
			
			var milestonesList=[];
			var milestoneValuesList=[];
			var milestoneMap=[];
			$('#'+selector).html(getRandomLoadingImg());
			fetchPortletsGraphData(url,function(data){
				if(data.status==403){
					$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
					return;
				}
				milestonesList=data["milestonesList"];
				milestoneValuesList=data["milestoneValuesList"];
				milestoneMap=data["milestoneMap"];
				
				var funnel_data=[];
				var temp;
				
				$.each(milestonesList,function(index,milestone){
					var each_data=[];
					if(milestone!='Lost'){
						if(milestone!='Won')
							each_data.push(milestone,milestoneValuesList[index]);
						else
							temp=index;
						if(each_data!="")
							funnel_data.push(each_data);
					}
				});
				
				var temp_data=[];
				if(temp!=undefined){
					temp_data.push(milestonesList[temp],milestoneValuesList[temp]);
					funnel_data.push(temp_data);
				}
				var falg=false;
				$.each(funnel_data,function(index,json1){
					if(json1[1]>0)
						falg = true;
				});
				if(falg)
					funnel_data = funnel_data;
				else
					funnel_data = [];
				dealsFunnelGraph(selector,funnel_data);
				
				addWidgetToGridster(base_model);
				
				//Added track options
				/*var options='';
				$.each(milestoneMap,function(milestoneId,milestoneName){
					if(base_model.get('settings').track==0 && milestoneName=="Default")
						options+="<option value="+milestoneId+" selected='selected'>"+milestoneName+"</option>";
					else if(base_model.get('settings').track==milestoneId)
						options+="<option value="+milestoneId+" selected='selected'>"+milestoneName+"</option>";
					else
						options+="<option value="+milestoneId+">"+milestoneName+"</option>";
				});
				$('#'+base_model.get("id")+'-track-options').append(options);*/
			});
			
			if(base_model.get('is_minimized'))
				$(this).hide();
			
			setPortletContentHeight(base_model);
			
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Emails Sent"){
			$(this).attr('id','p-body-'+column_position+'-'+row_position);
			
			var selector=$(this).attr('id');
			var url='/core/api/portlets/portletEmailsSent?duration='+base_model.get('settings').duration;
			
			var domainUsersList=[];
			var mailsCountList=[];
			var mailsOpenedCountList=[];
			$('#'+selector).html(getRandomLoadingImg());
			fetchPortletsGraphData(url,function(data){
				if(data.status==403){
					$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
					return;
				}
				domainUsersList=data["domainUsersList"];
				mailsCountList=data["mailsCountList"];
				mailsOpenedCountList=data["mailsOpenedCountList"];
				
				/*var catges=[];
				$.each(domainUsersList,function(index,domainUser){
					catges.push(domainUser);
				});
				
				emailsSentBarGraph(selector,catges,mailsCountList);*/
				
				var series=[];
				var text='';
				var colors;
				
				var tempData={};
				tempData.name="Emails Not Opened";
				tempData.data=mailsCountList;
				series[0]=tempData;
				tempData={};
				tempData.name="Emails Opened";
				tempData.data=mailsOpenedCountList;
				series[1]=tempData;
				text="No. of Emails";
				colors=['gray','green'];
				
				emailsSentBarGraph(selector,domainUsersList,series,mailsCountList,mailsOpenedCountList,text,colors);
				
				addWidgetToGridster(base_model);
			});
			
			if(base_model.get('is_minimized'))
				$(this).hide();
			
			setPortletContentHeight(base_model);
			
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Growth Graph"){
			$(this).attr('id','p-body-'+column_position+'-'+row_position);
			
			var selector=$(this).attr('id');
			var url='/core/api/portlets/portletGrowthGraph?tags='+base_model.get('settings').tags+'&frequency='+base_model.get('settings').frequency+'&duration='+base_model.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(base_model.get('settings').duration)+'&end-date='+getStartAndEndDatesOnDue("TOMORROW");
			$('#'+selector).html(getRandomLoadingImg());
			fetchPortletsGraphData(url,function(data){
				if(data.status==406){
					// Show cause of error in saving
					$save_info = $('<div class="portlet-error-message" style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'
							+ data.responseText
							+ '</i></p></small></div>');
					
					$('#'+selector).html($save_info).show();
					
					return;
				}
				var sortedKeys = [];
				$.each(data,function(k,v){
					sortedKeys.push(k);
				});
				sortedKeys.sort();
				var sortedData = {};
				$.each(sortedKeys,function(index,value){
					sortedData[''+value] = data[''+value];
				});
				var series;
				// Iterates through data and adds keys into
				// categories
				$.each(sortedData, function(k, v){
					// Initializes series with names with the first
					// data point
					if (series == undefined){
						var index = 0;
						series = [];
						$.each(v, function(k1, v1){
							var series_data = {};
							series_data.name = k1;
							series_data.data = [];
							series[index++] = series_data;
						});
					}
					// Fill Data Values with series data
					$.each(v, function(k1, v1){
						// Find series with the name k1 and to that,
						// push v1
						var series_data = find_series_with_name(series, k1);
						series_data.data.push([
								k * 1000, v1
						]);
					});

				});
				
				portletGrowthGraph(selector,series,base_model);
				
				addWidgetToGridster(base_model);
			});
			
			if(base_model.get('is_minimized'))
				$(this).hide();
			
			setPortletContentHeight(base_model);
			
			//Saved tags are appended
			var p_settings=base_model.get('settings');
			var p_tags=p_settings.tags;
			var tags=p_tags.split(",");
			var li='';
			$.each(tags,function(index,tagName){
				if(tagName!="")
					li += "<li data='"+tagName+"' style='display: inline-block;' class='tag'>"+tagName+"<a id='remove_tag' class='close'>&times</a></li>";
			});
			$('#'+base_model.get("id")+'-portlet-ul-tags').append(li);
			
			//enable tags properties
			setup_tags_typeahead();
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Deals Assigned"){
			$(this).attr('id','p-body-'+column_position+'-'+row_position);
			
			var selector=$(this).attr('id');
			var url='/core/api/portlets/portletDealsAssigned?duration='+base_model.get('settings').duration;
			
			var domainUsersList=[];
			var dealsAssignedCountList=[];
			$('#'+selector).html(getRandomLoadingImg());
			fetchPortletsGraphData(url,function(data){
				if(data.status==403){
					$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
					return;
				}
				domainUsersList=data["domainUsersList"];
				dealsAssignedCountList=data["assignedOpportunitiesCountList"];
				
				dealsAssignedBarGraph(selector,domainUsersList,dealsAssignedCountList);
				
				addWidgetToGridster(base_model);
			});
			
			if(base_model.get('is_minimized'))
				$(this).hide();
			
			setPortletContentHeight(base_model);
			
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Calls Per Person"){
			$(this).attr('id','p-body-'+column_position+'-'+row_position);
			
			var start_date_str = '';
			var end_date_str = '';
			if(base_model.get('settings').duration=='yesterday'){
				start_date_str = ''+base_model.get('settings').duration;
				end_date_str = 'today';
			}else{
				start_date_str = ''+base_model.get('settings').duration;
				end_date_str = 'TOMORROW';
			}
			
			var selector=$(this).attr('id');
			var url='/core/api/portlets/portletCallsPerPerson?duration='+base_model.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str);
			
			var answeredCallsCountList=[];
			var busyCallsCountList=[];
			var failedCallsCountList=[];
			var voiceMailCallsCountList=[];
			var callsDurationList=[];
			var totalCallsCountList=[];
			var domainUsersList=[];
			$('#'+selector).html(getRandomLoadingImg());
			fetchPortletsGraphData(url,function(data){
				if(data.status==403){
					$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
					return;
				}
				answeredCallsCountList=data["answeredCallsCountList"];
				busyCallsCountList=data["busyCallsCountList"];
				failedCallsCountList=data["failedCallsCountList"];
				voiceMailCallsCountList=data["voiceMailCallsCountList"];
				callsDurationList=data["callsDurationList"];
				totalCallsCountList=data["totalCallsCountList"];
				domainUsersList=data["domainUsersList"];
				
				var series=[];
				var text='';
				var colors;
				
				if(base_model.get('settings')["group-by"]=="number-of-calls"){
					var tempData={};
					tempData.name="Answered";
					tempData.data=answeredCallsCountList;
					series[0]=tempData;
					
					tempData={};
					tempData.name="Busy";
					tempData.data=busyCallsCountList;
					series[1]=tempData;
					
					tempData={};
					tempData.name="Failed";
					tempData.data=failedCallsCountList;
					series[2]=tempData;
					
					tempData={};
					tempData.name="Voicemail";
					tempData.data=voiceMailCallsCountList;
					series[3]=tempData;
					text="No. of Calls";
					colors=['green','blue','red','violet'];
				}else{
					var tempData={};
					tempData.name="Total Duration";
					var callsDurationInMinsList = [];
					$.each(callsDurationList,function(index,duration){
						callsDurationInMinsList[index] = duration/60;
					});
					tempData.data=callsDurationInMinsList;
					series[0]=tempData;
					text="Calls Duration (Mins)";
					colors=['green'];
				}
				
				callsPerPersonBarGraph(selector,domainUsersList,series,totalCallsCountList,callsDurationList,text,colors);
				
				addWidgetToGridster(base_model);
			});
			
			if(base_model.get('is_minimized'))
				$(this).hide();
			
			setPortletContentHeight(base_model);
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Agile CRM Blog"){
			$(this).find('div').html(getRandomLoadingImg());
			initBlogPortletSync($(this));
			if(base_model.get('is_minimized'))
				$(this).hide();
			
			setPortletContentHeight(base_model);
			
			addWidgetToGridster(base_model);
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Task Report"){
			$(this).attr('id','p-body-'+column_position+'-'+row_position);
			
			var start_date_str = '';
			var end_date_str = '';
			if(base_model.get('settings').duration=='yesterday'){
				start_date_str = ''+base_model.get('settings').duration;
				end_date_str = 'today';
			}else{
				start_date_str = ''+base_model.get('settings').duration;
				end_date_str = 'TOMORROW';
			}
			
			var selector=$(this).attr('id');
			var url='/core/api/portlets/portletTaskReport?group-by='+base_model.get('settings')["group-by"]+'&split-by='+base_model.get('settings')["split-by"]+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str);
			
			var groupByList=[];
			var splitByList=[];
			var splitByNamesList=[];
			
			$('#'+selector).html(getRandomLoadingImg());
			fetchPortletsGraphData(url,function(data){
				if(data.status==403){
					$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
					return;
				}
				groupByList=data["groupByList"];
				splitByList=data["splitByList"];
				
				var series=[];
				var text='';
				var colors;
				
				$.each(splitByList,function(index,splitByData){
					if(splitByNamesList.length==0)
						$.each(splitByData,function(key,value){
							splitByNamesList.push(key);
						});
				});
				for(var i=0;i<splitByNamesList.length;i++){
					var tempData={};
					var splitByDataList=[];
					$.each(splitByList,function(index,splitByData){
						$.each(splitByData,function(key,value){
							if(key==splitByNamesList[i])
								splitByDataList.push(value);
						});
					});
					tempData.name=splitByNamesList[i];
					tempData.data=splitByDataList;
					series[i]=tempData;
				}
				
				text="Task Report";
				
				taskReportBarGraph(selector,groupByList,series,text);
				
				addWidgetToGridster(base_model);
			});
			
			if(base_model.get('is_minimized'))
				$(this).hide();
			
			setPortletContentHeight(base_model);
		}
		addWidgetToGridster(base_model);
	});
	//enablePortletTimeAndDates(base_model);
}

/**
 * Generic function to fetch data for graphs and act accordingly on plan limit error
 * @param url
 * @param successCallback
 */
function fetchPortletsGraphData(url, successCallback){
	// Hides error message
	$("#plan-limit-error").hide();
	
	// Fetches data
	$.getJSON(url, function(data){	
		// Sends data to callback
		if(successCallback && typeof (successCallback) === "function")
			successCallback(data);
	}).error(function(response){
		// If error is not billing exception and forbidden exception then it is returned
		if(response.status != 406 && response.status != 403)
			return;
				
		// If it is billing exception or forbidden exception, then empty set is sent so page will not be showing loading on error message
		if(successCallback && typeof (successCallback) === "function")
			successCallback(response);
	}); 
}
function dealsByMilestoneBarGraph(selector,milestonesList,milestoneValuesList,milestoneNumbersList){
	head.js(LIB_PATH + 'lib/flot/highcharts-3.js',LIB_PATH + 'lib/flot/no-data-to-display.js', function(){
		if(milestonesList.length==0){
			$('#'+selector).highcharts({
		        chart: {
		            type: 'bar',
		            marginRight: 20
		        },
		        title: {
		            text: ''
		        },
		        xAxis: {
		            categories: []
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: ''
		            }
		        },
		        series: [],
		        exporting: {
			        enabled: false
			    }
		    });
		}else{
			$('#'+selector).highcharts({
		        chart: {
		            type: 'bar',
		            marginRight: 20
		        },
		        title: {
		            text: ''
		        },
		        xAxis: {
		            categories: milestonesList
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: 'Deal Value'
		            },
		            allowDecimals: false
		        },
		        legend: {
		        	enabled: false
		        },
		        tooltip: {
		        	formatter: function(){
		        		return '<table>' + 
		        		        '<tr><td style="color:'+this.points[0].series.color+';padding:0">'+this.points[0].series.name+'s: </td>' + 
		        		        '<td style="padding:0"><b>'+milestoneNumbersList[this.points[0].point.x]+'</b></td></tr>' + 
		        		        '<tr><td style="color:'+this.points[0].series.color+';padding:0">Total Value: </td>' + 
		        		        '<td style="padding:0"><b>'+getPortletsCurrencySymbol()+''+milestoneValuesList[this.points[0].point.x].toLocaleString()+'</b></td></tr>' +
		        		        '</table>';
		        	},
		            shared: true,
		            useHTML: true
		        },
		        plotOptions: {
		            column: {
		                pointPadding: 0.2,
		                borderWidth: 0
		            }
		        },
		        series: [{
		            name: 'Deal',
		            data: milestoneValuesList
		        }],
		        exporting: {
			        enabled: false
			    }
		    });
		}
	});
}
function closuresPerPersonBarGraph(selector,catges,data,text,name){
	head.js(LIB_PATH + 'lib/flot/highcharts-3.js', function(){
		$('#'+selector).highcharts({
	        chart: {
	            type: 'bar',
	            marginRight: 20
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: catges
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: text
	            },
	            allowDecimals: false
	        },
	        legend: {
	        	enabled: false
	        },
	        tooltip: {
	        	formatter: function(){
	        		return '<span style="font-size:10px">'+this.points[0].key+'</span>' + 
        			'<table>' + 
    		        '<tr><td style="color:'+this.points[0].series.color+';padding:0">'+this.points[0].series.name+': </td>' + 
    		        '<td style="padding:0"><b>'+data[this.points[0].point.x]+'</b></td></tr>' + 
    		        '</table>';
	        	},
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: [{
	            name: name,
	            data: data
	        }],
	        exporting: {
		        enabled: false
		    }
	    });
	});
}
function dealsFunnelGraph(selector,funnel_data){
	head.js(LIB_PATH + 'lib/flot/highcharts-3.js', LIB_PATH + 'lib/flot/funnel.js',LIB_PATH + 'lib/flot/no-data-to-display.js', function(){
		$('#'+selector).highcharts({
	        chart: {
	            type: 'funnel',
	            marginRight: 20,
	            className: 'deals-funnel-portlet'
	        },
	        title: {
	            text: ''
	        },
	        plotOptions: {
	        	series: {
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name}</b> ('+getPortletsCurrencySymbol()+'{point.y:,.0f})',
	                    color: 'black',
	                    softConnector: true
	                },
	                neckWidth: '20%',
	                neckHeight: '20%',
	                
	                //-- Other available options
	                height: '100%',
	                width: '50%'
	            }
	        },
	        tooltip: {
	        	pointFormat: '<span>{series.name}:<b>'+getPortletsCurrencySymbol()+'{point.y:,.0f}</b></span>',
	            shared: true,
	            useHTML: true
	        },
	        series: [{
	            name: 'Value',
	            data: funnel_data
	        }],
	        exporting: {
		        enabled: false
		    }
	    });
	});
}
function emailsSentBarGraph(selector,domainUsersList,series,mailsCountList,mailsOpenedCountList,text,colors){
	head.js(LIB_PATH + 'lib/flot/highcharts-3.js', function(){
		$('#'+selector).highcharts({
	        chart: {
	            type: 'bar',
	            marginRight: 20
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: domainUsersList
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: text
	            },
	            allowDecimals: false
	        },
	        tooltip: {
	        	formatter: function(){
	        		return '<table>' + 
	        		        '<tr><td style="color:'+this.points[0].series.color+';padding:0">'+this.points[0].series.name+': </td>' + 
	        		        '<td style="padding:0"><b>'+mailsCountList[this.points[0].point.x]+'</b></td></tr>' +
	        		        '<tr><td style="color:'+this.points[1].series.color+';padding:0">'+this.points[1].series.name+': </td>' + 
	        		        '<td style="padding:0"><b>'+mailsOpenedCountList[this.points[1].point.x]+'</b></td></tr>' +
	        		        '</table>';
	        	},
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	        	series: {
	                stacking: 'normal'
	            },
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: series,
	        exporting: {
		        enabled: false
		    },
		    colors: colors
	    });
	});
}
function portletGrowthGraph(selector,series,base_model){
	var flag=true;
	
	/*if(base_model.get("settings").tags==""){
		$('#portletSettingsModal').modal('show');
		$('#portletSettingsModal > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletSettingsModal')).val(base_model.get('name'));
		showPortletSettingsForm("portletsContactsGrowthGraphSettingsForm");
		
		$("#growth-graph-frequency", $('#portletsContactsGrowthGraphSettingsForm')).find('option[value='+ base_model.get("settings").frequency +']').attr("selected", "selected");
		var range=""+(new Date(base_model.get("settings")["start-date"]).format('mmmm d, yyyy'))+" - "+(new Date(base_model.get("settings")["end-date"]).format('mmmm d, yyyy'));
		$('#portlet-reportrange span').html(range);
		$('#start-date').val(base_model.get("settings")["start-date"]);
		$('#end-date').val(base_model.get("settings")["end-date"]);
		
		enablePortletTimeAndDates(base_model);
		$('#portletSettingsModal').removeData("modal").modal({backdrop: 'static', keyboard: false});
		$('#cancel-modal').attr('disabled',true);
		flag=false;
	}*/
	if(base_model.get("settings").tags==""){
		$('#'+selector).html("<div class='portlet-error-message'>Please <a href='#' id='"+base_model.get("id")+"-settings' class='portlet-settings' dada-toggle='modal'>configure</a> the dashlet and add the Tags.</div>");
		flag=false;
	}
	if(flag){
		head.js(LIB_PATH + 'lib/flot/highcharts-3.js', function(){
			$('#'+selector).highcharts({
		        chart: {
		            type: 'line',
		            marginRight: 20
		        },
		        title: {
		            text: ''
		        },
		        xAxis: {
		        	type: 'datetime',
			        dateTimeLabelFormats: {
			            //don't display the dummy year  month: '%e.%b',
			        	day: '%e.%b'
			        },
			        minTickInterval: 24 * 3600 * 1000
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: ''
		            }
		        },
		        ongraphtooltip: {
		        	formatter: function(){
			            return'<b>'+this.series.name+'</b><br/>'+Highcharts.dateFormat('%e.%b',
			            this.x)+': '+this.y.toFixed(2);
			        },
		            shared: true,
		            useHTML: true
		        },
		        plotOptions: {
		            column: {
		                pointPadding: 0.2,
		                borderWidth: 0
		            }
		        },
		        series: series,
		        exporting: {
			        enabled: false
			    }
		    });
		});
	}
}
function dealsAssignedBarGraph(selector,catges,dealsCountList){
	head.js(LIB_PATH + 'lib/flot/highcharts-3.js', function(){
		$('#'+selector).highcharts({
	        chart: {
	            type: 'bar',
	            marginRight: 20
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: catges
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'No. of deals assigned'
	            },
	            allowDecimals: false
	        },
	        legend: {
	        	enabled: false
	        },
	        tooltip: {
	        	formatter: function(){
	        		return '<span style="font-size:10px">'+this.points[0].key+'</span>' + 
	        		        '<table>' + 
	        		        '<tr><td style="color:'+this.points[0].series.color+';padding:0">'+this.points[0].series.name+': </td>' + 
	        		        '<td style="padding:0"><b>'+dealsCountList[this.points[0].point.x]+'</b></td></tr>' + 
	        		        '</table>';
	        	},
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: [{
	            name: 'Assigned Deals',
	            data: dealsCountList
	        }],
	        exporting: {
		        enabled: false
		    }
	    });
	});
}
function callsPerPersonBarGraph(selector,domainUsersList,series,totalCallsCountList,callsDurationList,text,colors){
	head.js(LIB_PATH + 'lib/flot/highcharts-3.js', function(){
		$('#'+selector).highcharts({
	        chart: {
	            type: 'bar',
	            marginRight: 20
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: domainUsersList
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: text
	            },
	            allowDecimals: false,
	        },
	        tooltip: {
	        	formatter: function(){
	        		var tt = '';
	        		if(text=="Calls Duration (Mins)")
	        			tt = '<table>' + 
        		              '<tr><td style="color:'+this.points[0].series.color+';padding:0">'+this.points[0].series.name+': </td>' +
        		              '<td style="padding:0"><b>'+getPortletsTimeConversion(callsDurationList[this.points[0].point.x])+'</b></td></tr>' +
        		              '<tr><td style="color:'+this.points[0].series.color+';padding:0">Calls: </td>' + 
        		        	  '<td style="padding:0"><b>'+totalCallsCountList[this.points[0].point.x]+'</b></td></tr>' +
        		        	  '</table>';
	        		else{
	        			tt += '<table>';
	        			if(this.points[0]!=undefined && this.points[0].series!=undefined){
	        				tt += 	'<tr><td style="color:'+this.points[0].series.color+';padding:0">'+this.points[0].series.name+': </td>' +
		                      		'<td style="padding:0"><b>'+this.points[0].point.y+'</b></td></tr>';
	        			}
	        			if(this.points[1]!=undefined && this.points[1].series!=undefined){
	        				tt += 	'<tr><td style="color:'+this.points[1].series.color+';padding:0">'+this.points[1].series.name+': </td>' +
		                      		'<td style="padding:0"><b>'+this.points[1].point.y+'</b></td></tr>';
	        			}
	        			if(this.points[2]!=undefined && this.points[2].series!=undefined){
	        				tt += 	'<tr><td style="color:'+this.points[2].series.color+';padding:0">'+this.points[2].series.name+': </td>' +
		                      		'<td style="padding:0"><b>'+this.points[2].point.y+'</b></td></tr>';
	        			}
	        			if(this.points[3]!=undefined && this.points[3].series!=undefined){
	        				tt += 	'<tr><td style="color:'+this.points[3].series.color+';padding:0">'+this.points[3].series.name+': </td>' +
		                      		'<td style="padding:0"><b>'+this.points[3].point.y+'</b></td></tr>';
	        			}
	        			tt += '</table>';
	        		}
	        		return tt;
	        	},
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	        	series: {
	                stacking: 'normal'
	            },
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: series,
	        exporting: {
		        enabled: false
		    },
		    colors: colors
	    });
	});
}
function enablePortletTimeAndDates(base_model){
	if(base_model.get('name')=="Growth Graph"){
		head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css", function(){
			// Bootstrap date range picker.
			$('#portlet-reportrange').daterangepicker({ ranges : { 'Today' : [
					'today', 'today'
			], 'Yesterday' : [
					'yesterday', 'yesterday'
			], 'Last 7 Days' : [
					Date.today().add({ days : -6 }), 'today'
			], 'Last 30 Days' : [
					Date.today().add({ days : -29 }), 'today'
			], 'This Month' : [
					Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()
			], 'Last Month' : [
					Date.today().moveToFirstDayOfMonth().add({ months : -1 }), Date.today().moveToFirstDayOfMonth().add({ days : -1 })
			] } }, function(start, end){
				$('#portlet-reportrange span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
				$('#start-date').val(start.getTime());
				$('#end-date').val(end.getTime());
			});
		});
	}
}
function setPortletContentHeight(base_model){
	if(base_model.get("size_y")==1){
		$('#'+base_model.get("id")).parent().find('.portlet_body').css("height",(base_model.get("size_y")*200)-40+"px");
		$('#'+base_model.get("id")).parent().find('.portlet_body').css("max-height",(base_model.get("size_y")*200)-40+"px");
	}else if(base_model.get("size_y")==2){
		$('#'+base_model.get("id")).parent().find('.portlet_body').css("height",(base_model.get("size_y")*200)+10-40+"px");
		$('#'+base_model.get("id")).parent().find('.portlet_body').css("max-height",(base_model.get("size_y")*200)+10-40+"px");
	}else if(base_model.get("size_y")==3){
		$('#'+base_model.get("id")).parent().find('.portlet_body').css("height",(base_model.get("size_y")*200)+20-40+"px");
		$('#'+base_model.get("id")).parent().find('.portlet_body').css("max-height",(base_model.get("size_y")*200)+20-40+"px");
	}
	$('#'+base_model.get("id")).parent().find('.portlet_body').css("overflow-x","hidden");
	$('#'+base_model.get("id")).parent().find('.portlet_body').css("overflow-y","auto");
}
function getPortletsCurrencySymbol(){
	var value = ((CURRENT_USER_PREFS.currency != null) ? CURRENT_USER_PREFS.currency : "USD-$");
	var symbol = ((value.length < 4) ? "$" : value.substring(4, value.length));
	return symbol;
}
function getPortletsTimeConversion(diffInSeconds){
	if(diffInSeconds==undefined || diffInSeconds==null)
		return;
	var duration='';
	var days=0;
	var hrs=0;
	var mins=0;
	var secs=0;
	days = Math.floor(diffInSeconds/(24*60*60));
	hrs = Math.floor((diffInSeconds % (24*60*60))/(60*60));
	mins = Math.floor(((diffInSeconds % (24*60*60)) % (60*60))/60);
	secs = Math.floor(((diffInSeconds % (24*60*60)) % (60*60))%60);
	
	if(hrs!=0)
		duration += ''+((days*24)+hrs)+'h';
	if(mins!=0)
		duration += ' '+mins+'m';
	if(secs!=0)
		duration += ' '+secs+'s';
	return duration;
}
function taskReportBarGraph(selector,gropuByList,series,text){
	head.js(LIB_PATH + 'lib/flot/highcharts-3.js', function(){
		$('#'+selector).highcharts({
	        chart: {
	            type: 'bar',
	            marginRight: 20
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: gropuByList
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: text
	            },
	            allowDecimals: false,
	        },
	        plotOptions: {
	        	series: {
	                stacking: 'normal'
	            },
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: series,
	        exporting: {
		        enabled: false
		    }
	    });
	});
}