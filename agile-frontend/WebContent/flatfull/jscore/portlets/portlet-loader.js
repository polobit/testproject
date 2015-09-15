var Portlets_View, gridster;
$(function()
{
	$.getJSON('/core/api/users/agileusers', function(users)
	{
		$.each(users, function(i, user)
		{
			if (CURRENT_DOMAIN_USER.id == user.domain_user_id)
			{
				CURRENT_AGILE_USER = user;
			}
		});
	});
});

/**
 * Loads all the portlets for the current agile user
 * 
 * @param el
 */
function loadPortlets(el){

	App_Portlets.todayEventsCollection = new Array();
	App_Portlets.tasksCollection = new Array();
	App_Portlets.pendingDeals = new Array();
	App_Portlets.dealsWon = new Array();
	App_Portlets.filteredCompanies = new Array();
	App_Portlets.filteredContacts = new Array();
	App_Portlets.emailsOpened = new Array();
	App_Portlets.statsReport = new Array();
	App_Portlets.leaderboard = new Array();
	App_Portlets.accountInfo = new Array();
	App_Portlets.activity=new Array();
	App_Portlets.activitiesView= new Array();
	App_Portlets.campaignstats = new Array();

	/*
	 * If Portlets_View is not defined , creates collection view, collection is
	 * sorted based on position i.e., set when sorted using jquery ui sortable
	 */
	
	// This flag is used to ensure portlet script are loaded only once in
	// postrender. It is set to false after portlet setup is initialized
	Portlets_View = new Base_Collection_View({ url : '/core/api/portlets', sortKey : "row_position",sort_collection : false, restKey : "portlet", templateKey : "portlets", individual_tag_name : 'div',
		postRenderCallback : function(portlets_el){
			set_up_portlets(el, portlets_el);

				if(Portlets_View.collection.length==0)
					$('.gridster > div:visible > div',el).removeClass('gs-w');
			
			initializePortletsListeners_1();
			initializePortletsListeners_2();

		} });

	this.Portlets_View.appendItem = set_p_portlets;

	//  Fetch portlets from collection and set_up_portlets (load their scripts)
	Portlets_View.collection.fetch();

	// show portlets
	var newEl = Portlets_View.render().el;
	$('#portlets', el).html(newEl);	
}

/**
 * 
 * 
 * @param el
 * @param portlets_el
 */
function set_up_portlets(el, portlets_el){

	var dimensions;
	var dim_width = Math.round($('.gridster-portlets').width()/3)-20;
	var dim_height = 200;
	dimensions = [dim_width, dim_height];
	gridster = $('.gridster > div:visible',portlets_el).gridster({
    	widget_selector: "div",
        widget_margins: [10, 12],
        widget_base_dimensions: dimensions,
        min_cols: 3,
        autogenerate_stylesheet: true,
        draggable: {
        	limit: true,
        	ignore_dragging: [".portlet_body",".portlet_body *",".portlet-panel",".portlet-panel *",".fc-content *",".events_show *"],
        	stop: function(event,ui){
        		
        		//$('#'+this.$player.attr('id')).attr('id','ui-id-'+this.$player.attr('data-col')+'-'+this.$player.attr('data-row'));
        		
				var models = [];

				/*
				 * Iterate through each all the portlets and set each portlet
				 * position and store it in array
				 */
				$('#portlet-res > div > .gs-w').each(function(){
					
					$(this).attr('id','ui-id-'+$(this).attr("data-col")+'-'+$(this).attr("data-row"));
					$(this).find('div.portlet_body').attr('id','p-body-'+$(this).attr("data-col")+'-'+$(this).attr("data-row"));
					
					var model_id = $(this).find('.portlets').attr('id');
					
					var model = Portlets_View.collection.get(model_id);
					model.set({ 'column_position' : parseInt($(this).attr("data-col")) }, { silent : true });
					model.set({ 'row_position' : parseInt($(this).attr("data-row")) }, { silent : true });

					models.push({ id : model.get("id"), column_position : parseInt($(this).attr("data-col")), row_position : parseInt($(this).attr("data-row")) });
				});
				// Saves new positions in server
				$.ajax({ type : 'POST', url : '/core/api/portlets/positions', data : JSON.stringify(models),
					contentType : "application/json; charset=utf-8", dataType : 'json' });
			}
        },
        resize: {
        	enabled: true,
        	max_size: [3,3],
			resize: function(event,ui){
				var temp=Portlets_View.collection.get($('#'+this.$resized_widget.attr('id')+' > div.portlets').attr('id'));
				if(temp.get("name")=="Mini Calendar"){
					var el=this.$resized_widget.find('#calendar_container');

					if($('#'+this.$resized_widget.attr('id')).height()<=200){
						$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("height","200px");
						$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("max-height","200px");
						$(el).find('.fc-header').css('height','25px');
						//$(el).find('.fc-header').css('padding-top','5px');
						$(el).parent().find('.show').css('padding-top','5px');
					}else if($('#'+this.$resized_widget.attr('id')).height()>200 && $('#'+this.$resized_widget.attr('id')).height()<=450 ){
						$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("height",$('#'+this.$resized_widget.attr('id')).height()+"px");
						$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("max-height",$('#'+this.$resized_widget.attr('id')).height()+"px");
						$(el).find('.fc-header').css('height','145px');
						$(el).find('.show').css('padding-top','70px');
					}
					else{
						$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("height",$('#'+this.$resized_widget.attr('id')).height()+"px");
						$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("max-height",$('#'+this.$resized_widget.attr('id')).height()+"px");
						$(el).find('.fc-header').css('height','250px');
						$(el).find('.show').css('padding-top','120px');
					}

				$(el).fullCalendar('option','aspectRatio',getaspectratio($(el).parent()));
					var top=parseInt($(el).find('.fc-widget-content').css('height'))/2-7;
					$(el).find('.fc-day-number').css('top',top);
				}	
			},

        	stop: function(event,ui){
        		
        		$(window).trigger('resize');
        		
        		$('#'+this.$resized_widget.attr('id')+' > div.portlet_body').css('overflow-x','hidden').css('overflow-y','auto');
					
        		var tempModel = Portlets_View.collection.get($('#'+this.$resized_widget.attr('id')+' > div.portlets').attr('id'));
        		
        		var that = this;
        		if(tempModel.get("name")=="Leaderboard"){
        			$('#'+this.$resized_widget.attr('id')+' > .portlet_header').find('ul').width(($('#'+this.$resized_widget.attr('id')+' > .portlet_body').find('ul').width()/$('#'+this.$resized_widget.attr('id')+' > .portlet_body').width()*100)+'%');
        		}

        		else if(tempModel.get("name")=="Mini Calendar")
        			{
						var el=this.$resized_widget.find('.portlet_body_calendar');
						var aspectratio;
        			if(this.$resized_widget.attr('data-sizey')==1){
						$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("height",this.$resized_widget.attr('data-sizey')*200+"px");
						$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("max-height",this.$resized_widget.attr('data-sizey')*200+"px");
						aspectratio=getaspectratio(el);
						 $('#calendar_container').fullCalendar('option','aspectRatio',aspectratio);	
						$(el).find('.fc-header').css('height','25px');
						$(el).find('.show').css('padding-top','5px');
						 
						
						
					}else if(this.$resized_widget.attr('data-sizey')==2){
						$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("height",this.$resized_widget.attr('data-sizey')*200+25+"px");
						$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("max-height",this.$resized_widget.attr('data-sizey')*200+25+"px");
						aspectratio=getaspectratio(el);
						 $('#calendar_container').fullCalendar('option','aspectRatio',aspectratio);	
						$(el).find('.fc-header').css('height','145px');
						$(el).find('.show').css('padding-top','70px');
						
						
					}
					else if(this.$resized_widget.attr('data-sizey')==3){
						$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("height",this.$resized_widget.attr('data-sizey')*200+50+"px");
						$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("max-height",this.$resized_widget.attr('data-sizey')*200+50+"px");	
						aspectratio=getaspectratio(el);
						 $('#calendar_container').fullCalendar('option','aspectRatio',aspectratio);	
						$(el).find('.fc-header').css('height','250px');
						$(el).find('.show').css('padding-top','120px');
						
						
						
					}
					
					  
						var top=parseInt($(el).find('.fc-widget-content').css('height'))/2-7;
						$(el).find('.fc-day-number').css('top',top);
        			}
        		

				var models = [];

				/*
				 * Iterate through each all the portlets and set each portlet
				 * position and store it in array
				 */
				$('#portlet-res > div > .gs-w').each(function(){
					
					$(this).attr('id','ui-id-'+$(this).attr("data-col")+'-'+$(this).attr("data-row"));
					
					$(this).find('div.portlet_body').attr('id','p-body-'+$(this).attr("data-col")+'-'+$(this).attr("data-row"));
					
					var model_id = $(this).find('.portlets').attr('id');
					
					var model = Portlets_View.collection.get(model_id);
					
					model.set({ 'size_x' : parseInt($(this).attr("data-sizex")) }, { silent : true });
					
					model.set({ 'size_y' : parseInt($(this).attr("data-sizey")) }, { silent : true });
					
					model.set({ 'column_position' : parseInt($(this).attr("data-col")) }, { silent : true });
					
					model.set({ 'row_position' : parseInt($(this).attr("data-row")) }, { silent : true });

					models.push({ id : model.get("id"), size_x : parseInt($(this).attr("data-sizex")), size_y : parseInt($(this).attr("data-sizey")), 
						column_position : parseInt($(this).attr("data-col")), row_position : parseInt($(this).attr("data-row")) });
				});
				// Saves new width and height in server
				$.ajax({ type : 'POST', url : '/core/api/portlets/widthAndHeight', data : JSON.stringify(models),
					contentType : "application/json; charset=utf-8", dataType : 'json' });

			}
        }
    }).data('gridster');

    $(window).resize(function(){
    	if(gridster!=undefined)
    		$('.gridster-portlets').css("height","auto");
    	if($(window).width()<768 && gridster!=undefined){
    		gridster.disable();
    		gridster.disable_resize();
    	}else if(gridster!=undefined){
    		gridster.enable();
    		gridster.enable_resize();
    		gridster.set_dom_grid_height();
    	}
		if($(window).width()<975 && $(window).width()>768 && $('.portlet_body_calendar').is(':visible')){
				$('.portlet_body_calendar').each(function(){
				$(this).find('#calendar_container').find('.fc-widget-header').each(function(){
				$(this).text($(this).text().substring(0, 1));
				});
			});
		}else if($(window).width()>975 && $('.portlet_body_calendar').is(':visible')){
				$('.portlet_body_calendar').each(function(){
				var weeksArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
				$(this).find('#calendar_container').find('.fc-widget-header').each(function(index){
				$(this).text(weeksArray[index]);
				});
			});
		}
    });

    if($(window).width()<768 && gridster!=undefined){
		gridster.disable();
		gridster.disable_resize();
	}else if(gridster!=undefined){
		gridster.enable();
		gridster.enable_resize();
	}
    $(window).trigger('resize');
}


