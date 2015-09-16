var Portlets_View, gridster;

/** If CURRENT_AGILE_USER is not set, set it from user.domain **/
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
 * set the portlets size and position on dashboard 
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
					var height=$('#'+this.$resized_widget.attr('id')).height();

					if(height<=200)
					{
						$(el).find('.fc-header').css('height','25px');
						$(el).parent().find('.show').css('padding-top','5px');
					}
					else if(height>200 && height<=450 )
					{
						$(el).find('.fc-header').css('height','145px');
						$(el).find('.show').css('padding-top','70px');
					}
					else
					{
						$(el).find('.fc-header').css('height','250px');
						$(el).find('.show').css('padding-top','120px');
					}

					var css = {"height" : height+"px", "max-height" : height+"px"};

					$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css(css);
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
						var aspectratio, height = this.$resized_widget.attr('data-sizey');


	        			if(height==1){
	        				height = height*200;

							$(el).find('.fc-header').css('height','25px');
							$(el).find('.show').css('padding-top','5px');
							 
							
							
						}else if(height==2){
							height = height*200+25;

							$(el).find('.fc-header').css('height','145px');
							$(el).find('.show').css('padding-top','70px');
							
							
						}
						else if(height==3){
							height = height*200+50;

							$(el).find('.fc-header').css('height','250px');
							$(el).find('.show').css('padding-top','120px');
							
							
							
						}

						var css = {"height" : height+"px", "max-height" : height+"px"};

						$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css(css);
						$('#calendar_container').fullCalendar('option','aspectRatio',getaspectratio(el));	
						
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

    $(window).resize(function()
    {
    	if(gridster!=undefined)
    		$('.gridster-portlets').css("height","auto");

    	if($(window).width()<768 && gridster!=undefined){
    		gridster.disable();
    		gridster.disable_resize();
    	}
    	else if(gridster!=undefined)
    	{
    		gridster.enable();
    		gridster.enable_resize();
    		gridster.set_dom_grid_height();
    	}

		if($(window).width()<975 && $(window).width()>768 && $('.portlet_body_calendar').is(':visible'))
		{
				$('.portlet_body_calendar').each(function(){
				$(this).find('#calendar_container').find('.fc-widget-header').each(function(){
				$(this).text($(this).text().substring(0, 1));
				});
			});
		}
		else if($(window).width()>975 && $('.portlet_body_calendar').is(':visible'))
		{
				$('.portlet_body_calendar').each(function()
				{
					var weeksArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
					$(this).find('#calendar_container').find('.fc-widget-header').each(function(index)
					{
						$(this).text(weeksArray[index]);
					});
				});
		}
    });

    if($(window).width()<768 && gridster!=undefined){
		gridster.disable();
		gridster.disable_resize();
	}
	else if(gridster!=undefined){
		gridster.enable();
		gridster.enable_resize();
	}

    $(window).trigger('resize');
}

/**To hide the modal popup after the portlet setting is saved**/
function hidePortletSettingsAfterSave(modal_id){

	var modal=$('#'+modal_id+ '> .modal-dialog > .modal-content > .modal-footer > a');
	modal.text('Save');
	modal.attr('disabled',false);
	$('#'+modal_id).modal('hide');
	$('.modal-backdrop').hide();
}

/** Listener function for Event handling**/
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

	if(flag)
	{
		model.save(portlet.toJSON(), 
		{
	        success: function (data) 
	        {

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
				}
				else if($('#tasks-task-report').val()=="all-tasks"){
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
	var taskreportStatus=$('#split-by-task-report > option#status');
	if($('#tasks-task-report').val()=="completed-tasks"){	
		if(taskreportStatus.is(':selected'))
			taskreportStatus.attr("selected",false);
		taskreportStatus.hide();
	}
	else
		taskreportStatus.show();
});

$('.gridster-portlets').off("mouseover").on('mouseover', '.stats_report_portlet_body', function(e) {
	if($('.stats_report_portlet_body').parent().find('.gs-resize-handle'))
	{
		$('.stats_report_portlet_body').parent().find('.gs-resize-handle').remove();
	}
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

$('.events_show').on('click','.minical-portlet-event-add',function(e)
{
	// Shows a new event
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
					$('#event-time-1').val('');
					$('#event-time-2').val('');						
  });

}

/** Initializes and fetched latest feeds from AgileCRM blosspot.**/
function initBlogPortletSync(el)
{
	head.js(LIB_PATH + 'lib/jquery.feeds.min.js',
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
							}
						});
		});

}

$('body').on('click', '.onboarding-skip', function(e) {
	var parent_el=$(this).parent();

	parent_el.find('span').css("text-decoration","line-through");

	if(!parent_el.find('small').hasClass('onboarding-undo'))
		parent_el.find('span').after("<small class='p-l-sm onboarding-undo c-p'>(undo)</small>");
	$(this).remove();
});

$('body').on('click', '.onboarding-undo', function(e) {
	var parent_el=$(this).parent();

	parent_el.find('span').css("text-decoration","none");
	parent_el.find('label').remove();
	parent_el.find('span').before("<label class='i-checks i-checks-sm onboarding-check' style='padding-right:4px;'><input type='checkbox'><i></i></label>");
	
	if(!parent_el.find('small').hasClass('onboarding-skip'))
		parent_el.find('span').after("<small class='p-l-sm onboarding-skip c-p'>(skip)</small>");
	$(this).remove();
});

/** Loads the default image for owner if no image is present **/
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

/** Loading google events for Events Portet**/
function loadGoogleEventsForPortlets(p_el,startTime,endTime){
	$.getJSON('core/api/calendar-prefs/get', function(response)
	{
		var events = new Array();
		console.log(response);
		if (response)
		{

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
