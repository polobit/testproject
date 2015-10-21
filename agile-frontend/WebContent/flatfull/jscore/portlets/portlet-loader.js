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

	App_Portlets.adminPortlets = new Array();

	/*
	 * If Portlets_View is not defined , creates collection view, collection is
	 * sorted based on position i.e., set when sorted using jquery ui sortable
	 */
	
	// This flag is used to ensure portlet script are loaded only once in
	// postrender. It is set to false after portlet setup is initialized
	Portlets_View = new Base_Collection_View({ url : '/core/api/portlets', sortKey : "row_position",sort_collection : false, restKey : "portlet", templateKey : "portlets", individual_tag_name : 'div',
		postRenderCallback : function(portlets_el){
			set_up_portlets(el, portlets_el);
				if(App_Portlets.adminPortlets.length!=0)
				{
					var models = [];
					$.each( App_Portlets.adminPortlets, function(index,model) {

					var obj={};
					var next_position = gridster.next_position(1, 1);
				obj.column_position = next_position.col;
				obj.row_position = next_position.row;
				
				model.set({ 'column_position' : obj.column_position}, { silent : true });
					model.set({ 'row_position' : obj.row_position  }, { silent : true });
					model.set({'isForAll' : false});
					set_p_portlets(model);
					//set_up_portlets(el, portlets_el);
					models.push({ id : model.get("id"), column_position : obj.column_position, row_position : obj.row_position,isForAll : false });
			
				});
				$.ajax({ type : 'POST', url : '/core/api/portlets/positions', data : JSON.stringify(models),
					contentType : "application/json; charset=utf-8", dataType : 'json' });
				}
				App_Portlets.adminPortlets=new Array();
				if(Portlets_View.collection.length==0)
					$('.gridster > div:visible > div',el).removeClass('gs-w');
			
			initializePortletsListeners();

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
				$.ajax({ type : 'POST', url : '/core/api/portlets/save-width-height', data : JSON.stringify(models),
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