function hidePortletSettingsAfterSave(modal_id){
	$('#'+modal_id+ '> .modal-dialog > .modal-content > .modal-footer > a').text('Save');
	$('#'+modal_id+ '> .modal-dialog > .modal-content > .modal-footer > a').attr('disabled',false);
	$('#'+modal_id).modal('hide');
	$('.modal-backdrop').hide();
}

function initializePortletsListeners_2(){


$('.modal-footer').off("click").on('click', '.portlet-settings-save-modal', function(e) {
	e.preventDefault();
	var scrollPosition=$(window).scrollTop();
	var form_id=$(this).parent().prev().find('form:visible').attr('id');
	var modal_id=$(this).parent().parent().parent().parent().attr('id');
	if (!isValidForm('#' + form_id))
		return false;
	$(this).attr('disabled',true);
	$(this).text('Saving...');
	
	var el=this.id;
	var flag=true;
	var json={};
	var obj={};
	var portletType=$('#portlet-type',$('#'+modal_id)).val();
	var portletName=$('#portlet-name',$('#'+modal_id)).val();
	json = serializeForm(form_id);
	if(portletType=="CONTACTS" && portletName=="Growth Graph"){
		var tags='';
		if($('#addPortletBulkTags').val()!=""){
			var tag=$('#addPortletBulkTags').val();
			if($('#portlet-ul-tags > li').length==0)
				$('#portlet-ul-tags').append("<li data='"+tag+"' class='tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block'>'"+tag+"'<a tag='"+tag+"' id='remove_tag' class='close m-l-xs'>&time</a></li>");
			else
				$('#portlet-ul-tags > li:last').after("<li data='"+tag+"' class='tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block'>'"+tag+"'<a tag='"+tag+"' id='remove_tag' class='close m-l-xs'>&time</a></li>");
		}
		$('#portlet-ul-tags > li').each(function(){
			if($(this).is(':last'))
				tags += $(this).attr('data');
			else
				tags += $(this).attr('data')+',';
		});
		json['tags']=tags;
	}

	if(portletType=="USERACTIVITY" && portletName=="Leaderboard"){
		var tempJson = {};
		var tempJson1 = [];
		$('#category-list',$('#'+el).parent().parent()).find('option').each(function(){
			if($(this).is(':selected'))
				tempJson[''+$(this).val()] = true;
			else
				tempJson[''+$(this).val()] = false;
		});
		$('#user-list',$('#'+el).parent().parent()).find('option:selected').each(function(){
			tempJson1.push($(this).val());
		});
		json['duration'] = $('#duration',$('#'+el).parent().parent()).val();
		json['category'] = tempJson;
		json['user'] = tempJson1;
	}
	
	var idVal = $('#'+$(this).attr('id').split("-save-modal")[0]).parent().find('.portlet_body').attr('id');
	var portlet = Portlets_View.collection.get(el.split("-save-modal")[0]);
	var column_position = portlet.get('column_position');
	var row_position = portlet.get('row_position');
	portlet.set({ "prefs" : JSON.stringify(json) }, { silent : true });
	portlet.url="core/api/portlets";
	var model = new BaseModel();
	model.url = 'core/api/portlets';
	if(flag){
		model.save(portlet.toJSON(), {
	        success: function (data) {
	        	hidePortletSettingsAfterSave(modal_id);
	        	$(window).scrollTop(scrollPosition);
	        	scrollPosition = 0;
	        	var model = data.toJSON();
	        	Portlets_View.collection.get(model).set(new BaseModel(model));
	        	var pos = ''+data.get("column_position")+''+data.get("row_position");
	        	portlet_utility.getInnerViewOfPortlet(data, $('#portlet-res'));
	        	
	        	setPortletContentHeight(data);
    			$('#'+data.get('id')).parent().find('div:last').after('<span class="gs-resize-handle gs-resize-handle-both"></span>');
	        },
	        error: function (obj, response) {
	        	//alert("response--"+response.status);
	        }
		});
	}
});

$('#portletsTaskReportSettingsModal').off("change").on('change', '#group-by-task-report', function(e) {
	
	$('#tasks-task-report').trigger("change");
	
	$('#split-by-task-report > option').each(function(e1){
		if($(this).val()==$('#group-by-task-report').val())
			$(this).hide();
		else{
			if($('#tasks-task-report').val()=="completed-tasks" && $(this).val()!="status"){
				$(this).show();
				$(this).attr("selected",true);
			}else if($('#tasks-task-report').val()=="all-tasks"){
				$(this).show();
				$(this).attr("selected",true);
			}
		}
	});
	if($('#group-by-task-report').val()=="status"){
		$('#tasks-task-report > option#all-tasks').attr("selected",true);
		$('#tasks-control-group').hide();
	}
	else
		$('#tasks-control-group').show();
});

$('.modal-content').off("change").on('change', '#tasks-task-report', function(e) {
	if($('#tasks-task-report').val()=="completed-tasks"){
		if($('#split-by-task-report > option#status').is(':selected'))
			$('#split-by-task-report > option#status').attr("selected",false);
		$('#split-by-task-report > option#status').hide();
	}
	else
		$('#split-by-task-report > option#status').show();
});

$('.gridster-portlets').off("mouseover").on('mouseover', '.stats_report_portlet_body', function(e) {
	if($('.stats_report_portlet_body').parent().find('.gs-resize-handle'))
		$('.stats_report_portlet_body').parent().find('.gs-resize-handle').remove();
});

$('.portlet_body').off("change").on('change', '.onboarding-check', function(e) {
	var that = $(this);
	var model_id = $(this).parent().parent().parent().find('.portlets').attr('id');
	var model = Portlets_View.collection.get(model_id);
	var json1 = {};
	$(this).parent().parent().find('label').each(function(){
		var json2 = {};
		if($(this).find('input:checkbox').is(':checked')){
			json2["done"] = true;
			json2["skip"] = false;
		}else{
			json2["done"] = false;
			json2["skip"] = false;
		}
		json1[""+$(this).prop('value')] = json2;
	});
	model.set({ 'prefs' : JSON.stringify(json1) }, { silent : true });
	// Saves new width and height in server
	$.ajax({ type : 'POST', url : '/core/api/portlets/saveOnboardingPrefs', data : JSON.stringify(model.toJSON()),
		contentType : "application/json; charset=utf-8", dataType : 'json', success: function(){
			if(that.find('input:checkbox').is(':checked')){
				that.parent().find('span').css("text-decoration","line-through");
			}else{
				that.parent().find('span').css("text-decoration","none");
			}} });
		
});

$('.modal-body').off("click").on('click', '#category-select-all', function(e) {
		e.preventDefault();
		$('#category-list').multiSelect('select_all');
});

$('.modal-content').off("click").on('click', '#category-select-none', function(e) {
		e.preventDefault();
		$('#category-list').multiSelect('deselect_all');
});

$('.modal-body').on('click', '#user-select-all', function(e) {
		e.preventDefault();
		$('#user-list').multiSelect('select_all');
});

$('.modal-content').on('click', '#user-select-none', function(e) {
		e.preventDefault();
		$('#user-list').multiSelect('deselect_all');
});

$('.modal-body').on('click', '#calls-user-select-all', function(e) {
	e.preventDefault();
	$('#calls-user-list').multiSelect('select_all');
});

$('.modal-content').on('click', '#calls-user-select-none', function(e) {
	e.preventDefault();
	$('#calls-user-list').multiSelect('deselect_all');
});

$('.modal-body').on('click', '#task-report-user-select-all', function(e) {
		e.preventDefault();
		$('#task-report-user-list').multiSelect('select_all');
});

$('.modal-content').on('click', '#task-report-user-select-none', function(e) {
		e.preventDefault();
		$('#task-report-user-list').multiSelect('deselect_all');
});

$('.gridster-portlets').on('mouseover','.portlet_body_calendar',function(e){
	$(this).find('.portlet_header_icons').removeClass('vis-hide');
	$(this).find('.fc-button').css('visibility','visible');	
});

$('.gridster-portlets').on('mouseout','.portlet_body_calendar',function(e){
$(this).find('.portlet_header_icons').addClass('vis-hide');
$(this).find('.fc-button').css('visibility','hidden');
});

$('.events_show').on('click','.minical-portlet-event',function(e){
	App_Portlets.currentPosition = '' + $(this).parents('.gs-w').find('.column_position').text().trim() + '' + $(this).parents('.gs-w').find('.row_position').text().trim();
	App_Portlets.currentPortletName = 'Mini Calendar';

	var id = $(this).attr('id');
	if(id && !isNaN(id)){
		var events_array= $('#calendar_container',$(this).parentsUntil('.mini-cal').eq($(this).parentsUntil('.mini-cal').length-1)).fullCalendar('clientEvents', id, function(event) {
			return (event.start >= date && event.start < endDate);
		});
		//$('#'+id,$('#calendar_container')).trigger('click');
		var model = events_array[0];
		App_Portlets.currentEventObj = model;
		var eventsURL = '/core/api/events/'+events_array[0].id;
		var event;
		$.getJSON(eventsURL, function(doc)
		{
			event=doc;
			var start = getDate(event.start);
			var end = getDate(event.end);
			if(!model)
			return;
		if(model.color == "#f05050" || model.color == "red")
			model.color = "red";
		else if(model.color == "#7266ba" || model.color == "#36C")
			model.color = "#36C";
		else
			model.color = "green";
		// Deserialize
		deserializeForm(model, $("#updateActivityForm"));
		
		$("#update-event-date-1").val(getDateInFormat(start));
		$("#update-event-date-2").val(getDateInFormat(end));
		// Set time for update Event
		$('#update-event-time-1')
				.val(
						(start.getHours() < 10 ? "0" : "") + start.getHours() + ":" + (start.getMinutes() < 10 ? "0" : "") + start.getMinutes());
		$('#update-event-time-2')
				.val(
						(end.getHours() < 10 ? "0" : "") + end.getHours() + ":" + (end.getMinutes() < 10 ? "0" : "") + end.getMinutes());

		// hide end date & time for all day events
		if (model.allDay)
		{
			$("#update-event-date-2").closest('.row').hide();
			$('#update-event-time-1').closest('.control-group').hide();
		}
		else
		{
			$('#update-event-time-1').closest('.control-group').show();
			$("#update-event-date-2").closest('.row').show();
		}

		if (model.type == "WEB_APPOINTMENT" && (model.start.getTime() / 1000) > parseInt(new Date().getTime() / 1000))
		{
			$("[id='event_delete']").attr("id", "delete_web_event");
			web_event_title = model.title;
			if (model.contacts.length > 0)
			{
				var firstname = getPropertyValue(model.contacts[0].properties, "first_name");
				if (firstname == undefined)
						firstname = "";
					var lastname = getPropertyValue(model.contacts[0].properties, "last_name");
					if (lastname == undefined)
						lastname = "";
				web_event_contact_name = firstname + " " + lastname;
			}
		}
		else
		{
			$("[id='delete_web_event']").attr("id", "event_delete");
		}

		if (model.description)
		{
			var description = '<label class="control-label"><b>Description </b></label><div class="controls"><textarea id="description" name="description" rows="3" class="input form-control" placeholder="Add Description"></textarea></div>'
			$("#event_desc").html(description);
			$("textarea#description").val(model.description);
		}
		else
		{
			var desc = '<div class="row-fluid">' + '<div class="control-group form-group m-b-none">' + '<a href="#" id="add_event_desctiption"><i class="icon-plus"></i> Add Description </a>' + '<div class="controls event_discription hide">' + '<textarea id="description" name="description" rows="3" class="input form-control w-full col-md-8" placeholder="Add Description"></textarea>' + '</div></div></div>'
			$("#event_desc").html(desc);
		}
		// Fills owner select element
		populateUsersInUpdateActivityModal(model);

		// Show edit modal for the event
		$("#updateActivityModal").modal('show');
		$('#'+id,$('#calendar_container')).trigger('click');
		return false;
	
		});
	}
});

$('.events_show').on('click','.minical-portlet-event-add',function(e){
	// Show a new event
	App_Portlets.currentPosition = '' + $(this).parents('.gs-w').find('.column_position').text().trim() + '' + $(this).parents('.gs-w').find('.row_position').text().trim();
	App_Portlets.currentPortletName = 'Mini Calendar';
	var start = new Date(parseInt($(this).attr('id')));
							$('#activityModal').modal('show');
							highlight_event();

							// Set Date for Event
							//var dateFormat = 'mm/dd/yyyy';
							$('#task-date-1').val(getDateInFormat(start));
							$("#event-date-1").val(getDateInFormat(start));
							$("#event-date-2").val(getDateInFormat(start));

							// Set Time for Event
							//if ((start.getHours() == 00) && (start.getHours() == 00) && (start.getMinutes() == 00))
							//{
								$('#event-time-1').val('');
								$('#event-time-2').val('');
							//}
							/* else
							{
								$('#event-time-1')
										.val(
												(start.getHours() < 10 ? "0" : "") + start.getHours() + ":" + (start.getMinutes() < 10 ? "0" : "") + start
														.getMinutes());
								$('#event-time-2').val(
										(start.getHours() < 10 ? "0" : "") + start.getHours() + ":" + (start.getMinutes() < 10 ? "0" : "") + start.getMinutes());
							} */
});

}

