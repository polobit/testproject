
var Portlets_View;
var portlet_template_loaded_map = {};

/**
 * Loads all the portlets for the current agile user
 * 
 * @param el
 */
function loadPortlets(el){
	var is_portlet_view_new = false;
	/*
	 * If Portlets_View is not defined , creates collection view, collection is
	 * sorted based on position i.e., set when sorted using jquery ui sortable
	 */
	if (!Portlets_View){
		// This flag is used to ensure portlet script are loaded only once in
		// postrender. It is set to false after portlet setup is initialized
		is_portlet_view_new = true;
		Portlets_View = new Base_Collection_View({ url : '/core/api/portlets', sortKey : "row_position", restKey : "portlet", templateKey : "portlets", individual_tag_name : 'div',
			postRenderCallback : function(portlets_el){
				head.load("css/misc/agile-portlet.css","http://gridster.net/dist/jquery.gridster.min.css", function(){
					// If scripts aren't loaded earlier, setup is initialized
					if (is_portlet_view_new){
						set_up_portlets(el, portlets_el);
						if(Portlets_View.collection.length==0)
							$('.gridster > div:visible > div',el).removeClass('gs-w');
					}
					is_portlet_view_new = false;
				})

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
		/*
		 * Have a flag, which is used to check whether portlets are already
		 * loaded. This avoid unnecessary loading.
		 */
		/*var flag = false;
		is_portlet_view_new = true;
		Portlets_View = new Base_Collection_View({ url : '/core/api/portlets', sortKey : "row_position", restKey : "portlet", templateKey : "portlets", individual_tag_name : 'div',
			postRenderCallback : function(portlets_el)
			{
				head.load("css/misc/agile-portlet.css", function()
				{
					// If scripts aren't loaded earlier, setup is initialized
					if (is_portlet_view_new)
					{
						set_up_portlets(el, portlets_el);
					}
					is_portlet_view_new = false;
				})

			} });*/
		this.Portlets_View.appendItem = set_p_portlets;

		/*
		 * Fetch portlets from collection and set_up_portlets (load their scripts)
		 */
		Portlets_View.collection.fetch();

		// show portlets
		var newEl = Portlets_View.render().el;
		set_up_portlets(el, newEl);
		if(Portlets_View.collection.length==0)
			$('.gridster > div:visible > div',el).removeClass('gs-w');
		$('#portlets', el).html(newEl);
		/*setTimeout(function(){
			$('#portlets-opportunities-model-list').removeClass('agile-edit-row');
			$('#portlets-tasks-model-list').removeClass('agile-edit-row');
			$('#portlets-events-model-list').removeClass('agile-edit-row');
		},1000);*/
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
	$(function(){
	    gridster = $('.gridster > div:visible',el).gridster({
	    	widget_selector: "div",
	        widget_margins: [10, 10],
	        widget_base_dimensions: [400, 280],
	        min_cols: 3,
	        draggable: {
	        	stop: function(event,ui){
					var models = [];

					/*
					 * Iterate through each all the portlets and set each portlet
					 * position and store it in array
					 */
					$('#portlet-res > div > .gs-w').each(function(){
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
	        	stop: function(event,ui){
					var models = [];

					/*
					 * Iterate through each all the portlets and set each portlet
					 * position and store it in array
					 */
					$('#portlet-res > div > .gs-w').each(function(){
						var model_id = $(this).find('.portlets').attr('id');
						
						var model = Portlets_View.collection.get(model_id);
						
						model.set({ 'size_x' : parseInt($(this).attr("data-sizex")) }, { silent : true });
						
						model.set({ 'size_y' : parseInt($(this).attr("data-sizey")) }, { silent : true });

						models.push({ id : model.get("id"), size_x : parseInt($(this).attr("data-sizex")), size_y : parseInt($(this).attr("data-sizey")) });
					});
					// Saves new width and height in server
					$.ajax({ type : 'POST', url : '/core/api/portlets/widthAndHeight', data : JSON.stringify(models),
						contentType : "application/json; charset=utf-8", dataType : 'json' });
				}
	        }
	    }).data('gridster');
	  });
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
	// Shows portlet icons on hover
	$(el).find('div.portlet_header_icons').show();

	// Changes width of portlet name
	$(el).find('div.portlet_header_name').css({ "width" : "40%" });
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
	// Hide portlet icons on hover
	$(el).find('div.portlet_header_icons').hide();

	// Changes width of portlet name
	$(el).find('div.portlet_header_name').css({ "width" : "80%" });
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
	
	$('#portletSettingsModal').modal('show');
	$('#portletSettingsModal > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
	$("#portlet-type",$('#portletSettingsModal')).val(base_model.get('portlet_type'));
	$("#portlet-name",$('#portletSettingsModal')).val(base_model.get('name'));
	
	if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Filter Based"){
		showPortletSettingsForm("portletsContactsFilterBasedSettingsForm");
		elData = $('#portletsContactsFilterBasedSettingsForm');
		$("#filter", elData).find('option[value='+ base_model.get("settings").filter +']').attr("selected", "selected");
	}else if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Emails Opened"){
		showPortletSettingsForm("portletsContactsEmailsOpenedSettingsForm");
		elData = $('#portletsContactsEmailsOpenedSettingsForm');
		$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
	}else if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Emails Sent"){
		showPortletSettingsForm("portletsContactsEmailsSentSettingsForm");
		elData = $('#portletsContactsEmailsSentSettingsForm');
		$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
	}else if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Growth Graph"){
		$('#portlet-ul-tags > li').remove();
		$('#cancel-modal').attr('disabled',false);
		
		showPortletSettingsForm("portletsContactsGrowthGraphSettingsForm");
		elData = $('#portletsContactsGrowthGraphSettingsForm');
		
		//Saved tags are appended
		var tags=base_model.get('settings').tags.split(",");
		var li='';
		$.each(tags,function(index,tagName){
			if(tagName!="")
				li += "<li data='"+tagName+"' style='display: inline-block;' class='tag'>"+tagName+"<a id='remove_tag' class='close'>&times</a></li>";
		});
		$('#portlet-ul-tags').append(li);
		
		//enable tags properties
		setup_tags_typeahead();
		
		$("#frequency", elData).find('option[value='+ base_model.get("settings").frequency +']').attr("selected", "selected");
		var range=""+(new Date(parseInt(base_model.get("settings")["start-date"])).format('mmmm d, yyyy'))+" - "+(new Date(parseInt(base_model.get("settings")["end-date"])).format('mmmm d, yyyy'));
		$('#portlet-reportrange span').html(range);
		$('#start-date').val(base_model.get("settings")["start-date"]);
		$('#end-date').val(base_model.get("settings")["end-date"]);
		
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Pending Deals"){
		showPortletSettingsForm("portletsPendingDealsSettingsForm");
		elData = $('#portletsPendingDealsSettingsForm');
		$("#deals", elData).find('option[value='+ base_model.get("settings").deals +']').attr("selected", "selected");
		$("#due-date", elData).val(new Date(base_model.get("settings")["due-date"]*1000).format('mm/dd/yyyy'));
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals By Milestone"){
		showPortletSettingsForm("portletsDealsByMilestoneSettingsForm");
		elData = $('#portletsDealsByMilestoneSettingsForm');
		var url='/core/api/portlets/portletDealsByMilestone?deals='+base_model.get('settings').deals+'&track='+base_model.get('settings').track+'&due-date='+base_model.get('settings')["due-date"];
		fetchPortletsGraphData(url,function(data){
			var options = '';
			$.each(data["milestoneMap"],function(milestoneId,milestoneName){
				if(base_model.get('settings').track==0 && milestoneName=="Default")
					options+="<option value="+milestoneId+" selected='selected'>"+milestoneName+"</option>";
				else if(base_model.get('settings').track==milestoneId)
					options+="<option value="+milestoneId+" selected='selected'>"+milestoneName+"</option>";
				else
					options+="<option value="+milestoneId+">"+milestoneName+"</option>";
			});
			$('#track', elData).append(options);
		});
		$("#deals", elData).find('option[value='+ base_model.get("settings").deals +']').attr("selected", "selected");
		$("#due-date", elData).val(new Date(base_model.get("settings")["due-date"]*1000).format('mm/dd/yyyy'));
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Closures Per Person"){
		showPortletSettingsForm("portletsDealsClosuresPerPersonSettingsForm");
		elData = $('#portletsDealsClosuresPerPersonSettingsForm');
		$("#group-by", elData).find('option[value='+ base_model.get("settings")["group-by"] +']').attr("selected", "selected");
		$("#due-date", elData).val(new Date(base_model.get("settings")["due-date"]*1000).format('mm/dd/yyyy'));
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals Won"){
		showPortletSettingsForm("portletsDealsWonSettingsForm");
		elData = $('#portletsDealsWonSettingsForm');
		$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals Funnel"){
		showPortletSettingsForm("portletsDealsFunnelSettingsForm");
		elData = $('#portletsDealsFunnelSettingsForm');
		var url='/core/api/portlets/portletDealsFunnel?deals='+base_model.get('settings').deals+'&track='+base_model.get('settings').track+'&due-date='+base_model.get('settings')["due-date"];
		fetchPortletsGraphData(url,function(data){
			var options = '';
			$.each(data["milestoneMap"],function(milestoneId,milestoneName){
				if(base_model.get('settings').track==0 && milestoneName=="Default")
					options+="<option value="+milestoneId+" selected='selected'>"+milestoneName+"</option>";
				else if(base_model.get('settings').track==milestoneId)
					options+="<option value="+milestoneId+" selected='selected'>"+milestoneName+"</option>";
				else
					options+="<option value="+milestoneId+">"+milestoneName+"</option>";
			});
			$('#track', elData).append(options);
		});
		$("#deals", elData).find('option[value='+ base_model.get("settings").deals +']').attr("selected", "selected");
		$("#due-date", elData).val(new Date(base_model.get("settings")["due-date"]*1000).format('mm/dd/yyyy'));
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals Assigned"){
		showPortletSettingsForm("portletsDealsAssignedSettingsForm");
		elData = $('#portletsDealsAssignedSettingsForm');
		$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
	}else if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Calls Per Person"){
		showPortletSettingsForm("portletsCallsPerPersonSettingsForm");
		elData = $('#portletsCallsPerPersonSettingsForm');
		$("#group-by", elData).find('option[value='+ base_model.get("settings")["group-by"] +']').attr("selected", "selected");
		$("#duration", elData).find('option[value='+ base_model.get("settings").duration +']').attr("selected", "selected");
	}
	
	if(base_model.get('name')=="Pending Deals" || base_model.get('name')=="Deals By Milestone" || base_model.get('name')=="Closures Per Person" || base_model.get('name')=="Deals Funnel"){
		$('#due-date', elData).datepicker({
			format : 'mm/dd/yyyy'
		});
	}	
}
function hidePortletSettings(el){
	$('#'+el.id.split("-cancel-modal")[0]+'-portlet-settings').modal('hide');
	//$('#'+el.id.split("-cancel-modal")[0]+'-backdrop').modal('hide');
}
function hidePortletSettingsAfterSave(form_id){
	$('#portletSettingsModal').modal('hide');
	$('#'+form_id).hide();
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
	var form_id=$(this).parent().prev().find('form:visible').attr('id');
	if (!isValidForm('#' + form_id))
		return false;
	
	var el=this.id;
	var flag=true;
	var json={};
	var obj={};
	var portletType=$('#portlet-type').val();
	var portletName=$('#portlet-name').val();
	json = serializeForm(form_id);
	if(portletType=="CONTACTS" && portletName=="Growth Graph"){
		var tags='';
		if($('#addPortletBulkTags').val()!=""){
			var tag=$('#addPortletBulkTags').val();
			if($('#portlet-ul-tags > li').length==0)
				$('#portlet-ul-tags').append("<li data='"+tag+"' style='display: inline-block;' class='tag'>'"+tag+"'<a tag='"+tag+"' id='remove_tag' class='close'>&time</a></li>");
			else
				$('#portlet-ul-tags > li:last').after("<li data='"+tag+"' style='display: inline-block;' class='tag'>'"+tag+"'<a tag='"+tag+"' id='remove_tag' class='close'>&time</a></li>");
		}
		$('#portlet-ul-tags > li').each(function(){
			if($(this).is(':last'))
				tags += $(this).attr('data');
			else
				tags += $(this).attr('data')+',';
		});
		json['tags']=tags;
	}
	
	var idVal = $('#'+$(this).attr('id').split("-save-modal")[0]).parent().find('.portlet_body').attr('id');
	var portlet = Portlets_View.collection.get(el.split("-save-modal")[0]);
	portlet.set({ "prefs" : JSON.stringify(json) }, { silent : true });
	portlet.url="core/api/portlets";
	var model = new BaseModel();
	model.url = 'core/api/portlets';
	if(flag){
		model.save(portlet.toJSON(), {
	        success: function (data) {
	        	hidePortletSettingsAfterSave(form_id);
	        	var model = data.toJSON();
	        	Portlets_View.collection.get(model).set(new BaseModel(model));
	        	//$('#'+this.parentNode.parentNode.parentNode.id).replaceWith($(getTemplate('portlets-model', model)));
	        	var portletCollectionView;
	        	if(data.get('portlet_type')=="CONTACTS" && data.get('name')=="Filter Based"){
	        		if(data.get('settings').filter=="companies")
	        			portletCollectionView = new Base_Collection_View({ url : '/core/api/portlets/portletContacts?filter='+data.get('settings').filter, templateKey : 'portlets-companies', individual_tag_name : 'tr' });
	        		else
	        			portletCollectionView = new Base_Collection_View({ url : '/core/api/portlets/portletContacts?filter='+data.get('settings').filter, templateKey : 'portlets-contacts', individual_tag_name : 'tr' });
	        	}else if(data.get('portlet_type')=="CONTACTS" && data.get('name')=="Emails Opened"){
	        		portletCollectionView = new Base_Collection_View({ url : '/core/api/portlets/portletEmailsOpened?duration='+data.get('settings').duration, templateKey : 'portlets-contacts', individual_tag_name : 'tr' });
	        	}else if(data.get('portlet_type')=="DEALS" && data.get('name')=="Pending Deals"){
	        		portletCollectionView = new Base_Collection_View({ url : '/core/api/portlets/portletPendingDeals?deals='+data.get('settings').deals+'&due-date='+data.get('settings')["due-date"], templateKey : 'portlets-opportunities', individual_tag_name : 'tr' });
	        	}else if(data.get('portlet_type')=="DEALS" && data.get('name')=="Deals Won"){
	        		portletCollectionView = new Base_Collection_View({ url : '/core/api/portlets/portletDealsWon?duration='+data.get('settings').duration, templateKey : 'portlets-opportunities', individual_tag_name : 'tr' });
	        	}
	        	if(portletCollectionView!=undefined)
	        		portletCollectionView.collection.fetch();
	        	if(data.get('name')!="Deals By Milestone" && data.get('name')!="Closures Per Person" && data.get('name')!="Deals Funnel" && data.get('name')!="Emails Sent" && data.get('name')!="Growth Graph" && data.get('name')!="Deals Assigned" && data.get('name')!="Calls Per Person"){
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html(getRandomLoadingImg());
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').html($(portletCollectionView.render().el));
	        	}else if(data.get('portlet_type')=="DEALS" && data.get('name')=="Deals By Milestone"){
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').attr('id',idVal);
	        		var selector=idVal;
	    			var url='/core/api/portlets/portletDealsByMilestone?deals='+data.get('settings').deals+'&track='+data.get('settings').track+'&due-date='+data.get('settings')["due-date"];
	    			var milestonesList=[];
	    			var milestoneValuesList=[];
	    			var milestoneNumbersList=[];
	    			var milestoneMap=[];
	    			
	    			fetchPortletsGraphData(url,function(data1){
	    				milestonesList=data1["milestonesList"];
	    				milestoneValuesList=data1["milestoneValuesList"];
	    				milestoneNumbersList=data1["milestoneNumbersList"];
	    				milestoneMap=data1["milestoneMap"];
	    				
	    				dealsByMilestoneBarGraph(selector,milestonesList,milestoneValuesList,milestoneNumbersList);
	    				
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
	    			
	    			fetchPortletsGraphData(url,function(data1){
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
	    			var url='/core/api/portlets/portletDealsFunnel?deals='+data.get('settings').deals+'&track='+data.get('settings').track+'&due-date='+data.get('settings')["due-date"];
	    			
	    			var milestonesList=[];
	    			var milestoneValuesList=[];
	    			var milestoneMap=[];
	    			
	    			fetchPortletsGraphData(url,function(data1){
	    				milestonesList=data1["milestonesList"];
	    				milestoneValuesList=data1["milestoneValuesList"];
	    				milestoneMap=data1["milestoneMap"];
	    				
	    				var funnel_data=[];
	    				var temp=0;
	    				
	    				$.each(milestonesList,function(index,milestone){
	    					var each_data=[];
	    					
	    					if(milestone!='Won')
	    						each_data.push(milestone,milestoneValuesList[index]);
	    					else
	    						temp=index;
	    					if(each_data!="")
	    						funnel_data.push(each_data);
	    				});
	    				
	    				var temp_data=[];
	    				temp_data.push(milestonesList[temp],milestoneValuesList[temp]);
	    				funnel_data.push(temp_data);
	    				
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
	        		
	        	}else if(data.get('portlet_type')=="CONTACTS" && data.get('name')=="Emails Sent"){
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').attr('id',idVal);
	        		
	        		var selector=idVal;
	    			var url='/core/api/portlets/portletEmailsSent?duration='+data.get('settings').duration;
	    			
	    			var domainUsersList=[];
	    			var mailsCountList=[];
	    			
	    			fetchPortletsGraphData(url,function(data){
	    				domainUsersList=data["domainUsersList"];
	    				mailsCountList=data["mailsCountList"];
	    				
	    				var catges=[];
	    				$.each(domainUsersList,function(index,domainUser){
	    					catges.push(domainUser);
	    				});
	    				
	    				emailsSentBarGraph(selector,catges,mailsCountList);
	    			});
	        		
	        	}else if(data.get('portlet_type')=="CONTACTS" && data.get('name')=="Growth Graph"){
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').attr('id',idVal);
	        		
	        		var selector=idVal;
	    			var url='/core/api/portlets/portletGrowthGraph?tags='+data.get('settings').tags+'&frequency='+data.get('settings').frequency+'&start-date='+data.get('settings')["start-date"]+'&end-date='+data.get('settings')["end-date"];
	    			
	    			fetchPortletsGraphData(url,function(data1){
	    				if(data1.status==406){
	    					// Show cause of error in saving
	    					$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'
	    							+ data1.responseText
	    							+ '</i></p></small></div>');
	    					
	    					$("#plan-limit-error-"+data.get('id')).html($save_info).show();
	    					
	    					return;
	    				}
	    				var series;
	    				// Iterates through data and adds keys into
	    				// categories
	    				$.each(data1, function(k, v){
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
	    				
	    				portletGrowthGraph(selector,series,data);
	    			});
	    			
	    			//Saved tags are appended
	    			var p_settings=data.get('settings');
	    			var p_tags=p_settings.tags;
	    			var tags=p_tags.split(",");
	    			var li='';
	    			$.each(tags,function(index,tagName){
	    				if(tagName!="")
	    					li += "<li data='"+tagName+"' style='display: inline-block;' class='tag'>"+tagName+"<a id='remove_tag' class='close'>&times</a></li>";
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
	    			
	    			fetchPortletsGraphData(url,function(data){
	    				domainUsersList=data["domainUsersList"];
	    				dealsAssignedCountList=data["assignedOpportunitiesCountList"];
	    				
	    				dealsAssignedBarGraph(selector,domainUsersList,dealsAssignedCountList);
	    			});
	        		
	        	}else if(data.get('portlet_type')=="CONTACTS" && data.get('name')=="Calls Per Person"){
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').attr('id',idVal);
	        		
	        		var selector=idVal;
	        		var url='/core/api/portlets/portletCallsPerPerson?duration='+data.get('settings').duration;
	        		
	        		var incomingCompletedCallsCountList=[];
	    			var incomingFailedCallsCountList=[];
	    			var incomingCompletedCallsDurationList=[];
	    			var outgoingCompletedCallsCountList=[];
	    			var outgoingFailedCallsCountList=[];
	    			var outgoingCompletedCallsDurationList=[];
	    			var completedCallsCountList=[];
	    			var failedCallsCountList=[];
	    			var completedCallsDurationList=[];
	    			var domainUsersList=[];
	    			
	    			fetchPortletsGraphData(url,function(data2){
	    				incomingCompletedCallsCountList=data2["incomingCompletedCallsCountList"];
	    				incomingFailedCallsCountList=data2["incomingFailedCallsCountList"];
	    				incomingCompletedCallsDurationList=data2["incomingCompletedCallsDurationList"];
	    				outgoingCompletedCallsCountList=data2["outgoingCompletedCallsCountList"];
	    				outgoingFailedCallsCountList=data2["outgoingFailedCallsCountList"];
	    				outgoingCompletedCallsDurationList=data2["outgoingCompletedCallsDurationList"];
	    				completedCallsCountList=data2["completedCallsCountList"];
	    				failedCallsCountList=data2["failedCallsCountList"];
	    				completedCallsDurationList=data2["completedCallsDurationList"];
	    				domainUsersList=data2["domainUsersList"];
	    				
	    				var series=[];
	    				var text='';
	    				var colors;
	    				
	    				if(data.get('settings')["group-by"]=="number-of-calls"){
	    					var tempData={};
	    					tempData.name="Completed Calls";
	    					tempData.data=completedCallsCountList;
	    					series[0]=tempData;
	    					tempData={};
	    					tempData.name="Failed Calls";
	    					tempData.data=failedCallsCountList;
	    					series[1]=tempData;
	    					text="No. of Calls";
	    					colors=['green','red'];
	    				}else{
	    					var tempData={};
	    					tempData.name="Calls Duration";
	    					tempData.data=completedCallsDurationList;
	    					series[0]=tempData;
	    					text="Call Duration";
	    					colors=['green'];
	    				}
	    				
	    				callsPerPersonBarGraph(selector,domainUsersList,series,text,colors);
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
	        	if(data.get('is_minimized'))
	        		$('#'+el.split("-save-modal")[0]).parent().find('.portlet_body').hide();
	        	
	        	enablePortletTimeAndDates(data);
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