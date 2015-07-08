
var Portlets_View;
var portlet_template_loaded_map = {};

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
	/*
	 * If Portlets_View is not defined , creates collection view, collection is
	 * sorted based on position i.e., set when sorted using jquery ui sortable
	 */
	if (!Portlets_View){
		head.load(FLAT_FULL_UI + "css/misc/agile-portlet.css" + "?_=" + _AGILE_VERSION);
		// This flag is used to ensure portlet script are loaded only once in
		// postrender. It is set to false after portlet setup is initialized
		is_portlet_view_new = true;
		Portlets_View = new Base_Collection_View({ url : '/core/api/portlets', sortKey : "row_position",sort_collection : false, restKey : "portlet", templateKey : "portlets", individual_tag_name : 'div',
			postRenderCallback : function(portlets_el){
				head.load(FLAT_FULL_UI + "css/jquery.gridster.css", function(){
					// If scripts aren't loaded earlier, setup is initialized
					set_up_portlets(el, portlets_el);
					if(Portlets_View.collection.length==0)
						$('.gridster > div:visible > div',el).removeClass('gs-w');
				});
			} });
		this.Portlets_View.appendItem = set_p_portlets;

		/*
		 * Fetch portlets from collection and set_up_portlets (load their scripts)
		 */
		Portlets_View.collection.fetch();

		// show portlets
		var newEl = Portlets_View.render().el;
		$('#portlets', el).html(newEl);
		/*setTimeout(function(){
			$('#portlets-opportunities-model-list').removeClass('agile-edit-row');
			$('#portlets-tasks-model-list').removeClass('agile-edit-row');
			$('#portlets-events-model-list').removeClass('agile-edit-row');
		},1000);*/
	}else{
		
		this.Portlets_View.appendItem = set_p_portlets;

		/*
		 * Fetch portlets from collection and set_up_portlets (load their scripts)
		 */
		Portlets_View.collection.fetch();

		// show portlets
		var newEl = Portlets_View.render().el;
		
		$('#portlets', el).html(newEl);
		
	}
}
var gridster;
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
        	ignore_dragging: [".portlet_body",".portlet_body *",".portlet-panel",".portlet-panel *"],
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
				if($('#'+this.$resized_widget.attr('id')).height()<=200){
			$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("height","200px");
			$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("max-height","200px");
			}else{
			$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("height",$('#'+this.$resized_widget.attr('id')).height()+"px");
			$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("max-height",$('#'+this.$resized_widget.attr('id')).height()+"px");
		}
				var el=this.$resized_widget.find('#calendar_container');
				var aspectRatio=get_calendar_width(el)/(get_calendar_height(el)-24);
									  $(el).fullCalendar('option','aspectRatio',aspectRatio);
				var top=parseInt($(el).find('.fc-widget-content').css('height'))/2-7;
						$(el).find('.fc-day-number').css('top',top);
				}	
			},
        	stop: function(event,ui){
        		
        		//for resizing portlet body
                /*if($('#'+this.$resized_widget.attr('id')).height()<=200){
        			$('#'+this.$resized_widget.attr('id')+' > .portlet_body').css("height","155px");
        			$('#'+this.$resized_widget.attr('id')+' > .portlet_body').css("max-height","155px");
        		}else{
        			$('#'+this.$resized_widget.attr('id')+' > .portlet_body').css("height",this.$resize_preview_holder.height()-45+"px");
        			$('#'+this.$resized_widget.attr('id')+' > .portlet_body').css("max-height",this.$resize_preview_holder.height()-45+"px");
        		}*/
        		$(window).trigger('resize');
        		
        		$('#'+this.$resized_widget.attr('id')+' > div.portlet_body').css('overflow-x','hidden').css('overflow-y','auto');
				//$('#'+this.$resized_widget.attr('id')+' > div.portlet_body_calendar').css('overflow-x','hidden').css('overflow-y','auto');
				
					
        		var tempModel = Portlets_View.collection.get($('#'+this.$resized_widget.attr('id')+' > div.portlets').attr('id'));
        		
        		var that = this;
        		if(tempModel.get("name")=="Leaderboard"){
        			/*$('#'+this.$resized_widget.attr('id')+' > .portlet_body').find('ul').find('li').each(function(indexVal){
        				if($('#'+that.$resized_widget.attr('id')+' > .portlet_body').find('ul').find('li').length-1==indexVal)
        					$('#'+that.$resized_widget.attr('id')+' > .portlet_header').find('ul').find('li').eq(indexVal).width($(this).width());
        				else
        					$('#'+that.$resized_widget.attr('id')+' > .portlet_header').find('ul').find('li').eq(indexVal).width($(this).width());
        			});*/
					/*var scrollbarWidth = $('#'+this.$resized_widget.attr('id')+' > .portlet_body').width()-$('#'+this.$resized_widget.attr('id')+' > .portlet_body').find('ul').width();
					if(scrollbarWidth!=0)
						$('#'+this.$resized_widget.attr('id')+' > .portlet_header').width($('#'+this.$resized_widget.attr('id')+' > .portlet_header').width()-scrollbarWidth);
					else
						$('#'+this.$resized_widget.attr('id')+' > .portlet_header').css("width","100%");*/
					$('#'+this.$resized_widget.attr('id')+' > .portlet_header').find('ul').width(($('#'+this.$resized_widget.attr('id')+' > .portlet_body').find('ul').width()/$('#'+this.$resized_widget.attr('id')+' > .portlet_body').width()*100)+'%');
        		}
        		else if(tempModel.get("name")=="Mini Calendar")
        			{
        			if(this.$resized_widget.attr('data-sizey')==1){
        			$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("height",this.$resized_widget.attr('data-sizey')*200+"px");
        			$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("max-height",this.$resized_widget.attr('data-sizey')*200+"px");
        		}else if(this.$resized_widget.attr('data-sizey')==2){
        			$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("height",this.$resized_widget.attr('data-sizey')*200+25+"px");
        			$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("max-height",this.$resized_widget.attr('data-sizey')*200+25+"px");
        		}
				else if(this.$resized_widget.attr('data-sizey')==3){
				$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("height",this.$resized_widget.attr('data-sizey')*200+50+"px");
        			$('#'+this.$resized_widget.attr('id')+' > .portlet_body_calendar').css("max-height",this.$resized_widget.attr('data-sizey')*200+50+"px");	
				}
				//$('#'+this.$resized_widget.attr('id')+' > div.portlet_body_calendar').css('overflow-x','auto');
				//$('#'+this.$resized_widget.attr('id')+' > div.portlet_body_calendar').css('overflow-y','auto')
				var el=this.$resized_widget.find('#calendar_container');
				var aspectRatio=get_calendar_width(el)/(get_calendar_height(el)-24);
									  $(el).fullCalendar('option','aspectRatio',aspectRatio);
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
    });
    if($(window).width()<768 && gridster!=undefined){
		gridster.disable();
		gridster.disable_resize();
	}else if(gridster!=undefined){
		gridster.enable();
		gridster.enable_resize();
	}
    $(window).trigger('resize');
  
	//enablePortletSorting(portlets_el);
}
/**
 * Shrink the portlet header name width
 * 
 * <p>
 * Shows the icons and decrease the width of portlet header to avoid the portlet
 * name overflow on mouse hover
 * 
 * @param el
 *            Element on which mouse entered (portlet header)
 */
function showPortletIcons(el){
	// Shows portlet icons on mouse hover
	$(el).find('div.portlet_header_icons').removeClass('vis-hide');

	// Changes width of portlet name
	//$(el).find('div.portlet_header_name').css({ "width" : "65%" });

	//Hide the leaderboard small text content in header part
	$(el).find('.portlet-header-small-text').hide();
}
/**
 * Expand the portlet header name width.
 * 
 * <p>
 * Hide the icons and use the remaining width in portlet header name DIV on mouse
 * leave
 * </p>
 * 
 * @param el
 *            Element on which mouse left (portlet header)
 */