function initBlogPortletSync(el)
{
	head
			.js(
					LIB_PATH + 'lib/jquery.feeds.min.js',
					function()
					{

						$('#portlet_blog_sync_container',el)
								.feeds(
										{
											feeds : { blog : "https://www.agilecrm.com/blog/feed/" },
											max : 3,
											entryTemplate : function(entry)
											{
												return '' + '<a href="' + entry.link + '" title = "' + entry.title + '" target="_blank" >' + entry.title + '</a><div style="color:#999;font-size:11px;line-height: 13px;margin-bottom:5px">' 
												+ new Date(entry.publishedDate).format('mmm d, yyyy') + '</div><p style="padding-top:5px;margin-bottom:15px">' 
												+ entry.contentSnippet.replace('<a', '<a target="_blank"') + '</p>';
											},
											onComplete : function(e){
												$('#portlet_blog_sync_container',el).append('<span class="pull-right"><a href="https://www.agilecrm.com/blog" target="_blank">Agile CRM Blog</a></span>');
											} });
					});

}

$('body').on('click', '.onboarding-skip', function(e) {
	$(this).parent().find('span').css("text-decoration","line-through");
	if(!$(this).parent().find('small').hasClass('onboarding-undo'))
		$(this).parent().find('span').after("<small class='p-l-sm onboarding-undo c-p'>(undo)</small>");
	$(this).remove();
});
$('body').on('click', '.onboarding-undo', function(e) {
	$(this).parent().find('span').css("text-decoration","none");
	$(this).parent().find('label').remove();
	$(this).parent().find('span').before("<label class='i-checks i-checks-sm onboarding-check' style='padding-right:4px;'><input type='checkbox'><i></i></label>");
	if(!$(this).parent().find('small').hasClass('onboarding-skip'))
		$(this).parent().find('span').after("<small class='p-l-sm onboarding-skip c-p'>(skip)</small>");
	$(this).remove();
});