function hidePortletIcons(el)
{
	// Hide portlet icons on mouse hover
	$(el).find('div.portlet_header_icons').addClass('vis-hide');

	// Changes width of portlet name
	//$(el).find('div.portlet_header_name').css({ "width" : "80%" });

	//Show the leaderboard small text content in header part
	$(el).find('.portlet-header-small-text').show();
}
function enablePortletSorting(el){
	// Loads jquery-ui to get sortable functionality on portlets
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function(){
		/*$('.portlet-column').sortable({
			connectWith: '.portlet-column',
			iframeFix: false,
			items:'div.portlet_container',
			opacity:0.8,
			helper:'original',
			revert:true,
			forceHelperSize:true,
			placeholder: 'portlet-ui-sortable-placeholder portlet-round-all',
			forcePlaceholderSize:true,
			tolerance:'pointer'
		});*/
		/*
		 * This event is called after sorting stops to save new positions of
		 * portlets
		 */
		$('.row-fluid', el).on(
				"sortstop",
				function(event, ui){
					var models = [];

					/*
					 * Iterate through each all the portlets and set each portlet
					 * position and store it in array
					 */
					$('#portlet-res').children().each(function(column){
						$(this).children().each(function(row){
							var model_id = $(this).find('.portlets').attr('id');
							
							var model = Portlets_View.collection.get(model_id);

							model.set({ 'column_position' : column+1 }, { silent : true });
							
							model.set({ 'row_position' : row+1 }, { silent : true });

							models.push({ id : model.get("id"), column_position : column+1, row_position : row+1 });
						});
					});

					// Saves new positions in server
					$.ajax({ type : 'POST', url : '/core/api/portlets/positions', data : JSON.stringify(models),
						contentType : "application/json; charset=utf-8", dataType : 'json' });
				});
	});
}
function showPortletSettings(el){
	var elData;
	var base_model = Portlets_View.collection.get(el.split("-settings")[0]);
	
	//Hide previous error messages
	$('.help-inline').hide();
	
	if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Filter Based"){
		$('#portletsContactsFilterBasedSettingsModal').modal('show');
		$('#portletsContactsFilterBasedSettingsModal > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletsContactsFilterBasedSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletsContactsFilterBasedSettingsModal')).val(base_model.get('name'));
		
		elData = $('#portletsContactsFilterBasedSettingsForm');
		
		var options ='<option value="">Select...</option>'
			+'<option value="contacts">All Contacts</option>'
			+'<option value="myContacts">My Contacts</option>';
		$.ajax({ type : 'GET', url : '/core/api/filters', async : false, dataType : 'json',
			success: function(data){
				$.each(data,function(index,contactFilter){
					options+="<option value="+contactFilter.id+">"+contactFilter.name+"</option>";
				});
				$('#filter', elData).html(options);
				$("#filter", elData).find('option[value='+ base_model.get("settings").filter +']').attr("selected", "selected");
				$('.loading-img').hide();
			} });
	}else if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Emails Opened"){
		$('#portletsContactsEmailsOpenedSettingsModal').modal('show');
		$('#portletsContactsEmailsOpenedSettingsModal > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletsContactsEmailsOpenedSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletsContactsEmailsOpenedSettingsModal')).val(base_model.get('name'));
		
		elData = $('#portletsContactsEmailsOpenedSettingsForm');
		$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
	}else if(base_model.get('portlet_type')=="USERACTIVITY" && base_model.get('name')=="Emails Sent"){
		$('#portletsContactsEmailsSentSettingsModal').modal('show');
		$('#portletsContactsEmailsSentSettingsModal > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletsContactsEmailsSentSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletsContactsEmailsSentSettingsModal')).val(base_model.get('name'));
		
		elData = $('#portletsContactsEmailsSentSettingsForm');
		$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
	}else if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Growth Graph"){
		$('#portlet-ul-tags > li').remove();
		$('#cancel-modal').attr('disabled',false);
		
		$('#portletsContactsGrowthGraphSettingsModal').modal('show');
		$('#portletsContactsGrowthGraphSettingsModal > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletsContactsGrowthGraphSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletsContactsGrowthGraphSettingsModal')).val(base_model.get('name'));
		
		elData = $('#portletsContactsGrowthGraphSettingsForm');
		
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
		//var range=""+(new Date(parseInt(base_model.get("settings")["start-date"])).format('mmmm d, yyyy'))+" - "+(new Date(parseInt(base_model.get("settings")["end-date"])).format('mmmm d, yyyy'));
		//$('#portlet-reportrange span').html(range);
		//$('#start-date').val(base_model.get("settings")["start-date"]);
		//$('#end-date').val(base_model.get("settings")["end-date"]);
		$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Pending Deals"){
		$('#portletsPendingDealsSettingsModal').modal('show');
		$('#portletsPendingDealsSettingsModal > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletsPendingDealsSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletsPendingDealsSettingsModal')).val(base_model.get('name'));
		
		elData = $('#portletsPendingDealsSettingsForm');
		$("#deals", elData).find('option[value='+ base_model.get("settings").deals +']').attr("selected", "selected");
		//$("#due-date", elData).val(new Date(base_model.get("settings")["due-date"]*1000).format('mm/dd/yyyy'));
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals By Milestone"){
		$('#portletsDealsByMilestoneSettingsModal').modal('show');
		$('#portletsDealsByMilestoneSettingsModal > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletsDealsByMilestoneSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletsDealsByMilestoneSettingsModal')).val(base_model.get('name'));
		
		elData = $('#portletsDealsByMilestoneSettingsForm');
		var url='/core/api/portlets/portletDealsByMilestone?deals='+base_model.get('settings').deals+'&track='+base_model.get('settings').track;
		if(App_Portlets.track_length!=undefined && App_Portlets.track_length>1)
			$('#portletsDealsByMilestoneTrack',elData).show();
		
		var tracks = [];
		if(App_Portlets.deal_tracks!=undefined && App_Portlets.deal_tracks!=null)
			tracks = App_Portlets.deal_tracks;
		else{
			$.ajax({ type : 'GET', url : '/core/api/milestone/pipelines', async : false, dataType : 'json',
				success: function(data){
					App_Portlets.track_length = data.length;
					App_Portlets.deal_tracks = data;
					tracks = App_Portlets.deal_tracks;
				} });
		}
		
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
		//$("#due-date", elData).val(new Date(base_model.get("settings")["due-date"]*1000).format('mm/dd/yyyy'));
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Closures Per Person"){
		$('#portletsDealsClosuresPerPersonSettingsModal').modal('show');
		$('#portletsDealsClosuresPerPersonSettingsModal > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletsDealsClosuresPerPersonSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletsDealsClosuresPerPersonSettingsModal')).val(base_model.get('name'));
		
		elData = $('#portletsDealsClosuresPerPersonSettingsForm');
		$("#group-by", elData).find('option[value='+ base_model.get("settings")["group-by"] +']').attr("selected", "selected");
		$("#due-date", elData).val(getDateInFormatFromEpoc(base_model.get("settings")["due-date"]));
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals Won"){
		$('#portletsDealsWonSettingsModal').modal('show');
		$('#portletsDealsWonSettingsModal > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletsDealsWonSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletsDealsWonSettingsModal')).val(base_model.get('name'));
		
		elData = $('#portletsDealsWonSettingsForm');
		$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals Funnel"){
		$('#portletsDealsFunnelSettingsModal').modal('show');
		$('#portletsDealsFunnelSettingsModal > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletsDealsFunnelSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletsDealsFunnelSettingsModal')).val(base_model.get('name'));
		
		elData = $('#portletsDealsFunnelSettingsForm');
		var url='/core/api/portlets/portletDealsFunnel?deals='+base_model.get('settings').deals+'&track='+base_model.get('settings').track;
		if(App_Portlets.track_length!=undefined && App_Portlets.track_length>1)
			$('#portletsDealsFunnelTrack',elData).show();
		
		var tracks = [];
		if(App_Portlets.deal_tracks!=undefined && App_Portlets.deal_tracks!=null)
			tracks = App_Portlets.deal_tracks;
		else{
			$.ajax({ type : 'GET', url : '/core/api/milestone/pipelines', async : false, dataType : 'json',
				success: function(data){
					App_Portlets.track_length = data.length;
					App_Portlets.deal_tracks = data;
					tracks = App_Portlets.deal_tracks;
				} });
		}
		
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
		//$("#due-date", elData).val(new Date(base_model.get("settings")["due-date"]*1000).format('mm/dd/yyyy'));
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals Assigned"){
		$('#portletsDealsAssignedSettingsModal').modal('show');
		$('#portletsDealsAssignedSettingsModal > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletsDealsAssignedSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletsDealsAssignedSettingsModal')).val(base_model.get('name'));
		
		elData = $('#portletsDealsAssignedSettingsForm');
		$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
	}else if(base_model.get('portlet_type')=="USERACTIVITY" && base_model.get('name')=="Calls Per Person"){
		$('#portletsCallsPerPersonSettingsModal').modal('show');
		$('#portletsCallsPerPersonSettingsModal > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletsCallsPerPersonSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletsCallsPerPersonSettingsModal')).val(base_model.get('name'));
		
		elData = $('#portletsCallsPerPersonSettingsForm');
		$("#group-by", elData).find('option[value='+ base_model.get("settings")["group-by"] +']').attr("selected", "selected");
		$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
		
		if(base_model.get("settings")["calls-user-list"]!=undefined){
			var options ='';
			$.ajax({ type : 'GET', url : '/core/api/users', async : false, dataType : 'json',
				success: function(data){
					$.each(data,function(index,domainUser){
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
			$.ajax({ type : 'GET', url : '/core/api/users', async : false, dataType : 'json',
				success: function(data){
					$.each(data,function(index,domainUser){
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
		
	}else if(base_model.get('portlet_type')=="TASKSANDEVENTS" && base_model.get('name')=="Task Report"){
		$('#portletsTaskReportSettingsModal').modal('show');
		$('#portletsTaskReportSettingsModal > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletsTaskReportSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletsTaskReportSettingsModal')).val(base_model.get('name'));
		
		elData = $('#portletsTaskReportSettingsForm');
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
			$.ajax({ type : 'GET', url : '/core/api/users', async : false, dataType : 'json',
				success: function(data){
					$.each(data,function(index,domainUser){
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
			$.ajax({ type : 'GET', url : '/core/api/users', async : false, dataType : 'json',
				success: function(data){
					$.each(data,function(index,domainUser){
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

	}else if(base_model.get('portlet_type')=="USERACTIVITY" && base_model.get('name')=="Stats Report"){
		$('#portletsStatsReportSettingsModal').modal('show');
		$('#portletsStatsReportSettingsModal > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletsStatsReportSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletsStatsReportSettingsModal')).val(base_model.get('name'));
		
		elData = $('#portletsStatsReportSettingsForm');
		$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
	}else if(base_model.get('portlet_type')=="TASKSANDEVENTS" && base_model.get('name')=="Agenda"){
		$('#portletsAgendaSettingsModal').modal('show');
		$('#portletsAgendaSettingsModal > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletsAgendaSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletsAgendaSettingsModal')).val(base_model.get('name'));
		
		elData = $('#portletsAgendaSettingsForm');
		$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
	}else if(base_model.get('portlet_type')=="TASKSANDEVENTS" && base_model.get('name')=="Today Tasks"){
		$('#portletsTodayTasksSettingsModal').modal('show');
		$('#portletsTodayTasksSettingsModal > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletsTodayTasksSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletsTodayTasksSettingsModal')).val(base_model.get('name'));
		
		elData = $('#portletsTodayTasksSettingsForm');
		$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
	}else if(base_model.get('portlet_type')=="USERACTIVITY" && base_model.get('name')=="Leaderboard"){
		$('#portletsLeaderboardSettingsModal').modal('show');
		$('#portletsLeaderboardSettingsModal > .modal-dialog > .modal-content > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletsLeaderboardSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletsLeaderboardSettingsModal')).val(base_model.get('name'));
		
		elData = $('#portletsLeaderboardSettingsForm');
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
			$.ajax({ type : 'GET', url : '/core/api/portlets/portletUsers', async : false, dataType : 'json',
				success: function(data){
					$.each(data,function(index,domainUser){
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
			$.ajax({ type : 'GET', url : '/core/api/portlets/portletUsers', async : false, dataType : 'json',
				success: function(data){
					$.each(data,function(index,domainUser){
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
	}
	
	if(base_model.get('name')=="Pending Deals" || base_model.get('name')=="Deals By Milestone" || base_model.get('name')=="Closures Per Person" || base_model.get('name')=="Deals Funnel"){
		$('#due-date', elData).datepicker({
			format : CURRENT_USER_PREFS.dateFormat
		});
	}	
}
function hidePortletSettings(el){
	$('#'+el.id.split("-cancel-modal")[0]+'-portlet-settings').modal('hide');
	//$('#'+el.id.split("-cancel-modal")[0]+'-backdrop').modal('hide');
}
function hidePortletSettingsAfterSave(modal_id){
	$('#'+modal_id+ '> .modal-dialog > .modal-content > .modal-footer > a').text('Save');
	$('#'+modal_id+ '> .modal-dialog > .modal-content > .modal-footer > a').attr('disabled',false);
	$('#'+modal_id).modal('hide');
	//$('#'+form_id).hide();
	$('.modal-backdrop').hide();
}
$('.portlet-minimize').die().live('click', function(e){
	e.preventDefault();
	var id = $(this).attr('id').split("-collapse")[0];

	$("#" + $(this).attr('id')).collapse('hide');
	$(this).removeClass();

	$(this).addClass('collapsed');
	$(this).addClass('portlet-maximize');
	$(this).addClass('icon-plus');

	// Get portlet from collection by portlet id
	var portlet = Portlets_View.collection.get(id);
	var portletJSON = portlet.toJSON();

	// set "is_minimized" field of portlet as true
	portlet.set({ 'is_minimized' : true }, { silent : true });
	portletJSON['is_minimized'] = true;

	// Get model and save portlet
	var model = new BaseModel();
	model.url = "core/api/portlets";
	model.save(portletJSON, { silent : true });
	
	$('#'+id).parent().find('.portlet_body').hide();
});
$('.portlet-maximize').die().live('click', function(e){
	e.preventDefault();
	var id = $(this).attr('id').split("-collapse")[0];

	$("#" + $(this).attr('id')).collapse('hide');
	$(this).removeClass();

	$(this).addClass('collapsed');
	$(this).addClass('portlet-minimize');
	$(this).addClass('icon-minus');

	// Get portlet from collection by portlet id
	var portlet = Portlets_View.collection.get(id);
	var portletJSON = portlet.toJSON();

	// set "is_minimized" field of portlet as true
	portlet.set({ 'is_minimized' : false }, { silent : true });
	portletJSON['is_minimized'] = false;

	// Get model and save portlet
	var model = new BaseModel();
	model.url = "core/api/portlets";
	model.save(portletJSON, { silent : true });
	
	$('#'+id).parent().find('.portlet_body').show();
});
$('.portlet-settings-save-modal').live('click', function(e){
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
	        	//$('#'+this.parentNode.parentNode.parentNode.id).replaceWith($(getTemplate('portlets-model', model)));
	        	var portletCollectionView;
	        	if(data.get('portlet_type')=="CONTACTS" && data.get('name')=="Filter Based"){
	        		if(data.get('settings').filter=="companies")
	        			App_Portlets.filteredCompanies[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletContacts?filter='+data.get('settings').filter+'&sortKey=-created_time', templateKey : 'portlets-companies', sort_collection : false, individual_tag_name : 'tr', sortKey : "-created_time" });
	        		else
	        			App_Portlets.filteredContacts[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletContacts?filter='+data.get('settings').filter+'&sortKey=-created_time', templateKey : 'portlets-contacts', sort_collection : false, individual_tag_name : 'tr', sortKey : "-created_time" });
	        	}
	        	
	        	else if(data.get('portlet_type')=="CONTACTS" && data.get('name')=="Emails Opened"){
	        		var start_date_str = '';
	        		var end_date_str = '';
	        		if(data.get('settings').duration=='yesterday'){
	        			start_date_str = ''+data.get('settings').duration;
	        			end_date_str = 'today';
	        		}else if(data.get('settings').duration=='this-week'){
						start_date_str = ''+data.get('settings').duration;
						end_date_str = 'this-week-end';
					}else if(data.get('settings').duration=='this-month'){
						start_date_str = ''+data.get('settings').duration;
						end_date_str = 'this-month-end';
					}else{
	        			start_date_str = ''+data.get('settings').duration;
	        			end_date_str = 'TOMORROW';
	        		}
	        		
	        		App_Portlets.emailsOpened[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletEmailsOpened?duration='+data.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str), templateKey : 'portlets-contacts-email-opens', sort_collection : false, individual_tag_name : 'tr', 
	        			postRenderCallback : function(p_el){
	        				displayTimeAgo(p_el);
	        			} });
	        	}else if(data.get('portlet_type')=="DEALS" && data.get('name')=="Pending Deals"){
	        		App_Portlets.pendingDeals[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletPendingDeals?deals='+data.get('settings').deals, templateKey : 'portlets-opportunities', sort_collection : false, individual_tag_name : 'tr',
	        			postRenderCallback : function(p_el){
	        				displayTimeAgo(p_el);
	        			} });
	        	}else if(data.get('portlet_type')=="DEALS" && data.get('name')=="Deals Won"){
	        		App_Portlets.dealsWon[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletDealsWon?duration='+data.get('settings').duration, templateKey : 'portlets-opportunities', individual_tag_name : 'tr',
	        			postRenderCallback : function(p_el){
	        				displayTimeAgo(p_el);
	        			} });
	        	}else if(data.get('portlet_type')=="TASKSANDEVENTS" && data.get('name')=="Agenda"){
	        		var start_date_str = '';
					var end_date_str = '';
					if(data.get('settings').duration=='next-7-days'){
						start_date_str = 'TOMORROW';
						end_date_str = ''+data.get('settings').duration;
					}else if(data.get('settings').duration=='today-and-tomorrow'){
						start_date_str = 'today';
						end_date_str = ''+data.get('settings').duration;
					}else if(data.get('settings').duration=='this-week'){
						start_date_str = ''+data.get('settings').duration;
						end_date_str = 'this-week-end';
					}else{
						start_date_str = ''+data.get('settings').duration;
						end_date_str = 'TOMORROW';
					}

	        		App_Portlets.todayEventsCollection[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletAgenda?duration='+data.get('settings').duration+'&start_time='+getStartAndEndDatesOnDue(start_date_str)+'&end_time='+getStartAndEndDatesOnDue(end_date_str), templateKey : 'portlets-events', sort_collection : false, individual_tag_name : 'tr',
						postRenderCallback : function(p_el){

						} });
	        	}else if(data.get('portlet_type')=="TASKSANDEVENTS" && data.get('name')=="Today Tasks"){
	        		var start_date_str = '';
					var end_date_str = '';
					if(data.get('settings').duration=='next-7-days'){
						start_date_str = 'TOMORROW';
						end_date_str = ''+data.get('settings').duration;
					}else if(data.get('settings').duration=='today-and-tomorrow'){
						start_date_str = 'today';
						end_date_str = ''+data.get('settings').duration;
					}else if(data.get('settings').duration=='this-week'){
						start_date_str = ''+data.get('settings').duration;
						end_date_str = 'this-week-end';
					}else{
						start_date_str = ''+data.get('settings').duration;
						end_date_str = 'TOMORROW';
					}
					
	        		App_Portlets.tasksCollection[parseInt(pos)] = new Base_Collection_View({ url : '/core/api/portlets/portletTodayTasks?duration='+data.get('settings').duration+'&start_time='+getStartAndEndDatesOnDue(start_date_str)+'&end_time='+getStartAndEndDatesOnDue(end_date_str), templateKey : 'portlets-tasks', sort_collection : false, individual_tag_name : 'tr',
						postRenderCallback : function(p_el){

						} });
	        	}else if(data.get('portlet_type')=="USERACTIVITY" && data.get('name')=="Stats Report"){
	        		/*var start_date_str = '';
	        		var end_date_str = '';
	        		if(data.get('settings').duration=='yesterday'){
	        			start_date_str = ''+data.get('settings').duration;
	        			end_date_str = 'today';
	        		}else if(data.get('settings').duration=='last-week'){
	        			start_date_str = ''+data.get('settings').duration;
	        			end_date_str = 'last-week-end';
	        		}else if(data.get('settings').duration=='last-month'){
	        			start_date_str = ''+data.get('settings').duration;
	        			end_date_str = 'last-month-end';
	        		}else if(data.get('settings').duration=='24-hours'){
	        			start_date_str = ''+data.get('settings').duration;
	        			end_date_str = 'now';
	        		}else{
	        			start_date_str = ''+data.get('settings').duration;
	        			end_date_str = 'TOMORROW';
	        		}
	        		
	        		App_Portlets.statsReport[parseInt(pos)] = new Base_Model_View({ url : '/core/api/portlets/portletStatsReport?duration='+data.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str)+'&time_zone='+(new Date().getTimezoneOffset()), template : "portlets-status-count-report-model", tagName : 'div', 
	        			postRenderCallback : function(p_el){
	        				var settingsEl = 	"<div class='portlet_header_icons pull-right clear-fix text-muted p-t-xs pos-abs pos-r-0 pos-t-0' style='visibility:hidden;'>"+
												"<i id='"+data.get('id')+"-settings' class='portlet-settings icon-wrench p-r-xs c-p'></i>"+
												"<i id='"+data.get('id')+"-close' class='c-p icon-close StatsReport-close p-r-sm' onclick='deletePortlet(this);'></i>"+
												"</div>";
	        				$('.stats-report-settings',p_el).find('span').eq(0).before(settingsEl);
	        			} });*/
	        	}else if(data.get('portlet_type')=="USERACTIVITY" && data.get('name')=="Leaderboard"){
	        		var start_date_str = data.get('settings').duration+'-start';
					var end_date_str = data.get('settings').duration+'-end';
					var users = '';
					if(data.get('settings').user!=undefined)
						users = JSON.stringify(data.get('settings').user);
					App_Portlets.leaderboard[parseInt(pos)] = new Base_Model_View({ url : '/core/api/portlets/portletLeaderboard?duration='+data.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str)+'&revenue='+data.get('settings').category.revenue+'&dealsWon='+data.get('settings').category.dealsWon+'&calls='+data.get('settings').category.calls+'&tasks='+data.get('settings').category.tasks+'&user='+users, template : 'portlets-leader-board-body-model', tagName : 'div',
						postRenderCallback : function(p_el){
							$('#ui-id-'+column_position+'-'+row_position+' > .portlet_header').find('ul').width(($('#ui-id-'+column_position+'-'+row_position+' > .portlet_body').find('ul').width()/$('#ui-id-'+column_position+'-'+row_position+' > .portlet_body').width()*100)+'%');
						} });
	        	}
	        	if(data.get('portlet_type')=="CONTACTS" && data.get('name')=="Filter Based"){
	        		if(data.get('settings').filter=="companies"){
	        			App_Portlets.filteredCompanies[parseInt(pos)].collection.fetch();
	        			$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html(getRandomLoadingImg());
	        			$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html($(App_Portlets.filteredCompanies[parseInt(pos)].render().el));
	        		}else{
	        			App_Portlets.filteredContacts[parseInt(pos)].collection.fetch();
	        			$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html(getRandomLoadingImg());
	        			$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html($(App_Portlets.filteredContacts[parseInt(pos)].render().el));
	        		}
	        	}else if(data.get('portlet_type')=="CONTACTS" && data.get('name')=="Emails Opened"){
	        		App_Portlets.emailsOpened[parseInt(pos)].collection.fetch();
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').find('.emails-opened-contacts-list').attr('id','emails-opened-contacts-list-'+column_position+'-'+row_position)
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').find('#emails-opened-contacts-list-'+column_position+'-'+row_position).html(getRandomLoadingImg());
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').find('#emails-opened-contacts-list-'+column_position+'-'+row_position).html($(App_Portlets.emailsOpened[parseInt(pos)].render().el));
	        	}else if(data.get('portlet_type')=="DEALS" && data.get('name')=="Pending Deals"){
	        		App_Portlets.pendingDeals[parseInt(pos)].collection.fetch();
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html(getRandomLoadingImg());
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html($(App_Portlets.pendingDeals[parseInt(pos)].render().el));
	        	}else if(data.get('portlet_type')=="DEALS" && data.get('name')=="Deals Won"){
	        		App_Portlets.dealsWon[parseInt(pos)].collection.fetch();
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html(getRandomLoadingImg());
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html($(App_Portlets.dealsWon[parseInt(pos)].render().el));
	        	}else if(data.get('portlet_type')=="TASKSANDEVENTS" && data.get('name')=="Agenda"){
	        		App_Portlets.todayEventsCollection[parseInt(pos)].collection.fetch();
	        		/*if(App_Portlets.todayEventsCollection[parseInt(pos)]!=undefined && App_Portlets.todayEventsCollection[parseInt(pos)].collection.length>0){
	        			$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html(getRandomLoadingImg());
	        			$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html($(App_Portlets.todayEventsCollection[parseInt(pos)].render().el));
	        		}else{
	        			if(data.get('settings').duration=="next-7-days")
							$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html("<div class='portlet-error-message'>No calendar events for next 7 days</div>");
						else if(data.get('settings').duration=="this-week")
							$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html("<div class='portlet-error-message'>No calendar events for this week</div>");
						else if(data.get('settings').duration=="today-and-tomorrow")
							$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html("<div class='portlet-error-message'>No calendar events for today and tomorrow</div>");
						else if(data.get('settings').duration=="1-day")
							$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html("<div class='portlet-error-message'>No calendar events for today</div>");
	        		}*/
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html(getRandomLoadingImg());
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html($(App_Portlets.todayEventsCollection[parseInt(pos)].render().el));
	        	}else if(data.get('portlet_type')=="TASKSANDEVENTS" && data.get('name')=="Today Tasks"){
	        		App_Portlets.tasksCollection[parseInt(pos)].collection.fetch();
	        		/*if(App_Portlets.tasksCollection[parseInt(pos)]!=undefined && App_Portlets.tasksCollection[parseInt(pos)].collection.length>0){
	        			$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html(getRandomLoadingImg());
	        			$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html($(App_Portlets.tasksCollection[parseInt(pos)].render().el));
	        		}else{
	        			if(data.get('settings').duration=="next-7-days")
							$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html("<div class='portlet-error-message'>No tasks for next 7 days");
						else if(data.get('settings').duration=="this-week")
							$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html("<div class='portlet-error-message'>No tasks for this week");
						else if(data.get('settings').duration=="today-and-tomorrow")
							$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html("<div class='portlet-error-message'>No tasks for today and tomorrow");
						else if(data.get('settings').duration=="1-day")
							$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html("<div class='portlet-error-message'>No tasks for today");
						else if(data.get('settings').duration=="all-over-due")
							$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html("<div class='portlet-error-message'>No overdue tasks</div>");
	        		}*/
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html(getRandomLoadingImg());
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html($(App_Portlets.tasksCollection[parseInt(pos)].render().el));
	        	}else if(data.get('portlet_type')=="USERACTIVITY" && data.get('name')=="Leaderboard"){
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html(getRandomLoadingImg());
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html($(App_Portlets.leaderboard[parseInt(pos)].render().el));
	        	}else if(data.get('portlet_type')=="USERACTIVITY" && data.get('name')=="Stats Report"){
	        		/*$('#'+el.split("-save-modal")[0]).parent().find('.stats_report_portlet_body').html(getRandomLoadingImg());
	        		$('#'+el.split("-save-modal")[0]).parent().find('.stats_report_portlet_body').html($(App_Portlets.statsReport[parseInt(pos)].render().el));*/
	        		
	        		var start_date_str = '';
	    			var end_date_str = '';
	    			if(data.get('settings').duration=='yesterday'){
	    				start_date_str = ''+data.get('settings').duration;
	    				end_date_str = 'today';
	    			}else if(data.get('settings').duration=='last-week'){
	    				start_date_str = ''+data.get('settings').duration;
	    				end_date_str = 'last-week-end';
	    			}else if(data.get('settings').duration=='last-month'){
	    				start_date_str = ''+data.get('settings').duration;
	    				end_date_str = 'last-month-end';
	    			}else if(data.get('settings').duration=='24-hours'){
	    				start_date_str = ''+data.get('settings').duration;
	    				end_date_str = 'now';
	    			}else if(data.get('settings').duration=='this-week'){
						start_date_str = ''+data.get('settings').duration;
						end_date_str = 'this-week-end';
					}else if(data.get('settings').duration=='this-month'){
						start_date_str = ''+data.get('settings').duration;
						end_date_str = 'this-month-end';
					}else{
	    				start_date_str = ''+data.get('settings').duration;
	    				end_date_str = 'TOMORROW';
	    			}
	    			var that = $('#'+el.split("-save-modal")[0]).parent().find('.stats_report_portlet_body');
	    			var newContactsurl='/core/api/portlets/portletStatsReport?reportType=newContacts&duration='+data.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str)+'&time_zone='+(new Date().getTimezoneOffset());
	    			setTimeout(function(){
	    				if(that.find('#new-contacts-count').text().trim()=="")
	    					that.find('#new-contacts-count').html("<img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' />");
	    			},1000);
	    			fetchPortletsGraphData(newContactsurl,function(data){
	    				that.find('#new-contacts-count').text(getNumberWithCommasForPortlets(data["newContactsCount"]));
	    				that.find('#new-contacts-label').text("New contacts");
	    			});
	    			
	    			var wonDealsurl='/core/api/portlets/portletStatsReport?reportType=wonDeals&duration='+data.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str)+'&time_zone='+(new Date().getTimezoneOffset());
	    			setTimeout(function(){
	    				if(that.find('#won-deal-value').text().trim()=="")
	    					that.find('#won-deal-value').html("<img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' />");
	    			},1000);
	    			fetchPortletsGraphData(wonDealsurl,function(data){
	    				that.find('#won-deal-value').text(getPortletsCurrencySymbol()+''+getNumberWithCommasForPortlets(data["wonDealValue"]));
	    				that.find('#won-deal-count').text("Won from "+getNumberWithCommasForPortlets(data['wonDealsCount'])+" deals");
	    			});
	    			
	    			var newDealsurl='/core/api/portlets/portletStatsReport?reportType=newDeals&duration='+data.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str)+'&time_zone='+(new Date().getTimezoneOffset());
	    			setTimeout(function(){
	    				if(that.find('#new-deal-value').text().trim()=="")
	    					that.find('#new-deal-value').html("<img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' />");
	    			},1000);
	    			fetchPortletsGraphData(newDealsurl,function(data){
	    				that.find('#new-deal-value').text(getNumberWithCommasForPortlets(data["newDealsCount"]));
	    				that.find('#new-deal-count').text("New deals worth "+getPortletsCurrencySymbol()+''+getNumberWithCommasForPortlets(data['newDealValue'])+"");
	    			});
	    			
	    			var campaignEmailsSentsurl='/core/api/portlets/portletStatsReport?reportType=campaignEmailsSent&duration='+data.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str)+'&time_zone='+(new Date().getTimezoneOffset());
	    			setTimeout(function(){
	    				if(that.find('#emails-sent-count').text().trim()=="")
	    					that.find('#emails-sent-count').html("<img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' />");
	    			},1000);
	    			fetchPortletsGraphData(campaignEmailsSentsurl,function(data){
	    				that.find('#emails-sent-count').text(getNumberWithCommasForPortlets(data["emailsSentCount"]));
	    				that.find('#emails-sent-label').text("Campaign emails sent");
	    			});
	        	}else if(data.get('portlet_type')=="DEALS" && data.get('name')=="Deals By Milestone"){
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').attr('id',idVal);
	        		var selector=idVal;
	    			var url='/core/api/portlets/portletDealsByMilestone?deals='+data.get('settings').deals+'&track='+data.get('settings').track;
	    			var milestonesList=[];
	    			var milestoneValuesList=[];
	    			var milestoneNumbersList=[];
	    			var milestoneMap=[];
	    			var sizey = parseInt($('#'+selector).parent().attr("data-sizey"));
	    			var topPos = 50*sizey;
	    			if(sizey==2 || sizey==3)
	    				topPos += 50;
	    			$('#'+selector).html("<div class='text-center v-middle opa-half' style='margin-top:"+topPos+"px'><img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' /></div>");
	    			fetchPortletsGraphData(url,function(data1){
	    				if(data1.status==403){
	    					$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
	    					return;
	    				}
	    				milestonesList=data1["milestonesList"];
	    				milestoneValuesList=data1["milestoneValuesList"];
	    				milestoneNumbersList=data1["milestoneNumbersList"];
	    				milestoneMap=data1["milestoneMap"];
	    				
	    				dealsByMilestonePieGraph(selector,milestonesList,milestoneValuesList,milestoneNumbersList);
	    				
	    				//Added track options
	    				var options='';
	    				$.each(milestoneMap,function(milestoneId,milestoneName){
	    					if(data.get('settings').track==0 && milestoneName=="Default")
	    						options+="<option value="+milestoneId+" selected='selected'>"+milestoneName+"</option>";
	    					else if(data.get('settings').track==milestoneId)
	    						options+="<option value="+milestoneId+" selected='selected'>"+milestoneName+"</option>";
	    					else
	    						options+="<option value="+milestoneId+">"+milestoneName+"</option>";
	    				});
	    				$('#'+data.get("id")+'-track-options').append(options);
	    			});
	    			
	        	}else if(data.get('portlet_type')=="DEALS" && data.get('name')=="Closures Per Person"){
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').attr('id',idVal);
	        		
	        		var selector=idVal;
	        		var url='/core/api/portlets/portletClosuresPerPerson?due-date='+data.get('settings')["due-date"];
	    			
	    			var milestoneNumbersList=[];
	    			var milestoneValuesList=[];
	    			var domainUsersList=[];
	    			$('#'+selector).html(getRandomLoadingImg());
	    			fetchPortletsGraphData(url,function(data1){
	    				if(data1.status==403){
	    					$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
	    					return;
	    				}
	    				milestoneNumbersList=data1["milestoneNumbersList"];
	    				milestoneValuesList=data1["milestoneValuesList"];
	    				domainUsersList=data1["domainUsersList"];
	    				
	    				var catges=[];
	    				
	    				$.each(domainUsersList,function(index,domainUser){
	    					catges.push(domainUser);
	    				});
	    				
	    				var data2=[];
	    				var text='';
	    				var name='';
	    				
	    				if(data.get('settings')["group-by"]=="number-of-deals"){
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
	    			});
	    			
	        	}else if(data.get('portlet_type')=="DEALS" && data.get('name')=="Deals Funnel"){
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').attr('id',idVal);
	        		
	        		var selector=idVal;
	    			var url='/core/api/portlets/portletDealsFunnel?deals='+data.get('settings').deals+'&track='+data.get('settings').track;
	    			
	    			var milestonesList=[];
	    			var milestoneValuesList=[];
	    			var milestoneMap=[];
	    			var sizey = parseInt($('#'+selector).parent().attr("data-sizey"));
	    			var topPos = 50*sizey;
	    			if(sizey==2 || sizey==3)
	    				topPos += 50;
	    			$('#'+selector).html("<div class='text-center v-middle opa-half' style='margin-top:"+topPos+"px'><img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' /></div>");
	    			fetchPortletsGraphData(url,function(data1){
	    				if(data1.status==403){
	    					$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
	    					return;
	    				}
	    				milestonesList=data1["milestonesList"];
	    				milestoneValuesList=data1["milestoneValuesList"];
	    				milestoneMap=data1["milestoneMap"];
	    				
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
	    				
	    				var options='';
	    				$.each(milestoneMap,function(milestoneId,milestoneName){
	    					if(data.get('settings').track==0 && milestoneName=="Default")
	    						options+="<option value="+milestoneId+" selected='selected'>"+milestoneName+"</option>";
	    					else if(data.get('settings').track==milestoneId)
	    						options+="<option value="+milestoneId+" selected='selected'>"+milestoneName+"</option>";
	    					else
	    						options+="<option value="+milestoneId+">"+milestoneName+"</option>";
	    				});
	    				$('#'+data.get("id")+'-track-options').append(options);
	    			});
	    			
	        	}else if(data.get('portlet_type')=="USERACTIVITY" && data.get('name')=="Emails Sent"){
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').attr('id',idVal);
	        		
	        		var selector=idVal;
	    			var url='/core/api/portlets/portletEmailsSent?duration='+data.get('settings').duration;
	    			
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
	    			});
	        	}else if(data.get('portlet_type')=="CONTACTS" && data.get('name')=="Growth Graph"){
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').attr('id',idVal);
	        		
	        		var selector=idVal;
	    			var url='/core/api/portlets/portletGrowthGraph?tags='+data.get('settings').tags+'&frequency='+data.get('settings').frequency+'&duration='+data.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(data.get('settings').duration)+'&end-date='+getStartAndEndDatesOnDue("TOMORROW");
	    			var sizey = parseInt($('#'+selector).parent().attr("data-sizey"));
	    			var topPos = 50*sizey;
	    			if(sizey==2 || sizey==3)
	    				topPos += 50;
	    			$('#'+selector).html("<div class='text-center v-middle opa-half' style='margin-top:"+topPos+"px'><img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' /></div>");
	    			fetchPortletsGraphData(url,function(data1){
	    				if(data1.status==406){
	    					// Show cause of error in saving
	    					$save_info = $('<div class="portlet-error-message" style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'
	    							+ data1.responseText
	    							+ '</i></p></small></div>');
	    					
	    					$("#"+selector).html($save_info).show();
	    					
	    					return;
	    				}

	    				var categories = [];
						var tempcategories = [];
						var dataLength = 0;
						var min_tick_interval = 1;
						var frequency = data.get('settings').frequency;

	    				var sortedKeys = [];
	    				$.each(data1,function(k,v){
	    					sortedKeys.push(k);
	    				});
	    				sortedKeys.sort();
	    				var sortedData = {};
	    				$.each(sortedKeys,function(index,value){
	    					sortedData[''+value] = data1[''+value];
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
	    						series_data.data.push(v1);
	    					});
	    					tempcategories.push(k*1000);
							dataLength++;

	    				});

	    				var cnt = 0;
						if(Math.ceil(dataLength/10)>0){
							min_tick_interval = Math.ceil(dataLength/10);
							if(min_tick_interval==3){
								min_tick_interval = 4;
							}
						}
						$.each(sortedData, function(k, v){
							var dte = new Date(tempcategories[cnt]);
							if(frequency!=undefined){
								if(frequency=="daily"){
									categories.push(Highcharts.dateFormat('%e.%b', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()))+'');
								}else if(frequency=="weekly"){
									if(cnt!=dataLength-1){
										var next_dte = new Date(tempcategories[cnt+1]);
										categories.push(Highcharts.dateFormat('%e.%b', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()))+'-'+Highcharts.dateFormat('%e.%b', Date.UTC(next_dte.getFullYear(), next_dte.getMonth(), next_dte.getDate()-1)));
									}else{
										categories.push(Highcharts.dateFormat('%e.%b', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()))+'-'+Highcharts.dateFormat('%e.%b', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()+6)));
									}
								}else if(frequency=="monthly"){
									if(cnt!=dataLength-1){
										var next_dte = new Date(tempcategories[cnt+1]);
										categories.push(Highcharts.dateFormat('%e.%b \' %y', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()))+'-'+Highcharts.dateFormat('%e.%b \' %y', Date.UTC(next_dte.getFullYear(), next_dte.getMonth(), next_dte.getDate()-1)));
									}else{
										categories.push(Highcharts.dateFormat('%e.%b \' %y', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()))+'-'+Highcharts.dateFormat('%e.%b \' %y', Date.UTC(dte.getFullYear(), dte.getMonth()+1, dte.getDate()-1)));
									}
								}
								cnt++;
							}

						});
	    				
	    				portletGrowthGraph(selector,series,data,categories,min_tick_interval);
	    			});
	    			//Saved tags are appended
	    			var p_settings=data.get('settings');
	    			var p_tags=p_settings.tags;
	    			var tags=p_tags.split(",");
	    			var li='';
	    			$.each(tags,function(index,tagName){
	    				if(tagName!="")
	    					li += "<li data='"+tagName+"' class='tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block'>"+tagName+"<a id='remove_tag' class='close m-l-xs'>&times</a></li>";
	    			});
	    			$('#'+data.get("id")+'-portlet-ul-tags').append(li);
	    			
	    			//enable tags properties
	    			setup_tags_typeahead();
	    			
	    		}else if(data.get('portlet_type')=="DEALS" && data.get('name')=="Deals Assigned"){
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').attr('id',idVal);
	        		
	        		var selector=idVal;
	    			var url='/core/api/portlets/portletDealsAssigned?duration='+data.get('settings').duration;
	    			
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
	    			});
	        	}else if(data.get('portlet_type')=="USERACTIVITY" && data.get('name')=="Calls Per Person"){
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').attr('id',idVal);
	        		
	        		var start_date_str = '';
	        		var end_date_str = '';
	        		if(data.get('settings').duration=='yesterday'){
	        			start_date_str = ''+data.get('settings').duration;
	        			end_date_str = 'today';
	        		}else if(data.get('settings').duration=='this-week'){
						start_date_str = ''+data.get('settings').duration;
						end_date_str = 'this-week-end';
					}else if(data.get('settings').duration=='this-month'){
						start_date_str = ''+data.get('settings').duration;
						end_date_str = 'this-month-end';
					}else{
	        			start_date_str = ''+data.get('settings').duration;
	        			end_date_str = 'TOMORROW';
	        		}
	        		
	        		var users = '';
					if(data.get('settings')["calls-user-list"]!=undefined)
						users = JSON.stringify(data.get('settings')["calls-user-list"]);

	        		var selector=idVal;
	        		var url='/core/api/portlets/portletCallsPerPerson?duration='+data.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str)+'&user='+users;
	        		
	        		var answeredCallsCountList=[];
	    			var busyCallsCountList=[];
	    			var failedCallsCountList=[];
	    			var voiceMailCallsCountList=[];
	    			var callsDurationList=[];
	    			var totalCallsCountList=[];
	    			var domainUsersList=[];
	    			var domainUserImgList=[];
	    			var sizey = parseInt($('#'+selector).parent().attr("data-sizey"));
	    			var topPos = 50*sizey;
	    			if(sizey==2 || sizey==3)
	    				topPos += 50;
	    			$('#'+selector).html("<div class='text-center v-middle opa-half' style='margin-top:"+topPos+"px'><img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' /></div>");
	    			fetchPortletsGraphData(url,function(data2){
	    				if(data2.status==403){
	    					$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
	    					return;
	    				}
	    				answeredCallsCountList=data2["answeredCallsCountList"];
	    				busyCallsCountList=data2["busyCallsCountList"];
	    				failedCallsCountList=data2["failedCallsCountList"];
	    				voiceMailCallsCountList=data2["voiceMailCallsCountList"];
	    				callsDurationList=data2["callsDurationList"];
	    				totalCallsCountList=data2["totalCallsCountList"];
	    				domainUsersList=data2["domainUsersList"];
	    				domainUserImgList=data2["domainUserImgList"];
	    				
	    				var series=[];
	    				var text='';
	    				var colors;
	    				
	    				if(data.get('settings')["group-by"]=="number-of-calls"){
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
	    				
	    				callsPerPersonBarGraph(selector,domainUsersList,series,totalCallsCountList,callsDurationList,text,colors,domainUserImgList);
	    			});
	        	}else if(data.get('portlet_type')=="TASKSANDEVENTS" && data.get('name')=="Task Report"){
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').attr('id',idVal);
	        		
	        		var start_date_str = '';
	    			var end_date_str = '';
	    			if(data.get('settings').duration=='yesterday'){
	    				start_date_str = ''+data.get('settings').duration;
	    				end_date_str = 'today';
	    			}else if(data.get('settings').duration=='this-week'){
						start_date_str = ''+data.get('settings').duration;
						end_date_str = 'this-week-end';
					}else if(data.get('settings').duration=='this-month'){
						start_date_str = ''+data.get('settings').duration;
						end_date_str = 'this-month-end';
					}else{
	    				start_date_str = ''+data.get('settings').duration;
	    				end_date_str = 'TOMORROW';
	    			}
	        		
	        		var users = '';
					if(data.get('settings')["task-report-user-list"]!=undefined)
						users = JSON.stringify(data.get('settings')["task-report-user-list"]);

	        		var selector=idVal;
	        		var url='/core/api/portlets/portletTaskReport?group-by='+data.get('settings')["group-by"]+'&split-by='+data.get('settings')["split-by"]+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str)+'&tasks='+data.get('settings').tasks+'&user='+users;
	        		
	        		var groupByList=[];
	    			var splitByList=[];
	    			var splitByNamesList=[];
	    			var domainUserNamesList=[];
	    			var sizey = parseInt($('#'+selector).parent().attr("data-sizey"));
	    			var topPos = 50*sizey;
	    			if(sizey==2 || sizey==3)
	    				topPos += 50;
	    			$('#'+selector).html("<div class='text-center v-middle opa-half' style='margin-top:"+topPos+"px'><img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' /></div>");
	    			fetchPortletsGraphData(url,function(data2){
	    				if(data2.status==403){
	    					$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
	    					return;
	    				}
	    				groupByList=data2["groupByList"];
	    				splitByList=data2["splitByList"];
	    				domainUserNamesList=data2["domainUserNamesList"];
	    				var series=[];
	    				var text='';
	    				var colors;
	    				
	    				$.each(splitByList,function(index,splitByData){
	    					if(splitByNamesList.length==0)
	    						$.each(splitByData,function(key,value){
	    							splitByNamesList.push(getPortletNormalName(key));
	    						});
	    				});
	    				for(var i=0;i<splitByNamesList.length;i++){
	    					var tempData={};
	    					var splitByDataList=[];
	    					$.each(splitByList,function(index,splitByData){
	    						$.each(splitByData,function(key,value){
	    							if(getPortletNormalName(key)==splitByNamesList[i])
	    								splitByDataList.push(value);
	    						});
	    					});
	    					tempData.name=splitByNamesList[i];
	    					tempData.data=splitByDataList;
	    					series[i]=tempData;
	    				}
	    				
	    				text="Task Report";
	    				
	    				var groupByNamesList=[];
	    				
	    				$.each(groupByList,function(index,name){
	    					groupByNamesList[index] = getPortletNormalName(name);
	    				});
	    				
	    				taskReportBarGraph(selector,groupByNamesList,series,text,data,domainUserNamesList);
	    				
	    			});
	        	}
	        	if(data.get('portlet_type')=="CONTACTS" && data.get('name')=="Emails Opened"){
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').attr('id',idVal);
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').find('.emails-opened-pie-chart').attr('id','emails-opened-pie-chart-'+column_position+'-'+row_position);
	    			var start_date_str = '';
	    			var end_date_str = '';
	    			if(data.get('settings').duration=='yesterday'){
	    				start_date_str = ''+data.get('settings').duration;
	    				end_date_str = 'today';
	    			}else if(data.get('settings').duration=='this-week'){
						start_date_str = ''+data.get('settings').duration;
						end_date_str = 'this-week-end';
					}else if(data.get('settings').duration=='this-month'){
						start_date_str = ''+data.get('settings').duration;
						end_date_str = 'this-month-end';
					}else{
	    				start_date_str = ''+data.get('settings').duration;
	    				end_date_str = 'TOMORROW';
	    			}
	    			
	    			var selector='emails-opened-pie-chart-'+column_position+'-'+row_position;
	    			var url='/core/api/portlets/portletEmailsOpenedPie?duration='+data.get('settings').duration+'&start-date='+getStartAndEndDatesOnDue(start_date_str)+'&end-date='+getStartAndEndDatesOnDue(end_date_str);
	    			
	    			var emailsSentCount=0;
	    			var emailsOpenedCount=0;
	    			
	    			
	    			var sizey = parseInt($('#'+selector).parent().attr("data-sizey"));
	    			var topPos = 50*sizey;
	    			$('#'+selector).html("<div class='text-center v-middle opa-half' style='margin-top:"+topPos+"px'><img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' /></div>");
	    			fetchPortletsGraphData(url,function(data1){
	    				if(data1.status==403){
	    					$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
	    					return;
	    				}
	    				emailsSentCount=data1["emailsSentCount"];
	    				emailsOpenedCount=data1["emailsOpenedCount"];
	    				
	    				var series=[];
	    				series.push(["Emails Sent",emailsSentCount-emailsOpenedCount]);
	    				series.push(["Emails Opened",emailsOpenedCount]);
	    				
	    				emailsOpenedPieChart(selector,series,emailsSentCount,emailsOpenedCount);
	    			});
	    		}
	        	/*if(data.get('portlet_type')=="DEALS" && data.get('name')=="Deals Won" && portletCollectionView.collection.models.length!=0){
	        		setTimeout(function(){
	        			$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').find('.dealsWonValue').show();
		    			var totalVal=0;
		        		$.each(portletCollectionView.collection.models,function(index,model){
							totalVal += parseInt(model.get("expected_value"));
						});
		        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').find('.dealsWonValue').append("Total won value:"+totalVal);
	        		},2000);
	        	}*/
	        	
	        	setPortletContentHeight(data);
    			$('#'+data.get('id')).parent().find('div:last').after('<span class="gs-resize-handle gs-resize-handle-both"></span>');
	        	
	        	if(data.get('is_minimized'))
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').hide();
	        	
	        	//enablePortletTimeAndDates(data);
	        	/*head.js(LIB_PATH + 'jscore/handlebars/handlebars-helpers.js', function(){
					var el = $(getTemplate('portlets', {}));
					$("#content").html(el);
					loadPortlets(el);
				});*/
	        },
	        error: function (obj, response) {
	        	//alert("response--"+response.status);
	        }
		});
	}
});
function showPortletSettingsForm(formId){
	$('#portletSettingsModal > .modal-body > form').each(function(){
		if($(this).attr('id')==formId)
			$(this).show();
		else
			$(this).hide();
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
$('#group-by-task-report').live('change',function(e){
	
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
$('#tasks-task-report').live('change',function(e){
	if($('#tasks-task-report').val()=="completed-tasks"){
		if($('#split-by-task-report > option#status').is(':selected'))
			$('#split-by-task-report > option#status').attr("selected",false);
		$('#split-by-task-report > option#status').hide();
	}
	else
		$('#split-by-task-report > option#status').show();
});
$('.stats_report_portlet_body').live('mouseover',function(e){
	if($('.stats_report_portlet_body').parent().find('.gs-resize-handle'))
		$('.stats_report_portlet_body').parent().find('.gs-resize-handle').remove();
	$('.stats_report_portlet_body').find('.portlet_header_icons').css("visibility","visible");
	//$('.stats_report_portlet_body').find('.stats-report-settings').find('span').eq(0).addClass('p-l-lg');
});
$('.stats_report_portlet_body').live('mouseout',function(e){
	$('.stats_report_portlet_body').find('.portlet_header_icons').css("visibility","hidden");
	//$('.stats_report_portlet_body').find('.stats-report-settings').find('span').eq(0).removeClass('p-l-lg');
});
$('.onboarding-skip').live('click',function(e){
	$(this).parent().find('span').css("text-decoration","line-through");
	if(!$(this).parent().find('small').hasClass('onboarding-undo'))
		$(this).parent().find('span').after("<small class='p-l-sm onboarding-undo c-p'>(undo)</small>");
	$(this).remove();
});
$('.onboarding-undo').live('click',function(e){
	$(this).parent().find('span').css("text-decoration","none");
	$(this).parent().find('label').remove();
	$(this).parent().find('span').before("<label class='i-checks i-checks-sm onboarding-check' style='padding-right:4px;'><input type='checkbox'><i></i></label>");
	if(!$(this).parent().find('small').hasClass('onboarding-skip'))
		$(this).parent().find('span').after("<small class='p-l-sm onboarding-skip c-p'>(skip)</small>");
	$(this).remove();
});
$('.onboarding-check').live('change',function(e){
	/*$(this).parent().find('span').before("<label class='fa fa-check p-r-sm'><i></i></label>");
	if(!$(this).parent().find('small').hasClass('onboarding-undo'))
		$(this).parent().find('span').after("<small class='p-l-sm onboarding-undo c-p'>(undo)</small>");
	$(this).remove();*/
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
		json1[""+$(this).attr('value')] = json2;
	});
	model.set({ 'prefs' : JSON.stringify(json1) }, { silent : true });
	// Saves new width and height in server
	$.ajax({ type : 'POST', url : '/core/api/portlets/saveOnboardingPrefs', data : JSON.stringify(model.toJSON()),
		contentType : "application/json; charset=utf-8", dataType : 'json', success: function(){
			if(that.find('input:checkbox').is(':checked')){
				that.parent().find('span').css("text-decoration","line-through");
				that.parent().find('span > a').addClass("text-muted");
				that.parent().find('label').removeClass('fa fa-square-o ob-portlet-font-check onboarding-check c-p');
				that.parent().find('label').addClass('fa fa-check-square-o ob-portlet-font-check onboarding-check c-p text-muted');
				that.find('input:checkbox').removeClass('ob-portlet-no-check');
				that.find('input:checkbox').addClass('ob-portlet-check');
			}else{
				that.parent().find('span').css("text-decoration","none");
				that.parent().find('span > a').removeClass("text-muted");
				that.parent().find('label').removeClass('fa fa-check-square-o ob-portlet-font-check onboarding-check c-p text-muted');
				that.parent().find('label').addClass('fa fa-square-o ob-portlet-font-check onboarding-check c-p');
				that.find('input:checkbox').removeClass('ob-portlet-check');
				that.find('input:checkbox').addClass('ob-portlet-no-check');
			}} });
		
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
$('.leaderboard_portlet_header').live('mouseover',function(e){
	$('.leaderboard_portlet_header').find('.portlet_header_icons').css("visibility","visible");
});
$('.leaderboard_portlet_header').live('mouseout',function(e){
	$('.leaderboard_portlet_header').find('.portlet_header_icons').css("visibility","hidden");
});
$('#category-select-all').die().live('click',function(e){
		e.preventDefault();
		$('#category-list').multiSelect('select_all');
});
$('#category-select-none').die().live('click',function(e){
		e.preventDefault();
		$('#category-list').multiSelect('deselect_all');
});
$('#user-select-all').die().live('click',function(e){
		e.preventDefault();
		$('#user-list').multiSelect('select_all');
});
$('#user-select-none').die().live('click',function(e){
		e.preventDefault();
		$('#user-list').multiSelect('deselect_all');
});
$('#calls-user-select-all').die().live('click',function(e){
	e.preventDefault();
	$('#calls-user-list').multiSelect('select_all');
});
$('#calls-user-select-none').die().live('click',function(e){
	e.preventDefault();
	$('#calls-user-list').multiSelect('deselect_all');
});
$('#task-report-user-select-all').die().live('click',function(e){
		e.preventDefault();
		$('#task-report-user-list').multiSelect('select_all');
});
$('#task-report-user-select-none').die().live('click',function(e){
		e.preventDefault();
		$('#task-report-user-list').multiSelect('deselect_all');
});
function getDurationForPortlets(duration){
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
		
		return time_period;
}

function minicalendar(el)
{
	var totalEvents = 0;
	var eventsCount = 0;
	head
			.js(
				
					 LIB_PATH + 'lib/jquery-ui.min.js', 'lib/fullcalendar.min.js', function()
							{
						$('#calendar_container',el).fullCalendar({
							
								aspectRatio:(get_calendar_width($(el).find('#calendar_container'))/(get_calendar_height($(el).find('#calendar_container'))-24)) ,
								selectable: true,
								header : { left : 'prev', center : 'title', right : 'next' },
								weekMode:'liquid',
								
								
								 events : function(start, end, callback)
								{
									var top=parseInt($(el).find('.fc-widget-content').css('height'))/2-7;
									$(el).find('.fc-day-number').css('top',top);  
									var date=new Date();
									   var todayDate=new Date(date.getFullYear(), date.getMonth(), date.getDate(),00,00,00);
									   var endDate=new Date(date.getFullYear(), date.getMonth(), date.getDate(),23,59,59);
									   if(start<todayDate &&  todayDate<end){
												//$('.events_show').empty().append(todayDate.format('dd mmm yyyy'));
												$(el).find('.events_show').empty().append('<div class="show p-t-xs p-l-xs">Today </div>');
									
									   }
									var eventsURL = '/core/api/events?start=' + start.getTime() / 1000 + "&end=" + end.getTime() / 1000;
									$.getJSON(eventsURL, function(doc)
									{
										$.each(doc, function(index, data)
										{
											
											
											if (data.color == 'red' || data.color == '#f05050')
												data.color='#f05050'
											else if (data.color == '#36C' || data.color == '#23b7e5' || data.color == 'blue')
												data.color='#fad733';
											else if (data.color == 'green' || data.color == '#bbb')
												data.color='#edf1f2'
											
											if(data.start >= (todayDate.getTime()/1000) && data.start < (endDate.getTime()/1000)) {	
											$(el).find('.events_show').append('<li class="p-l-sm p-t-xs" style=color:'+data.color+'"><span style="color : black">'+data.title+'<br></span><small>'+ e_date.format('dd-mmm-yyyy HH:MM') + ' </small></li>');
									
									   }
												totalEvents++;
											});

										if (doc)
										{

											callback(doc);

										}
									});
								},  
							  
							  
							     eventRender: function (event, element, view) { 
							    									 	var year = event.start.getFullYear(), month = event.start.getMonth() + 1, date = event.start.getDate();
					                   var result = year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
					                   $(element).addClass(result);
									   
									   $('.fc-event').find('.fc-event-inner').css('display','none');
									 
					                  
							    
								} ,
								eventAfterRender: function (event, element, view) {
									
									eventsCount++;
								if(totalEvents == 0){
										totalEvents = $(el).find('#calendar_container').find('.fc-event').length;
									}
									var h=parseInt($(el).find('.fc-widget-content').css('height'));
									var head=parseInt($(el).find('.fc-header').css('height'));
									var top=element.position().top+h-22;
					//if((element.index()+1))
									var left=element.position().left+5;
									//var top=$(element).css('top')
											$(element).css('top',top);
											$(element).css('left',left);
									   //var e_class=element.attr('class');
									
									/* if((element.parent().children().eq(element.index()-1)).hasClass(e_class))
									{
										   var left_update= (element.parent().children().eq(element.index()-1)).position().left+5;
										 $(element).css('left',left_update);  
										 var top_update=(element.parent().children().eq(element.index()-1)).position().top;
										 $(element).css('top',top_update);
										 
										 
										 
									   } */
									   if(eventsCount==totalEvents || eventsCount==(2*totalEvents)){
          totalEvents = 0;
          eventsCount = 0;
          var classNamesArray = [];
         $(el).find('#calendar_container').find('.fc-event').each(function(index){
          if($.inArray($(this).attr('class').split(" ")[$(this).attr('class').split(" ").length-1], classNamesArray)==-1){
           classNamesArray.push($(this).attr('class').split(" ")[$(this).attr('class').split(" ").length-1]);
          }
         });
         $.each(classNamesArray,function(index, value){
          var pos = $('.'+this,el).eq(0).position();
          if($(el).parent().attr('data-sizex')==1){
           if($('.'+this,el).length==1){
            pos.left += 10;
            pos.top += 5;
           }else if($('.'+this,el).length==2){
            pos.left += 7;
            pos.top += 5;
           }else if($('.'+this,el).length==3){
            pos.left += 4;
            pos.top += 5;
           }else{
            pos.top += 5;
           }
          }else if($(el).parent().attr('data-sizex')==2){
           if($('.'+this,el).length==1){
            pos.left += 33;
            pos.top += 5;
           }else if($('.'+this,el).length==2){
            pos.left += 28;
            pos.top += 5;
           }else if($('.'+this,el).length==3){
            pos.left += 26;
            pos.top += 5;
           }else{
            pos.left += 21;
            pos.top += 5;
           }
          }else if($(el).parent().attr('data-sizex')==3){
           if($('.'+this,el).length==1){
            pos.left += 53;
            pos.top += 5;
           }else if($('.'+this,el).length==2){
            pos.left += 50;
            pos.top += 5;
           }else if($('.'+this,el).length==3){
            pos.left += 46;
            pos.top += 5;
           }else{
            pos.left += 43;
            pos.top += 5;
           }
          }
          if($(el).parent().attr('data-sizey')==2){
           pos.top -= 20;
          }else if($(el).parent().attr('data-sizey')==3){
           pos.top -= 35;
          }
          $('.'+this,el).each(function(index){
            if(index>0){
             $(this,el).css({"top": pos.top, "left":pos.left+(6*index)});
             if(index>3){
              $(this,el).hide();
             }
            }else if(index==0){
             $(this,el).css({"top": pos.top, "left":pos.left});
            }
           });
         });
         }
									
								},
								
								eventMouseover : function(event, jsEvent, view)
						{
							var leftorright = 'left';
							var pullupornot = '';
							if (event.start.getDay() == 5 || event.start.getDay() == 6)
									leftorright = 'right';
								pullupornot = 'pull-up';
								var popoverElement = '<div class="fc-overlay ' + leftorright + '">' + '<div class="panel bg-white b-a pos-rlt p-sm">' + '<span class="arrow ' + leftorright + ' ' + pullupornot + '"></span>' + '<div class="h4 font-thin m-b-sm"><div class="pull-left text-ellipsis" style="width:140px">' + event.title + '</div><div class="pull-right"><img class="r-2x" src="' + event.ownerPic + '" height="20px" width="20px"/></div></div>' + '<div class="line b-b b-light"></div>' + '<div><i class="icon-clock text-muted m-r-xs"></i>' + event.start
									.format('dd-mmm-yyyy HH:MM') + '</div>' + '</div>' + '</div>';
							$(this).append(popoverElement);
							$(this).find('.fc-overlay').show();
						},
						
						eventMouseout : function(event, jsEvent, view)
						{
							$(this).find('.fc-overlay').hide();
							$(this).find('.fc-overlay').remove();
						},
								
								dayClick : function(date,allDay,jsEvent,view){
									var days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
									$(el).find('.events_show').empty().append('<div class="show p-t-xs text-sm p-l-xs">'+days[date.getDay()]+',' +date.format('dd mmm')+' </div>');
									var endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
									var array= $('#calendar_container',el).fullCalendar('clientEvents', function(event) {
										return (event.start >= date && event.start < endDate);
								});
								$.each(array,function(index){
									$(el).find('.events_show').append('<li class="p-l-sm p-t-xs" style="color : '+array[index].color+'"><span style="color : black">'+array[index].title+'</span><br><small>'+ array[index].start.format('dd-mmm-yyyy HH:MM') + ' </small></li>');
									
								});
								}
							    	
						}); 

							});
}

   function get_calendar_height(el) {
      return $(el).parent('.portlet_body_calendar').height();
}
function get_calendar_width(el)
{
	return $(el).width();
}

function showIcons(el)
{
	$(el).find('div.portlet_header_icons').removeClass('vis-hide');
}

$('.portlet_body_calendar').live('mouseover',function(e){
			$('.portlet_body_calendar').find('.portlet_header_icons').removeClass('vis-hide');
			//$('.portlet_body_calendar').css('overflow','inherit');
});

$('.portlet_body_calendar').live('mouseout',function(e){
	$('.portlet_body_calendar').find('.portlet_header_icons').addClass('vis-hide');
	//$('.portlet_body_calendar').css('overflow','auto');
});