function gravatarImgForPortlets(width){
	// Default image
	var img = DEFAULT_GRAVATAR_url;
	var backup_image = "&d=404\" ";
	// backup_image="";
	var initials = '';
	
	if (initials.length == 0)
		backup_image = "&d=" + DEFAULT_GRAVATAR_url + "\" ";
	var data_name = '';
	return new Handlebars.SafeString('https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + '' + backup_image + data_name);
}

function loadGoogleEventsForPortlets(p_el,startTime,endTime){
	$.getJSON('core/api/calendar-prefs/get', function(response)
	{
		var events = new Array();
		console.log(response);
		if (response)
		{
			//createCookie('google_event_token', response.access_token);

			head.js('https://apis.google.com/js/client.js', '/lib/calendar/gapi-helper.js', function()
			{
				setupGC(function()
				{

					gapi.auth.setToken({ access_token : response.access_token, state : "https://www.googleapis.com/auth/calendar" });

					var current_date = new Date();
					var timezone_offset = current_date.getTimezoneOffset();
					var startDate = new Date(startTime * 1000);
					var gDateStart = startDate.toISOString();
       				var endDate = new Date(endTime * 1000);
       				var gDateEnd = endDate.toISOString();

					// Retrieve the events from primary
					var request = gapi.client.calendar.events
								.list({ 'calendarId' : 'primary', maxResults : 25, singleEvents : true, orderBy : 'startTime', timeMin : gDateStart, timeMax : gDateEnd });
						request.execute(function(resp)
						{
							console.log(resp);
							for (var i = 0; i < resp.items.length; i++)
							{
								var fc_event = google2fcEvent(resp.items[i]);
								fc_event.startEpoch = new Date(fc_event.start).getTime()/1000;
								fc_event.endEpoch = new Date(fc_event.end).getTime()/1000;
								if (isNaN(fc_event.endEpoch))
								{
									fc_event.endEpoch = new Date(fc_event.google.end.date).getTime()/1000;
								}
								console.log(fc_event);
								events.push(fc_event);

							}
							App_Portlets.googleEventCollectionView = new Base_Collection_View({ data : events, templateKey : "portlets-google-events", individual_tag_name : 'tr',
								sort_collection : true, sortKey : 'start', descending : false, 
								postRenderCallback : function(el){
									if($(p_el).parent().parent().find('#normal-events').find('table').find('tr').length>0)
									{
										$(p_el).parent().parent().find('#google-events').addClass('m-t-n-md').css("border-top","1px solid #eee");
									}
									setTimeout(function(){
										if($(p_el).parent().parent().find('#normal-events').find('table').find('tr').length==0 && $(p_el).parent().parent().find('#google-events').find('table').find('tr').length==0)
										{
											$(p_el).parent().parent().find('#normal-events').html('<div class="portlet-error-message">No calendar events</div>');
										}
									},1000);
								} });
							//googleEventCollectionView.appendItem = appendGoogleEvent;
							if($(p_el).parent().parent().find('#google-events').find('table').find('tr').length==0)
							{
								$(p_el).parent().parent().find('#google-events').html(App_Portlets.googleEventCollectionView.render(true).el);
							}
							hideTransitionBar();
						});

				});
			});
		}
		else{
			setTimeout(function(){
				if($(p_el).parent().parent().find('#normal-events').find('table').find('tr').length==0 && $(p_el).parent().parent().find('#google-events').find('table').find('tr').length==0)
				{
					$(p_el).parent().parent().find('#normal-events').html('<div class="portlet-error-message">No calendar events</div>');
				}
			},1000);
		}
	});
}

var jso=[];
function minicalendar(el)
{
	eraseCookie('current_date_calendar');
	init_cal(el);
	var totalEvents = 0;
	var eventsCount = 0;
	var dayClasses = [];
	
	
						$('#calendar_container',el).fullCalendar({
								

							aspectRatio:getaspectratio(el),
							selectable: true,
							header : { left : 'prev',right:'next', center :'title'  },
							weekMode:'liquid',
							
							eventSources :[
							{
							events : function(start, end, callback)
								{
								if($(el).parent().attr('data-sizey')==2)
									$(el).find('.fc-header').css('height','145px');		
								else if($(el).parent().attr('data-sizey')==3)
									$(el).find('.fc-header').css('height','250px');		
								
									jso=[];
									var date=new Date();
									   var todayDate=new Date(date.getFullYear(), date.getMonth(), date.getDate(),00,00,00);
									   var endDate=new Date(date.getFullYear(), date.getMonth(), date.getDate(),23,59,59);
											if(readCookie('current_date_calendar')!=null)
											{
												var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
												var cookie_date=new Date(readCookie('current_date_calendar'));
												if(cookie_date.getTime()!=todayDate.getTime()){
													todayDate=cookie_date;
												endDate=new Date(cookie_date.getFullYear(), cookie_date.getMonth(), cookie_date.getDate(),23,59,59);
												$(el).find('.events_show').empty().append('<div class="show p-t-xs text-md text-center">'+days[cookie_date.getDay()]+', ' +cookie_date.format('dd mmm')+' </div><ul class="list"></ul>');
	
												}
												else
													$(el).find('.events_show').empty().append('<div class="show p-t-xs text-md text-center">Today </div><ul class="list"></ul>');
											}
											else if(start<todayDate &&  todayDate<end){
												$(el).find('.events_show').empty().append('<div class="show p-t-xs text-md text-center">Today </div><ul class="list"></ul>');
											
									   }
									
											if($(el).parent().attr('data-sizey')==2)
											   $(el).find('.show').css('padding-top','70px');
										   else if($(el).parent().attr('data-sizey')==3)
											   $(el).find('.show').css('padding-top','120px');
										var top=parseInt($(el).find('.fc-widget-content').css('height'))/2-7;
									$(el).find('.fc-day-number').css('top',top);  
									
									var eventsURL = '/core/api/events?start=' + start.getTime() / 1000 + "&end=" + end.getTime() / 1000 + "&owner_id=" +CURRENT_AGILE_USER.id;
									
									
										$.getJSON(eventsURL, function(doc)
									{
										$.each(doc, function(index, data)
										{
					
											if (data.color == 'red' || data.color == '#f05050')
												data.color='#f05050';
											else if (data.color == '#36C' || data.color == '#23b7e5' || data.color == 'blue')
												data.color='#7266ba';
											else if (data.color == 'green' || data.color == '#bbb')
												data.color='#fad733';
											
											
									   var e_date= new Date(data.start*1000);
											var end_date=new Date(data.end*1000);
											//var a=Math.round((end_date-e_date)/(1000*60*60*24));
											var a=(end_date.getMonth()-e_date.getMonth())+(end_date.getDate()-e_date.getDate());
												if(a==0){
													var new_json1=JSON.parse(JSON.stringify(data));
													jso.push(new_json1);
												}
												else{
													for(var i=0;i<=a;i++){
														var new_json={};
														new_json=JSON.parse(JSON.stringify(data));
													if(i==0){
														new_json.start=e_date.getTime()/1000;
														new_json.end=new Date(e_date.getFullYear(),e_date.getMonth(),e_date.getDate()+i,23,59,59).getTime()/1000;
														}
													else if(i<a){		
														new_json.start=new Date(e_date.getFullYear(),e_date.getMonth(),e_date.getDate()+i,00,00,00).getTime()/1000;
														new_json.end=new Date(e_date.getFullYear(),e_date.getMonth(),e_date.getDate()+i,23,59,59).getTime()/1000;
														}
													else{
														new_json.start=new Date(e_date.getFullYear(),e_date.getMonth(),e_date.getDate()+i,00,00,00).getTime()/1000;
														new_json.end=end_date.getTime()/1000;
														}
												jso.push(new_json);
												} }
											});
										
									if (doc)
										{

											console.log(jso);
											 $.each(jso,function(index,ev){
											if(ev.start >= (todayDate.getTime()/1000) && ev.start <= (endDate.getTime()/1000)) {
												if($(el).find('.portlet-calendar-error-message').length!=0)
												{
													$(el).find('.portlet-calendar-error-message').css('display','none');
													$(el).find('.minical-portlet-event-add').css('display','none');
												}
											var e_date= new Date(ev.start*1000);
											var len=$(el).find('.list').find('li').length;
											if(len!=0){
												$(el).find('.list').find('small').each(function(x) 
												{
													if(e_date.format('HH:MM')<$(this).text())
													{$(this).parents('li').before('<li class="p-t-xs p-r-xs" style="color:'+ev.color+'"><span style="color : #58666e" class="text-cap word-break"><a class="minical-portlet-event" id='+ev.id+' data-date='+todayDate.getTime()+'>'+ev.title+'</a><br><small class="block m-t-n-xxs">'+ e_date.format('HH:MM') + ' </small></span></li>');
													return false;}
													if(x==len-1)
														$(this).parents('.list').append('<li class="p-t-xs p-r-xs" style="color:'+ev.color+'"><span style="color : #58666e" class="text-cap word-break"><a class="minical-portlet-event" id='+ev.id+' data-date='+todayDate.getTime()+'>'+ev.title+'</a><br><small class="block m-t-n-xxs">'+ e_date.format('HH:MM') + ' </small></span></li>') ;

												 });
													}
													else
											$(el).find('.list').append('<li class="p-t-xs p-r-xs" style="color:'+ev.color+'"><span style="color : #58666e" class="text-cap word-break"><a class="minical-portlet-event" id='+ev.id+' data-date='+todayDate.getTime()+'>'+ev.title+'</a><br><small class="block m-t-n-xxs">'+ e_date.format('HH:MM') + ' </small></span></li>');
											}
											}); 
											
											
											callback(jso);
									   }
										
									
										
									});
									
									
						} },{dataType :'agile-events'}
							
						
							],
						    
							  
							  
							     eventRender: function (event, element, view) { 
							    									 	var year = event.start.getFullYear(), month = event.start.getMonth() + 1, date = event.start.getDate();
					                   var result = year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
					                   $(element).addClass(result);
					                   $(element).attr('id',event.id);
					                   	dayClasses.push(result);
									   $('.fc-event').find('.fc-event-inner').css('display','none');

										var count=$(el).find('.'+result).length;
										if(count>3){
											return false;
											//$(element).hide();
										}  
								} ,
								eventAfterRender: function (event, element, view) {
									
									eventsCount++;
								if(totalEvents == 0){
										totalEvents = $(el).find('#calendar_container').find('.fc-event').length;
									}
									var h=parseInt($(el).find('.fc-widget-content').css('height'));
									var head=parseInt($(el).find('.fc-header').css('height'));
									var top=element.position().top+h-25;
									var left=element.position().left+5;
											$(element).css('top',top);
											$(element).css('left',left);
									   
		 if(eventsCount==totalEvents || eventsCount==(2*totalEvents)){
			 var temp;
			 var dayEventsTotalCount = totalEvents;
			 if($(el).find('.fc-border-separate').find('tbody').find('tr:last').css('display')!="none"){
			 if($(el).find('.fc-border-separate').find('tbody').find('tr').length==6 && ($(el).parent().attr('data-sizey')==1))
				 $(el).find('.fc-border-separate').find('tbody').find('tr').find('.fc-first').find('div:first').css('min-height','23px');
			 }
			 $(el).find('.fc-border-separate').find('tbody').find('tr').each(function(index){
				 if($(el).find('.fc-border-separate').find('tbody').find('tr').eq(index).find('.fc-first').find('.fc-day-content').find('div').height()> $(el).find('.fc-border-separate').find('tbody').find('tr').eq(index+1).find('.fc-first').find('.fc-day-content').find('div').height())
					 temp= $(el).find('.fc-border-separate').find('tbody').find('tr').eq(index+1).find('.fc-first').find('.fc-day-content').find('div').height();
				 else
					 temp= $(el).find('.fc-border-separate').find('tbody').find('tr').eq(index).find('.fc-first').find('.fc-day-content').find('div').height();
			 });
			  $(el).find('.fc-border-separate').find('tbody').find('tr').each(function(index){
				  $(this).find('.fc-first').find('.fc-day-content').find('div').css('height',temp);
			  });
											totalEvents = 0;
											eventsCount = 0;
											jso=[];
          var classNamesArray = [];
         $(el).find('#calendar_container').find('.fc-event').each(function(index){
          if($.inArray($(this).attr('class').split(" ")[$(this).attr('class').split(" ").length-1], classNamesArray)==-1){
           classNamesArray.push($(this).attr('class').split(" ")[$(this).attr('class').split(" ").length-1]);
          }
         });
         $.each(classNamesArray,function(index, value){
         	var dayEventsCount = 0;
          $.each(dayClasses, function(index1, value1){
           if(dayClasses[index1]==classNamesArray[index]){
            dayEventsCount++;
           }
          });
          if(eventsCount==(2*dayEventsTotalCount)){
           dayEventsCount = dayEventsCount/2;
          }
          var pos = $('.'+this,el).eq(0).position();
		  var eventsLength = $('.'+this,el).length;
          var addPixels = Math.round(($(el).find('.fc-widget-header').eq(1).width()-10)/2);
          if(eventsLength==1){
           pos.left += addPixels;
          }else if(eventsLength==2){
           pos.left += addPixels;
           pos.left -= 3;
          }else if(eventsLength==3){
           pos.left += addPixels;
           pos.left -= 6;
          }else{
           pos.left += addPixels;
           pos.left -= 10;
          }
		  pos.top += 8;
          if($(el).parent().attr('data-sizey')==2){
          // pos.top -= 20;
          }else if($(el).parent().attr('data-sizey')==3){
           //pos.top -= 35;
          }
          $('.'+this,el).each(function(index){
            if(index>0){
             $(this,el).css({"top": pos.top, "left":pos.left+(6*index)});
             if(index>2){
              $(this,el).hide();
             }
            }else if(index==0){
             $(this,el).css({"top": pos.top, "left":pos.left});
            }
           });
		   if(dayEventsCount>3){
           var icon_pos = pos.left+(3*6);
           $('.'+this,el).eq(eventsLength-1).after('<div class="plus-button pos-abs c-p" style="top: '+(pos.top-7)+'px;left: '+icon_pos+'px; color:lightgray;" title="'+(dayEventsCount-3)+' more">&nbsp;</div>');
          }
         });
		dayClasses = [];
         }
		},
								eventMouseover : function(event, jsEvent, view)
						{
							$(el).find('.portlet_header_icons').removeClass('vis-hide');
							$(el).find('.fc-button').css('visibility','visible');
							el.parent().css('z-index',3);
							var reletedContacts = '';
							var meeting_type = '';
							if(CURRENT_AGILE_USER.domainUser.ownerPic=="" || CURRENT_AGILE_USER.domainUser.ownerPic=="no image")
									event.ownerPic=gravatarImgForPortlets(25);
							if (event.contacts)
							{
								if (event.contacts.length > 0)
									reletedContacts += '<i class="icon-user text-muted m-r-xs"></i>';
							}
							if (event.contacts)
							{
								for (var i = 0; i < event.contacts.length; i++)
								{
									if (event.contacts[i].type == "PERSON")
									{
										var last_name = getPropertyValue(event.contacts[i].properties, "last_name");
										if (last_name == undefined)
											last_name = "";
										reletedContacts += '<a class="text-info" href="#contact/' + event.contacts[i].id + '">' + getPropertyValue(
												event.contacts[i].properties, "first_name") + ' ' + last_name + '</a>';
									}
									else
									{
										try
										{
											reletedContacts += '<a class="text-info" href="#company/' + event.contacts[i].id + '">' + getPropertyValue(
													event.contacts[i].properties, "name") + '</a>';
										}
										catch (err)
										{
											console.log("error");
										}
									}
									if (i != event.contacts.length - 1)
										reletedContacts += ', ';
								}
							}
							if (event.meeting_type && event.description)
							{
								meeting_type = '<i class="icon-comment-alt text-muted m-r-xs"></i><span>Meeting Type - ' + event.meeting_type + '</span><br/><span title=' + event.description + '>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + event.description + '</span>';
							}

							else if (event.description)
							{
								meeting_type = '<i class="icon-comment-alt text-muted m-r-xs"></i><span title=' + event.description + '>' + event.description + '</span>';
							}
							var leftorright = 'bottom';
							var pullupornot = '';
							var popoverElement = '';
							if(event.type=="AGILE"){
								popoverElement = '<div class="fc-overlay ' + leftorright + '" style="width:100%;">' + '<div class="panel bg-white b-a pos-rlt p-sm">' + '<span class="arrow ' + leftorright + ' ' + pullupornot + '"></span>' + '<div class="h4 font-thin m-b-sm"><div class="pull-left text-ellipsis p-b-xs" style="width:100%;">' + event.title + '</div></div>' + '<div class="line b-b b-light"></div>' + '<div><i class="icon-clock text-muted m-r-xs"></i>' + event.start
									.format('dd-mmm-yyyy HH:MM') + '<div class="pull-right" style="width:10%;"><img class="r-2x" src="' + event.ownerPic + '" height="20px" width="20px" title="' + event.owner.name + '"/></div></div>' + '<div class="text-ellipsis">' + reletedContacts + '</div>' + '<div class="text-ellipsis">' + meeting_type + '</div>' + '</div>' + '</div>';
								$(this).append(popoverElement);
								$(this).find('.fc-overlay').find('.arrow').css('top','70px');
							}else{
								popoverElement = '<div class="fc-overlay ' + leftorright + '" style="width:100%;">' + '<div class="panel bg-white b-a pos-rlt p-sm">' + '<span class="arrow ' + leftorright + ' ' + pullupornot + '"></span>' + '<div class="h4 font-thin m-b-sm"><div class="pull-left text-ellipsis p-b-xs" style="width:100%;">' + event.title + '</div></div>' + '<div class="line b-b b-light"></div>' + '<div><i class="icon-clock text-muted m-r-xs"></i>' + event.start
									.format('dd-mmm-yyyy HH:MM') + '<div class="pull-right" style="width:10%;"></div></div>' + '<div class="text-ellipsis">' + reletedContacts + '</div>' + '<div class="text-ellipsis">' + meeting_type + '</div>' + '</div>' + '</div>';
								$(this).append(popoverElement);
							}
							if(event.start.getDay()==4 || event.start.getDay()==5 || event.start.getDay()==6){
								$(this).find('.fc-overlay').css('left','-180px');
								$(this).find('.fc-overlay').find('.arrow').css('left','91%');
							}
							if(reletedContacts!='' || meeting_type!=''){
								$(this).find('.fc-overlay').css('top','-95px');
								$(this).find('.fc-overlay').find('.arrow').css('top','84px');
							}
							if(reletedContacts!='' && meeting_type!=''){
								$(this).find('.fc-overlay').css('top','-108px');
								$(this).find('.fc-overlay').find('.arrow').css('top','98px');
							}
							$(this).find('.fc-overlay').show();
						},
						eventMouseout : function(event, jsEvent, view)
						{
							el.parent().css('z-index',2);
							$(this).find('.fc-overlay').hide();
							$(this).find('.fc-overlay').remove();
						},
								
								dayClick : function(date,allDay,jsEvent,view){
									//createCookie("current_date_calendar", date);
									App_Portlets.refetchEvents = false;
									var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
									var current_date = new Date();
									if(date.getFullYear()==current_date.getFullYear() && date.getMonth()==current_date.getMonth() && date.getDate()==current_date.getDate()){
										$(el).find('.events_show').empty().append('<div class="show p-t-xs text-md text-center">Today</div><ul class="list"></ul>');
									}else{
										$(el).find('.events_show').empty().append('<div class="show p-t-xs text-md text-center">'+days[date.getDay()]+', ' +date.format('dd mmm')+' </div><ul class="list"></ul>');
									}
									if($(el).parent().attr('data-sizey')==2)
											   $(el).find('.show').css('padding-top','70px');
										   else if($(el).parent().attr('data-sizey')==3)
											   $(el).find('.show').css('padding-top','120px');
									var endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
									var array= $('#calendar_container',el).fullCalendar('clientEvents', function(event) {
										return (event.start >= date && event.start < endDate);
								});
								if(array.length!=0){
								$.each(array,function(index){
									var len=$(el).find('.list').find('li').length;
												if(len!=0){
												$(el).find('.list').find('small').each(function(x) 
												{
													if(array[index].start.format('HH:MM')<$(this).text())
													{$(this).parents('li').before('<li class="p-t-xs p-r-xs" style="color : '+array[index].color+'"><span style="color : #58666e" class="text-cap word-break"><a class="minical-portlet-event" id='+array[index].id+' data-date='+date.getTime()+'>'+array[index].title+'</a><br><small class="block m-t-n-xxs">'+ array[index].start.format('HH:MM') + ' </small></span></li>');
													return false;}
													
													if(x==len-1)
														$(this).parents('.list').append('<li class="p-t-xs p-r-xs" style="color : '+array[index].color+'"><span style="color : #58666e" class="text-cap word-break"><a class="minical-portlet-event" id='+array[index].id+' data-date='+date.getTime()+'>'+array[index].title+'</a><br><small class="block m-t-n-xxs">'+ array[index].start.format('HH:MM') + ' </small></span></li>');
												 });
									}
									else
									$(el).find('.list').append('<li class="p-t-xs p-r-xs" style="color : '+array[index].color+'"><span style="color : #58666e" class="text-cap word-break"><a class="minical-portlet-event" id='+array[index].id+' data-date='+date.getTime()+'>'+array[index].title+'</a><br><small class="block m-t-n-xxs">'+ array[index].start.format('HH:MM') + ' </small></span></li>');
									
								});
								}
								else if(!App_Portlets.refetchEvents){
									$(el).find('.events_show').append('<div class="portlet-calendar-error-message">No appointments for the day</div><div class="text-center"><a class="minical-portlet-event-add text-info" id='+date.getTime()+' data-date='+date.getTime()+'>+Add</a></div>');
								}
								}
							    	
						}); 

							
}

function loadingGoogleEvents(el,startTime,endTime){
	
	$.getJSON('core/api/calendar-prefs/get', function(response)
	{
		if(response==undefined)
		{
			setTimeout(function(){
				if($(el).find('.list').find('li').length==0 && $(el).find('.portlet-calendar-error-message').length==0)
											{
												var date=new Date();
												$(el).find('.events_show').append('<div class="portlet-calendar-error-message">No appointments for the day</div><div class="text-center"><a class="minical-portlet-event-add text-info" id='+date.getTime()+' data-date='+date.getTime()+'>+Add</a></div>');
											}
			},10000);
			eraseCookie('current_date_calendar');
		}
		console.log(response);
		if (response)
		{
			if(typeof gapi != "undefined" && isDefined(gapi) && isDefined(gapi.client) && isDefined(gapi.client.calendar)) 
			{googledata(el,response,startTime,endTime);
				return;
			}
		

			head.js('https://apis.google.com/js/client.js', '/lib/calendar/gapi-helper.js', function()
			{
				setupGC(function()
				{

					googledata(el,response,startTime,endTime);
					return;
				});
			});
		}
	});
	
}

function init_cal(el){
	var fc = $.fullCalendar;
	fc.sourceFetchers = [];
	// Transforms the event sources to Google Calendar Events
	fc.sourceFetchers.push(function(sourceOptions, start, end) {
		if (sourceOptions.dataType == 'agile-events')
		 loadingGoogleEvents(el,start.getTime()/1000,end.getTime()/1000);
	});
	
}

function googledata(el,response,startTime,endTime)
{
	gapi.auth.setToken({ access_token : response.access_token, state : "https://www.googleapis.com/auth/calendar" });

					var current_date = new Date();
					var timezone_offset = current_date.getTimezoneOffset();
					var startDate = new Date((startTime * 1000)-(timezone_offset*60*1000));
       				var gDateStart = startDate.toISOString();
       				var endDate = new Date((endTime * 1000)-(timezone_offset*60*1000));
       				var gDateEnd = endDate.toISOString();
					// Retrieve the events from primary
					var request = gapi.client.calendar.events
								.list({ 'calendarId' : 'primary', maxResults : 25, singleEvents : true, orderBy : 'startTime', timeMin : gDateStart, timeMax : gDateEnd });
						request.execute(function(resp)
						{
							var events = new Array();
							console.log(resp);
							for (var j = 0; j < resp.items.length; j++)
							{
								var fc_event = google2fcEvent(resp.items[j]);
								  fc_event.startDate=new Date(fc_event.start);
								  fc_event.end=new Date(fc_event.end);
								  fc_event.color='#3a3f51';
								  fc_event.backgroundColor='#3a3f51';
								   if(fc_event.allDay==true){
									  fc_event.start = new Date(fc_event.startDate.getTime()+fc_event.startDate.getTimezoneOffset()*60*1000);
									  fc_event.end= new Date(new Date(fc_event.google.end.date).getTime()+fc_event.startDate.getTimezoneOffset()*60*1000);
									  var a=(fc_event.end.getMonth()-fc_event.startDate.getMonth())+(fc_event.end.getDate()-fc_event.start.getDate());
									  if(a==1){
										  fc_event.start=fc_event.start.getTime()/1000;
										  fc_event.end=(fc_event.end.getTime()-1)/1000;
										  $('#calendar_container',el).fullCalendar('renderEvent',fc_event);
											events.push(fc_event);
									  }
									  else{
													for(var i=0;i<a;i++){
														var new_json={};
														new_json=JSON.parse(JSON.stringify(fc_event));
													if(i==0){
														new_json.start=fc_event.start.getTime()/1000;
														new_json.end=new Date(fc_event.start.getFullYear(),fc_event.startDate.getMonth(),fc_event.startDate.getDate()+i,23,59,59).getTime()/1000;
														}
													else if(i<a){		
														new_json.start=new Date(fc_event.start.getFullYear(),fc_event.start.getMonth(),fc_event.start.getDate()+i,00,00,00).getTime()/1000;
														new_json.end=new Date(fc_event.start.getFullYear(),fc_event.start.getMonth(),fc_event.start.getDate()+i,23,59,59).getTime()/1000;
														}
													else{
														new_json.start=new Date(fc_event.start.getFullYear(),fc_event.start.getMonth(),fc_event.start.getDate()+i,00,00,00).getTime()/1000;
														new_json.end=fc_event.end.getTime()/1000;
														}
														console.log(new_json);
														$('#calendar_container',el).fullCalendar('renderEvent',new_json);
														events.push(new_json);
													}
												}
									  
								  } 
								  else{
								//var a=Math.round((fc_event.end-fc_event.start)/(1000*60*60*24));
								var a=(fc_event.end.getMonth()-fc_event.startDate.getMonth())+(fc_event.end.getDate()-fc_event.startDate.getDate());
											
												if(a==0){
													fc_event.start=fc_event.startDate.getTime()/1000;
													fc_event.end=fc_event.end.getTime()/1000;
													$('#calendar_container',el).fullCalendar('renderEvent',fc_event);
													events.push(fc_event);
												}
												else{
													for(var i=0;i<=a;i++){
														var new_json={};
														new_json=JSON.parse(JSON.stringify(fc_event));
													if(i==0){
														new_json.start=fc_event.startDate.getTime()/1000;
														new_json.end=new Date(fc_event.startDate.getFullYear(),fc_event.startDate.getMonth(),fc_event.startDate.getDate()+i,23,59,59).getTime()/1000;
														}
													else if(i<a){		
														new_json.start=new Date(fc_event.startDate.getFullYear(),fc_event.startDate.getMonth(),fc_event.startDate.getDate()+i,00,00,00).getTime()/1000;
														new_json.end=new Date(fc_event.startDate.getFullYear(),fc_event.startDate.getMonth(),fc_event.startDate.getDate()+i,23,59,59).getTime()/1000;
														}
													else{
														new_json.start=new Date(fc_event.startDate.getFullYear(),fc_event.startDate.getMonth(),fc_event.startDate.getDate()+i,00,00,00).getTime()/1000;
														new_json.end=fc_event.end.getTime()/1000;
														}
														console.log(new_json);
														$('#calendar_container',el).fullCalendar('renderEvent',new_json);
														events.push(new_json);
													}
												}
								  }
								

							}
							var len=$(".events_show").find('.list').find('li').length;
							var date=new Date();
							 $.each(events,function(index,ev){
											 var todayDate=new Date(date.getFullYear(), date.getMonth(), date.getDate(),00,00,00);
									   var endDate=new Date(date.getFullYear(), date.getMonth(), date.getDate(),23,59,59);
									   
									   if(readCookie('current_date_calendar')!=null)
											{
												var cookie_date=new Date(readCookie('current_date_calendar'));
												todayDate=cookie_date;
												endDate=new Date(cookie_date.getFullYear(), cookie_date.getMonth(), cookie_date.getDate(),23,59,59);
												
											}
											if(ev.start.getTime() >= (todayDate.getTime()) && ev.start.getTime() <= (endDate.getTime())) {	
											if(len!=0){
												$(el).find('.list').find('small').each(function( index ) 
												{
													if(ev.start.format('HH:MM')<$(this).text())
													{$(this).parents('li').before('<li class="p-t-xs p-r-xs" style="color:'+ev.color+'"><span style="color : #58666e" class="text-cap word-break"><a class="minical-portlet-event" id='+ev.id+' data-date='+date.getTime()+'>'+ev.title+'</a><br><small class="block m-t-n-xxs">'+ ev.start.format('HH:MM') + ' </small></span></li>');
													return false;}
													/* else
													$(this).parents('li').after('<li class="p-t-xs p-r-xs" style="color:'+ev.color+'"><span style="color : #58666e" class="text-cap word-break"><a class="minical-portlet-event" id='+ev.id+' data='+ev+'>'+ev.title+'</a><br><small class="block m-t-n-xxs">'+ ev.start.format('HH:MM') + ' </small></span></li>') ;
												 */
												 });
											}
											else
											 $(el).find('.list').append('<li class="p-t-xs p-r-xs" style="color:'+ev.color+'"><span style="color : #58666e" class="text-cap word-break"><a class="minical-portlet-event" id='+ev.id+' data-date='+date.getTime()+'>'+ev.title+'</a><br><small class="block m-t-n-xxs">'+ ev.start.format('HH:MM') + ' </small></span></li>');
											}
											});
											eraseCookie('current_date_calendar');
											setTimeout(function(){
												//eraseCookie('current_date_calendar');
											if($(el).find('.list').find('li').length==0 && $(el).find('.portlet-calendar-error-message').length==0)
											{
												$(el).find('.events_show').append('<div class="portlet-calendar-error-message">No appointments for the day</div><div class="text-center"><a class="minical-portlet-event-add text-info" id='+date.getTime()+' data-date='+date.getTime()+'>+Add</a></div>');
											}
											},10000);
											
							
						});
}

/*
* 
*/
function getaspectratio(el)
{
	var width;
	var height;
	if($(el).parent().attr('data-sizex')==1)
	{
		$(el).find('#calendar_container').css("padding","0px");
		width=$(el).find('#calendar_container').width();
		if($(el).parent().attr('data-sizey')==1)
		height=$(el).height()-25;
		else if($(el).parent().attr('data-sizey')==2)
				height=$(el).height()-200;
			else
				height=$(el).height()-350;
	}
	if($(el).parent().attr('data-sizex')==2)
	{
		$(el).find('#calendar_container').css("padding","0px 50px 0px");
		width=$(el).find('#calendar_container').width();
		if($(el).parent().attr('data-sizey')==1)
		height=$(el).height()-25;
		else if($(el).parent().attr('data-sizey')==2)
				height=$(el).height()-200;
			else
				height=$(el).height()-350;
	}
	if($(el).parent().attr('data-sizex')==3)
	{
		$(el).find('#calendar_container').css("padding","0px 100px 0px");
		width=$(el).find('#calendar_container').width();
		if($(el).parent().attr('data-sizey')==1)
		height=$(el).height()-25;//width=$(el).find('#calendar_container').width()
		else if($(el).parent().attr('data-sizey')==2)
				height=$(el).height()-200;
			else
				height=$(el).height()-350
	}
	return (width/height);
}

